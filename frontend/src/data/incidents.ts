export type Urgence = "faible" | "normale" | "haute";

export type StatutIncident = "ouvert" | "cloture";

export type Incident = {
  id: number;
  terrainNom: string;
  equipementNom: string;
  description: string;
  urgence: Urgence;
  statut: StatutIncident;
  prestataire?: string;
  date?: string;
  resultat?: string;
};

export function incidentEstValide(description: string): boolean {
  return description.trim().length > 0;
}

export function creerIncident(
  id: number,
  terrainNom: string,
  equipementNom: string,
  description: string,
  urgence: Urgence,
): Incident {
  return {
    id,
    terrainNom,
    equipementNom,
    description: description.trim(),
    urgence,
    statut: "ouvert",
  };
}

export function clotureEstValide(
  prestataire: string,
  date: string,
  resultat: string,
): boolean {
  return (
    prestataire.trim().length > 0 &&
    date.trim().length > 0 &&
    resultat.trim().length > 0
  );
}

export function cloturerIncident(
  incident: Incident,
  prestataire: string,
  date: string,
  resultat: string,
): Incident {
  return {
    ...incident,
    statut: "cloture",
    prestataire: prestataire.trim(),
    date: date.trim(),
    resultat: resultat.trim(),
  };
}
