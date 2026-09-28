/**
 * WashKart Theme Color Palette
 * Centralized theme configuration for brand colors, background, text, status colors.
 * Easily change brand identity by editing this file.
 */

export const colors = {
  // Brand Colors
  primary: '#2563EB',       // Blue 600
  primaryLight: '#60A5FA',  // Blue 400
  primaryDark: '#1D4ED8',   // Blue 700
  primaryBg: '#EFF6FF',     // Blue 50

  secondary: '#0EA5E9',     // Sky 500
  secondaryLight: '#38BDF8',// Sky 400
  secondaryBg: '#F0F9FF',   // Sky 50

  accent: '#8B5CF6',        // Purple 500
  accentBg: '#F5F3FF',      // Purple 50

  // Status & Feedback Colors
  success: '#16A34A',       // Green 600
  successBg: '#F0FDF4',     // Green 50
  successBorder: '#BBF7D0', // Green 200

  warning: '#F59E0B',       // Amber 500
  warningBg: '#FFFBEB',     // Amber 50
  warningBorder: '#FDE68A', // Amber 200

  error: '#DC2626',         // Red 600
  errorBg: '#FEF2F2',       // Red 50
  errorBorder: '#FECACA',   // Red 200

  info: '#0284C7',          // Light Blue 600
  infoBg: '#F0F9FF',        // Light Blue 50

  // Neutrals & Layout
  background: '#F8FAFC',    // Slate 50
  surface: '#FFFFFF',       // Pure White
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E2E8F0',        // Slate 200
  divider: '#F1F5F9',       // Slate 100
  inputBg: '#F1F5F9',       // Slate 100
  disabledBg: '#E2E8F0',    // Slate 200

  // Typography Colors
  text: '#0F172A',          // Slate 900
  textSecondary: '#64748B', // Slate 500
  textMuted: '#94A3B8',     // Slate 400
  textWhite: '#FFFFFF',
  disabledText: '#94A3B8',

  // Special Overlays
  overlay: 'rgba(15, 23, 42, 0.5)',
  shadow: 'rgba(15, 23, 42, 0.08)',
  shadowStrong: 'rgba(15, 23, 42, 0.16)',
};

export type Colors = typeof colors;
