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
  badgeFiabilite,
  type Terrain,
  type Prestataire,
} from "../data/terrains";
import { REGIONS_CARTE } from "../data/franceMap";
import {
  incidentEstValide,
  creerIncident,
  clotureEstValide,
  cloturerIncident,
  type Incident,
  type Urgence,
} from "../data/incidents";

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
  const [prestataireSelectionne, setPrestataireSelectionne] =
    useState<Prestataire | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [equipementChoisi, setEquipementChoisi] = useState("");
  const [descriptionIncident, setDescriptionIncident] = useState("");
  const [urgenceIncident, setUrgenceIncident] = useState<Urgence>("normale");
  const [erreurIncident, setErreurIncident] = useState("");
  const [incidentEnCloture, setIncidentEnCloture] = useState<number | null>(
    null,
  );
  const [prestataireCloture, setPrestataireCloture] = useState("");
  const [dateCloture, setDateCloture] = useState("");
  const [resultatCloture, setResultatCloture] = useState("");
  const [erreurCloture, setErreurCloture] = useState("");
  const terrainsFiltres = filtrerTerrains(terrains, recherche);
  const regions = [...new Set(terrainsFiltres.map((t) => t.region))];
  const stats = statistiques(terrains);
  const prioritaires = terrains.filter(
    (t) => statutGlobal(t.equipements) === "non-conforme",
  );

  function declarerIncident() {
    if (!terrainSelectionne) return;
    if (!incidentEstValide(descriptionIncident)) {
      setErreurIncident("La description de l'incident est obligatoire.");
      return;
    }
    setIncidents((precedents) => [
      ...precedents,
      creerIncident(
        precedents.length + 1,
        terrainSelectionne.nom,
        equipementChoisi,
        descriptionIncident,
        urgenceIncident,
      ),
    ]);
    setDescriptionIncident("");
    setErreurIncident("");
  }

  function ouvrirCloture(id: number) {
    setIncidentEnCloture(id);
    setPrestataireCloture("");
    setDateCloture("");
    setResultatCloture("");
    setErreurCloture("");
  }

  function validerCloture(incident: Incident) {
    if (!clotureEstValide(prestataireCloture, dateCloture, resultatCloture)) {
      setErreurCloture("Prestataire, date et résultat sont obligatoires.");
      return;
    }
    setIncidents((precedents) =>
      precedents.map((i) =>
        i.id === incident.id
          ? cloturerIncident(i, prestataireCloture, dateCloture, resultatCloture)
          : i,
      ),
    );
    setIncidentEnCloture(null);
  }

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

      {onglet === "prestataires" && prestataireSelectionne ? (
        <main className={styles.main}>
          <button
            type="button"
            className={styles.retour}
            onClick={() => setPrestataireSelectionne(null)}
          >
            ← Retour
          </button>
          <section className={styles.regionSection}>
            <h2>{prestataireSelectionne.nom}</h2>
            <p className={styles.prioriteLieu}>
              {prestataireSelectionne.ville}
            </p>
            <p className={styles.ficheLigne}>
              <strong>Spécialité :</strong> {prestataireSelectionne.specialite}
            </p>
            <p className={styles.ficheLigne}>
              <strong>Zone d&apos;intervention :</strong>{" "}
              {prestataireSelectionne.zoneIntervention}
            </p>
          </section>
        </main>
      ) : onglet === "prestataires" ? (
        <main className={styles.main}>
          <div className={styles.titreSection}>
            <h2>Annuaire des prestataires</h2>
          </div>
          <p className={styles.sousTitre}>
            Entreprises qui réparent et contrôlent les terrains de
            l&apos;association, avec leur note.
          </p>
          <div className={styles.listePrestataires}>
            {prestataires.map((p) => (
              <article
                key={p.nom}
                className={styles.cartePrestataire}
                onClick={() => setPrestataireSelectionne(p)}
                role="button"
                tabIndex={0}
              >
                <div className={styles.entetePrestataire}>
                  <h3>{p.nom}</h3>
                  <span
                    className={styles.badgeFiabilite}
                    data-badge={badgeFiabilite(p.note)}
                  >
                    {badgeFiabilite(p.note)}
                  </span>
                </div>
                <p className={styles.specialitePrestataire}>
                  {p.specialite}
                </p>
                <p className={styles.prioriteLieu}>{p.ville}</p>
                <p className={styles.notePrestataire}>
                  {"★".repeat(Math.round(p.note))}
                  {"☆".repeat(5 - Math.round(p.note))}{" "}
                  <strong>{p.note.toFixed(1).replace(".", ",")} / 5</strong>
                  {" · "}
                  {p.nbPrestations} prestation
                  {p.nbPrestations > 1 ? "s" : ""}
                </p>
              </article>
            ))}
          </div>
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

            <h2 className={styles.ficheSousTitre}>Déclarer un incident</h2>
            <div className={styles.formulaireIncident}>
              <select
                value={equipementChoisi}
                onChange={(e) => setEquipementChoisi(e.target.value)}
              >
                {terrainSelectionne.equipements.map((e) => (
                  <option key={e.nom} value={e.nom}>
                    {e.nom}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Description de l'incident"
                value={descriptionIncident}
                onChange={(e) => setDescriptionIncident(e.target.value)}
              />
              <select
                value={urgenceIncident}
                onChange={(e) =>
                  setUrgenceIncident(e.target.value as Urgence)
                }
              >
                <option value="faible">Urgence faible</option>
                <option value="normale">Urgence normale</option>
                <option value="haute">Urgence haute</option>
              </select>
              {erreurIncident && (
                <p className={styles.erreurFormulaire}>{erreurIncident}</p>
              )}
              <button type="button" onClick={declarerIncident}>
                Déclarer l&apos;incident
              </button>
            </div>

            {incidents.filter((i) => i.terrainNom === terrainSelectionne.nom)
              .length > 0 && (
              <>
                <h2 className={styles.ficheSousTitre}>Incidents</h2>
                <ul className={styles.listeIncidents}>
                  {incidents
                    .filter((i) => i.terrainNom === terrainSelectionne.nom)
                    .map((i) => (
                      <li key={i.id} className={styles.incidentItem}>
                        <div className={styles.terrainLigne}>
                          <span>
                            {i.equipementNom} — {i.description}
                          </span>
                          <span className={styles.statutBadge}>
                            {i.statut === "ouvert" ? "Ouvert" : "Clôturé"}
                          </span>
                        </div>

                        {i.statut === "cloture" ? (
                          <p className={styles.ficheLigne}>
                            Clôturé par {i.prestataire} le {i.date} —{" "}
                            {i.resultat}
                          </p>
                        ) : incidentEnCloture === i.id ? (
                          <div className={styles.formulaireIncident}>
                            <input
                              type="text"
                              placeholder="Prestataire"
                              value={prestataireCloture}
                              onChange={(e) =>
                                setPrestataireCloture(e.target.value)
                              }
                            />
                            <input
                              type="date"
                              value={dateCloture}
                              onChange={(e) => setDateCloture(e.target.value)}
                            />
                            <textarea
                              placeholder="Résultat"
                              value={resultatCloture}
                              onChange={(e) =>
                                setResultatCloture(e.target.value)
                              }
                            />
                            {erreurCloture && (
                              <p className={styles.erreurFormulaire}>
                                {erreurCloture}
                              </p>
                            )}
                            <button
                              type="button"
                              onClick={() => validerCloture(i)}
                            >
                              Clôturer l&apos;incident
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className={styles.retour}
                            onClick={() => ouvrirCloture(i.id)}
                          >
                            Clôturer
                          </button>
                        )}
                      </li>
                    ))}
                </ul>
              </>
            )}
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
                      onClick={() => {
                        setTerrainSelectionne(t);
                        setEquipementChoisi(t.equipements[0]?.nom ?? "");
                        setDescriptionIncident("");
                        setErreurIncident("");
                      }}
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
