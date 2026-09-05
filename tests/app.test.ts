import test from "node:test";
import assert from "node:assert/strict";
import { studentProfileSchema, refineIdeaRequestSchema } from "../src/lib/schemas";
import { checkRateLimit } from "../src/lib/rate-limit";
import { getCuratedBlueprintsForProfile } from "../src/lib/mock-data";
import { generateMarkdownBlueprint } from "../src/lib/export-markdown";
import { generateProjectBlueprints, refineCapstoneBlueprint } from "../src/lib/gemini";
import { StudentProfile } from "../src/lib/types";

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

test("Curated Blueprints: Returns domain-matching blueprints with tailored scope", () => {
  const blueprints = getCuratedBlueprintsForProfile(mockProfile);
  assert.ok(blueprints.length >= 1);
  const primary = blueprints[0];

  assert.ok(primary.title.length > 5);
  assert.ok(primary.coreFeatures.length >= 2);
  assert.ok(primary.roadmap.length >= 2);
  assert.equal(primary.estimatedScope.totalWeeks, 12);
  assert.ok(primary.suitability.includes("team of 2"));
});

test("Markdown Exporter: Produces valid IEEE capstone formatted document", () => {
  const blueprints = getCuratedBlueprintsForProfile(mockProfile);
  const md = generateMarkdownBlueprint(blueprints[0]);

  assert.match(md, /# Final-Year Capstone Project Blueprint:/);
  assert.match(md, /## 1\. Problem Statement/);
  assert.match(md, /## 5\. Technology Stack/);
  assert.match(md, /## 8\. 3-Week Proof of Concept \(MVP Version\)/);
  assert.match(md, /## 9\. Phased Development Roadmap/);
  assert.match(md, /## 10\. Risks, Challenges & Mitigations/);
});

test("Gemini Gateway: Graceful fallback when GEMINI_API_KEY is not set", async () => {
  // Ensure we simulate missing API key
  const originalKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;

  const result = await generateProjectBlueprints(mockProfile);
  assert.equal(result.success, true);
  assert.equal(result.isDemoMode, true);
  assert.equal(result.source, "curated_fallback");
  assert.ok(result.data.length >= 1);

  // Restore
  if (originalKey) process.env.GEMINI_API_KEY = originalKey;
});

test("Refinement Gateway: Modifies blueprint in demo/fallback mode cleanly", async () => {
  const blueprints = getCuratedBlueprintsForProfile(mockProfile);
  const target = blueprints[0];

  const result = await refineCapstoneBlueprint(
    target,
    "Adapt for strict 4-week deadline and solo development",
    "Solo Dev (4-Week Sprint)"
  );

  assert.equal(result.success, true);
  assert.ok(result.data.suitability.includes("Refinement") || result.data.suitability.includes("incorporate"));
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
