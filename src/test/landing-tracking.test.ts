import { afterEach, describe, expect, it, vi } from "vitest";
import { allowsTracking, landingTrackingScript } from "../lib/landing-tracking";

const publicTrace = "https://www.cloudflare.com/cdn-cgi/trace";
const pixelScript = 'script[src="https://cdn.utmify.com.br/scripts/pixel/pixel.js"]';
const testWindow = window as Window & { __landingTrackingStarted?: boolean };

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
  delete testWindow.__landingTrackingStarted;
  document.querySelectorAll('script[src*="cdn.utmify.com.br"]').forEach(node => node.remove());
});

async function runTracking(fetchMock: ReturnType<typeof vi.fn>) {
  vi.stubGlobal("fetch", fetchMock);
  await window.eval(landingTrackingScript);
}

const trace = (country: string) => ({ ok: true, text: async () => `loc=${country}\n` });

describe("Tracking on hosts without a local country endpoint", () => {
  it("loads UTMify once when the local endpoint fails and the fallback identifies Brazil", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({ ok: false }).mockResolvedValueOnce(trace("BR"));
    await runTracking(fetchMock);
    expect(fetchMock).toHaveBeenNthCalledWith(2, publicTrace, expect.objectContaining({ credentials: "omit", referrerPolicy: "no-referrer" }));
    expect(document.querySelectorAll(pixelScript)).toHaveLength(1);
    await window.eval(landingTrackingScript);
    expect(document.querySelectorAll(pixelScript)).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it("falls back when the preview returns HTML rather than trace data", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({ ok: true, text: async () => "<html>Preview</html>" }).mockResolvedValueOnce(trace("BR"));
    await runTracking(fetchMock);
    expect(document.querySelector(pixelScript)).not.toBeNull();
  });
  it("blocks Portugal even when resolved by the fallback", async () => {
    await runTracking(vi.fn().mockRejectedValueOnce(new Error("Unavailable")).mockResolvedValueOnce(trace("PT")));
    expect(document.querySelector(pixelScript)).toBeNull();
  });
  it("keeps tracking blocked when both country lookups fail", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("Unavailable"));
    await runTracking(fetchMock);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(document.querySelector(pixelScript)).toBeNull();
  });
  it("does not override an explicit unknown country with the fallback", async () => {
    const fetchMock = vi.fn().mockResolvedValue(trace("XX"));
    await runTracking(fetchMock);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(document.querySelector(pixelScript)).toBeNull();
  });
  it("does not look up the country or load scripts after an opt-out", async () => {
    localStorage.setItem("landing-ad-opt-out", "true");
    const fetchMock = vi.fn();
    await runTracking(fetchMock);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(document.querySelector(pixelScript)).toBeNull();
  });
});

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