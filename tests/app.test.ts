import test from "node:test";
import assert from "node:assert/strict";
import {
  studentProfileSchema,
  refineIdeaRequestSchema,
  projectEvaluationSchema,
  projectBlueprintSchema,
} from "../src/lib/schemas";
import { checkRateLimit } from "../src/lib/rate-limit";
import { getCuratedBlueprintsForProfile, CURATED_PROJECT_BLUEPRINTS } from "../src/lib/mock-data";
import { generateMarkdownBlueprint } from "../src/lib/export-markdown";
import { generateProjectBlueprints, refineCapstoneBlueprint } from "../src/lib/gemini";
import { StudentProfile, ProjectEvaluation } from "../src/lib/types";
import { POST as generatePostHandler } from "../src/app/api/generate-ideas/route";
import { POST as refinePostHandler } from "../src/app/api/refine-idea/route";
import { NextRequest } from "next/server";

const mockProfile: StudentProfile = {
  interests: ["Healthcare & MedTech", "AI & Large Language Models"],
  skills: ["Python", "FastAPI", "React", "Docker"],
  domain: "Healthcare & Medicine",
  projectType: "AI / Machine Learning Platform",
  experienceLevel: "Intermediate",
  timeframeWeeks: 12,
  teamSize: 2,
  preferredTech: "BioBERT, PostgreSQL",
  constraints: "Free tier deployment",
};

const mockEvaluation: ProjectEvaluation = {
  feasibilityScore: 91,
  skillFitScore: 95,
  timeFeasibilityScore: 88,
  resourceFeasibilityScore: 92,
  innovationScore: 86,
  impactScore: 96,
  whyThisWorks: "Combines modular microservices with verified medical datasets for reliable prototype delivery.",
  keyRisks: ["Clinical entity extraction latency", "Non-standard medical terms"],
  riskMitigations: ["Use deterministic dictionary fallback", "Pre-cache common drug interaction pairs"],
  differentiationSuggestions: ["Explainable clinical counterfactuals", "Real-time FAERS signal integration"],
};

// 1. Profile Schema Validation
test("Schema Validation: Valid student profile succeeds", () => {
  const result = studentProfileSchema.safeParse(mockProfile);
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.domain, "Healthcare & Medicine");
    assert.equal(result.data.timeframeWeeks, 12);
  }
});

test("Schema Validation: Empty skills array fails with validation error", () => {
  const invalid = { ...mockProfile, skills: [] };
  const result = studentProfileSchema.safeParse(invalid);
  assert.equal(result.success, false);
  if (!result.success) {
    assert.match(result.error.issues[0].message, /at least one technical skill/i);
  }
});

test("Schema Validation: Empty interests array fails with validation error", () => {
  const invalid = { ...mockProfile, interests: [] };
  const result = studentProfileSchema.safeParse(invalid);
  assert.equal(result.success, false);
  if (!result.success) {
    assert.match(result.error.issues[0].message, /at least one interest area/i);
  }
});

test("Schema Validation: Overly long strings are rejected", () => {
  const longInterest = "A".repeat(120);
  const invalid = { ...mockProfile, interests: [longInterest] };
  const result = studentProfileSchema.safeParse(invalid);
  assert.equal(result.success, false);
});

// 2. Project Evaluation Schema Validation
test("Evaluation Schema: Valid evaluation data parses successfully", () => {
  const result = projectEvaluationSchema.safeParse(mockEvaluation);
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.feasibilityScore, 91);
    assert.equal(result.data.skillFitScore, 95);
    assert.equal(result.data.timeFeasibilityScore, 88);
    assert.equal(result.data.resourceFeasibilityScore, 92);
    assert.equal(result.data.innovationScore, 86);
    assert.equal(result.data.impactScore, 96);
    assert.equal(result.data.keyRisks.length, 2);
    assert.equal(result.data.riskMitigations.length, 2);
    assert.equal(result.data.differentiationSuggestions.length, 2);
  }
});

test("Evaluation Schema: Boundary scores [1, 100] are accepted", () => {
  const minScoreEval = {
    ...mockEvaluation,
    feasibilityScore: 1,
    skillFitScore: 1,
    timeFeasibilityScore: 1,
    resourceFeasibilityScore: 1,
    innovationScore: 1,
    impactScore: 1,
  };
  const minResult = projectEvaluationSchema.safeParse(minScoreEval);
  assert.equal(minResult.success, true);

  const maxScoreEval = {
    ...mockEvaluation,
    feasibilityScore: 100,
    skillFitScore: 100,
    timeFeasibilityScore: 100,
    resourceFeasibilityScore: 100,
    innovationScore: 100,
    impactScore: 100,
  };
  const maxResult = projectEvaluationSchema.safeParse(maxScoreEval);
  assert.equal(maxResult.success, true);
});

test("Evaluation Schema: Out-of-bound scores (<1 or >100) are rejected", () => {
  const tooLow = { ...mockEvaluation, feasibilityScore: 0 };
  const lowResult = projectEvaluationSchema.safeParse(tooLow);
  assert.equal(lowResult.success, false);

  const tooHigh = { ...mockEvaluation, innovationScore: 101 };
  const highResult = projectEvaluationSchema.safeParse(tooHigh);
  assert.equal(highResult.success, false);
});

test("Evaluation Schema: Missing required explanation or empty arrays are rejected", () => {
  const missingWhy = { ...mockEvaluation, whyThisWorks: "" };
  const whyResult = projectEvaluationSchema.safeParse(missingWhy);
  assert.equal(whyResult.success, false);

  const emptyRisks = { ...mockEvaluation, keyRisks: [] };
  const risksResult = projectEvaluationSchema.safeParse(emptyRisks);
  assert.equal(risksResult.success, false);

  const emptyDiff = { ...mockEvaluation, differentiationSuggestions: [] };
  const diffResult = projectEvaluationSchema.safeParse(emptyDiff);
  assert.equal(diffResult.success, false);
});

// 3. Project Blueprint Schema with Evaluation
test("Blueprint Schema: Requires valid evaluation object", () => {
  const blueprints = getCuratedBlueprintsForProfile(mockProfile);
  const primary = blueprints[0];
  const parseResult = projectBlueprintSchema.safeParse(primary);
  assert.equal(parseResult.success, true);

  // Missing evaluation field should fail validation
  const withoutEval = { ...primary };
  delete (withoutEval as { evaluation?: unknown }).evaluation;
  const invalidResult = projectBlueprintSchema.safeParse(withoutEval);
  assert.equal(invalidResult.success, false);
});

// 4. Rate Limiting
test("Rate Limiting: Allows requests under limit and blocks when exceeded", () => {
  const testId = `test-ip-${Date.now()}`;
  const config = { intervalMs: 10000, maxRequests: 3 };

  const req1 = checkRateLimit(testId, config);
  assert.equal(req1.allowed, true);
  assert.equal(req1.remaining, 2);

  const req2 = checkRateLimit(testId, config);
  assert.equal(req2.allowed, true);
  assert.equal(req2.remaining, 1);

  const req3 = checkRateLimit(testId, config);
  assert.equal(req3.allowed, true);
  assert.equal(req3.remaining, 0);

  const req4 = checkRateLimit(testId, config);
  assert.equal(req4.allowed, false);
  assert.equal(req4.remaining, 0);
});

// 5. Curated Blueprints
test("Curated Blueprints: Returns domain-matching blueprints with tailored scope and evaluations", () => {
  const blueprints = getCuratedBlueprintsForProfile(mockProfile);
  assert.ok(blueprints.length >= 1);
  const primary = blueprints[0];

  assert.ok(primary.title.length > 5);
  assert.ok(primary.coreFeatures.length >= 2);
  assert.ok(primary.roadmap.length >= 2);
  assert.equal(primary.estimatedScope.totalWeeks, 12);
  assert.ok(primary.suitability.includes("team of 2"));

  // Verify evaluation object
  assert.ok(primary.evaluation);
  assert.ok(primary.evaluation.feasibilityScore >= 1 && primary.evaluation.feasibilityScore <= 100);
  assert.ok(primary.evaluation.skillFitScore >= 1 && primary.evaluation.skillFitScore <= 100);
  assert.ok(primary.evaluation.timeFeasibilityScore >= 1 && primary.evaluation.timeFeasibilityScore <= 100);
  assert.ok(primary.evaluation.resourceFeasibilityScore >= 1 && primary.evaluation.resourceFeasibilityScore <= 100);
  assert.ok(primary.evaluation.innovationScore >= 1 && primary.evaluation.innovationScore <= 100);
  assert.ok(primary.evaluation.impactScore >= 1 && primary.evaluation.impactScore <= 100);
  assert.ok(primary.evaluation.whyThisWorks.length > 10);
  assert.ok(primary.evaluation.keyRisks.length >= 1);
  assert.ok(primary.evaluation.riskMitigations.length >= 1);
  assert.ok(primary.evaluation.differentiationSuggestions.length >= 1);
});

test("Curated Blueprints: All static curated entries conform to schema", () => {
  for (const bp of CURATED_PROJECT_BLUEPRINTS) {
    const res = projectBlueprintSchema.safeParse(bp);
    assert.equal(res.success, true, `Blueprint ${bp.id} should validate against schema`);
  }
});

// 6. Markdown Exporter with Evaluation Section
test("Markdown Exporter: Produces valid IEEE capstone formatted document with Project Reality Check", () => {
  const blueprints = getCuratedBlueprintsForProfile(mockProfile);
  const md = generateMarkdownBlueprint(blueprints[0]);

  assert.match(md, /# Final-Year Capstone Project Blueprint:/);
  assert.match(md, /## 1\. Project Reality Check & Feasibility Evaluation/);
  assert.match(md, /Overall Feasibility/);
  assert.match(md, /Skill Fit/);
  assert.match(md, /Innovation & Differentiation/);
  assert.match(md, /Real-World Impact/);
  assert.match(md, /### Why This Works/);
  assert.match(md, /### Key Risks & Targeted Mitigations/);
  assert.match(md, /### How to Differentiate This Project/);
  assert.match(md, /## 2\. Problem Statement/);
  assert.match(md, /## 6\. Technology Stack/);
  assert.match(md, /## 9\. 3-Week Proof of Concept \(MVP Version\)/);
  assert.match(md, /## 10\. Phased Development Roadmap/);
  assert.match(md, /## 11\. Risks, Challenges & Mitigations/);
});

// 7. Gemini Gateway Fallback
test("Gemini Gateway: Graceful fallback when GEMINI_API_KEY is not set", async () => {
  const originalKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;

  const result = await generateProjectBlueprints(mockProfile);
  assert.equal(result.success, true);
  assert.equal(result.isDemoMode, true);
  assert.equal(result.source, "curated_fallback");
  assert.ok(result.data.length >= 1);
  assert.ok(result.data[0].evaluation.feasibilityScore > 0);

  if (originalKey) process.env.GEMINI_API_KEY = originalKey;
});

// 8. Refinement Gateway
test("Refinement Gateway: Modifies blueprint in demo/fallback mode and retains evaluation", async () => {
  const blueprints = getCuratedBlueprintsForProfile(mockProfile);
  const target = blueprints[0];

  const result = await refineCapstoneBlueprint(
    target,
    "Adapt for strict 4-week deadline and solo development",
    "Solo Dev (4-Week Sprint)"
  );

  assert.equal(result.success, true);
  assert.ok(result.data.suitability.includes("Refinement") || result.data.suitability.includes("incorporate"));
  assert.ok(result.data.evaluation);
  assert.ok(result.data.evaluation.whyThisWorks.length > 0);
  assert.ok(result.data.evaluation.differentiationSuggestions.length >= 1);
});

test("Schema Validation: Refine request schema validates correctly", () => {
  const blueprints = getCuratedBlueprintsForProfile(mockProfile);
  const validPayload = {
    blueprint: blueprints[0],
    refinementPrompt: "Simplify features for solo sprint",
    quickPreset: "Solo Dev (4-Week Sprint)",
  };
  const parseResult = refineIdeaRequestSchema.safeParse(validPayload);
  assert.equal(parseResult.success, true);

  const invalidPayload = {
    blueprint: blueprints[0],
    refinementPrompt: "", // too short
  };
  const invalidResult = refineIdeaRequestSchema.safeParse(invalidPayload);
  assert.equal(invalidResult.success, false);
});

// 9. In-Memory Route Handler Tests (Testing Server-Side API Handlers)
test("API Route Handler: /api/generate-ideas rejects invalid payload with 400", async () => {
  const invalidReq = new NextRequest("http://localhost:3000/api/generate-ideas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interests: ["AI"], skills: [] }),
  });

  const response = await generatePostHandler(invalidReq);
  assert.equal(response.status, 400);
  const json = await response.json();
  assert.equal(json.success, false);
  assert.match(json.error, /validation error/i);
});

test("API Route Handler: /api/generate-ideas succeeds with valid profile", async () => {
  const validReq = new NextRequest("http://localhost:3000/api/generate-ideas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mockProfile),
  });

  const response = await generatePostHandler(validReq);
  assert.equal(response.status, 200);
  const json = await response.json();
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data) && json.data.length >= 1);
  assert.ok(json.data[0].evaluation.feasibilityScore >= 1);
});

test("API Route Handler: /api/refine-idea succeeds with valid blueprint", async () => {
  const blueprints = getCuratedBlueprintsForProfile(mockProfile);
  const validReq = new NextRequest("http://localhost:3000/api/refine-idea", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      blueprint: blueprints[0],
      refinementPrompt: "Condense scope for 4-week solo build",
      quickPreset: "Solo Dev (4-Week Sprint)",
    }),
  });

  const response = await refinePostHandler(validReq);
  assert.equal(response.status, 200);
  const json = await response.json();
  assert.equal(json.success, true);
  assert.ok(json.data.title);
  assert.ok(json.data.evaluation.feasibilityScore >= 1);
});
