import styles from "./page.module.css";
import { terrains, statutGlobal } from "../data/terrains";

const LIBELLES_STATUT = {
  conforme: "Conforme",
  "a-surveiller": "À surveiller",
  "non-conforme": "Non conforme",
} as const;

export default function Home() {
  const regions = [...new Set(terrains.map((t) => t.region))];

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Sport dans la Ville — Suivi des terrains</h1>
        {regions.map((region) => (
          <section key={region}>
            <h2>{region}</h2>
            <ul>
              {terrains
                .filter((t) => t.region === region)
                .map((t) => {
                  const statut = statutGlobal(t.equipements);
                  return (
                    <li key={t.nom} data-statut={statut}>
                      {t.nom} — {LIBELLES_STATUT[statut]}
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
