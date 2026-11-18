export type AvisEquipement = "S" | "SAR" | "NS";

export type Equipement = {
  nom: string;
  avis: AvisEquipement;
};

export type Terrain = {
  nom: string;
  region: string;
  equipements: Equipement[];
};

export type Statut = "conforme" | "a-surveiller" | "non-conforme";

export function statutGlobal(equipements: Equipement[]): Statut {
  if (equipements.some((e) => e.avis === "NS")) return "non-conforme";
  if (equipements.some((e) => e.avis === "SAR")) return "a-surveiller";
  return "conforme";
}

export const terrains: Terrain[] = [
  {
    nom: "City-stade Croix-Rousse",
    region: "Auvergne-Rhône-Alpes",
    equipements: [
      { nom: "But de foot", avis: "S" },
      { nom: "Panier de basket", avis: "S" },
    ],
  },
  {
    nom: "City-stade Vaulx-en-Velin",
    region: "Auvergne-Rhône-Alpes",
    equipements: [
      { nom: "But de foot", avis: "SAR" },
      { nom: "Agrès", avis: "S" },
    ],
  },
  {
    nom: "Terrain Mulhouse Bourtzwiller",
    region: "Grand Est",
    equipements: [
      { nom: "But de foot", avis: "NS" },
      { nom: "Panier de basket", avis: "S" },
    ],
  },
  {
    nom: "Terrain Roubaix Alma",
    region: "Hauts-de-France",
    equipements: [{ nom: "Panier de basket", avis: "S" }],
  },
];
