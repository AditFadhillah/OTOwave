# OTOwave Project Brief
## Cross-Platform Mobile Audio Player with React Native

### Project Overview
Build a **production-ready audio player** for iOS and Android that handles music, podcasts, and audiobooks with native background playback, lock-screen controls, and persistent progress tracking.

**Target:** Ship an MVP with core playback features; design for offline downloads and advanced features in Phase 2.

---

## Tech Stack
- **Framework:** React Native + TypeScript
- **Audio Engine:** `react-native-track-player` (RNTP)
- **State Management:** Zustand
- **Local Storage:** `react-native-mmkv` (fast key-value persistence)
- **File System:** `expo-file-system` or `react-native-fs` (offline downloads)
- **Navigation:** Expo Router or React Navigation
- **Animations/Gestures:** `react-native-reanimated` + `react-native-gesture-handler`
- **Build Tool:** Expo CLI (for prebuild) or React Native CLI

---

## Core Architecture Principle
**Separate UI from Native Audio Engine.** Audio playback cannot be tied to React lifecycle—it must run in a headless background service.

### How It Works:
1. **Background Service** runs independently via `react-native-track-player`
   - iOS: Hooks into `AVAudioSession` + `MPNowPlayingInfoCenter` (Control Center, AirPlay, Bluetooth)
   - Android: Runs Foreground Service with persistent media notification + `MediaSessionCompat`

2. **State Sync** between Native Engine and React UI:
   - Use RNTP hooks: `usePlaybackState()`, `useProgress()`, `useActiveTrack()`
   - Zustand manages app state: playlists, downloaded files, user preferences
   - `react-native-mmkv` persists playback positions every few seconds

3. **Hardware Integration:**
   - Lock-screen controls trigger `PlaybackService.ts` event listeners
   - Bluetooth play/pause, skip, seek all routed through RNTP
   - Audio interruptions (phone calls) handled by RNTP automatically

---

## Data Model

```typescript
export type AudioCategory = 'music' | 'podcast' | 'audiobook';

export interface Chapter {
  id: string;
  title: string;
  startTime: number;  // seconds
  endTime: number;    // seconds
}

export interface AudioItem {
  id: string;
  url: string;              // Remote stream or local file:// path
  title: string;
  artist: string;           // Artist, podcast host, or book author
  album?: string;           // Album, podcast show, or book title
  artwork?: string;         // Cover art URL
  duration: number;         // Total seconds
  category: AudioCategory;
  chapters?: Chapter[];     // For audiobooks/podcasts
  lastPosition?: number;    // Resume timestamp (seconds)
  isDownloaded?: boolean;   // Local file available?
}
```

---

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── MiniPlayer.tsx          # Persistent bottom bar above tabs
│   │   ├── ProgressBar.tsx         # Interactive scrubber with time display
│   │   ├── PlaybackControls.tsx    # Play/pause, skip, 15s/30s jump buttons
│   │   └── SpeedModal.tsx          # Playback rate (0.75x to 2.5x)
│   ├── screens/
│   │   ├── HomeScreen.tsx          # Continue listening & recent additions
│   │   ├── LibraryScreen.tsx       # Filtered tabs (Music/Podcasts/Audiobooks)
│   │   ├── FullPlayerScreen.tsx    # Modal with artwork, chapters, sleep timer
│   │   └── DownloadsScreen.tsx     # Offline storage management
│   ├── services/
│   │   ├── PlaybackService.ts      # Headless listener for remote/lock-screen events
│   │   └── DownloadManager.ts      # Download & delete local audio files
│   ├── store/
│   │   ├── usePlayerStore.ts       # Queue, speed, sleep timer
│   │   └── useLibraryStore.ts      # Saved items, bookmarks, resume positions
│   ├── types/
│   │   └── audio.ts                # TypeScript interfaces
│   ├── utils/
│   │   └── formatTime.ts           # Seconds → HH:MM:SS
│   └── App.tsx
├── index.js                        # Registers App + PlaybackService
└── package.json
```

---

## Phase Breakdown

### Phase 1: Setup & Background Service
1. Initialize OTOwave project with Expo + TypeScript
2. Install dependencies: `react-native-track-player`, `zustand`, `react-native-mmkv`, `react-native-reanimated`, `react-native-gesture-handler`
3. Configure native permissions:
   - **iOS:** Add `"audio"` to `UIBackgroundModes` in `app.json` or `Info.plist`
   - **Android:** Ensure `FOREGROUND_SERVICE` + `WAKE_LOCK` permissions (RNTP config plugin handles)
4. Create `PlaybackService.ts` and register in `index.js`
5. Test on a real device: basic play/pause/seek via lock screen

### Phase 2: UI & Navigation
1. Build MiniPlayer, ProgressBar, PlaybackControls components
2. Create HomeScreen, LibraryScreen, FullPlayerScreen
3. Set up bottom tab navigation with mini-player persistent above tabs
4. Implement state sync: `usePlaybackState()` → UI updates

### Phase 3: Category-Specific Features
1. **Music Mode:** Previous/next buttons, repeat, shuffle
2. **Podcast/Audiobook Mode:** −15s/+30s jump buttons, playback speed, chapter drawer
3. Conditionally render based on `AudioItem.category`

### Phase 4: Persist & Resume
1. Create custom hook listening to `useProgress(5000)` (every 5 seconds)
2. Write current position to MMKV keyed by `track.id`
3. On load, seek to saved position before playing
4. Implement sleep timer (gradual volume reduction → pause)

### Phase 5: Offline Downloads (Phase 2)
1. Use `FileSystem.createDownloadResumable()` for remote audio files
2. Store local `file://` URI in `useLibraryStore`
3. Toggle between remote/local playback based on `isDownloaded`

---

## MVP Scope (Do First)
- ✅ Play/pause/seek with UI controls
- ✅ Lock-screen controls (iOS Control Center, Android media notification)
- ✅ Persistent mini-player above navigation
- ✅ Library view with basic playlist support
- ✅ Playback progress persistence (resume feature)
- ✅ Category-aware UI (music vs podcast vs audiobook)

**Save for Later:**
- Downloads & offline mode
- Sleep timer
- Advanced playback speed
- Cloud sync

---

## Important Considerations

### Setup Friction Points
- **Prebuild Required:** This project uses native modules; Expo Go won't work. Use `npx expo prebuild` to generate iOS/Android folders.
- **Device Testing:** Audio behaves differently on emulator. Test on real phones early.
- **iOS Entitlements:** Background audio requires specific provisioning. May need Apple Developer account for testing on physical iPhone.

### Common Gotchas
1. **RNTP Initialization:** Call `TrackPlayer.setupPlayer()` early in app lifecycle, before any playback attempts
2. **State Desync:** If MMKV saves don't align with RNTP playback, resume will feel broken. Test thoroughly.
3. **Platform Differences:** iOS and Android handle background audio slightly differently—test on both early
4. **Performance:** Keep Zustand subscriptions focused; don't re-render entire app on every progress update

### Testing Strategy
1. **Unit:** Test formatTime, store reducers
2. **Integration:** Test playback flow (load track → play → update progress → pause → resume)
3. **Device:** Test on iPhone + Android device:
   - Lock screen plays/pauses via native controls
   - App backgrounding doesn't interrupt audio
   - Resume from saved position works
   - Bluetooth controls work

---

## Getting Started Checklist
- [ ] Initialize Expo project with TypeScript template
- [ ] Install all dependencies listed in Phase 1
- [ ] Configure native permissions (iOS + Android)
- [ ] Create `PlaybackService.ts` and test lock-screen controls
- [ ] Build MiniPlayer and basic navigation
- [ ] Implement Zustand stores
- [ ] Test on real device (iPhone and/or Android)
- [ ] Add progress persistence with MMKV
- [ ] Ship MVP

---

## Success Criteria
- Audio plays continuously when app is backgrounded
- Lock-screen controls (play/pause/seek) work on both platforms
- Playback position persists between app sessions
- UI reflects playback state in real-time
- App handles audio interruptions gracefully (phone calls, other apps)
