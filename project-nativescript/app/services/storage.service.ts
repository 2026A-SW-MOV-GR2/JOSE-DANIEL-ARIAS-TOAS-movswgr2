import { StorageMode } from '../models/storage-mode.model';
import { Mascota } from '../data';

import {
    sqlGetAll,
    sqlInsert,
    sqlUpdate,
    sqlDelete,
    initSQLite
} from '../repositories/sqlite.repository';

import {
    nosqlGetAll,
    nosqlUpsert,
    nosqlDelete,
    initNoSQL
} from '../repositories/nosql.repository';

let _currentMode: StorageMode = 'SQL';

export async function initStorage(): Promise<void> {
    await initSQLite();
    initNoSQL();
    console.log('[INFO] StorageService inicializado (SQL + NoSQL)');
}

export function getMode(): StorageMode {
    return _currentMode;
}

export function setMode(mode: StorageMode): void {
    _currentMode = mode;
    console.log(`[INFO] StorageService → modo cambiado a "${mode}"`);
}

export async function loadItems(mode?: StorageMode): Promise<Mascota[]> {
    const m = mode ?? _currentMode;

    if ( m === 'SQL') {
        console.log('[INFO] StorageService → cargando items desde SQLite');
        return await sqlGetAll();
    } else {
        console.log('[INFO] StorageService → cargando items desde NoSQL');
        return nosqlGetAll();
    }
}

export async function saveItem(item: Mascota, mode?: StorageMode): Promise<void> {
    const m = mode ?? _currentMode;

    if (m === 'SQL') {
        await sqlInsert(item);
    } else {
        nosqlUpsert(item);
    }
}

export async function updateItem(item: Mascota, mode?: StorageMode): Promise<void> {
    const m = mode ?? _currentMode; 

    if (m === 'SQL') {
        await sqlUpdate(item);
    } else {
        nosqlUpsert(item);
    }
}

export async function deleteItem(id: number, mode?: StorageMode): Promise<void> {
    const m = mode ?? _currentMode;
    if (m === 'SQL') {
        await sqlDelete(id);
    } else {
        nosqlDelete(id);
    }
}