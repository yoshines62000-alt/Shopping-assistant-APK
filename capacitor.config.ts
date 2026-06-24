import type { CapacitorConfig } from '@capacitor/cli';

// L'UI Next (export statique) est embarquée dans l'APK ; les requêtes API vont
// vers le backend du PC sur le réseau local (réglable dans l'app → Réglages →
// Connexion au backend). cleartext = autorise le HTTP non chiffré vers la LAN.
//
// Le code source de l'UI vit dans le dépôt principal « shopping-assistant »
// (dossier voisin) : on construit son export statique puis on le synchronise ici.
const config: CapacitorConfig = {
  appId: 'com.evolveai.shoppingassistant',
  appName: 'Shopping Assistant',
  webDir: '../shopping-assistant/apps/web/out',
  android: {
    allowMixedContent: true,
  },
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
};

export default config;
