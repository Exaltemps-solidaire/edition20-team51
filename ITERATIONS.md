# Plan d'itérations — Sport dans la Ville (équipe 36BDAX)

- **Source du plan** : proposé par l'agent (aucun plan d'itérations de l'équipe trouvé dans `passation/cadrage/` ni dans `passation.json`).
- **Temps restant annoncé** : 40 minutes, à la question posée le 2026-11-18.
- **Durée d'un tour de test de l'équipe** : 10 minutes.
- **Capacité** : une itération coûte au moins codage (≤10 min) + publication (~5 min) + tour de test (10 min), soit ≥15 min et jusqu'à ~25 min si le codage va au plafond.

✂️ **40 minutes ne permettent qu'une seule itération complète dans ces conditions** (25 min consommées dans le pire cas, 15 min restants ne suffisent pas à un deuxième cycle complet avec marge). Je détaille donc une seule itération. Tout le reste du plan de livraison de l'équipe (déclaration d'incident, suivi/clôture, annuaire des prestataires, carte interactive) sort du périmètre de ce tour et sera retaillé une fois le temps restant reconfirmé après l'itération 1.

Ordre de priorité suivi : celui du plan de livraison de l'équipe (`passation/cadrage/6-plan-de-livraison.md` / section « Le plan » du PRD), puisque `2-idees-priorisees.md` est vide (« Pas encore produit »). Rien n'est écarté par `matiere/arbitrages.md` (« Aucun vote consolidé »).

---

## Itération 1 : afficher la liste des terrains par région, avec des données en dur

- **Dans le périmètre** :
  - Écran principal du cas passant : liste des terrains groupés par région, avec un statut de conformité global par terrain (basé sur les avis de ses équipements : S / SAR / NS).
  - Données en dur (pas de base, pas d'appel API métier à ce stade).
  - `.env.example` à la racine et `DEPLOIEMENT.md`, conformes au contrat de déployabilité.
  - Déploiement selon la recette du `/CLAUDE.md` racine (ports 8080/8081, chemins relatifs).
- **Hors périmètre** : fiche détaillée d'un terrain, fiche équipement, déclaration d'incident, suivi/clôture, annuaire des prestataires, carte interactive, choix de persona (« Qui êtes-vous ? »), toute base de données.
- **Critères d'acceptation** (3 au plus) :
  - Étant donné l'application déployée, quand je visite `/`, alors je vois les régions et, pour chaque région, la liste de ses terrains avec un statut de conformité global.
  - Étant donné un terrain dont un équipement a l'avis « NS », quand la page affiche son statut, alors le terrain apparaît comme non conforme (et non « conforme » ou « à surveiller »).
  - Étant donné l'application déployée, quand j'appelle `GET /health` et `GET /sante` sur le front (8080) et l'API (8081), alors chacune répond 200.
- **Hypothèse de l'équipe couverte** : aucune — `cadrage/5-hypotheses.md` est vide (« Pas encore produit »). Cette itération répond directement au premier job to be done du plan de livraison (« tracer l'état de conformité par équipement, sans ouvrir Excel »), côté lecture seule.
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** :
  - `.env.example`
  - `DEPLOIEMENT.md`
  - `frontend/src/data/terrains.ts` (données en dur + fonction de calcul du statut global)
  - `frontend/src/app/page.tsx`
  - `frontend/src/app/page.module.css`
- **Tests unitaires prévus** : 1 à 3, sur la fonction qui calcule le statut global d'un terrain à partir des avis de ses équipements (S / SAR / NS → conforme / à surveiller / non conforme).
- **Étapes ajoutées à la démo** : ouvrir `/`, vérifier que les régions et leurs terrains s'affichent avec un statut. (Non faites : voir ci-dessous.)
- **Bilan** :
  - **Durée de codage réelle** : 1 minute (sur 10 estimées). Très en dessous du budget.
  - **Dépassement** : oui, mais pas sur le codage — sur la fenêtre globale de l'itération (codage + publication + tour de test). Le temps annoncé (12 min) a été dépassé d'environ 25 minutes à cause de deux aléas hors code :
    1. la plateforme (Postgres/registre/réseau/etc.) n'était pas démarrée du tout en début d'itération, alors que le gabarit suppose qu'elle tourne déjà (~5 min de démarrage) ;
    2. Docker Hub a mis la VM en rate-limit anonyme pendant le `podman build` (touchant aussi des services de la plateforme comme Casdoor) ; le développeur s'est connecté avec `podman login docker.io`, ce qui a débloqué les pulls.
    Décision du développeur : continuer malgré le dépassement plutôt que de s'arrêter.
  - **Critères satisfaits** : les 3 critères d'acceptation (écran par région avec statut, terrain à équipement NS affiché non conforme, `/health` et `/sante` à 200 sur les deux ports) — vérifiés localement (`curl localhost:8080` et `:8081/health`) et en ligne via `./scripts/signaler-version.sh 1`.
  - **Reporté** : la mise à jour de `e2e/demo.spec.ts` (hors DoD, sautée faute de temps après les aléas de déploiement) — à faire à l'itération 2 si le temps le permet.
  - **Bloqué par le harnais** : le premier appel à `signaler-version.sh` a été refusé par le hook `verifier-avant-signal.sh` (`npm test` échouait, faute de `node_modules` installés à la racine du dépôt) ; corrigé par `npm install` à la racine, puis signalement accepté.
  - **Modifications** :
    - `frontend/src/data/terrains.ts` (nouveau) : données en dur (terrains, équipements, avis) et `statutGlobal()` — sert les 3 critères d'acceptation.
    - `frontend/src/data/terrains.test.ts` (nouveau) : 3 tests Vitest sur `statutGlobal()`.
    - `frontend/src/app/page.tsx` : remplace la page de démarrage Next.js par l'écran « liste des terrains par région » — sert le critère 1.
    - `.env.example` (nouveau) : documente `PORT` (seule variable lue par l'application à ce stade).
    - `DEPLOIEMENT.md` (nouveau) : page de déploiement exigée par le contrat.
    - `podman-compose.yml` (nouveau, racine) : assemble `frontend`/`api` sur `core-network`, ports 8080/8081.
    - `api/Dockerfile`, `frontend/Dockerfile` : image de base qualifiée en `docker.io/library/...` (résolution des noms courts échoue hors terminal interactif).

---

## À venir (non détaillé, à retailler selon le temps restant au début de l'itération 2)

1. Mettre à jour `e2e/demo.spec.ts` (reporté de l'itération 1, hors DoD).
2. Fiche terrain : caractéristiques, situation juridique, liste des équipements.
3. Fiche équipement : historique des contrôles et avis S / SAR / NS.
4. Déclaration d'incident (formulaire mobile, terrain + équipement + description + urgence).
5. Suivi et clôture de l'incident (prestataire, date, résultat).
6. Annuaire des prestataires (écrans 1 et 2 de l'idée retenue).
7. Carte interactive (écran 4 de l'idée retenue).
8. Écran « Qui êtes-vous ? » (choix de persona, sans connexion).

⚠️ La plateforme est maintenant démarrée et les images de base sont en cache local : les aléas de l'itération 1 (plateforme froide, rate-limit Docker Hub) ne devraient plus coûter de temps à l'itération 2. À confirmer au prochain `/iteration 2` en redemandant le temps restant.
