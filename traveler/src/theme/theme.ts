import { MD3LightTheme } from 'react-native-paper';

export const colors = {
  primary: '#FFD700', // Golden
  secondary: '#FFA500', // Orange Gold
  background: '#000000', // Black
  surface: '#1A1A1A', // Dark Gray
  surfaceVariant: '#2A2A2A', // Lighter Dark Gray
  onPrimary: '#000000', // Black text on gold
  onSecondary: '#000000', // Black text on orange
  onBackground: '#FFFFFF', // White text on black
  onSurface: '#FFFFFF', // White text on dark surface
  outline: '#FFD700', // Golden outline
  error: '#FF6B6B',
  success: '#4ECDC4',
  warning: '#FFE66D',
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  accent: '#FF8C00', // Dark Orange
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    onPrimary: colors.onPrimary,
    onSecondary: colors.onSecondary,
    onBackground: colors.onBackground,
    onSurface: colors.onSurface,
    outline: colors.outline,
    error: colors.error,
  },
  fonts: {
    ...MD3LightTheme.fonts,
    default: {
      fontFamily: 'Poppins-Regular',
    },
    headlineLarge: {
      fontFamily: 'Poppins-Bold',
      fontSize: 32,
      lineHeight: 40,
    },
    headlineMedium: {
      fontFamily: 'Poppins-Bold',
      fontSize: 28,
      lineHeight: 36,
    },
    titleLarge: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: 22,
      lineHeight: 28,
    },
    titleMedium: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: 16,
      lineHeight: 24,
    },
    bodyLarge: {
      fontFamily: 'Poppins-Regular',
      fontSize: 16,
      lineHeight: 24,
    },
    bodyMedium: {
      fontFamily: 'Poppins-Regular',
      fontSize: 14,
      lineHeight: 20,
    },
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};