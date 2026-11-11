export const colors = {
  background: '#000000',
  surface: '#0E0E12',
  surfaceRaised: '#16161C',
  surfaceHighlight: '#1F1F27',
  border: '#24242C',
  text: '#FFFFFF',
  textSecondary: '#A1A1AD',
  textTertiary: '#6B6B78',
  primary: '#1A5FFF',
  primaryPressed: '#1450DB',
  primarySoft: 'rgba(26, 95, 255, 0.16)',
  primaryText: '#6E97FF',
  star: '#FFC53D',
  danger: '#FF4D5E',
  success: '#2ED47A',
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const type = {
  hero: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -0.8, color: colors.text },
  title: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.4, color: colors.text },
  section: { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.3, color: colors.text },
  headline: { fontSize: 16, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.textSecondary, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '500' as const, color: colors.textSecondary },
  micro: { fontSize: 11, fontWeight: '700' as const, color: colors.textTertiary, letterSpacing: 0.8 },
};

/**
 * Height of the Material 3 navigation bar that native tabs render on Android, without the system inset,
 * and of the web tab bar in `(tabs)/_layout.web.tsx`.
 */
export const TAB_BAR_HEIGHT = 80;
export const MINI_PLAYER_HEIGHT = 64;
