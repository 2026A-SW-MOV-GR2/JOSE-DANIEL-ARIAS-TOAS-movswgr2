import { EventData, Page, Observable } from '@nativescript/core';
import { ApiService } from './services/api.service';

const api = new ApiService();

export function onNavigatingTo(args: EventData) {
  const page = args.object as Page;
  const vm = new Observable();

  vm.set('id', '');
  vm.set('title', '');
  vm.set('body', '');
  vm.set('postLoaded', false);
  vm.set('isLoading', false);
  vm.set('isUpdating', false);
  vm.set('message', '');
  vm.set('canInteract', true);
  vm.set('canUpdate', false);
  vm.set('isBusy', false);

  vm.set('getData', async function (this: Observable) {
    const idRaw = this.get('id');
    const id = Number(idRaw);
    if (!Number.isInteger(id) || id <= 0) {
      this.set('message', 'Ingrese un ID numérico válido (entero mayor que 0).');
      return;
    }

    this.set('isLoading', true);
    this.set('isBusy', true);
    this.set('canInteract', false);
    this.set('message', '');
    this.set('postLoaded', false);
    this.set('canUpdate', false);

    try {
      const data = await api.getPostById(id);
      this.set('title', data.title ?? '');
      this.set('body', data.body ?? '');
      this.set('postLoaded', true);
      this.set('canUpdate', true);
      this.set('message', 'Datos cargados. Puede editar y presionar Actualizar.');
    } catch (err) {
      console.error('API Error:', err);
      this.set('message', 'Error al consultar el post. Ver consola para más detalles.');
    } finally {
      this.set('isLoading', false);
      this.set('isBusy', false);
      this.set('canInteract', true);
    }
  });

  vm.set('sendData', async function (this: Observable) {
    if (!this.get('postLoaded')) {
      this.set('message', 'No hay datos para actualizar.');
      return;
    }

    this.set('isUpdating', true);
    this.set('isBusy', true);
    this.set('canInteract', false);
    this.set('message', '');

    try {
      const payload = {
        id: Number(this.get('id')),
        userId: 1,
        title: this.get('title'),
        body: this.get('body'),
      };

      const resp = await api.updatePost(payload.id, payload);
      this.set('title', resp.title ?? this.get('title'));
      this.set('body', resp.body ?? this.get('body'));
      this.set('message', 'Actualización recibida (200 OK).');
    } catch (err) {
      console.error('Update Error:', err);
      this.set('message', 'Error al actualizar el post. Ver consola para más detalles.');
    } finally {
      this.set('isUpdating', false);
      this.set('isBusy', false);
      this.set('canInteract', true);
    }
  });

  page.bindingContext = vm;
}

export function onGetDataTap(args: EventData) {
  const page = (args.object as any).page as Page;
  const fn = page.bindingContext.get('getData');
  if (typeof fn === 'function') {
    fn.call(page.bindingContext);
  }
}

export function onSendDataTap(args: EventData) {
  const page = (args.object as any).page as Page;
  const fn = page.bindingContext.get('sendData');
  if (typeof fn === 'function') {
    fn.call(page.bindingContext);
  }
}
