import { describe, expect, it } from "vitest";
import landingHtml from "../../public/mapa.html?raw";

describe("Biomedicina single kit offer", () => {
  const page = new DOMParser().parseFromString(landingHtml, "text/html");

  it("offers only the complete kit", () => {
    expect(Array.from(page.querySelectorAll("[data-plan]")).map((plan) => plan.getAttribute("data-plan"))).toEqual(["complete"]);
  });

  it("prices the complete kit at R$ 17,90", () => {
    expect(page.querySelector('[data-plan="complete"] .main-price')?.textContent).toBe("R$ 17,90");
  });

  it("preserves all 300 maps", () => {
    expect(page.querySelector('[data-plan="complete"]')?.getAttribute("data-maps")).toBe("300");
  });

  it("preserves all six bonuses", () => {
    expect(page.querySelector('[data-plan="complete"]')?.getAttribute("data-bonuses")).toBe("6");
  });

  it("preserves support", () => {
    expect(page.querySelector('[data-plan="complete"]')?.getAttribute("data-support")).toBe("true");
  });

  it("uses only the supplied checkout for every purchase", () => {
    const links = Array.from(page.querySelectorAll('a[href^="https://pay.wiapy.com/"]')).map((link) => link.getAttribute("href"));
    expect(links).toEqual([
      "https://pay.wiapy.com/g6_7CKyFP31J",
      "https://pay.wiapy.com/g6_7CKyFP31J",
    ]);
  });

  it("has no upgrade purchase option", () => {
    expect(page.querySelector("#upgrade-offer, [data-open-upgrade]")).toBeNull();
  });
});
