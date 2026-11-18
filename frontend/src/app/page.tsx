"use client";

import { useState } from "react";
import styles from "./page.module.css";
import {
  terrains,
  statutGlobal,
  statistiques,
  statutRegion,
  prestataires,
} from "../data/terrains";

const LIBELLES_STATUT = {
  conforme: "Conforme",
  "a-surveiller": "À surveiller",
  "non-conforme": "Non conforme",
} as const;

// Positions approximatives (pas géographiquement exactes) sur une carte 100x100.
const POSITION_REGION: Record<string, { x: number; y: number }> = {
  "Hauts-de-France": { x: 50, y: 12 },
  "Grand Est": { x: 68, y: 22 },
  "Île-de-France": { x: 48, y: 28 },
  "Auvergne-Rhône-Alpes": { x: 62, y: 55 },
  "Nouvelle-Aquitaine": { x: 32, y: 60 },
  Occitanie: { x: 45, y: 75 },
};

const POSITION_PAR_DEFAUT = { x: 50, y: 50 };

export default function Home() {
  const [onglet, setOnglet] = useState<"terrains" | "prestataires">(
    "terrains",
  );
  const regions = [...new Set(terrains.map((t) => t.region))];
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
      ) : (
      <main className={styles.main}>
        <div className={styles.titreSection}>
          <h2>Terrains par région</h2>
          <span className={styles.badge}>Données d&apos;exemple</span>
        </div>

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
            viewBox="0 0 100 100"
            className={styles.carte}
            role="img"
            aria-label="Carte de France avec le statut de chaque région"
          >
            <path
              d="M20,15 L55,5 L80,18 L90,40 L75,60 L85,80 L55,95 L30,88 L10,65 L5,35 Z"
              className={styles.carteContour}
            />
            {regions.map((region) => {
              const { x, y } = POSITION_REGION[region] ?? POSITION_PAR_DEFAUT;
              return (
                <circle
                  key={region}
                  cx={x}
                  cy={y}
                  r={4}
                  className={styles.cartePoint}
                  data-statut={statutRegion(terrains, region)}
                >
                  <title>{region}</title>
                </circle>
              );
            })}
          </svg>
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

        {regions.map((region) => (
          <section key={region} className={styles.regionSection}>
            <h2>{region}</h2>
            <ul className={styles.listeTerrains}>
              {terrains
                .filter((t) => t.region === region)
                .map((t) => {
                  const statut = statutGlobal(t.equipements);
                  return (
                    <li key={t.nom} className={styles.terrainLigne}>
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
