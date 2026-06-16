import { EventData, Page, Application } from "@nativescript/core";
import { IntentsViewModel } from "./intents-view-model";

let _viewModel: IntentsViewModel;

export function navigatingTo(args: EventData) {
  const page = args.object as Page;
  _viewModel = new IntentsViewModel();
  page.bindingContext = _viewModel;

  page.once("loaded", () => {
    processStartupIntent();
  });
}

function processStartupIntent() {
  const activity = Application.android.foregroundActivity
    || Application.android.startActivity;

  if (!activity) return;

  const intent = activity.getIntent() as android.content.Intent;
  _viewModel.processIncomingIntent(intent);
}

export function onDialTap() {
  _viewModel.onDialTap();
}

export function onPhotoTap() {
  _viewModel.onPhotoTap();
}