import { describe, expect, it } from "vitest";
import {
  statutGlobal,
  statistiques,
  statutRegion,
  filtrerTerrains,
  badgeFiabilite,
  type Terrain,
} from "./terrains";

describe("badgeFiabilite", () => {
  it("renvoie Fiable à partir de 4", () => {
    expect(badgeFiabilite(4.6)).toBe("Fiable");
    expect(badgeFiabilite(4)).toBe("Fiable");
  });

  it("renvoie Correct entre 3 et 4", () => {
    expect(badgeFiabilite(3.8)).toBe("Correct");
  });

  it("renvoie À surveiller en dessous de 3", () => {
    expect(badgeFiabilite(2.7)).toBe("À surveiller");
  });
});

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

describe("statutRegion", () => {
  const liste: Terrain[] = [
    {
      nom: "A",
      region: "R1",
      ville: "V",
      codePostal: "00000",
      equipements: [{ nom: "But", avis: "S" }],
    },
    {
      nom: "B",
      region: "R1",
      ville: "V",
      codePostal: "00000",
      equipements: [{ nom: "But", avis: "SAR" }],
    },
    {
      nom: "C",
      region: "R2",
      ville: "V",
      codePostal: "00000",
      equipements: [{ nom: "But", avis: "NS" }],
    },
  ];

  it("renvoie le pire statut des terrains de la région", () => {
    expect(statutRegion(liste, "R1")).toBe("a-surveiller");
    expect(statutRegion(liste, "R2")).toBe("non-conforme");
  });
});

describe("filtrerTerrains", () => {
  const liste: Terrain[] = [
    {
      nom: "A",
      region: "R",
      ville: "Lyon",
      codePostal: "69004",
      equipements: [{ nom: "But", avis: "S" }],
    },
    {
      nom: "B",
      region: "R",
      ville: "Mulhouse",
      codePostal: "68100",
      equipements: [{ nom: "But", avis: "S" }],
    },
  ];

  it("filtre par ville, insensible à la casse", () => {
    expect(filtrerTerrains(liste, "lyon")).toEqual([liste[0]]);
  });

  it("filtre par code postal", () => {
    expect(filtrerTerrains(liste, "681")).toEqual([liste[1]]);
  });

  it("renvoie toute la liste si la recherche est vide", () => {
    expect(filtrerTerrains(liste, "")).toEqual(liste);
  });
});
