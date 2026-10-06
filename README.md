# LingoLanka Native

LingoLanka Native is the installable React Native/Expo companion to the privacy-first LingoLanka web app. Learning progress stays in AsyncStorage on the learner's device, while Sinhala audio is requested from Sinhala-script text and supported by bundled core clips.

## Try it on a phone

1. Install Node.js and the Expo Go app on the phone.
2. In this `mobile` folder, run:

   ```powershell
   npm install
   npx expo start
   ```

3. Scan the QR code from Expo Go while the computer and phone are on the same network.

## Developer checks

```powershell
npx tsc --noEmit
npm run lint
npx expo export --platform web --output-dir dist-web
```

## Make installable native builds

- Android: install JDK 17 and Android Studio/SDK, run `npm run android:patch`, then build from the generated `android` project with `./gradlew app:assembleRelease -PreactNativeArchitectures=arm64-v8a`.
- iOS: use macOS with Xcode and an Apple Developer signing identity, then run `npx expo run:ios` or archive through Xcode.
- Expo Application Services is optional. The app does not require a paid runtime service to work after installation.

The verified direct-install build is `../artifacts/android/LingoLanka-1.0.0-arm64.apk`. It targets modern 64-bit Android phones and is signed with the development certificate for direct testing; create a private production keystore before a Play Store release.

On Windows, native builds may exceed path-length limits. If that happens, copy the `mobile` directory to a short temporary path for compilation, then copy only the completed APK back into `artifacts/android`.

## Privacy and learning notes

- No account, advertising, analytics, or cloud storage is included.
- Tracing is an honest self-check against numbered reference sheets; it does not claim handwriting recognition.
- Device speech engines vary. The app refuses to label Latin/English text as Sinhala, but native-speaker review or human recordings are still required before claiming every pronunciation is authoritative.
