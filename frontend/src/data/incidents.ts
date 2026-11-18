export type Urgence = "faible" | "normale" | "haute";

export type Incident = {
  id: number;
  terrainNom: string;
  equipementNom: string;
  description: string;
  urgence: Urgence;
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
  return { id, terrainNom, equipementNom, description: description.trim(), urgence };
}
