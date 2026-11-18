"use client";

import { useState } from "react";
import styles from "./page.module.css";
import {
  terrains,
  statutGlobal,
  statistiques,
  statutRegion,
  prestataires,
  filtrerTerrains,
  type Terrain,
} from "../data/terrains";
import { REGIONS_CARTE } from "../data/franceMap";

const LIBELLES_STATUT = {
  conforme: "Conforme",
  "a-surveiller": "À surveiller",
  "non-conforme": "Non conforme",
} as const;

const REGIONS_SUIVIES = new Set(terrains.map((t) => t.region));

export default function Home() {
  const [onglet, setOnglet] = useState<"terrains" | "prestataires">(
    "terrains",
  );
  const [recherche, setRecherche] = useState("");
  const [terrainSelectionne, setTerrainSelectionne] =
    useState<Terrain | null>(null);
  const terrainsFiltres = filtrerTerrains(terrains, recherche);
  const regions = [...new Set(terrainsFiltres.map((t) => t.region))];
  const stats = statistiques(terrains);
  const prioritaires = terrains.filter(
    (t) => statutGlobal(t.equipements) === "non-conforme",
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Suivi des terrains</h1>
        <p>City-stades &amp; terrains multisports</p>
        <div className={styles.onglets}>
          <button
            type="button"
            className={styles.onglet}
            data-actif={onglet === "terrains"}
            onClick={() => setOnglet("terrains")}
          >
            Terrains
          </button>
          <button
            type="button"
            className={styles.onglet}
            data-actif={onglet === "prestataires"}
            onClick={() => setOnglet("prestataires")}
          >
            Prestataires
          </button>
        </div>
      </header>

      {onglet === "prestataires" ? (
        <main className={styles.main}>
          <div className={styles.titreSection}>
            <h2>Prestataires</h2>
          </div>
          <section className={styles.regionSection}>
            <ul className={styles.listeTerrains}>
              {prestataires.map((p) => (
                <li key={p.nom} className={styles.terrainLigne}>
                  <span>
                    {p.nom} — {p.ville}
                  </span>
                  <span className={styles.statutBadge}>{p.specialite}</span>
                </li>
              ))}
            </ul>
          </section>
        </main>
      ) : terrainSelectionne ? (
        <main className={styles.main}>
          <button
            type="button"
            className={styles.retour}
            onClick={() => setTerrainSelectionne(null)}
          >
            ← Retour
          </button>
          <section className={styles.regionSection}>
            <h2>{terrainSelectionne.nom}</h2>
            <p className={styles.prioriteLieu}>
              {terrainSelectionne.ville} · {terrainSelectionne.codePostal}
            </p>
            <p className={styles.ficheLigne}>
              <strong>Situation juridique :</strong>{" "}
              {terrainSelectionne.situationJuridique ?? "Non renseignée"}
            </p>
            <h2 className={styles.ficheSousTitre}>Équipements</h2>
            <ul className={styles.listeTerrains}>
              {terrainSelectionne.equipements.map((e) => (
                <li key={e.nom} className={styles.terrainLigne}>
                  <span>{e.nom}</span>
                  <span className={styles.statutBadge} data-statut-avis={e.avis}>
                    {e.avis}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </main>
      ) : (
      <main className={styles.main}>
        <div className={styles.titreSection}>
          <h2>Terrains par région</h2>
          <span className={styles.badge}>Données d&apos;exemple</span>
        </div>

        <input
          type="text"
          className={styles.recherche}
          placeholder="Rechercher un terrain (ville ou code postal)"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />

        <div className={styles.stats}>
          <div className={styles.statCarte}>
            <p className={styles.statLibelle}>Terrains suivis</p>
            <p className={styles.statValeur}>{stats.terrainsSuivis}</p>
          </div>
          <div className={styles.statCarte}>
            <p className={styles.statLibelle}>Non conformes</p>
            <p className={`${styles.statValeur} ${styles.statAlerte}`}>
              {stats.nonConformes}
            </p>
          </div>
          <div className={styles.statCarte}>
            <p className={styles.statLibelle}>Contrôles annuels en retard</p>
            <p className={`${styles.statValeur} ${styles.statAttention}`}>
              {stats.controlesEnRetard}
            </p>
          </div>
          <div className={styles.statCarte}>
            <p className={styles.statLibelle}>Réparations bloquées</p>
            <p className={`${styles.statValeur} ${styles.statAlerte}`}>
              {stats.reparationsBloquees}
            </p>
          </div>
        </div>

        <section className={styles.vueParRegion}>
          <h2>Carte par région</h2>
          <svg
            viewBox="0 0 1000 960"
            className={styles.carte}
            role="img"
            aria-label="Carte de France avec le statut de chaque région"
          >
            {REGIONS_CARTE.map(({ id, region, d }) => (
              <path
                key={id}
                d={d}
                className={styles.carteRegion}
                data-statut={
                  REGIONS_SUIVIES.has(region)
                    ? statutRegion(terrains, region)
                    : "non-suivie"
                }
              >
                <title>{region}</title>
              </path>
            ))}
          </svg>
          <p className={styles.attributionCarte}>
            Carte :{" "}
            <a
              href="https://simplemaps.com"
              target="_blank"
              rel="noreferrer"
            >
              simplemaps.com
            </a>
          </p>
          <div className={styles.pastilles}>
            {regions.map((region) => (
              <span key={region} className={styles.pastilleRegion}>
                <span
                  className={styles.point}
                  data-statut={statutRegion(terrains, region)}
                />
                {region}
              </span>
            ))}
          </div>
          <div className={styles.legende}>
            <span>
              <span className={styles.point} data-statut="conforme" />
              Conforme, rien à signaler
            </span>
            <span>
              <span className={styles.point} data-statut="a-surveiller" />
              À surveiller / travaux en cours
            </span>
            <span>
              <span className={styles.point} data-statut="non-conforme" />
              Alerte
            </span>
            <span>
              <span className={styles.point} data-statut="non-suivie" />
              Région non suivie
            </span>
          </div>
        </section>

        {prioritaires.length > 0 && (
          <section className={styles.priorite}>
            <h2>À traiter en priorité</h2>
            {prioritaires.map((t) => (
              <article key={t.nom} className={styles.prioriteCarte}>
                <span className={styles.pointAlerte} />
                <div>
                  <p className={styles.prioriteNom}>{t.nom}</p>
                  <p className={styles.prioriteLieu}>
                    {t.ville} · {t.codePostal}
                  </p>
                  <p className={styles.prioriteDetail}>Terrain non conforme</p>
                </div>
              </article>
            ))}
          </section>
        )}

        {terrainsFiltres.length === 0 && (
          <p className={styles.aucunResultat}>Aucun terrain trouvé.</p>
        )}

        {regions.map((region) => (
          <section key={region} className={styles.regionSection}>
            <h2>{region}</h2>
            <ul className={styles.listeTerrains}>
              {terrainsFiltres
                .filter((t) => t.region === region)
                .map((t) => {
                  const statut = statutGlobal(t.equipements);
                  return (
                    <li
                      key={t.nom}
                      className={styles.terrainLigne}
                      onClick={() => setTerrainSelectionne(t)}
                      role="button"
                      tabIndex={0}
                    >
                      <span>{t.nom}</span>
                      <span
                        className={styles.statutBadge}
                        data-statut={statut}
                      >
                        {LIBELLES_STATUT[statut]}
                      </span>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}
      </main>
      )}
    </div>
  );
}
