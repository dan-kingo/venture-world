import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '../../theme/theme';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation: any;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const logoScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(50);

  useEffect(() => {
    // Animate logo
    logoScale.value = withSpring(1, { damping: 15, stiffness: 100 });
    
    // Animate title
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    
    // Animate subtitle
    subtitleOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    
    // Animate buttons
    buttonOpacity.value = withDelay(900, withTiming(1, { duration: 800 }));
    buttonTranslateY.value = withDelay(900, withSpring(0, { damping: 15 }));
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  return (
    <LinearGradient
      colors={[colors.background, colors.surface, colors.background]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Logo Section */}
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>🌍</Text>
            </View>
          </Animated.View>

          {/* Title Section */}
          <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
            <Text style={styles.title}>Venture World</Text>
            <View style={styles.titleUnderline} />
          </Animated.View>

          {/* Subtitle Section */}
          <Animated.View style={[styles.subtitleContainer, subtitleAnimatedStyle]}>
            <Text style={styles.subtitle}>
              Discover Ethiopia's hidden treasures through immersive AR & VR experiences
            </Text>
          </Animated.View>

          {/* Buttons Section */}
          <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Language')}
              style={styles.primaryButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Get Started
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Login')}
              style={styles.secondaryButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.secondaryButtonLabel}
            >
              I have an account
            </Button>
          </Animated.View>

          {/* Features Preview */}
          <Animated.View style={[styles.featuresContainer, buttonAnimatedStyle]}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📱</Text>
              <Text style={styles.featureText}>AR Tours</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🥽</Text>
              <Text style={styles.featureText}>VR Experiences</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🗺️</Text>
              <Text style={styles.featureText}>Smart Itineraries</Text>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoText: {
    fontSize: 60,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  titleUnderline: {
    width: 100,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  subtitleContainer: {
    marginBottom: spacing.xxl,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    marginBottom: spacing.md,
    borderRadius: 25,
  },
  secondaryButton: {
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 25,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: colors.onPrimary,
  },
  secondaryButtonLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: colors.primary,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: spacing.md,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  featureText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});