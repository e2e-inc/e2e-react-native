import { View } from 'react-native';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { MiniPlayer } from '@/components/mini-player';
import { StatusBarScrim } from '@/components/status-bar-scrim';
import { ToastProvider } from '@/components/toast';
import { LibraryProvider } from '@/store/library';
import { PlayerProvider } from '@/store/player';
import { colors } from '@/theme';

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    border: colors.border,
    text: colors.text,
  },
};

const sheet = {
  presentation: 'formSheet',
  sheetGrabberVisible: true,
  sheetCornerRadius: 28,
  contentStyle: { backgroundColor: colors.surface },
} as const;

export default function RootLayout() {
  return (
    <ThemeProvider value={theme}>
      <LibraryProvider>
        <PlayerProvider>
          <ToastProvider>
            <View style={{ flex: 1, backgroundColor: colors.background }}>
              <StatusBar style="light" />
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                  name="player"
                  options={{ animation: 'slide_from_bottom', gestureDirection: 'vertical', fullScreenGestureEnabled: true }}
                />
                <Stack.Screen name="queue" options={{ animation: 'slide_from_bottom' }} />
                <Stack.Screen name="share" options={{ ...sheet, sheetAllowedDetents: [0.62] }} />
                <Stack.Screen name="add-to-playlist" options={{ ...sheet, sheetAllowedDetents: [0.6] }} />
                <Stack.Screen name="new-playlist" options={{ ...sheet, sheetAllowedDetents: [0.4] }} />
                <Stack.Screen name="review" options={{ ...sheet, sheetAllowedDetents: [0.7] }} />
                <Stack.Screen name="sleep-timer" options={{ ...sheet, sheetAllowedDetents: [0.55] }} />
              </Stack>
              <StatusBarScrim />
              <MiniPlayer />
            </View>
          </ToastProvider>
        </PlayerProvider>
      </LibraryProvider>
    </ThemeProvider>
  );
}
