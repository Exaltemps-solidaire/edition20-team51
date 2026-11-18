import { describe, expect, it } from "vitest";
import { statutGlobal, statistiques, type Terrain } from "./terrains";

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

describe("statistiques", () => {
  const liste: Terrain[] = [
    {
      nom: "A",
      region: "R",
      ville: "V",
      codePostal: "00000",
      equipements: [{ nom: "But", avis: "S" }],
    },
    {
      nom: "B",
      region: "R",
      ville: "V",
      codePostal: "00000",
      equipements: [{ nom: "But", avis: "NS" }],
      controleAnnuelEnRetard: true,
      reparationBloquee: true,
    },
  ];

  it("compte les terrains suivis, non conformes, contrôles en retard et réparations bloquées", () => {
    expect(statistiques(liste)).toEqual({
      terrainsSuivis: 2,
      nonConformes: 1,
      controlesEnRetard: 1,
      reparationsBloquees: 1,
    });
  });
});
