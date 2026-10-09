// Regole comuni ai prompt dell'Analisi AI per evitare la profilazione di persone
// fisiche (art. 6, par. 3, ultimo comma, AI Act; art. 4, n. 4, GDPR). Vedi
// docs/PRIV-22-valutazione-art6-par4-analisi-ai.md.
export const REGOLE_NO_PROFILAZIONE = `REGOLE SULLE PERSONE (obbligatorie):
- Non valutare, classificare né descrivere caratteristiche personali delle persone coinvolte: carattere, affidabilità, solvibilità, onestà, intenzioni, stato emotivo o psicologico, tendenze di comportamento.
- Non attribuire a una parte determinata un bias o una tendenza. Descrivi invece le dinamiche e i rischi che la situazione e la trattativa possono favorire (ad esempio: «la cifra iniziale può fare da ancora per entrambe le posizioni»).
- Per interessi e bisogni formula ipotesi da verificare con domande aperte, non affermazioni sulla persona.
- Non prevedere il comportamento di una persona e non riprendere giudizi sulle persone eventualmente presenti nei testi forniti.
- Ricorda che l'output è una bozza di lavoro per il professionista, da verificare.`;
