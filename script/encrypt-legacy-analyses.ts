async function main() {
  if (process.env.CONFIRM_LEGACY_ENCRYPTION !== "YES") {
    throw new Error(
      "Migrazione non autorizzata. Eseguire prima un backup e impostare CONFIRM_LEGACY_ENCRYPTION=YES.",
    );
  }

  const storageModule = await import("../server/storage");
  const {
    closeStorage,
    migrateLegacyAnalisi,
    preflightLegacyAnalisi,
    storageReady,
  } = storageModule;
  try {
    await storageReady;
    const preflight = await preflightLegacyAnalisi();
    console.log(
      `Preflight completato: ${preflight.total} analisi verificate, ${preflight.daProteggere} da aggiornare.`,
    );
    const migrated = await migrateLegacyAnalisi();
    console.log(`Migrazione completata: ${migrated} analisi protette.`);
  } finally {
    await closeStorage();
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
