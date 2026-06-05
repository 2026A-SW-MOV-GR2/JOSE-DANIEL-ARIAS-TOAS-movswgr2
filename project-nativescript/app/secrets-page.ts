import { EventData, Page, Observable } from '@nativescript/core';
import { navigateTo } from './drawer-service';
import {
    SecretMechanism,
    SECRET_MECHANISMS,
    SECRET_LABELS,
    SECRET_DESCRIPTIONS
} from './models/secret-mode.model';
import { secretSave, secretGet } from './services/secure-storage.service';

let vm: Observable;

export function onNavigatingTo(args: EventData) {
    const page = args.object as Page;
    vm = new Observable();

    vm.set('drawerOpen', false);
    vm.set('key',        '');
    vm.set('value',      '');
    vm.set('resultText', '');
    vm.set('resultVisible',   false);
    vm.set('notFoundVisible', false);

    // Mecanismo seleccionado por defecto
    vm.set('selectedMechanism', 'SharedPreferences' as SecretMechanism);
    vm.set('selectedLabel',      SECRET_LABELS['SharedPreferences']);
    vm.set('selectedDesc',       SECRET_DESCRIPTIONS['SharedPreferences']);

    // Lista de opciones para el selector visual
    const options = SECRET_MECHANISMS.map(m => ({
        mechanism: m,
        label:       SECRET_LABELS[m],
        description: SECRET_DESCRIPTIONS[m],
        selected:    m === 'SharedPreferences'
    }));
    vm.set('mechanismOptions', options);

    page.bindingContext = vm;
}

// ─── Drawer ───────────────────────────────────────────────────────────────────
export function onMenuTap()     { vm.set('drawerOpen', true);  }
export function onDrawerClose() { vm.set('drawerOpen', false); }
export function onNavMascotas() { vm.set('drawerOpen', false); navigateTo('list-page');    }
export function onNavAPI()      { vm.set('drawerOpen', false); navigateTo('network-page'); }
export function onNavSecretos() { vm.set('drawerOpen', false); }

// ─── Selector de mecanismo ────────────────────────────────────────────────────
export function onMechanismSelect(args: any) {
    const mechanism = args.object?.bindingContext?.mechanism as SecretMechanism;
    if (!mechanism) return;

    vm.set('selectedMechanism', mechanism);
    vm.set('selectedLabel',      SECRET_LABELS[mechanism]);
    vm.set('selectedDesc',       SECRET_DESCRIPTIONS[mechanism]);

    // Actualiza el estado "selected" en cada opción para reflejar visualmente
    const options = (vm.get('mechanismOptions') as any[]).map(o => ({
        ...o,
        selected: o.mechanism === mechanism
    }));
    vm.set('mechanismOptions', options);

    // Limpia resultados previos al cambiar mecanismo
    vm.set('resultVisible',   false);
    vm.set('notFoundVisible', false);
    vm.set('resultText', '');

    console.log(`[INFO] Mecanismo seleccionado: ${mechanism}`);
}

// ─── Guardar ──────────────────────────────────────────────────────────────────
export function onSaveTap() {
    const key       = (vm.get('key')   || '').trim();
    const value     = (vm.get('value') || '').trim();
    const mechanism = vm.get('selectedMechanism') as SecretMechanism;

    if (!key || !value) {
        vm.set('resultText',    'Ingresa una llave y un valor.');
        vm.set('resultVisible',   true);
        vm.set('notFoundVisible', false);
        return;
    }

    try {
        secretSave(mechanism, key, value);
        vm.set('resultText',    `✅ Guardado en ${SECRET_LABELS[mechanism]}`);
        vm.set('resultVisible',   true);
        vm.set('notFoundVisible', false);
        console.log(`[INFO] secrets-page: guardado key="${key}" en ${mechanism}`);
    } catch (err) {
        vm.set('resultText',    `❌ Error al guardar: ${err}`);
        vm.set('resultVisible',   true);
        vm.set('notFoundVisible', false);
        console.error(`[ERROR] secrets-page.onSaveTap:`, err);
    }
}

// ─── Recuperar ────────────────────────────────────────────────────────────────
export function onRetrieveTap() {
    const key       = (vm.get('key') || '').trim();
    const mechanism = vm.get('selectedMechanism') as SecretMechanism;

    if (!key) {
        vm.set('resultText',    'Ingresa una llave para recuperar.');
        vm.set('resultVisible',   true);
        vm.set('notFoundVisible', false);
        return;
    }

    try {
        const found = secretGet(mechanism, key);

        if (found !== null) {
            vm.set('value',         found);
            vm.set('resultText',    `🔓 Valor recuperado de ${SECRET_LABELS[mechanism]}`);
            vm.set('resultVisible',   true);
            vm.set('notFoundVisible', false);
            console.log(`[INFO] secrets-page: recuperado key="${key}" desde ${mechanism}`);
        } else {
            vm.set('resultVisible',   false);
            vm.set('notFoundVisible', true);
            console.log(`[INFO] secrets-page: key="${key}" no encontrada en ${mechanism}`);
        }
    } catch (err) {
        vm.set('resultText',    `❌ Error al recuperar: ${err}`);
        vm.set('resultVisible',   true);
        vm.set('notFoundVisible', false);
        console.error(`[ERROR] secrets-page.onRetrieveTap:`, err);
    }
}