import { EventData, Page, Frame, Observable, Application } from '@nativescript/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

export function onNavigatingTo(args: EventData) {
    const page = args.object as Page;
    const vm = new Observable();

    vm.set('menuItems', [
        { name: 'Inicio', moduleName: 'main-page' },
        { name: 'Módulo 1: API REST', moduleName: 'network-page' },
        { name: 'Módulo 2: CRUD Mascotas', moduleName: 'list-page' },
        { name: 'Módulo 3: Secretos', moduleName: 'secrets-page' }
    ]);

    page.bindingContext = vm;
}

export function onDrawerButtonTap(args: EventData) {
    const page = (args.object as any).page as Page;
    const drawer = page.getViewById('drawer') as RadSideDrawer;
    drawer.showDrawer();
}

export function onItemTap(args: any) {
    const page = (args.object as any).page as Page;
    const drawer = page.getViewById('drawer') as RadSideDrawer;
    const index = args.index;
    const item = page.bindingContext.get('menuItems')[index];

    drawer.closeDrawer();

    if (item?.moduleName && item.moduleName !== 'main-page') {
        Frame.topmost().navigate({ moduleName: item.moduleName });
    }
}

export function onOpenNetworkPageTap() {
    Frame.topmost().navigate({ moduleName: 'network-page' });
}

