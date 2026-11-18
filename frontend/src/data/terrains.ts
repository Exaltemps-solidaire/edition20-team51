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
  departement?: string;
  quartier?: string;
  anneeConstruction?: number;
  anneeRenovation?: number;
  conventionOccupationFoncier?: string;
  dateFinConventionOccupationFoncier?: string;
  proprieteEquipements?: string;
  conventionObjectifs?: string;
  dateFinConventionObjectifs?: string;
  sport?: string;
  nombreTerrain?: number;
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
  note: number;
  nbPrestations: number;
};

export type BadgeFiabilite = "Fiable" | "Correct" | "À surveiller";

export function badgeFiabilite(note: number): BadgeFiabilite {
  if (note >= 4) return "Fiable";
  if (note >= 3) return "Correct";
  return "À surveiller";
}

export const prestataires: Prestataire[] = [
  {
    nom: "SportFix Rhône",
    ville: "Lyon",
    specialite: "Buts et agrès",
    zoneIntervention: "Auvergne-Rhône-Alpes",
    note: 4.6,
    nbPrestations: 2,
  },
  {
    nom: "Alsace Terrains Services",
    ville: "Mulhouse",
    specialite: "Revêtements",
    zoneIntervention: "Grand Est",
    note: 3.8,
    nbPrestations: 4,
  },
  {
    nom: "Nord Équipements Sportifs",
    ville: "Roubaix",
    specialite: "Paniers de basket",
    zoneIntervention: "Hauts-de-France",
    note: 2.7,
    nbPrestations: 1,
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
    departement: "Rhône",
    quartier: "Croix-Rousse",
    anneeConstruction: 2008,
    anneeRenovation: 2019,
    conventionOccupationFoncier: "Mise à disposition par la ville de Lyon",
    dateFinConventionOccupationFoncier: "2028-06-30",
    proprieteEquipements: "Association",
    conventionObjectifs: "Convention d'objectifs Métropole de Lyon",
    dateFinConventionObjectifs: "2026-12-31",
    sport: "Football / Basketball",
    nombreTerrain: 1,
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
    departement: "Rhône",
    quartier: "Le Mas du Taureau",
    anneeConstruction: 2012,
    conventionOccupationFoncier: "Mise à disposition par la ville",
    dateFinConventionOccupationFoncier: "2027-09-30",
    proprieteEquipements: "Ville de Vaulx-en-Velin",
    conventionObjectifs: "Convention d'objectifs CAF du Rhône",
    dateFinConventionObjectifs: "2027-08-31",
    sport: "Football / Gymnastique",
    nombreTerrain: 1,
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
    departement: "Isère",
    quartier: "Teisseire",
    anneeConstruction: 2005,
    anneeRenovation: 2015,
    conventionOccupationFoncier: "Mise à disposition par Grenoble-Alpes Métropole",
    dateFinConventionOccupationFoncier: "2025-12-31",
    proprieteEquipements: "Association",
    conventionObjectifs: "Convention d'objectifs Politique de la Ville",
    dateFinConventionObjectifs: "2026-06-30",
    sport: "Football / Gymnastique",
    nombreTerrain: 1,
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
    departement: "Haut-Rhin",
    quartier: "Bourtzwiller",
    anneeConstruction: 2001,
    anneeRenovation: 2010,
    conventionOccupationFoncier: "Mise à disposition par la ville de Mulhouse",
    dateFinConventionOccupationFoncier: "2026-03-31",
    proprieteEquipements: "Ville de Mulhouse",
    conventionObjectifs: "Convention d'objectifs CAF du Haut-Rhin",
    dateFinConventionObjectifs: "2026-12-31",
    sport: "Football / Basketball",
    nombreTerrain: 2,
  },
  {
    nom: "Terrain Roubaix Alma",
    region: "Hauts-de-France",
    ville: "Roubaix",
    codePostal: "59100",
    situationJuridique: "Propriété municipale",
    equipements: [{ nom: "Panier de basket", avis: "S" }],
    departement: "Nord",
    quartier: "Alma-Gare",
    anneeConstruction: 2017,
    conventionOccupationFoncier: "Mise à disposition par la ville de Roubaix",
    dateFinConventionOccupationFoncier: "2029-01-31",
    proprieteEquipements: "Association",
    conventionObjectifs: "Convention d'objectifs Métropole Européenne de Lille",
    dateFinConventionObjectifs: "2027-12-31",
    sport: "Basketball",
    nombreTerrain: 1,
  },
];
