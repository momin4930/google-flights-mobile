# ✈️ Google Flights Mobile

A beautiful, cross-platform mobile app to search, compare, and explore flights—built with Expo, React Native, and a modern, animated UI.

---

<p align="center">
  <img src="./assets/images/app-icon.png" alt="App Icon" width="120" />
</p>

---

## 🚀 Features

- **Stunning Gradient UI:** Modern, animated backgrounds and splash screens for a delightful user experience.
- **Onboarding & Authentication:** Smooth onboarding flow, sign up, and sign in with persistent user storage.
- **Flight Search:** Search for flights using the Amadeus API (or Sky-Scrapper API, see code comments).
- **Explore Destinations:** Discover featured cities and travel inspiration.
- **Lottie Animations:** Engaging, animated visuals throughout the app.
- **Custom Bottom Navigation:** Blurred, themed navigation bar for easy access.
- **Dark & Light Mode:** Automatic theme switching based on system settings.
- **Cross-Platform:** Runs on Android, iOS, and Web with responsive layouts.



---

## 📝 Project Structure

```
app/                # Main app screens and navigation
  (tabs)/           # Tabbed navigation screens (Home, Explore, Flights)
  screens/          # Standalone screens (Onboarding, Signin, Signup, etc.)
  _layout.tsx       # Root layout and navigation stack
components/         # Reusable UI components
constants/          # Theme and color constants
assets/             # Images, fonts, Lottie files
hooks/              # Custom React hooks
scripts/            # Utility scripts (e.g., reset-project.js)
```

---

## 🛠️ Tech Stack

- [Expo](https://expo.dev/) (with expo-router)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Lottie](https://airbnb.io/lottie/#/)
- [Amadeus API](https://developers.amadeus.com/) (for flight data)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (for user data)
- [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

```bash
npm install
```

### Running the App

```bash
npx expo start
```

- Open in Expo Go, Android/iOS simulator, or web browser.

---

## 🧩 Customization

- **Splash Screen:** Edit `app.json` and replace `assets/images/app-icon.png`.
- **Gradient Colors:** Change gradient colors in `app/screens/Home.tsx` and `app/screens/Onboarding.tsx`.
- **Featured Destinations:** Update content in `Home.tsx`.

---


<p align="center">
  <b>Happy travels! 🌍</b>
</p>
