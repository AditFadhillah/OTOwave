import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
} from 'react-native-track-player';

export async function setupPlayer(): Promise<void> {
  await TrackPlayer.setupPlayer({ autoHandleInterruptions: true });

  await TrackPlayer.updateOptions({
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SeekTo,
      Capability.JumpBackward,
      Capability.JumpForward,
      Capability.Stop,
    ],
    compactCapabilities: [Capability.Play, Capability.Pause],
    notificationCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.JumpBackward,
      Capability.JumpForward,
      Capability.Stop,
    ],
    backwardJumpInterval: 15,
    forwardJumpInterval: 30,
    android: {
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },
  });
}

export default async function PlaybackService(): Promise<void> {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) =>
    TrackPlayer.seekTo(position),
  );
  TrackPlayer.addEventListener(Event.RemoteJumpForward, ({ interval }) =>
    TrackPlayer.seekBy(interval),
  );
  TrackPlayer.addEventListener(Event.RemoteJumpBackward, ({ interval }) =>
    TrackPlayer.seekBy(-interval),
  );
}
