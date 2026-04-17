# Minimal Notes

Minimal Notes is an offline daily journal app built with Expo and React Native.

## What This App Includes

- Create, edit, delete notes
- Search notes by title or content
- Offline persistence with AsyncStorage
- Clean light-theme UI with rounded note cards
- No login, no backend, no tracking, no ads

## Project Structure

- `app/` routes using Expo Router
- `components/` reusable UI blocks
- `storage/` local persistence logic
- `types/` shared TypeScript models

## Run Locally

```bash
npm install
npm start
```

Then:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for web

If Metro cache causes stale errors:

```bash
npx expo start -c
```

## Build Android (EAS)

Preview APK:

```bash
eas build -p android --profile preview
```

Production AAB for Play Store:

```bash
eas build -p android --profile production
```

## Build iOS (EAS)

```bash
eas build -p ios --profile production
```
