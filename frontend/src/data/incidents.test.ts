import { describe, expect, it } from "vitest";
import { incidentEstValide, creerIncident } from "./incidents";

describe("incidentEstValide", () => {
  it("rejette une description vide", () => {
    expect(incidentEstValide("")).toBe(false);
  });

  it("rejette une description composée uniquement d'espaces", () => {
    expect(incidentEstValide("   ")).toBe(false);
  });

  it("accepte une description renseignée", () => {
    expect(incidentEstValide("But cassé")).toBe(true);
  });
});

describe("creerIncident", () => {
  it("crée un incident en coupant les espaces de la description", () => {
    expect(
      creerIncident(1, "City-stade Teisseire", "But de foot", "  Filet troué  ", "haute"),
    ).toEqual({
      id: 1,
      terrainNom: "City-stade Teisseire",
      equipementNom: "But de foot",
      description: "Filet troué",
      urgence: "haute",
    });
  });
});
