import { Observable, Application, ImageSource } from "@nativescript/core";
export class IntentsViewModel extends Observable {
    private _phoneNumber: string = "";
    private _photoSource: ImageSource | null = null;
    private _receivedText: string = "";
    private _receivedImageSource: ImageSource | null = null;
    private _activityResultRegistered: boolean = false;

    constructor() {
        super();
        this._registerNewIntentListener();
    }

    get phoneNumber(): string {
        return this._phoneNumber;
    }

    set phoneNumber(value: string) {
        if(this._phoneNumber !== value) {
            this._phoneNumber = value;
            this.notifyPropertyChange("phoneNumber", value);
        }
    }

    get photoSource(): ImageSource | null {
        return this._photoSource;
    }
    set photoSource(value: ImageSource | null) {
        this._photoSource = value;
        this.notifyPropertyChange("photoSource", value);
    }
    
    get receivedText(): string {
        return this._receivedText;
    }
    set receivedText(value: string) {
        this._receivedText = value;
        this.notifyPropertyChange("receivedText", value);
    }
    
    get receivedImageSource(): ImageSource | null {
        return this._receivedImageSource;
    }
    set receivedImageSource(value: ImageSource | null) {
        this._receivedImageSource = value;
        this.notifyPropertyChange("receivedImageSource", value);
    }
    

    onDialTap() {
        const phone = this._phoneNumber.trim() || "0987654321"
        const intent = new android.content.Intent(
            android.content.Intent.ACTION_DIAL
        );
        intent.setData(android.net.Uri.parse("tel:" + phone))
        Application.android.foregroundActivity.startActivity(intent)
    }

    onPhotoTap() {
        if (!this._activityResultRegistered) {
            this._activityResultRegistered = true;

            Application.android.on(
                Application.android.activityResultEvent, 
                (args: any) => {
                    if(args.requestCode === 1001 
                        && args.resultCode === android.app.Activity.RESULT_OK
                        && args.intent) {
                        const bitmap = args.intent
                        .getParcelableExtra("data") as android.graphics.Bitmap;
                        if (bitmap) {
                            this.photoSource = new ImageSource(bitmap);
                        }
                    }
                }
            );
        }
        const intent = new android.content.Intent(
            android.provider.MediaStore.ACTION_IMAGE_CAPTURE
        );
    
        Application.android.foregroundActivity.startActivityForResult(intent, 1001);

    }


  // ─── Procesamiento de intents entrantes ──────────────────────────────────
    
    processIncomingIntent(intent: android.content.Intent) {
        console.log("=== DEBUG INTENT ===");
        console.log("Intent recibido:", intent);
        console.log("Action:", intent ? intent.getAction() : "NULL");
        console.log("Type:", intent ? intent.getType() : "NULL");

        if (!intent) return;
    
        const action = intent.getAction();
        if (action !== android.content.Intent.ACTION_SEND) return;
    
        const mimeType = intent.getType();
        if (!mimeType) return;
    
        if (mimeType.startsWith("text/")) {
            const text = intent.getStringExtra(
                android.content.Intent.EXTRA_TEXT
            );
            if (text) {
                this.receivedText = text;
                this.receivedImageSource = null;
            } 
        } else if (mimeType.startsWith("image/")) {
                const uri = intent.getParcelableExtra(
                    android.content.Intent.EXTRA_STREAM
                ) as android.net.Uri;

                const context = Application.android.context;
                const stream = context.getContentResolver().openInputStream(uri);
                const bitmap = android.graphics.BitmapFactory.decodeStream(stream);

                this.receivedImageSource = new ImageSource(bitmap);
                this.receivedText = ""; // ← limpia texto previo
        }
    }
    
    // ─── Listener para cuando la app ya está abierta (onNewIntent) ───────────
    
    private _registerNewIntentListener() {
        Application.android.on("activityNewIntent", (args: any) => {
        const newIntent = args.intent as android.content.Intent;
        this.processIncomingIntent(newIntent);
        });
    }    
}