import styles from "./page.module.css";
import {
  terrains,
  statutGlobal,
  statistiques,
  statutRegion,
} from "../data/terrains";

const LIBELLES_STATUT = {
  conforme: "Conforme",
  "a-surveiller": "À surveiller",
  "non-conforme": "Non conforme",
} as const;

export default function Home() {
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
      </header>

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
          <h2>Vue par région</h2>
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
    </div>
  );
}
