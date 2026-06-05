import { Application, knownFolders, File } from '@nativescript/core';
import { SecretMechanism } from '../models/secret-mode.model';
// Añade esta línea cerca de tus imports
declare const androidx: any;

declare var android: any;
declare var java: any;

// ─── SharedPreferences ────────────────────────────────────────────────────────

function getSharedPrefs() {
    const ctx = Application.android.context;
    return ctx.getSharedPreferences('ns_prefs', android.content.Context.MODE_PRIVATE);
}

export function spSave(key: string, value: string): void {
    const editor = getSharedPrefs().edit();
    editor.putString(key, value);
    editor.apply();
    console.log(`[INFO] SharedPreferences.save → key="${key}"`);
}

export function spGet(key: string): string | null {
    const prefs = getSharedPrefs();
    if (!prefs.contains(key)) return null;
    return prefs.getString(key, "");
}

// ─── DataStore (simulado con archivo JSON — comportamiento equivalente) ────────
// NativeScript no tiene binding directo a Jetpack DataStore (requiere Kotlin
// coroutines). Usamos File I/O síncrono sobre la carpeta de documentos,
// que es el equivalente funcional para el propósito académico del taller.

function getDataStorePath(): string {
    return knownFolders.documents().path + '/ns_datastore.json';
}

function readDataStore(): Record<string, string> {
    try {
        const path = getDataStorePath();
        if (!File.exists(path)) return {};
        const content = File.fromPath(path).readTextSync();
        return JSON.parse(content || '{}');
    } catch {
        return {};
    }
}

function writeDataStore(data: Record<string, string>): void {
    File.fromPath(getDataStorePath()).writeTextSync(JSON.stringify(data));
}

export function dsSave(key: string, value: string): void {
    const data = readDataStore();
    data[key] = value;
    writeDataStore(data);
    console.log(`[INFO] DataStore.save → key="${key}"`);
}

export function dsGet(key: string): string | null {
    const data = readDataStore();
    return data.hasOwnProperty(key) ? data[key] : null;
}

// ─── EncryptedSharedPreferences ───────────────────────────────────────────────

function getEncryptedPrefs() {
    const ctx = Application.android.context;

    const MasterKeys = androidx.security.crypto.MasterKeys;
    const keyAlias   = MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC);

    return androidx.security.crypto.EncryptedSharedPreferences.create(
        'ns_encrypted_prefs',
        keyAlias,
        ctx,
        androidx.security.crypto.EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        androidx.security.crypto.EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    );
}

export function espSave(key: string, value: string): void {
    const editor = getEncryptedPrefs().edit();
    editor.putString(key, value);
    editor.apply();
    console.log(`[INFO] EncryptedSharedPreferences.save → key="${key}"`);
}

export function espGet(key: string): string | null {
    const prefs = getEncryptedPrefs();
    if (!prefs.contains(key)) return null;
    return prefs.getString(key, null);
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

export function secretSave(mechanism: SecretMechanism, key: string, value: string): void {
    switch (mechanism) {
        case 'SharedPreferences':          spSave(key, value);  break;
        case 'DataStore':                  dsSave(key, value);  break;
        case 'EncryptedSharedPreferences': espSave(key, value); break;
    }
}

export function secretGet(mechanism: SecretMechanism, key: string): string | null {
    switch (mechanism) {
        case 'SharedPreferences':          return spGet(key);
        case 'DataStore':                  return dsGet(key);
        case 'EncryptedSharedPreferences': return espGet(key);
    }
}