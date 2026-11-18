import { describe, expect, it } from "vitest";
import { statutGlobal } from "./terrains";

describe("statutGlobal", () => {
  it("renvoie non-conforme si un équipement a l'avis NS", () => {
    expect(
      statutGlobal([
        { nom: "But", avis: "S" },
        { nom: "Panier", avis: "NS" },
      ]),
    ).toBe("non-conforme");
  });

  it("renvoie a-surveiller si le pire avis est SAR", () => {
    expect(
      statutGlobal([
        { nom: "But", avis: "S" },
        { nom: "Panier", avis: "SAR" },
      ]),
    ).toBe("a-surveiller");
  });

  it("renvoie conforme si tous les avis sont S", () => {
    expect(statutGlobal([{ nom: "But", avis: "S" }])).toBe("conforme");
  });
});
