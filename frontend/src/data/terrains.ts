export type AvisEquipement = "S" | "SAR" | "NS";

export type Equipement = {
  nom: string;
  avis: AvisEquipement;
};

export type Terrain = {
  nom: string;
  region: string;
  ville: string;
  codePostal: string;
  equipements: Equipement[];
  controleAnnuelEnRetard?: boolean;
  reparationBloquee?: boolean;
};

export type Statut = "conforme" | "a-surveiller" | "non-conforme";

export function statutGlobal(equipements: Equipement[]): Statut {
  if (equipements.some((e) => e.avis === "NS")) return "non-conforme";
  if (equipements.some((e) => e.avis === "SAR")) return "a-surveiller";
  return "conforme";
}

export type Statistiques = {
  terrainsSuivis: number;
  nonConformes: number;
  controlesEnRetard: number;
  reparationsBloquees: number;
};

export function statistiques(liste: Terrain[]): Statistiques {
  return {
    terrainsSuivis: liste.length,
    nonConformes: liste.filter(
      (t) => statutGlobal(t.equipements) === "non-conforme",
    ).length,
    controlesEnRetard: liste.filter((t) => t.controleAnnuelEnRetard).length,
    reparationsBloquees: liste.filter((t) => t.reparationBloquee).length,
  };
}

export const terrains: Terrain[] = [
  {
    nom: "City-stade Croix-Rousse",
    region: "Auvergne-Rhône-Alpes",
    ville: "Lyon",
    codePostal: "69004",
    equipements: [
      { nom: "But de foot", avis: "S" },
      { nom: "Panier de basket", avis: "S" },
    ],
  },
  {
    nom: "City-stade Vaulx-en-Velin",
    region: "Auvergne-Rhône-Alpes",
    ville: "Vaulx-en-Velin",
    codePostal: "69120",
    equipements: [
      { nom: "But de foot", avis: "SAR" },
      { nom: "Agrès", avis: "S" },
    ],
    controleAnnuelEnRetard: true,
  },
  {
    nom: "City-stade Teisseire",
    region: "Auvergne-Rhône-Alpes",
    ville: "Grenoble",
    codePostal: "38100",
    equipements: [
      { nom: "But de foot", avis: "NS" },
      { nom: "Agrès", avis: "S" },
    ],
    reparationBloquee: true,
  },
  {
    nom: "Terrain Mulhouse Bourtzwiller",
    region: "Grand Est",
    ville: "Mulhouse",
    codePostal: "68100",
    equipements: [
      { nom: "But de foot", avis: "NS" },
      { nom: "Panier de basket", avis: "S" },
    ],
    reparationBloquee: true,
  },
  {
    nom: "Terrain Roubaix Alma",
    region: "Hauts-de-France",
    ville: "Roubaix",
    codePostal: "59100",
    equipements: [{ nom: "Panier de basket", avis: "S" }],
  },
];
