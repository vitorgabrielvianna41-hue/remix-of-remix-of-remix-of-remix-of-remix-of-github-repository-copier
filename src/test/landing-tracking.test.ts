import { describe, expect, it } from "vitest";
import { allowsTracking } from "../lib/landing-tracking";

describe("No-banner tracking regional limits", () => {
  it("allows Brazil without an opt-out", () => expect(allowsTracking("BR")).toBe(true));
  it("blocks regions requiring consent", () => expect(allowsTracking("PT")).toBe(false));
  it("blocks unresolved geography", () => {
    expect(allowsTracking("XX")).toBe(false);
    expect(allowsTracking("")).toBe(false);
    expect(allowsTracking("T1")).toBe(false);
  });
  it("honors an explicit refusal in Brazil", () => expect(allowsTracking("BR", true)).toBe(false));
});