import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.projectnativescript',
  appPath: 'app',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none'
  }
} as NativeScriptConfig;