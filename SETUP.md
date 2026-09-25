# Mochi Focus — Setup and Deployment

## Start

Requires Node.js 22.12+ (Node 24 recommended).

```sh
npm install
cp .env.example .env
npm run dev
```

The focus timer, tracking, and room progression work immediately. For music, register your own application at https://devportal.jamendo.com/ and add its read API Client ID:

```env
VITE_JAMENDO_CLIENT_ID=your_client_id_here
```

Restart Vite after editing `.env`. Vite exposes this ID in the browser bundle; it is not a secret. Never add a client secret or OAuth credentials. Creating a Jamendo account and accepting its terms are the project owner's responsibility.

## Features

- Pomodoro 25/5, deep focus 45/10, long study 60/10, custom 1–240 minutes, and count-up timer.
- Pause, restart, explicit continue into breaks, and finish-session for stopwatch. Breaks do not count as focus. Changing mode/restarting preserves focus already earned but does not count an unfinished session as completed.
- Wall-clock timer catches up after background tab throttling. Active sessions stop on reload; credited time is retained. Time accrued across midnight while a tab is suspended is attributed to the day it resumes.
- Six Jamendo lofi track collections with play/pause, next/previous, shuffle, mute, volume, automatic next, artist links, and license links. Music and timer operate independently. Station palettes share one original room illustration.
- Local daily focus, goal, completed sessions, total time, current/longest streak, and recent history. A day with at least one credited second extends a streak.
- Animated Mochi and seven cosmetic milestones. Unlocked objects can be placed in the room.
- Saved kawaii light/dark themes: cream and strawberry by day, deep plum and soft pink by night.
- Keyboard-accessible controls, native modal focus trapping, touch-friendly phone/tablet layouts, and reduced-motion support.

Your browser's local storage is the source of truth. Different browsers/devices do not sync. Clearing site data deletes progress. A full/private storage environment can prevent persistence without stopping the timer. Use one active study tab to avoid competing writes.

## Project architecture

- `src/hooks/useTimer.ts`: wall-clock focus/break lifecycle.
- `src/hooks/useStudyStats.ts`, `src/utils/stats.ts`: persistent study history and streak calculations.
- `src/hooks/useMusic.ts`: Howler lifecycle, track navigation and playback.
- `src/types/music.ts`: replaceable MusicProvider interface.
- `src/services/jamendo.ts`: read API requests, validation, cancellation, and in-memory station cache.
- `src/data/stations.ts`: station metadata and verified lofi track IDs.
- `src/components/`: mascot and modal.
- `public/backgrounds/`: local media.

Music is fetched once per station per page session, then reused. No polling or timer-driven API requests. Network failures show a retry action. Live Jamendo playback requires your own valid Client ID and must be verified after configuration.

## Checks

```sh
npm test
npm run build
npm run preview
```

## Deploy to Vercel

Push this folder as a GitHub repository, import it into Vercel, and use the Vite preset. Build: `npm run build`. Output: `dist`. Add `VITE_JAMENDO_CLIENT_ID` in Vercel's environment settings and redeploy. No server or rewrite is needed.

## Deploy to GitHub Pages

The included Actions workflow builds and deploys to Pages only when manually dispatched. In GitHub: Settings → Pages → Source → GitHub Actions. Add a repository Actions variable named `VITE_JAMENDO_CLIENT_ID`. Relative Vite asset paths support repository subpaths. Do not add `.env` to Git.

```sh
git remote add origin https://github.com/YOUR_USERNAME/mochi-focus.git
git branch -M main
git push -u origin main
```

## Audio and licensing

See [CREDITS.md](CREDITS.md). Jamendo tracks retain their individual licenses. Check https://developer.jamendo.com/v3.0 and applicable API terms before release or monetization. Do not assume the open-source software license grants commercial rights to Jamendo music. API quotas and terms can change.

Documentation references: [Tailwind Vite setup](https://tailwindcss.com/docs/installation/using-vite), [Jamendo tracks API](https://developer.jamendo.com/v3.0/tracks).
