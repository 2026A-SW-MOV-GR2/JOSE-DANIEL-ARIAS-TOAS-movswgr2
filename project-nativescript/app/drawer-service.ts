import { Frame } from '@nativescript/core';

export function navigateTo(moduleName: string) {
    Frame.topmost().navigate({
        moduleName: moduleName,
        transition: {
            name: 'fade'
        }
    });
}
