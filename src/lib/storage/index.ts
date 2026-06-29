import { openDB, type IDBPDatabase } from 'idb';
import type { StoredAppData } from '../types';
import { createEmptyStoredData } from '../types';
import { migrateStoredData } from './migrate';

const DB_NAME = 'bas-logg';
const DB_VERSION = 1;
const STORE_NAME = 'app';
const STATE_KEY = 'state';

type BasLogDb = IDBPDatabase<{
  app: {
    key: string;
    value: StoredAppData;
  };
}>;

let dbPromise: Promise<BasLogDb> | null = null;

function getDb(): Promise<BasLogDb> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
}

export async function loadStoredData(): Promise<StoredAppData> {
  try {
    const db = await getDb();
    const raw = await db.get(STORE_NAME, STATE_KEY);
    return migrateStoredData(raw);
  } catch {
    return createEmptyStoredData();
  }
}

export async function saveStoredData(data: StoredAppData): Promise<void> {
  try {
    const db = await getDb();
    await db.put(STORE_NAME, data, STATE_KEY);
  } catch (error) {
    console.error('Kunde inte spara lokala data', error);
    throw error;
  }
}

export async function clearStoredData(): Promise<void> {
  try {
    const db = await getDb();
    await db.delete(STORE_NAME, STATE_KEY);
  } catch (error) {
    console.error('Kunde inte rensa lokala data', error);
    throw error;
  }
}
