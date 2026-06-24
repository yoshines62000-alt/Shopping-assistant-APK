# Shopping Assistant — App Android (Capacitor)

Wrapper Android de l'app web : **l'interface est embarquée dans l'APK** (export
statique Next), et les requêtes API vont vers le **backend qui tourne sur le PC**,
joint sur le **réseau local (Wi-Fi)**. Le scraping (Python + Chromium) ne peut pas
tourner sur Android : il reste sur le PC.

## Organisation des dépôts

Ce dépôt (`shopping-assistant apk`) ne contient **que** le projet Android. Il
s'appuie sur ses voisins, à placer dans le **même dossier parent** :

| Dossier voisin | Rôle |
|---|---|
| `shopping-assistant` | code source (UI web + backend). L'UI de l'APK est construite à partir d'ici (`apps/web`). |
| `shopping-assistant-desktop` | app Windows (Electron) — héberge le backend que l'app mobile interroge. |

## Pré-requis (toolchain locale, hors PATH)

- **JDK 17** : `C:\Users\jonat\android-tools\jdk\jdk-17.0.19+10`
- **Android SDK 34** : `C:\Users\jonat\android-tools\sdk` (platform-tools,
  platforms;android-34, build-tools;34.0.0)
- `android/local.properties` → `sdk.dir=C\:/Users/jonat/android-tools/sdk` (recréé localement, non versionné)
- `npm install` (récupère `@capacitor/cli` + `cross-env`)

## Construire l'APK

```powershell
$root = "C:\Users\jonat\android-tools"
$env:JAVA_HOME = "$root\jdk\jdk-17.0.19+10"; $env:ANDROID_HOME = "$root\sdk"
cd "C:\Users\jonat\Documents\shopping-assistant apk"

# 1. Construire l'UI (depuis le dépôt voisin) + la synchroniser dans Android
npm run sync          # = build:web (../shopping-assistant/apps/web) puis cap sync android

# 2a. APK debug
cd android; .\gradlew.bat assembleDebug --no-daemon
#   -> android/app/build/outputs/apk/debug/app-debug.apk

# 2b. APK signé (release)
cd android; .\gradlew.bat assembleRelease --no-daemon
#   -> android/app/build/outputs/apk/release/app-release.apk
```

(`npm run apk` / `npm run apk:release` enchaînent sync + build.)

### Signature (release)

L'APK release est signé → il se met à jour **par-dessus** une version précédente
(même signature). Identifiants lus depuis `android/keystore.properties` (jamais
versionné), qui pointe vers :

- Keystore : `C:\Users\jonat\android-tools\shopping-assistant-release.keystore`
  (alias `shopping-assistant`). **À conserver précieusement** : sans lui, plus de
  mise à jour par-dessus l'app installée.

Vérifier : `…\sdk\build-tools\34.0.0\apksigner.bat verify --print-certs <apk>`.
Nouvelle version → incrémenter `versionCode` (+1) et `versionName` dans
`android/app/build.gradle`.

## Utiliser l'app

1. Sur le PC : lancer Shopping Assistant **(desktop ≥ v0.24.0, qui expose le
   backend en LAN)** et autoriser le port **8756** dans le pare-feu Windows.
2. IP locale du PC : `ipconfig` → « Adresse IPv4 » (ex. `192.168.1.20`).
3. Installer l'APK sur le téléphone (sources inconnues autorisées).
4. Dans l'app → **Réglages → Connexion au backend** → `http://192.168.1.20:8756`
   → Enregistrer. Téléphone sur le **même Wi-Fi** que le PC.

## Notes

- `appId` : `com.evolveai.shoppingassistant`.
- APK **debug** = non signé. Le **release** est signé (cert auto-signé EvolveAI),
  suffisant pour l'installation manuelle. Pour le Play Store : générer un `.aab`
  (`bundleRelease`).
