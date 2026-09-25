## Mochi Focus
Mochi Focus is a kawaii lofi study timer that turns focus time into a cozy daily ritual. Study alongside Mochi the tuxedo cat, discover relaxing music, and watch your room grow as you build your study habits. The app runs entirely in your browser, with no backend or account required. Your study progress and preferences are saved on your device.

## 💫 Key Features

- **Flexible focus timers:** Choose Pomodoro (25/5), Deep Focus (45/10), Long Study (60/10), a custom countdown, or a stopwatch. Pause, restart, and take breaks at your own pace.
- **Six music stations:** Explore Tokyo Café, Rainy Window, Sakura Beats, Midnight Study, Library Neko, and Night Train. Each has its own icon, description, and nine selected Jamendo tracks explicitly labeled lofi; each room has original artwork featuring Mochi and cherry blossoms.
- **Independent music controls:** Play, pause, skip, shuffle, mute, and adjust music volume without interrupting your timer. View the current track, artist, and license information.
- **Completion chime:** An optional gentle tone marks the end of focus and break timers or a finished stopwatch session. Preview it in Settings and save your preference.
- **Mochi the study cat:** Your tuxedo cat companion wears a cherry blossom and reacts to studying, breaks, session completion, and inactivity.
- **Study tracking:** Track daily focus, total study time, completed sessions, daily goals, current and longest streaks, and recent daily history.
- **Room progression:** Build your own furnished room with three color palettes. Unlock 18 decorations through study milestones, drag them into place or use keyboard controls, and save your arrangement on your device.
- **Kawaii light and dark modes:** Enjoy warm cream and strawberry accents by day, or deep plum and soft pink by night. Dark mode is the default, and your theme preference is saved.
- **Responsive design:** Flexible phone, tablet, and desktop layouts with touch-friendly controls, keyboard navigation, and reduced-motion support.

## 🛠️ Tech Stack

- **React:** Builds the interactive interface from reusable components. Custom hooks separate timer behavior, audio playback, and study tracking.
- **TypeScript:** Adds type checking to components, state, and the music-provider interface. It helps catch errors during development and keeps the code easier to maintain.
- **Vite:** Runs the local development server and produces the optimized production build. Its static output can be hosted on Vercel or GitHub Pages.
- **Tailwind CSS:** Integrates with Vite for utility-based styling alongside custom CSS. The interface uses responsive layouts and theme styles for both light and dark modes.
- **Lucide React:** Supplies consistent icons for navigation, timer actions, playback, and study statistics. Icon-only controls include accessible labels.
- **Howler.js:** Handles Jamendo music playback, track navigation, and volume control independently of the focus timer.
- **Jamendo API v3:** Provides track discovery and artist information for the six stations. A public Client ID enables read-only API access without a backend or client secret.
- **localStorage:** Stores study history, preferences, goals, and room decoration selections in the browser. Data stays on the current device and browser rather than syncing to an account.
- **Git and GitHub:** Git tracks source changes locally, and the project includes a GitHub Actions workflow for GitHub Pages deployment. The repository can also be connected to Vercel.
- **Vitest and React Testing Library:** Test timer behavior and study-statistics calculations. Checks cover pause/resume, completion, breaks, stopwatch sessions, background timing, and streaks.

## 🌸 View Mochi Focus Here

[Mochi Focus](https://mochi-focus.vercel.app)

## Contact

- **LinkedIn:** [linkedin.com/in/cyristalj](https://www.linkedin.com/in/cyristalj)
- **GitHub:** [github.com/cyristal-gems](https://github.com/cyristal-gems)
- **Email:** [cyrisjoseph@outlook.com](mailto:cyrisjoseph@outlook.com)
