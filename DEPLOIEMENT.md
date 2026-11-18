# Déploiement

Application de suivi des terrains et équipements pour **Sport dans la Ville**, association qui anime 80 terrains de sport en pied d'immeuble.

## Services

- `frontend/` : écran web (Next.js, export statique servi par nginx), exposé publiquement sur le port 8080.
- `api/` : service api (Node), sur le port 8081, non exposé directement au public (routé via `/api/`).

## Services externes

Aucun à ce stade : les données sont en dur dans le frontend. Aucune base, aucun appel IA.

## Fragile / inachevé

- Pas de base de données : les terrains et équipements sont codés en dur dans `frontend/src/data/terrains.ts`.
- Pas de fiche terrain/équipement détaillée, pas de déclaration d'incident : à venir, voir `ITERATIONS.md`.

## Contact

Équipe 51 (36BDAX), hackathon eXaltemps Solidaire.
