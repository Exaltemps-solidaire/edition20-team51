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

## Itération 2 : habillage visuel conforme à la maquette (demande du développeur, captures `3.jpg`/`4.jpg`)

- **Plan validé** (demande hors passation, taillée en itération avec le développeur).
- **Temps restant annoncé** : 10 minutes au total (hors déploiement), à la question posée le 2026-11-18.
- ✂️ Ce budget ne permet qu'une seule itération de codage : carte interactive, recherche, onglets Terrains/Prestataires restent hors périmètre.
- **Dans le périmètre** :
  - En-tête vert foncé (titre + sous-titre) + badge « Données d'exemple ».
  - 4 cartes de stats (Terrains suivis, Non conformes, Contrôles en retard, Réparations bloquées), calculées depuis `frontend/src/data/terrains.ts`.
  - Bloc « À traiter en priorité » listant les terrains non conformes, en cartes.
- **Hors périmètre** : carte France, recherche, onglets, toggle Carte/Par région, case « Afficher les prestataires », annuaire des prestataires.
- **Critères d'acceptation** :
  - La page `/` affiche l'en-tête vert avec titre/sous-titre et le badge « Données d'exemple ».
  - Les 4 cartes de stats affichent des nombres cohérents avec les données en dur.
  - Les terrains non conformes apparaissent dans un bloc « À traiter en priorité » distinct de la liste par région.
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : `frontend/src/data/terrains.ts`, `frontend/src/data/terrains.test.ts`, `frontend/src/app/page.tsx`, `frontend/src/app/page.module.css`.
- **Bilan** :
  - **Durée de codage réelle** : 1 minute (sur 10 estimées). Pas de dépassement.
  - **Critères satisfaits** : les 3 (en-tête vert + badge, 4 cartes de stats cohérentes avec les données, bloc « À traiter en priorité » distinct) — vérifiés via `curl localhost:8080/` après déploiement.
  - **Reporté** : rien de nouveau pour cette itération ; `e2e/demo.spec.ts` reste reporté (voir itération 1).
  - **Bloqué par le harnais** : rien — `npm test` et `verifier-deployabilite.sh` passaient déjà avant le signal.
  - **Modifications** :
    - `frontend/src/data/terrains.ts` : ajout de `ville`/`codePostal` sur chaque terrain, des champs optionnels `controleAnnuelEnRetard`/`reparationBloquee`, et de la fonction `statistiques()` — sert le critère 2.
    - `frontend/src/data/terrains.test.ts` : test Vitest sur `statistiques()`.
    - `frontend/src/app/page.tsx` : en-tête vert + badge, 4 cartes de stats, bloc « À traiter en priorité » — sert les 3 critères.
    - `frontend/src/app/page.module.css` : réécriture complète du style (palette verte, cartes, badges de statut) pour coller à la maquette.
    - `frontend/src/app/globals.css` : reprend la modification déjà en cours (palette de variables CSS), non générée par cette itération.

---

## Itération 3 : vue "par région" avec pastille de statut et légende (pas la carte SVG complète)

- **Plan validé** (développeur : « suffisamment [de temps], go »).
- **Temps restant annoncé** : non chiffré précisément par le développeur ; je garde le budget standard de 10 minutes de codage et m'arrête à l'alarme de 8 minutes si besoin.
- ✂️ "Carte interactive + onglets + recherche" du point 2 de "À venir" est trop gros pour une itération : je ne garde que la vue par région avec pastille de couleur et légende. La vraie carte SVG de la France, les onglets Terrains/Prestataires et la recherche restent hors périmètre, reportés à une itération 4.
- **Dans le périmètre** :
  - Nouvelle section "Vue par région" : une pastille (vert/orange/rouge) par région, calculée à partir du pire statut de ses terrains.
  - Légende couleur → statut (vert = conforme, orange = à surveiller, rouge = non conforme), reprenant les couleurs de la maquette.
- **Hors périmètre** : carte SVG de la France, positions géographiques, onglets Terrains/Prestataires, recherche, case "Afficher les prestataires".
- **Critères d'acceptation** :
  - La page `/` affiche une pastille de couleur par région, correspondant au pire statut de ses terrains.
  - Une légende affiche la correspondance entre les 3 couleurs et les 3 statuts.
  - `npm test` passe avec un test sur la fonction qui calcule le statut d'une région.
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : `frontend/src/data/terrains.ts`, `frontend/src/data/terrains.test.ts`, `frontend/src/app/page.tsx`, `frontend/src/app/page.module.css`.
- **Bilan** :
  - **Durée de codage réelle** : moins d'une minute (sur 10 estimées). Pas de dépassement.
  - **Critères satisfaits** : les 3 (pastille par région au pire statut, légende des 3 couleurs, test Vitest sur `statutRegion`) — vérifiés via `curl localhost:8080/` après déploiement.
  - **Reporté** : carte SVG de la France, onglets Terrains/Prestataires, recherche (reportés à l'itération 4, voir « À venir »).
  - **Bloqué par le harnais** : rien — `npm test` et `verifier-deployabilite.sh` passaient déjà avant le signal.
  - **Modifications** :
    - `frontend/src/data/terrains.ts` : ajout de `statutRegion()` (pire statut des terrains d'une région) — sert le critère 1.
    - `frontend/src/data/terrains.test.ts` : test Vitest sur `statutRegion()` — sert le critère 3.
    - `frontend/src/app/page.tsx` : section « Vue par région » avec pastilles colorées et légende — sert les critères 1 et 2.
    - `frontend/src/app/page.module.css` : styles des pastilles et de la légende.

---

## Itération 4 : carte SVG simplifiée de la France avec pastilles par région

- **Plan validé** (développeur : « suffisamment [de temps], go »).
- **Temps restant annoncé** : non chiffré précisément par le développeur ; budget standard de 10 minutes de codage, arrêt à l'alarme de 8 minutes si besoin.
- ✂️ Je ne garde qu'un seul des trois morceaux du point 2 de "À venir" : la carte visuelle, la plus démonstrative au pitch. Recherche et onglets Terrains/Prestataires restent hors périmètre, reportés à une itération 5.
- **Dans le périmètre** :
  - Remplace la liste de pastilles de l'itération 3 par une carte SVG simplifiée de la France (positions approximatives, pas géographiquement exactes), une pastille par région présente dans les données.
  - Couleur de la pastille = statut de la région (réutilise `statutRegion`, déjà testé à l'itération 3).
  - La légende couleur reste visible.
- **Hors périmètre** : positions géographiquement exactes, interaction (clic/zoom), recherche, onglets Terrains/Prestataires, affichage des prestataires sur la carte.
- **Critères d'acceptation** :
  - La page `/` affiche une carte SVG avec une pastille positionnée pour chaque région présente dans les données.
  - La couleur de chaque pastille correspond au statut de sa région (vert/orange/rouge).
  - `npm test` passe toujours (pas de nouvelle logique métier : positions de carte = données statiques, pas de nouveau test exigé).
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : `frontend/src/app/page.tsx`, `frontend/src/app/page.module.css`.
- **Bilan** :
  - **Durée de codage réelle** : moins d'une minute (sur 10 estimées). Pas de dépassement.
  - **Critères satisfaits** : les 3 (carte SVG avec une pastille par région, couleur correspondant au statut via `statutRegion`, `npm test` toujours au vert) — vérifiés via `curl localhost:8080/` (3 `<circle>` présents) après déploiement.
  - **Reporté** : positions géographiquement exactes, interaction, recherche, onglets Terrains/Prestataires (reportés à l'itération 5, voir « À venir »).
  - **Bloqué par le harnais** : rien — `npm test` et `verifier-deployabilite.sh` passaient déjà avant le signal.
  - **Modifications** :
    - `frontend/src/app/page.tsx` : table `POSITION_REGION` (positions approximatives) et section carte SVG avec un cercle coloré par région — sert les critères 1 et 2.
    - `frontend/src/app/page.module.css` : styles du contour et des pastilles de la carte SVG.

---

## Itération 5 : onglets Terrains / Prestataires (annuaire minimal en dur)

- **Plan validé** (développeur : « suffisamment [de temps], go », malgré la demande explicite de chiffrer le temps restant — je garde donc le budget standard de 10 minutes et m'arrête à l'alarme de 8 minutes si besoin).
- ✂️ Je ne garde que les onglets, pas la recherche (ville/code postal), qui reste hors périmètre et reportée à l'itération 6.
- **Dans le périmètre** :
  - Deux onglets en haut de l'écran : "Terrains" (contenu actuel : en-tête, stats, carte, priorité, liste par région) et "Prestataires" (nouvel onglet).
  - Onglet "Prestataires" : liste simple (nom, ville, spécialité) à partir de données en dur minimales, sans annuaire complet ni fiche détaillée.
- **Hors périmètre** : recherche, fiche détaillée d'un prestataire, lien terrain↔prestataire, filtre par région sur les prestataires.
- **Critères d'acceptation** :
  - La page `/` affiche deux onglets cliquables "Terrains" et "Prestataires".
  - Cliquer sur "Prestataires" affiche une liste d'au moins 2 prestataires (nom + ville), sans recharger la page.
  - Cliquer sur "Terrains" réaffiche le contenu existant (stats, carte, liste par région) sans régression.
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : `frontend/src/data/terrains.ts` (ajout d'une liste `prestataires` en dur), `frontend/src/app/page.tsx` (passage en composant client avec état d'onglet), `frontend/src/app/page.module.css`.
- **Bilan** :
  - **Durée de codage réelle** : moins d'une minute (sur 10 estimées). Pas de dépassement.
  - **Critères satisfaits** : les 3 (onglets cliquables, liste de 3 prestataires sans rechargement, contenu "Terrains" inchangé) — vérifiés par lecture du code et `curl localhost:8080/` (le rendu HTML initial affiche les deux onglets) ; le basculement client (state React) n'est pas vérifiable par `curl` seul, à confirmer par le développeur dans le navigateur.
  - **Reporté** : recherche ville/code postal (voir "À venir").
  - **Bloqué par le harnais** : une première tentative d'édition a cassé la structure JSX (parenthèse du ternaire manquante), détectée par le hook ESLint avant même d'arriver au test — corrigée immédiatement, pas de blocage côté signal.
  - **Modifications** :
    - `frontend/src/data/terrains.ts` : ajout du type `Prestataire` et de la liste `prestataires` (3 entrées en dur) — sert le critère 2.
    - `frontend/src/app/page.tsx` : passage en `"use client"`, état `onglet` (terrains/prestataires), rendu conditionnel des deux vues — sert les 3 critères.
    - `frontend/src/app/page.module.css` : styles des onglets (actif/inactif).

---

## À venir (non détaillé, à retailler selon le temps restant au début de l'itération 6)

1. Mettre à jour `e2e/demo.spec.ts` (reporté de l'itération 1, hors DoD).
2. Recherche (ville / code postal).
3. Fiche terrain : caractéristiques, situation juridique, liste des équipements.
4. Fiche équipement : historique des contrôles et avis S / SAR / NS.
5. Déclaration d'incident (formulaire mobile, terrain + équipement + description + urgence).
6. Suivi et clôture de l'incident (prestataire, date, résultat).
7. Annuaire des prestataires (écrans 1 et 2 de l'idée retenue).
8. Écran « Qui êtes-vous ? » (choix de persona, sans connexion).

⚠️ La plateforme est maintenant démarrée et les images de base sont en cache local : les aléas de l'itération 1 (plateforme froide, rate-limit Docker Hub) ne devraient plus coûter de temps à l'itération 6. À confirmer au prochain `/iteration 6` en redemandant le temps restant.

---

## Itération 6 : annulée, temps restant insuffisant (3 minutes)

- Temps restant annoncé : 3 minutes, à la question posée le 2026-11-18.
- ✂️ 3 minutes ne couvrent pas codage + publication (~5 min observées sur les itérations précédentes) + tour de test. Aucun bug n'a été signalé par l'équipe pour justifier un correctif minimal et risqué.
- **Décision** : pas de nouveau code. Vérification de stabilité uniquement : `npm test` au vert, `./scripts/verifier-deployabilite.sh` sans borne, `/health` et `/sante` à 200 sur 8080 et 8081.
- **La version 5 reste la version finale montrée au pitch.** Pas de nouveau signal PM Lab (rien de nouveau à signaler).
- **Reporté** (hors temps du hackathon) : recherche ville/code postal, `e2e/demo.spec.ts`, fiches terrain/équipement, déclaration et suivi d'incident, annuaire complet des prestataires, écran « Qui êtes-vous ? ».
- **Correction** : le développeur a explicitement demandé de continuer en ignorant le temps restant annoncé. L'annulation ci-dessus est révoquée ; l'itération 6 est redétaillée et codée ci-dessous.

---

## Itération 6 (reprise) : recherche de terrains par ville ou code postal

- **Plan validé** (développeur : « continue, oublie le temps restant »).
- **Dans le périmètre** :
  - Champ de recherche dans l'onglet "Terrains", filtrant les terrains affichés par ville ou code postal (sous-chaîne, insensible à la casse).
  - Message "Aucun terrain trouvé" si la recherche ne correspond à rien, plutôt qu'une liste vide muette.
- **Hors périmètre** : recherche par nom de terrain ou de région, recherche sur l'onglet Prestataires, mise en avant des résultats sur la carte.
- **Critères d'acceptation** :
  - Un champ de recherche filtre les terrains affichés (par région) par ville ou code postal.
  - Une recherche sans correspondance affiche "Aucun terrain trouvé" au lieu d'une liste vide.
  - `npm test` passe avec un test sur la fonction de filtrage.
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : `frontend/src/data/terrains.ts`, `frontend/src/data/terrains.test.ts`, `frontend/src/app/page.tsx`, `frontend/src/app/page.module.css`.
- **Bilan** :
  - **Durée de codage réelle** : 1 minute (sur 10 estimées). Pas de dépassement.
  - **Critères satisfaits** : les 3 (filtre ville/code postal, message "Aucun terrain trouvé", `npm test` au vert avec 3 nouveaux tests sur `filtrerTerrains`) — vérifiés via `curl localhost:8080/` (champ de recherche présent) et lecture du code pour le comportement de filtrage.
  - **Reporté** : rien de nouveau ; `e2e/demo.spec.ts`, fiches détaillées, incidents, annuaire complet et écran persona restent hors périmètre du hackathon tel que mené.
  - **Bloqué par le harnais** : rien — `npm test` et `verifier-deployabilite.sh` passaient déjà avant le signal.
  - **Modifications** :
    - `frontend/src/data/terrains.ts` : ajout de `filtrerTerrains()` (filtre par ville/code postal, insensible à la casse) — sert le critère 1.
    - `frontend/src/data/terrains.test.ts` : 3 tests Vitest sur `filtrerTerrains()` — sert le critère 3.
    - `frontend/src/app/page.tsx` : état `recherche`, champ de recherche, filtrage de la liste par région, message "Aucun terrain trouvé" — sert les critères 1 et 2.
    - `frontend/src/app/page.module.css` : styles du champ de recherche et du message vide.

---

## Itération 7 : fiche terrain (caractéristiques, situation juridique, équipements)

- **Plan validé** (développeur : « suffisamment [de temps], go »).
- ✂️ Un seul morceau de "À venir" : la fiche terrain. Déclaration/suivi d'incident, annuaire complet des prestataires, écran persona et `e2e/demo.spec.ts` restent hors périmètre.
- **Dans le périmètre** :
  - Cliquer sur un terrain dans la liste par région ouvre sa fiche : ville, code postal, situation juridique (nouveau champ en dur), liste des équipements avec leur avis (S/SAR/NS).
  - Un bouton "Retour" referme la fiche et revient à la liste.
- **Hors périmètre** : édition de la fiche, historique des contrôles, lien vers un prestataire, URL dédiée par terrain (pas de routing Next, tout reste sur `/`).
- **Critères d'acceptation** :
  - Cliquer sur un terrain affiche sa fiche (ville, code postal, situation juridique, liste des équipements avec avis).
  - Un bouton "Retour" referme la fiche sans recharger la page.
  - `npm test` passe toujours (pas de nouvelle logique métier testable : affichage + données en dur).
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : `frontend/src/data/terrains.ts` (champ `situationJuridique`), `frontend/src/app/page.tsx`, `frontend/src/app/page.module.css`.
- **Bilan** :
  - **Durée de codage réelle** : 1 minute (sur 10 estimées). Pas de dépassement.
  - **Critères satisfaits** : les 3 (clic → fiche avec ville/code postal/situation juridique/équipements, bouton Retour, `npm test` toujours au vert) — vérifiés par lecture du code et `curl localhost:8080/` (pas de régression sur la liste existante ; la fiche elle-même n'est pas dans le rendu statique initial puisqu'elle dépend d'un clic côté client).
  - **Reporté** : déclaration/suivi d'incident, annuaire complet des prestataires, écran persona, `e2e/demo.spec.ts` (voir « À venir »).
  - **Bloqué par le harnais** : rien, mais ajout du champ `situationJuridique` a d'abord cassé `tsc --noEmit` sur les fixtures de `terrains.test.ts` (type requis) ; corrigé en rendant le champ optionnel plutôt qu'en modifiant tous les fixtures de test.
  - **Modifications** :
    - `frontend/src/data/terrains.ts` : ajout du champ optionnel `situationJuridique` sur `Terrain`, renseigné pour les 5 terrains en dur.
    - `frontend/src/app/page.tsx` : état `terrainSelectionne`, lignes de terrain cliquables, vue fiche avec bouton "Retour" — sert les 2 premiers critères.
    - `frontend/src/app/page.module.css` : styles du bouton Retour et de la fiche.

---

## Itération 8 : vraie carte des régions (SVG simplemaps.com), demande du développeur

- **Plan validé** (développeur fournit le SVG `fr.svg`, demande explicite).
- **Dans le périmètre** :
  - Remplace la carte SVG simplifiée (blob + cercles) de l'itération 4 par le tracé réel des 13 régions françaises, extrait de `fr.svg` (simplemaps.com, libre pour usage commercial, attribution conservée).
  - Chaque région présente dans les données (`Auvergne-Rhône-Alpes`, `Grand Est`, `Hauts-de-France`) est colorée selon `statutRegion` ; les régions sans terrain suivi restent dans une couleur neutre (pas de faux "conforme").
  - Légende et attribution simplemaps visibles sous la carte.
- **Hors périmètre** : interaction (clic/zoom sur une région), positions des départements, DOM-TOM.
- **Critères d'acceptation** :
  - La carte affiche les 13 régions avec leur tracé réel (pas un blob approximatif).
  - Les 3 régions ayant des terrains suivis sont colorées selon leur statut (vert/orange/rouge) ; les autres régions restent neutres.
  - `npm test` passe toujours.
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : `frontend/src/data/franceMap.ts` (nouveau, tracé des régions extrait de `fr.svg`), `frontend/src/app/page.tsx`, `frontend/src/app/page.module.css`.
- **Bilan** :
  - **Durée de codage réelle** : 1 minute (sur 10 estimées). Pas de dépassement.
  - **Critères satisfaits** : les 3 (13 régions au tracé réel, 3 régions suivies colorées par statut / 10 neutres, `npm test` toujours au vert) — vérifiés via `curl localhost:8080/` : 1 `conforme`, 2 `non-conforme`, 10 `non-suivie` (total 13), attribution simplemaps présente.
  - **Reporté** : interaction sur la carte (clic/zoom), positions des départements, DOM-TOM — non demandés, hors périmètre.
  - **Bloqué par le harnais** : rien.
  - **Modifications** :
    - `frontend/src/data/franceMap.ts` (nouveau) : tracé (`d`) des 13 régions, extrait du `fr.svg` fourni par le développeur (simplemaps.com, libre pour usage commercial) via un script Python ponctuel (non committé) — sert le critère 1.
    - `frontend/src/app/page.tsx` : remplace le blob + cercles positionnés approximativement par le rendu des 13 tracés réels, coloration conditionnelle (statut si région suivie, neutre sinon), attribution simplemaps, entrée de légende "Région non suivie" — sert les critères 1 et 2.
    - `frontend/src/app/page.module.css` : styles `.carteRegion` (remplace `.carteContour`/`.cartePoint`), `.attributionCarte`, `.point[data-statut="non-suivie"]`.
  - **Note** : le fichier source `fr.svg` (85 Ko) reste non committé à la racine du dépôt — seules les données extraites et attribuées vivent dans le code applicatif.

---

## Itération 9 : déclaration d'incident depuis la fiche terrain

- **Plan validé** (développeur : « très bien, /iteration 9 »). Temps restant annoncé à la question précédente : 1 heure, suffisant pour plusieurs itérations ; celle-ci reste dans le budget standard de 10 minutes de codage.
- **Dans le périmètre** :
  - Sur la fiche d'un terrain, un formulaire (équipement concerné, description, niveau d'urgence : faible/normale/haute) déclare un incident.
  - Une description vide est rejetée (validation testée en Vitest), les autres sont acceptées.
  - Les incidents déclarés pour ce terrain s'affichent dans une liste sur sa fiche, sans rechargement de page (état en mémoire, pas de persistance serveur — cohérent avec le reste du prototype en dur).
- **Hors périmètre** : suivi et clôture de l'incident (prestataire, date, résultat — itération 10), persistance (base de données, API), notification.
- **Critères d'acceptation** :
  - Depuis la fiche d'un terrain, un formulaire permet de déclarer un incident (équipement, description, urgence).
  - Une description vide affiche un message d'erreur et n'ajoute pas l'incident.
  - Un incident déclaré apparaît dans une liste "Incidents" sur la fiche du terrain, sans rechargement de page.
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : `frontend/src/data/incidents.ts` (nouveau), `frontend/src/data/incidents.test.ts` (nouveau), `frontend/src/app/page.tsx`, `frontend/src/app/page.module.css`.
- **Bilan** :
  - **Durée de codage réelle** : 1 minute (sur 10 estimées). Pas de dépassement.
  - **Critères satisfaits** : les 3 (formulaire sur la fiche terrain, description vide rejetée avec message d'erreur, incident ajouté à une liste "Incidents" sans rechargement) — vérifiés par lecture du code et `npm test` (4 nouveaux tests sur `incidentEstValide`/`creerIncident`) ; le comportement du formulaire au clic n'est pas vérifiable par `curl` seul (état client), à confirmer par le développeur dans le navigateur.
  - **Reporté** : suivi et clôture de l'incident (itération 10), annuaire complet des prestataires, écran persona, `e2e/demo.spec.ts`.
  - **Bloqué par le harnais** : rien.
  - **Modifications** :
    - `frontend/src/data/incidents.ts` (nouveau) : types `Incident`/`Urgence`, `incidentEstValide()` (description non vide), `creerIncident()` — sert les critères 1 et 2.
    - `frontend/src/data/incidents.test.ts` (nouveau) : 4 tests Vitest sur la validation et la création d'incident.
    - `frontend/src/app/page.tsx` : état `incidents`/formulaire, formulaire de déclaration sur la fiche terrain, liste "Incidents" filtrée par terrain — sert les 3 critères.
    - `frontend/src/app/page.module.css` : styles du formulaire et du message d'erreur.

---

## Itération 10 : suivi et clôture de l'incident

- **Plan validé** (dans le plan global à 3 itérations validé par le développeur ; confirmé « suffisamment, go » à la question du temps restant).
- **Dans le périmètre** :
  - Chaque incident a un statut : "ouvert" (par défaut) ou "clôturé".
  - Un incident ouvert peut être clôturé via un petit formulaire inline (prestataire, date, résultat).
  - Un incident clôturé affiche prestataire/date/résultat et n'a plus de formulaire (non modifiable).
- **Hors périmètre** : réouverture d'un incident clôturé, notification au prestataire, historique des modifications.
- **Critères d'acceptation** :
  - Chaque incident affiché indique son statut (ouvert/clôturé).
  - Un incident ouvert peut être clôturé en renseignant prestataire, date et résultat, sans rechargement de page.
  - Un incident clôturé affiche ces 3 informations et ne propose plus de formulaire de clôture.
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : `frontend/src/data/incidents.ts`, `frontend/src/data/incidents.test.ts`, `frontend/src/app/page.tsx`, `frontend/src/app/page.module.css`.
- **Bilan** :
  - **Durée de codage réelle** : 1 minute (sur 10 estimées). Pas de dépassement.
  - **Critères satisfaits** : les 3 (statut ouvert/clôturé affiché, clôture via formulaire inline sans rechargement, infos de clôture affichées sans formulaire une fois clôturé) — vérifiés par lecture du code et `npm test` (6 nouveaux tests sur `clotureEstValide`/`cloturerIncident`, 15/15 au total).
  - **Reporté** : annuaire complet des prestataires (itération 11), écran persona, `e2e/demo.spec.ts`.
  - **Bloqué par le harnais** : rien.
  - **Modifications** :
    - `frontend/src/data/incidents.ts` : ajout de `StatutIncident`, champs `statut`/`prestataire`/`date`/`resultat` sur `Incident`, `clotureEstValide()` et `cloturerIncident()` — sert les 3 critères.
    - `frontend/src/data/incidents.test.ts` : mise à jour du test `creerIncident` (statut "ouvert" désormais inclus) + 6 nouveaux tests sur la clôture.
    - `frontend/src/app/page.tsx` : état de clôture par incident, badge de statut, formulaire inline de clôture, affichage figé une fois clôturé — sert les 3 critères.
    - `frontend/src/app/page.module.css` : styles `.listeIncidents`/`.incidentItem`.

---

## Itération 11 : fiche prestataire (annuaire enrichi)

- **Plan validé** (dans le plan global à 3 itérations validé par le développeur ; confirmé « suffisamment, go »).
- **Dans le périmètre** :
  - Cliquer sur un prestataire dans l'onglet "Prestataires" ouvre sa fiche (nom, ville, spécialité, zone d'intervention en dur).
  - Un bouton "Retour" referme la fiche et revient à la liste des prestataires.
- **Hors périmètre** : lien terrain↔prestataire, historique des interventions, édition, URL dédiée (pas de routing Next).
- **Critères d'acceptation** :
  - Cliquer sur un prestataire affiche sa fiche (nom, ville, spécialité, zone d'intervention).
  - Un bouton "Retour" referme la fiche sans recharger la page.
  - `npm test` passe toujours (pas de nouvelle logique métier testable : affichage + données en dur).
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : `frontend/src/data/terrains.ts` (champ `zoneIntervention` sur `Prestataire`), `frontend/src/app/page.tsx`, `frontend/src/app/page.module.css`.
- **Bilan** :
  - **Durée de codage réelle** : moins d'une minute (sur 10 estimées). Pas de dépassement.
  - **Critères satisfaits** : les 3 (fiche avec nom/ville/spécialité/zone d'intervention, bouton Retour, `npm test` toujours au vert à 15/15) — vérifiés par lecture du code et `curl localhost:8080/` (pas de régression, `/health`/`/sante` à 200).
  - **Reporté** : écran persona, `e2e/demo.spec.ts` (seuls éléments restants du backlog initial de la passation).
  - **Bloqué par le harnais** : rien.
  - **Modifications** :
    - `frontend/src/data/terrains.ts` : ajout du champ `zoneIntervention` sur `Prestataire`, renseigné pour les 3 prestataires en dur.
    - `frontend/src/app/page.tsx` : état `prestataireSelectionne`, lignes de prestataire cliquables, vue fiche avec bouton "Retour" — sert les 2 premiers critères (réutilise les styles `.ficheLigne`/`.retour` de la fiche terrain, pas de nouveau CSS).
  - Pas de fichier CSS modifié (réutilisation complète des styles existants de la fiche terrain).
