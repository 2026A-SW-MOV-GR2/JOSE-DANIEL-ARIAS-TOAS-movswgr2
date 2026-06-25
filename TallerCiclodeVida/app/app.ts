import { Application, isAndroid } from '@nativescript/core';
// Ajusta la ruta dependiendo de si app.ts está en la raíz o dentro de la carpeta app/
import { sharedViewModel } from './main-view-model'; 

if (isAndroid) {
    // 1. FASE DE CREACIÓN Y RECUPERACIÓN DE ESTADO
    Application.android.on(Application.android.activityCreatedEvent, (args: any) => {
        console.log("LOG: onCreate - Actividad Creada");
        const bundle = args.bundle;
        
        // Si hay un bundle, significa que la actividad fue recreada (ej. por rotación)
        if (bundle) {
            const countRecuperado = bundle.getInt('CONTADOR_GUARDADO', 0);
            sharedViewModel.setCount(countRecuperado);
            console.log(`LOG: onRestoreInstanceState (vía onCreate) - Dato recuperado: ${countRecuperado}`);
        }
    });

    // 2. OTROS EVENTOS DEL CICLO DE VIDA (Para la investigación del Taller)
    Application.android.on(Application.android.activityStartedEvent, () => console.log("LOG: onStart - Actividad Iniciada"));
    Application.android.on(Application.android.activityResumedEvent, () => console.log("LOG: onResume - Actividad en Primer Plano"));
    Application.android.on(Application.android.activityPausedEvent, () => console.log("LOG: onPause - Actividad Pausada"));
    Application.android.on(Application.android.activityStoppedEvent, () => console.log("LOG: onStop - Actividad Detenida"));
    Application.android.on(Application.android.activityDestroyedEvent, () => console.log("LOG: onDestroy - Actividad Destruida"));

    // 3. GUARDADO DE ESTADO ANTES DE LA DESTRUCCIÓN
    Application.android.on(Application.android.saveActivityStateEvent, (args: any) => {
        const bundle = args.bundle;
        bundle.putInt('CONTADOR_GUARDADO', sharedViewModel.getCount());
        console.log("LOG: onSaveInstanceState - Estado guardado en el Bundle");
    });
}

Application.run({ moduleName: 'app-root' });