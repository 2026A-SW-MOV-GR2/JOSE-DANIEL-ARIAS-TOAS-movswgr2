import { Mascota } from '../data';
import { knownFolders, File, FileSystemEntity } from '@nativescript/core';

// Definimos la carpeta donde se guardarán los "documentos" NoSQL
const getDocFolder = () => {
    return knownFolders.documents().getFolder('mascotas_nosql_db');
};

export function initNoSQL(): void {
    const folder = getDocFolder();
    console.log('[INFO] NoSQL (Document Store) inicializado en:', folder.path);
}

export function nosqlGetAll(): Mascota[] {
    const folder = getDocFolder();
    const items: Mascota[] = [];

    // Leemos todos los archivos (documentos) de la carpeta
    folder.eachEntity((entity: FileSystemEntity) => {
        if (File.exists(entity.path) && entity.name.endsWith('.json')) {
            const file = File.fromPath(entity.path);
            const content = file.readTextSync();
            if (content) {
                try {
                    items.push(JSON.parse(content));
                } catch (e) {
                    console.error(`[ERROR] Error al parsear JSON de ${entity.name}`, e);
                }
            }
        }
        return true;
    });

    return items.sort((a, b) => b.id - a.id);
}

export function nosqlUpsert(item: Mascota): void {
    const folder = getDocFolder();
    // Cada documento es un archivo .json (Key-Value/Document Store)
    const fileName = `mascota_${item.id}.json`;
    const file = folder.getFile(fileName);

    file.writeTextSync(JSON.stringify(item));
    console.log(`[INFO] NoSQL.Upsert → Documento guardado: ${fileName}`);
}

export function nosqlDelete(id: number): void {
    const folder = getDocFolder();
    const fileName = `mascota_${id}.json`;
    if (folder.contains(fileName)) {
        const file = folder.getFile(fileName);
        file.removeSync();
        console.log(`[INFO] NoSQL.Delete → Documento eliminado: ${fileName}`);
    }
}
