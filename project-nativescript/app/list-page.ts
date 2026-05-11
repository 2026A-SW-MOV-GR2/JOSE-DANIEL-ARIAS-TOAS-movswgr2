import { EventData, Page, Frame, Application } from '@nativescript/core';
import { items, Mascota } from './data';

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = { items };
}

export function onItemTap(args: any) {
  const index = args.index;
  const item = items.getItem(index) as Mascota;
  Frame.topmost().navigate({ moduleName: 'form-page', context: { mode: 'edit', itemId: item.id } });
}

export function onAddTap() {
  Frame.topmost().navigate({ moduleName: 'form-page', context: { mode: 'create' } });
}

export function onDeleteTap(args: any) {
  // button is inside the item template; its parent bindingContext is the item
  const button = args.object;
  // climb to get the item binding context if available
  const itemContext = button.bindingContext || (button.page && button.page.bindingContext);
  const item: Mascota | undefined = itemContext as Mascota;
  if (!item) {
    console.warn('No se encontró la mascota para eliminar');
    return;
  }

  const index = items.findIndex(i => i.id === item.id);
  if (index === -1) {
    console.warn('Índice no encontrado para mascota id', item.id);
    return;
  }

  confirmAndDelete(index, item.nombre);
}

function confirmAndDelete(index: number, nombre: string) {
  if (Application.android) {
    const ctx = Application.android.foregroundActivity || Application.android.startActivity || Application.android.context;
    const alertDialogBuilder = new android.app.AlertDialog.Builder(ctx);
    alertDialogBuilder.setTitle('Confirmar eliminación');
    alertDialogBuilder.setMessage(`¿Eliminar a ${nombre}?`);
    alertDialogBuilder.setPositiveButton('Sí', new android.content.DialogInterface.OnClickListener({
      onClick: function(dialog, which) {
        items.splice(index, 1);
        // Mostrar Toast nativo
        android.widget.Toast.makeText(ctx, `${nombre} ha sido eliminada`, android.widget.Toast.LENGTH_SHORT).show();
      }
    }));
    alertDialogBuilder.setNegativeButton('No', null);
    alertDialogBuilder.show();
  } else {
    // Fallback simple para iOS / otros
    if (confirm(`¿Eliminar a ${nombre}?`)) {
      items.splice(index, 1);
    }
  }
}

