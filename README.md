# 🌸 Mochi Focus

## Summary

Mochi Focus is a kawaii lofi study timer that turns focus time into a cozy daily ritual. Study alongside Mochi the cat, discover relaxing music, mix ambient sounds, and watch your room grow as you build your study habits.

The app runs entirely in your browser, with no backend or account required. Your study progress and preferences are saved on your device.

## Key Features

- **Flexible focus timers:** Choose Pomodoro (25/5), Deep Focus (45/10), Long Study (60/10), a custom countdown, or a stopwatch. Pause, restart, and take breaks at your own pace.
- **Six music stations:** Explore Tokyo Café, Rainy Window, Sakura Beats, Midnight Study, Library Neko, and Night Train. Each has its own icon, description, and Jamendo music search criteria; the rooms currently share a café illustration with color treatments.
- **Independent music controls:** Play, pause, skip, shuffle, mute, and adjust music volume without interrupting your timer. View the current track, artist, and license information.
- **Ambient sound mixer:** Choose original synthesized rain, café, fireplace, ocean, or night textures with a separate volume control. Ambience is selected independently of the music station.
- **Mochi the study cat:** Your animated companion reacts to studying, breaks, session completion, and inactivity.
- **Study tracking:** Track daily focus, total study time, completed sessions, daily goals, current and longest streaks, and recent daily history.
- **Room progression:** Unlock seven cosmetic objects through study milestones, then choose which unlocked items to display.
- **Kawaii light and dark modes:** Enjoy warm cream and strawberry accents by day, or deep plum and soft pink by night. Your theme preference is saved.
- **Responsive design:** Flexible phone, tablet, and desktop layouts with touch-friendly controls, keyboard navigation, and reduced-motion support.
- **Local persistence:** Keep progress and preferences between visits on the same browser. No cloud syncing or account setup is needed.

- **Offline focus:** After an online visit finishes saving the app, reopen it offline to use timers, study tracking, room artwork, and local ambience. Jamendo music still requires internet.

## Tech Stack

- **React:** Builds the interactive interface from reusable components. Custom hooks separate timer behavior, audio playback, and study tracking.
- **TypeScript:** Adds type checking to components, state, and the music-provider interface. It helps catch errors during development and keeps the code easier to maintain.
- **Vite:** Runs the local development server and produces the optimized production build. Its static output can be hosted on Vercel or GitHub Pages.
- **Tailwind CSS:** Integrates with Vite for utility-based styling alongside custom CSS. The interface uses responsive layouts and theme styles for both light and dark modes.
- **Lucide React:** Supplies consistent icons for navigation, timer actions, playback, and study statistics. Icon-only controls include accessible labels.
- **Howler.js:** Handles music playback and locally hosted ambient audio. Separate audio instances let users control music and ambience independently.
- **Jamendo API v3:** Provides track discovery and artist information for the six stations. A public Client ID enables read-only API access without a backend or client secret.
- **localStorage:** Stores study history, preferences, goals, and room decoration selections in the browser. Data stays on the current device and browser rather than syncing to an account.
- **Git and GitHub:** Git tracks source changes locally, and the project includes a GitHub Actions workflow for GitHub Pages deployment. The repository can also be connected to Vercel.
- **Vitest and React Testing Library:** Test timer behavior and study-statistics calculations. Checks cover pause/resume, completion, breaks, stopwatch sessions, background timing, and streaks.

For local setup and deployment instructions, see [SETUP.md](SETUP.md). Music and asset attribution is documented in [CREDITS.md](CREDITS.md).

## View Mochi Focus Here

<!-- Add the live Vercel or GitHub Pages link here once hosting is selected. -->

## Contact

- **LinkedIn:** [linkedin.com/in/cyristalj](https://www.linkedin.com/in/cyristalj)
- **GitHub:** [github.com/cyristal-gems](https://github.com/cyristal-gems)
- **Email:** [cyrisjoseph@outlook.com](mailto:cyrisjoseph@outlook.com)
