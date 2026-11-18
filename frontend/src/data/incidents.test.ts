import { describe, expect, it } from "vitest";
import {
  incidentEstValide,
  creerIncident,
  clotureEstValide,
  cloturerIncident,
  type Incident,
} from "./incidents";

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
      statut: "ouvert",
    });
  });
});

describe("clotureEstValide", () => {
  it("rejette si un champ manque", () => {
    expect(clotureEstValide("", "2026-11-18", "Réparé")).toBe(false);
    expect(clotureEstValide("SportFix Rhône", "", "Réparé")).toBe(false);
    expect(clotureEstValide("SportFix Rhône", "2026-11-18", "")).toBe(false);
  });

  it("accepte si les 3 champs sont renseignés", () => {
    expect(clotureEstValide("SportFix Rhône", "2026-11-18", "Réparé")).toBe(
      true,
    );
  });
});

describe("cloturerIncident", () => {
  it("passe l'incident à clôturé avec les informations de clôture", () => {
    const incident: Incident = {
      id: 1,
      terrainNom: "City-stade Teisseire",
      equipementNom: "But de foot",
      description: "Filet troué",
      urgence: "haute",
      statut: "ouvert",
    };
    expect(
      cloturerIncident(incident, "SportFix Rhône", "2026-11-18", "Réparé"),
    ).toEqual({
      ...incident,
      statut: "cloture",
      prestataire: "SportFix Rhône",
      date: "2026-11-18",
      resultat: "Réparé",
    });
  });
});
