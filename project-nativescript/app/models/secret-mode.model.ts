export type SecretMechanism = 'SharedPreferences' | 'DataStore' | 'EncryptedSharedPreferences';

export const SECRET_MECHANISMS: SecretMechanism[] = [
    'SharedPreferences',
    'DataStore',
    'EncryptedSharedPreferences'
];

export const SECRET_LABELS: Record<SecretMechanism, string> = {
    SharedPreferences:           '⚙️  SharedPreferences',
    DataStore:                   '🗃️  DataStore',
    EncryptedSharedPreferences:  '🔐  EncryptedSharedPreferences'
};

export const SECRET_DESCRIPTIONS: Record<SecretMechanism, string> = {
    SharedPreferences:           'Clave-Valor simple. Sin cifrado. Preferencias de UI.',
    DataStore:                   'Moderno y asíncrono. Sin cifrado. Reemplaza SharedPrefs.',
    EncryptedSharedPreferences:  'AES-256 SIV + AES-128 GCM. Para tokens y credenciales.'
};