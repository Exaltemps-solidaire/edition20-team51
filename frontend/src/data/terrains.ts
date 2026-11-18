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
  situationJuridique?: string;
  equipements: Equipement[];
  controleAnnuelEnRetard?: boolean;
  reparationBloquee?: boolean;
};

export type Statut = "conforme" | "a-surveiller" | "non-conforme";

export function filtrerTerrains(liste: Terrain[], recherche: string): Terrain[] {
  const q = recherche.trim().toLowerCase();
  if (!q) return liste;
  return liste.filter(
    (t) =>
      t.ville.toLowerCase().includes(q) || t.codePostal.includes(q),
  );
}

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

const GRAVITE: Record<Statut, number> = {
  conforme: 0,
  "a-surveiller": 1,
  "non-conforme": 2,
};

export function statutRegion(liste: Terrain[], region: string): Statut {
  const statutsRegion = liste
    .filter((t) => t.region === region)
    .map((t) => statutGlobal(t.equipements));
  return statutsRegion.reduce(
    (pire, s) => (GRAVITE[s] > GRAVITE[pire] ? s : pire),
    "conforme" as Statut,
  );
}

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

export type Prestataire = {
  nom: string;
  ville: string;
  specialite: string;
  zoneIntervention: string;
};

export const prestataires: Prestataire[] = [
  {
    nom: "SportFix Rhône",
    ville: "Lyon",
    specialite: "Buts et agrès",
    zoneIntervention: "Auvergne-Rhône-Alpes",
  },
  {
    nom: "Alsace Terrains Services",
    ville: "Mulhouse",
    specialite: "Revêtements",
    zoneIntervention: "Grand Est",
  },
  {
    nom: "Nord Équipements Sportifs",
    ville: "Roubaix",
    specialite: "Paniers de basket",
    zoneIntervention: "Hauts-de-France",
  },
];

export const terrains: Terrain[] = [
  {
    nom: "City-stade Croix-Rousse",
    region: "Auvergne-Rhône-Alpes",
    ville: "Lyon",
    codePostal: "69004",
    situationJuridique: "Propriété municipale",
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
    situationJuridique: "Propriété municipale",
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
    situationJuridique: "Mise à disposition associative",
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
    situationJuridique: "Propriété municipale",
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
    situationJuridique: "Propriété municipale",
    equipements: [{ nom: "Panier de basket", avis: "S" }],
  },
];
