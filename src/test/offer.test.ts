import { describe, expect, it } from "vitest";
import landingHtml from "../../public/mapa.html?raw";

describe("Biomedicina offer invariants", () => {
  const page = new DOMParser().parseFromString(landingHtml, "text/html");

  it("prices the basic plan at R$ 10,00", () => {
    expect(page.querySelector('[data-plan="basic"] .main-price')?.textContent).toBe("R$ 10,00");
  });

  it("includes 100 maps in the basic plan", () => {
    expect(page.querySelector('[data-plan="basic"]')?.getAttribute("data-maps")).toBe("100");
  });

  it("excludes bonuses from the basic plan", () => {
    expect(page.querySelector('[data-plan="basic"]')?.getAttribute("data-bonuses")).toBe("0");
  });

  it("excludes support from the basic plan", () => {
    expect(page.querySelector('[data-plan="basic"]')?.getAttribute("data-support")).toBe("false");
  });

  it("prices the complete plan at R$ 24,90", () => {
    expect(page.querySelector('[data-plan="complete"] .main-price')?.textContent).toBe("R$ 24,90");
  });

  it("includes all 300 maps in the complete plan", () => {
    expect(page.querySelector('[data-plan="complete"]')?.getAttribute("data-maps")).toBe("300");
  });

  it("includes all six bonuses in the complete plan", () => {
    expect(page.querySelector('[data-plan="complete"]')?.getAttribute("data-bonuses")).toBe("6");
  });

  it("includes support in the complete plan", () => {
    expect(page.querySelector('[data-plan="complete"]')?.getAttribute("data-support")).toBe("true");
  });

  it("uses the supplied basic checkout", () => {
    expect(page.querySelector('[data-plan="basic"] a')?.getAttribute("href")).toBe("https://pay.wiapy.com/EluXtsqIiEY");
  });

  it("uses the supplied complete checkout for every complete purchase", () => {
    const completeLinks = Array.from(
      page.querySelectorAll('[data-plan="complete"] a, #final-cta-section a'),
    ).map((link) => link.getAttribute("href"));
    expect(completeLinks).toEqual([
      "https://pay.wiapy.com/g6_7CKyFP31J",
      "https://pay.wiapy.com/g6_7CKyFP31J",
    ]);
  });

  it("opens the exclusive offer popup from the basic plan button", () => {
    expect(page.querySelector('[data-plan="basic"] a')?.hasAttribute("data-open-upgrade")).toBe(true);
  });

  it("prices the exclusive upgrade at R$ 15,90 instead of R$ 24,90", () => {
    const modal = page.querySelector("#upgrade-offer");
    expect(modal?.querySelector(".upgrade-modal-price-now")?.textContent).toBe("R$ 15,90");
    expect(modal?.querySelector("s")?.textContent).toBe("R$ 24,90");
  });

  it("sends the exclusive upgrade to its own checkout", () => {
    expect(page.querySelector("#upgrade-offer .upgrade-modal-main")?.getAttribute("href")).toBe(
      "https://pay.wiapy.com/hDkqeTD3u09",
    );
  });

  it("keeps the R$ 10,00 choice available inside the popup", () => {
    expect(page.querySelector("#upgrade-offer .upgrade-modal-keep")?.getAttribute("href")).toBe(
      "https://pay.wiapy.com/EluXtsqIiEY",
    );
  });
});
