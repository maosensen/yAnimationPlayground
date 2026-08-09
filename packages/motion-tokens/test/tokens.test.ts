import assert from "node:assert/strict";
import test from "node:test";
import {
  choreography,
  distance,
  duration,
  easing,
  millisecondsToFrames,
  millisecondsToSeconds,
  spring,
  stagger,
} from "../src/index.ts";

test("duration and stagger scales remain ordered", () => {
  assert.deepEqual(Object.values(duration), [0, 120, 180, 280, 420, 640, 900]);
  assert.deepEqual(Object.values(stagger), [40, 70, 110]);
  assert.deepEqual(Object.values(distance), [4, 8, 16, 24]);
});

test("easing curves are valid cubic bezier tuples", () => {
  for (const curve of Object.values(easing)) {
    assert.equal(curve.length, 4);
    assert.ok(curve.every(Number.isFinite));
    assert.ok(curve[0] >= 0 && curve[0] <= 1);
    assert.ok(curve[2] >= 0 && curve[2] <= 1);
  }
});

test("spring presets are stable physical contracts", () => {
  for (const preset of Object.values(spring)) {
    assert.ok(preset.stiffness > 0);
    assert.ok(preset.damping > 0);
    assert.ok(preset.mass > 0);
  }
});

test("semantic choreography only references existing tokens", () => {
  for (const recipe of Object.values(choreography)) {
    if ("duration" in recipe) assert.ok(recipe.duration in duration);
    if ("easing" in recipe) assert.ok(recipe.easing in easing);
    if ("spring" in recipe) assert.ok(recipe.spring in spring);
    if ("stagger" in recipe) assert.ok(recipe.stagger in stagger);
    if ("distance" in recipe) assert.ok(recipe.distance in distance);
  }
});

test("time conversion is deterministic across browser and video runtimes", () => {
  assert.equal(millisecondsToSeconds(duration.deliberate), 0.42);
  assert.equal(millisecondsToFrames(duration.expressive, 30), 19);
  assert.equal(millisecondsToFrames(duration.expressive, 60), 38);
  assert.throws(() => millisecondsToFrames(100, 0), RangeError);
});
