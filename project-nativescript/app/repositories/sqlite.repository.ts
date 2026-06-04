import {Mascota} from '../data';

const Sqlite = require('nativescript-sqlite');

const DB_NAME = 'mascotas.sqlite';
const TABLE = 'mascotas';

let _db: any = null;

export async function initSQLite(): Promise<void> {
  if (_db) return; // ya inicializado
 
  _db = await new Sqlite(DB_NAME);
 
  await _db.execSQL(`
    CREATE TABLE IF NOT EXISTS ${TABLE} (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre       TEXT    NOT NULL,
      raza         TEXT,
      tipo         TEXT,
      imagen       TEXT,
      activo       INTEGER DEFAULT 1,
      fechaNacimiento TEXT
    );
  `);
 
  console.log('[INFO] SQLite inicializado → tabla "mascotas" lista');
}

export async function sqlGetAll(): Promise<Mascota[]> {
    await initSQLite();
    const rows: any[][] = await _db.all(`SELECT * FROM ${TABLE} ORDER BY id DESC`);

    console.log(`[DEBUG] SQLite.getAll → ${rows.length} filas`);


    return rows.map(row => ({
        id: row[0],
        nombre: row[1],
        raza: row[2],
        tipo: row[3] as Mascota['tipo'],
        imagen: row[4] || 'res://ic_placeholder',
        activo: row[5] === 1,
        fechaNacimiento: row[6] ? new Date(row[6]) : undefined
    }));
}

export async function sqlInsert(item: Mascota): Promise<void> {
    await initSQLite();

    await _db.execSQL(
        `INSERT INTO ${TABLE} (nombre, raza, tipo, imagen, activo, fechaNacimiento) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            item.nombre, 
            item.raza, 
            item.tipo, 
            item.imagen || 'res://ic_placeholder', 
            item.activo ? 1 : 0, 
            item.fechaNacimiento ? item.fechaNacimiento.toISOString() : null
        ]
    );

    console.log(`[INFO] SQLite.insert → id=${item.id} nombre="${item.nombre}"`);
}

export async function sqlUpdate(item: Mascota): Promise<void> {
    await initSQLite();
    
    await _db.execSQL(
        `UPDATE ${TABLE} SET nombre=?, raza=?, tipo=?, imagen=?, activo=?, fechaNacimiento=? WHERE id=?`,
        [
            item.nombre,
            item.raza,
            item.tipo,
            item.imagen,
            item.activo ? 1 : 0,
            item.fechaNacimiento ? item.fechaNacimiento.toISOString() : null,
            item.id
        ]
    );
    console.log(`[INFO] SQLite.update → id=${item.id} nombre="${item.nombre}"`);
}

export async function sqlDelete(id: number): Promise<void> {
    await initSQLite();
    await _db.execSQL(`DELETE FROM ${TABLE} WHERE id=?`, [id]);
    console.log(`[INFO] SQLite.delete → id=${id}`);
}
