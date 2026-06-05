// app/tests/example.spec.ts
import { initStorage, saveItem, loadItems, deleteItem } from '../services/storage.service';
import { Mascota } from '../data';

// Chai ya está configurado en el karma.conf.js del proyecto
// La variable 'expect' está disponible globalmente via karma-chai

describe('Módulo 2 - Persistencia Dual', () => {

    // Se ejecuta UNA vez antes de todas las pruebas
    before(async () => {
        await initStorage();
    });

    // ─── Prueba 1 ────────────────────────────────────────────────────────────
    it('debe guardar en SQL y NO aparecer en NoSQL', async () => {
        const mascotaSQL: Mascota = {
            id: Date.now(),
            nombre: 'TestSQL',
            raza: 'Labrador',
            tipo: 'Perro',
            activo: true,
            imagen: 'res://ic_placeholder'
        };

        try {
            // Insertar en SQL
            await saveItem(mascotaSQL, 'SQL');

            // Leer desde SQL → debe existir
            const itemsSQL = await loadItems('SQL');
            const encontradoEnSQL = itemsSQL.some(i => i.nombre === 'TestSQL');
            expect(encontradoEnSQL).to.equal(true);

            // Leer desde NoSQL → NO debe existir
            const itemsNOSQL = await loadItems('NOSQL');
            const encontradoEnNOSQL = itemsNOSQL.some(i => i.nombre === 'TestSQL');
            expect(encontradoEnNOSQL).to.equal(false);
            
        } finally {
            // El bloque finally se ejecuta SIEMPRE, incluso si el 'expect' falla.
            // Esto garantiza que la base de datos quede limpia.
            await deleteItem(mascotaSQL.id, 'SQL');
        }
    });

});