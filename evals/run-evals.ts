#!/usr/bin/env tsx
/**
 * Eval runner for portfolio projects.
 *
 * Usage:
 *   tsx evals/run-evals.ts --project <gather|storyspeak|smart-personal-agent> \
 *     [--target http://localhost:8080] [--fixtures path/to/dir] [--dry-run]
 *
 * Each prompt is sent to the target system, then the (prompt, expected, actual)
 * triple is scored by Claude Sonnet 4.6 against the rubric in the eval JSON.
 *
 * Outputs: evals/results/<project>-<ISO>.json + .md
 */
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

type Prompt = {
  id: string;
  category: string;
  prompt: string;
  expected: unknown;
  notes?: string;
};

type EvalSet = {
  project: string;
  version: string;
  system_under_test: string;
  rubric: {
    scale: string;
    criteria: string[];
    pass_threshold: number;
    blocking_failures?: string[];
  };
  prompts: Prompt[];
};

type PromptResult = {
  id: string;
  category: string;
  prompt: string;
  expected: unknown;
  actual: string;
  scores: Record<string, number>;
  mean: number;
  passed: boolean;
  judge_notes: string;
};

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : undefined;
  };
  return {
    project: get("--project"),
    target: get("--target"),
    fixtures: get("--fixtures"),
    dryRun: args.includes("--dry-run"),
  };
}

async function callSystem(
  prompt: Prompt,
  opts: { project: string; target?: string; fixtures?: string; dryRun: boolean },
): Promise<string> {
  if (opts.dryRun) {
    return `[dry-run: would call ${opts.project} target=${opts.target ?? "fixture"} with ${JSON.stringify(prompt.prompt).slice(0, 80)}]`;
  }
  if (opts.fixtures) {
    const path = join(opts.fixtures, `${prompt.id}.json`);
    if (existsSync(path)) return readFileSync(path, "utf8");
    return `[no fixture for ${prompt.id}]`;
  }
  if (opts.target) {
    const endpoint =
      opts.project === "gather"
        ? "/api/ai/nlp"
        : opts.project === "smart-personal-agent"
          ? "/agent/chat"
          : "/companion";
    const res = await fetch(`${opts.target}${endpoint}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: prompt.prompt, evalId: prompt.id }),
    });
    return await res.text();
  }
  throw new Error("provide --target, --fixtures, or --dry-run");
}

async function judge(
  client: Anthropic,
  evalSet: EvalSet,
  prompt: Prompt,
  actual: string,
): Promise<{ scores: Record<string, number>; notes: string }> {
  const sys = [
    `You are scoring an LLM system on behavioral evals.`,
    `Project: ${evalSet.project}. System: ${evalSet.system_under_test}.`,
    `Rubric criteria (score each 0.0–1.0):`,
    ...evalSet.rubric.criteria.map((c) => `  - ${c}`),
    ``,
    `Respond ONLY with JSON: { "scores": { "<criterion_short_name>": 0.0, ... }, "notes": "<one sentence>" }.`,
    `Use the substring before " — " in each criterion as its key.`,
  ].join("\n");

  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 400,
    system: [{ type: "text", text: sys, cache_control: { type: "ephemeral" } }],
    messages: [
      {
        role: "user",
        content: `PROMPT: ${prompt.prompt}\n\nEXPECTED: ${JSON.stringify(prompt.expected)}\n\nACTUAL: ${actual}\n\nScore now.`,
      },
    ],
  });
  const text = msg.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("")
    .trim();
  const jsonStart = text.indexOf("{");
  const parsed = JSON.parse(text.slice(jsonStart));
  return { scores: parsed.scores, notes: parsed.notes };
}

function mean(scores: Record<string, number>): number {
  const vals = Object.values(scores);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

async function main() {
  const opts = parseArgs();
  if (!opts.project) throw new Error("--project required");
  const evalPath = join(__dirname, `${opts.project}.eval.json`);
  const evalSet: EvalSet = JSON.parse(readFileSync(evalPath, "utf8"));
  const client = new Anthropic();
  const results: PromptResult[] = [];

  for (const p of evalSet.prompts) {
    process.stdout.write(`  ${p.id} ${p.category.padEnd(20)} `);
    const actual = await callSystem(p, { ...opts, project: opts.project! });
    const { scores, notes } = await judge(client, evalSet, p, actual);
    const m = mean(scores);
    const passed = m >= evalSet.rubric.pass_threshold;
    results.push({
      id: p.id,
      category: p.category,
      prompt: p.prompt,
      expected: p.expected,
      actual,
      scores,
      mean: m,
      passed,
      judge_notes: notes,
    });
    process.stdout.write(`${passed ? "PASS" : "FAIL"} ${m.toFixed(2)}\n`);
  }

  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const outDir = join(__dirname, "results");
  mkdirSync(outDir, { recursive: true });
  const jsonPath = join(outDir, `${opts.project}-${ts}.json`);
  writeFileSync(
    jsonPath,
    JSON.stringify({ evalSet: { ...evalSet, prompts: undefined }, results }, null, 2),
  );

  const byCat = new Map<string, PromptResult[]>();
  for (const r of results) {
    if (!byCat.has(r.category)) byCat.set(r.category, []);
    byCat.get(r.category)!.push(r);
  }
  const overallPass = results.filter((r) => r.passed).length;
  const lines: string[] = [
    `# ${evalSet.project} eval results`,
    ``,
    `**Run:** ${ts}  `,
    `**Pass rate:** ${overallPass}/${results.length} (${((100 * overallPass) / results.length).toFixed(1)}%)  `,
    `**Threshold:** ${evalSet.rubric.pass_threshold}`,
    ``,
    `## By category`,
    ``,
    `| Category | n | Pass | Mean |`,
    `|---|---|---|---|`,
  ];
  for (const [cat, rs] of byCat) {
    const p = rs.filter((r) => r.passed).length;
    const m = rs.reduce((a, b) => a + b.mean, 0) / rs.length;
    lines.push(`| ${cat} | ${rs.length} | ${p}/${rs.length} | ${m.toFixed(2)} |`);
  }
  lines.push(``, `## Failures`, ``);
  for (const r of results.filter((r) => !r.passed)) {
    lines.push(`- **${r.id}** (${r.category}, ${r.mean.toFixed(2)}): ${r.judge_notes}`);
  }
  writeFileSync(jsonPath.replace(".json", ".md"), lines.join("\n"));
  console.log(`\nWrote ${jsonPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
