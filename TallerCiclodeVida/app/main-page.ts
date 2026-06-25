import { EventData, Page } from '@nativescript/core';
import { sharedViewModel } from './main-view-model';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = sharedViewModel;
}

export function onIncrement() {
    sharedViewModel.onIncrement();
}