import { EventData, Page, Observable, Frame, Application } from '@nativescript/core';
import { Mascota } from './data';
import { navigateTo } from './drawer-service'

declare var android: any;

import {
  StorageMode,
  STORAGE_LABELS,
  STORAGE_COLORS,
} from './models/storage-mode.model';
import {
  initStorage,
  loadItems,
  deleteItem,
  getMode,
  setMode
} from './services/storage.service';

let pageRef: Page;
let vm: Observable;
let _initialized = false;

export async function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  pageRef = page;

  vm = new Observable();
  vm.set('items', []);
  vm.set('isLoading', false);
  vm.set('drawerOpen', false);
  vm.set('isSqlMode', true);

  updateModeUI('SQL');
  page.bindingContext = vm;

  if (!_initialized) {
    try{
      await initStorage();
      _initialized = true;
    } catch (error) {
      console.error('[ERROR] initStorage', error);
    }
  }

  await reloadList();
}

export function onNavigatingFrom() {
  pageRef = null as any;
}

export async function  onStorageModeToggle(args: any){
  const switchChecked: boolean = args.value;
  const newMode: StorageMode = switchChecked ? 'SQL' : 'NOSQL';

  if (newMode === getMode()) return;

  setMode(newMode);
  updateModeUI(newMode);
  console.log(`[INFO] Modo de almacenamiento cambiado a "${newMode}"`);
  await reloadList();
}

// ─────────────────────────────────────────────────────────────────────────────
// Drawer
// ─────────────────────────────────────────────────────────────────────────────
export function onMenuTap()     { vm.set('drawerOpen', true);  }
export function onDrawerClose() { vm.set('drawerOpen', false); }
export function onNavMascotas() { vm.set('drawerOpen', false); }
export function onNavAPI()      { vm.set('drawerOpen', false); navigateTo('network-page'); }
export function onNavSecretos() { vm.set('drawerOpen', false); navigateTo('secrets-page'); }

// CRUD
export function onItemTap(args: any) {
  const items = vm.get('items') as Mascota[];
  const item = items[args.index];
  if(!item) return;

  Frame.topmost().navigate({
    moduleName: 'form-page',
    context: {
      mode: 'edit',
      item: item,
      storageMode: getMode()
    }
  });
}

export function onAddTap() {
  Frame.topmost().navigate({
    moduleName: 'form-page',
    context: {
      mode: 'create',
      storageMode: getMode()
    }
  });
}

export function onDeleteTap(args: any) {
  const item = args.object?._bindingContext as Mascota;
  if (!item?.id) {
    console.warn('[WARN] No se encontro la mascota a eliminar');
    return;
  }
  confirmAndDelete(item);
}

function confirmAndDelete(item: Mascota) {
  if (Application.android) {
    const ctx = Application.android.foregroundActivity
             || Application.android.startActivity
             || Application.android.context;

    const builder = new android.app.AlertDialog.Builder(ctx);
    builder.setTitle('Confirmar eliminación');
    builder.setMessage(`¿Eliminar a "${item.nombre}" del ${getMode()}?`);
    builder.setPositiveButton('Sí', new android.content.DialogInterface.OnClickListener({
      async onClick(_d: any, _w: any) {
        try {
          await deleteItem(item.id);
          android.widget.Toast
            .makeText(ctx, `"${item.nombre}" eliminada de ${getMode()}`, android.widget.Toast.LENGTH_SHORT)
            .show();
          await reloadList();
        } catch (err) {
          console.error('[ERROR] deleteItem:', err);
        }
      },
    }));
    builder.setNegativeButton('No', null as any);
    builder.show();
  } else {
    if (confirm(`¿Eliminar a "${item.nombre}"?`)) {
      deleteItem(item.id).then(() => reloadList());
    }
  }
}

function updateModeUI(mode: StorageMode) {
  vm.set('isSqlMode',    mode === 'SQL');
  vm.set('storageLabel', STORAGE_LABELS[mode]);
  vm.set('storageColor', STORAGE_COLORS[mode]);
  vm.set('sourceBannerText',
    mode === 'SQL'
      ? '🗄️  Leyendo desde SQLite (Relacional)'
      : '📦  Leyendo desde Couchbase (NoSQL)');
}

async function reloadList() {
  if (!vm) return;
  vm.set('isLoading', true);
  try {
    const mascotaList = await loadItems();
    vm.set('items', mascotaList);
    vm.set('sourceCountText', `${mascotaList.length} registro(s)`);
    console.log(`[INFO] Lista recargada: ${mascotaList.length} items desde ${getMode()}`);
  } catch (err) {
    console.error('[ERROR] reloadList:', err);
    vm.set('items', []);
    vm.set('sourceCountText', 'Error al cargar');
  } finally {
    vm.set('isLoading', false);
  }
}
