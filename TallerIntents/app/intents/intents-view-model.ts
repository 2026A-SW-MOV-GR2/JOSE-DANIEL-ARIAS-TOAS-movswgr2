import { Observable, Application, ImageSource } from "@nativescript/core";
export class IntentsViewModel extends Observable {
    onDialTap() {
        const phone = "0987654321"
        const intent = new android.content.Intent(android.content.Intent.ACTION_DIAL);
        intent.setData(android.net.Uri.parse("tel:" + phone))
        Application.android.foregroundActivity.startActivity(intent)
    }

    onPhotoTap() {
        const intent = new android.content.Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
        const activity = Application.android.foregroundActivity;
        
        Application.android.on(Application.android.activityResultEvent, (args: any) => {
            if(args.requestCode === 1001 && args.resultCode === android.app.Activity.RESULT_OK) {
                const bitmap = args.intent.getParcelableExtra("data");
                const imageSource = new ImageSource(bitmap);
            }
        });
        activity.startActivityForResult(intent, 1001)

    }
}