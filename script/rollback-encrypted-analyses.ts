async function main() {
  if (process.env.CONFIRM_ENCRYPTION_ROLLBACK !== "YES") {
    throw new Error(
      "Rollback non autorizzato. Impostare CONFIRM_ENCRYPTION_ROLLBACK=YES solo durante una procedura di emergenza coordinata.",
    );
  }

  const storageModule = await import("../server/storage");
  const {
    closeStorage,
    preflightEncryptionRollback,
    rollbackProtectedAnalisi,
    storageReady,
  } = storageModule;
  try {
    await storageReady;
    const total = await preflightEncryptionRollback();
    console.log(`Preflight rollback completato: ${total} analisi verificabili.`);
    const restored = await rollbackProtectedAnalisi();
    console.log(`Rollback completato: ${restored} analisi ripristinate.`);
  } finally {
    await closeStorage();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
