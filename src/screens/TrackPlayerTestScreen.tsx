// TEMPORARY manual playback test screen. Remove once Phase 1 playback is verified.
import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';

const TEST_TRACK = {
  id: 'test-1',
  url: 'https://storage.googleapis.com/exoplayer-test-media-0/play.mp3',
  title: 'Test track',
  artist: 'OTOwave',
};

function formatTime(seconds: number): string {
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function TrackPlayerTestScreen() {
  const playbackState = usePlaybackState();
  const {position, duration} = useProgress(500);
  const state = 'state' in playbackState ? playbackState.state : undefined;

  const loadAndPlay = async () => {
    await TrackPlayer.reset();
    await TrackPlayer.add(TEST_TRACK);
    await TrackPlayer.play();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TrackPlayer test (temporary)</Text>
      <Text style={styles.line}>State: {state ?? 'none'}</Text>
      <Text style={styles.line}>
        Position: {formatTime(position)} / {formatTime(duration)}
      </Text>
      <View style={styles.buttons}>
        <Button title="Load and play" onPress={loadAndPlay} />
        <Button title="Play" onPress={() => TrackPlayer.play()} />
        <Button title="Pause" onPress={() => TrackPlayer.pause()} />
        <Button title="Stop" onPress={() => TrackPlayer.stop()} />
        <Button
          title="Seek +15s"
          onPress={async () => {
            await TrackPlayer.seekTo(position + 15);
          }}
        />
      </View>
      {state === State.Error ? (
        <Text style={styles.error}>Playback error. Check Metro/logcat.</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 24, justifyContent: 'center', gap: 12},
  title: {fontSize: 20, fontWeight: '600'},
  line: {fontSize: 16},
  buttons: {gap: 8, marginTop: 12},
  error: {color: 'red', marginTop: 12},
});
