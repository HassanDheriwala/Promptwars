import assert from "node:assert/strict";

async function runApiTests() {
  console.log("=== Running API HTTP Validation & Security Tests ===");

  // 1. Invalid payload: Empty skills
  const res1 = await fetch("http://localhost:3000/api/generate-ideas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interests: ["AI"], skills: [] }),
  });
  const data1 = await res1.json();
  assert.equal(res1.status, 400, "Should return 400 for empty skills");
  assert.equal(data1.success, false);
  assert.match(data1.error, /validation error/i);
  console.log("✔ Test 1 Passed: Empty skills rejected with 400 & clear message");

  // 2. Invalid payload: Missing body / empty string
  const res2 = await fetch("http://localhost:3000/api/generate-ideas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "invalid-json",
  });
  const data2 = await res2.json();
  assert.equal(res2.status, 400, "Should return 400 for invalid JSON");
  assert.equal(data2.success, false);
  console.log("✔ Test 2 Passed: Invalid JSON payload rejected cleanly");

  // 3. Valid generation payload
  const validProfile = {
    interests: ["Healthcare & MedTech"],
    skills: ["Python", "FastAPI"],
    domain: "Healthcare & Medicine",
    projectType: "Full-Stack Web App",
    experienceLevel: "Intermediate",
    timeframeWeeks: 12,
    teamSize: 2,
  };

  const res3 = await fetch("http://localhost:3000/api/generate-ideas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validProfile),
  });
  const data3 = await res3.json();
  assert.equal(res3.status, 200, "Should return 200 for valid profile");
  assert.equal(data3.success, true);
  assert.ok(Array.isArray(data3.data) && data3.data.length >= 1, "Returns blueprint array");
  console.log(`✔ Test 3 Passed: Blueprint generation succeeded (${data3.data.length} blueprints, source: ${data3.source})`);

  // 4. Refinement API
  const res4 = await fetch("http://localhost:3000/api/refine-idea", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      blueprint: data3.data[0],
      refinementPrompt: "Condense scope for a solo 4-week project",
      quickPreset: "Solo Dev (4-Week Sprint)",
    }),
  });
  const data4 = await res4.json();
  assert.equal(res4.status, 200, "Should return 200 for valid refinement");
  assert.equal(data4.success, true);
  assert.ok(data4.data.title, "Refined blueprint has title");
  console.log("✔ Test 4 Passed: Blueprint refinement succeeded");

  console.log("=== All API HTTP Tests Passed! ===");
}

runApiTests().catch((err) => {
  console.error("API test failed:", err);
  process.exit(1);
});
