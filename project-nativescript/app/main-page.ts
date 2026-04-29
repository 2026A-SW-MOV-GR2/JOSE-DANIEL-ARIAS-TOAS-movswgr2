import { EventData, Page, Color, Application } from '@nativescript/core';

// ...existing code...

function updateFromResources(page: Page) {
    // Solo para Android se usan recursos por orientación/idioma con qualifiers
    if (Application.android) {
        // Preferir la activity en primer plano para obtener la configuración actual
        const activity = Application.android.foregroundActivity || Application.android.startActivity || Application.android.context;
        const res = activity.getResources();
        const pkgName = activity.getPackageName();

        // El sistema operativo elige automáticamente la carpeta según idioma y orientación
        const idTexto = res.getIdentifier('saludo', 'string', pkgName);
        const idColorT = res.getIdentifier('main_text_color', 'color', pkgName);
        const idColorF = res.getIdentifier('main_bg_color', 'color', pkgName);

        // Obtener los valores reales con comprobaciones por si faltan
        const saludo = idTexto ? res.getString(idTexto) : 'Hola';
        const colorTexto = idColorT ? new Color(res.getColor(idColorT)) : new Color('#000000');
        const colorFondo = idColorF ? new Color(res.getColor(idColorF)) : new Color('#FFFFFF');

        // Vincular a la interfaz (reemplaza o crea bindingContext)
        page.bindingContext = {
            mensaje: saludo,
            colorT: colorTexto.hex,
            colorF: colorFondo.hex
        };
    } else {
        // iOS u otros: mantener valores por defecto o usar localización iOS si es necesario
        page.bindingContext = page.bindingContext || { mensaje: 'Hola', colorT: '#000000', colorF: '#FFFFFF' };
    }
}

function scheduleUpdateFromResources(page: Page) {
    const pending = (page as any)._orientationTimer;
    if (pending) {
        clearTimeout(pending);
    }

    (page as any)._orientationTimer = setTimeout(() => {
        try {
            updateFromResources(page);
        } catch (e) {
            console.error('Error actualizando recursos tras cambio de orientación:', e);
        }
    }, 100);
}

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;

    // Inicializa valores desde recursos actuales
    updateFromResources(page);

    // Registrar listener para cambios de orientación y actualizar la UI cuando ocurra
    const handler = () => scheduleUpdateFromResources(page);

    // Guardar referencia para eliminar después
    (page as any)._orientationHandler = handler;
    Application.on(Application.orientationChangedEvent, handler);
}

export function onNavigatingFrom(args: EventData) {
    const page = <Page>args.object;
    const handler = (page as any)._orientationHandler;
    if (handler) {
        Application.off(Application.orientationChangedEvent, handler);
        (page as any)._orientationHandler = null;
    }

    const pending = (page as any)._orientationTimer;
    if (pending) {
        clearTimeout(pending);
        (page as any)._orientationTimer = null;
    }
}
