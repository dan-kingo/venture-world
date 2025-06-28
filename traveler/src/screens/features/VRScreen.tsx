import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button, IconButton, Card } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { colors, spacing } from '../../theme/theme';

const { width, height } = Dimensions.get('window');

interface VRScreenProps {
  navigation: any;
}

const vrExperiences = [
  {
    id: '1',
    title: 'Lalibela Rock Churches',
    description: 'Explore the magnificent rock-hewn churches in 360°',
    thumbnail: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&vr=1',
    duration: '8 min',
  },
  {
    id: '2',
    title: 'Simien Mountains',
    description: 'Breathtaking views of Ethiopia\'s highest peaks',
    thumbnail: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&vr=1',
    duration: '12 min',
  },
  {
    id: '3',
    title: 'Danakil Depression',
    description: 'Journey to one of the hottest places on Earth',
    thumbnail: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&vr=1',
    duration: '15 min',
  },
];

export default function VRScreen({ navigation }: VRScreenProps) {
  const [selectedExperience, setSelectedExperience] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const startVRExperience = (experience: any) => {
    setSelectedExperience(experience);
    setIsPlaying(true);
  };

  const stopVRExperience = () => {
    setSelectedExperience(null);
    setIsPlaying(false);
  };

  if (isPlaying && selectedExperience) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* VR Player Header */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.playerHeader}>
            <IconButton
              icon="arrow-left"
              iconColor={colors.text}
              size={24}
              onPress={stopVRExperience}
              style={styles.backButton}
            />
            <View style={styles.playerInfo}>
              <Text style={styles.playerTitle}>{selectedExperience.title}</Text>
              <Text style={styles.playerDuration}>{selectedExperience.duration}</Text>
            </View>
            <IconButton
              icon="fullscreen"
              iconColor={colors.text}
              size={24}
              onPress={() => {}}
              style={styles.fullscreenButton}
            />
          </Animated.View>

          {/* VR Video Player */}
          <WebView
            source={{ uri: selectedExperience.videoUrl }}
            style={styles.webView}
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
            domStorageEnabled
          />

          {/* VR Controls */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.vrControls}>
            <Button
              mode="outlined"
              onPress={stopVRExperience}
              style={styles.exitButton}
              labelStyle={styles.exitButtonLabel}
              icon="exit-to-app"
            >
              Exit VR
            </Button>
            
            <View style={styles.vrActions}>
              <IconButton
                icon="rotate-3d-variant"
                iconColor={colors.primary}
                size={28}
                onPress={() => {}}
                style={styles.actionButton}
              />
              <IconButton
                icon="volume-high"
                iconColor={colors.primary}
                size={28}
                onPress={() => {}}
                style={styles.actionButton}
              />
              <IconButton
                icon="cog"
                iconColor={colors.primary}
                size={28}
                onPress={() => {}}
                style={styles.actionButton}
              />
            </View>
          </Animated.View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[colors.background, colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
          <IconButton
            icon="arrow-left"
            iconColor={colors.primary}
            size={24}
            onPress={() => navigation.goBack()}
            style={styles.headerBackButton}
          />
          <Text style={styles.headerTitle}>VR Experiences</Text>
          <IconButton
            icon="information-outline"
            iconColor={colors.primary}
            size={24}
            onPress={() => {}}
            style={styles.infoButton}
          />
        </Animated.View>

        {/* VR Introduction */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.introSection}>
          <Card style={styles.introCard}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.introGradient}
            >
              <Text style={styles.introIcon}>🥽</Text>
              <Text style={styles.introTitle}>Virtual Reality Tours</Text>
              <Text style={styles.introDescription}>
                Experience Ethiopia's wonders from anywhere in the world with immersive 360° videos
              </Text>
            </LinearGradient>
          </Card>
        </Animated.View>

        {/* VR Experiences List */}
        <View style={styles.experiencesSection}>
          <Text style={styles.sectionTitle}>Available Experiences</Text>
          
          {vrExperiences.map((experience, index) => (
            <Animated.View
              key={experience.id}
              entering={FadeInDown.delay(600 + index * 100)}
            >
              <Card
                style={styles.experienceCard}
                onPress={() => startVRExperience(experience)}
              >
                <View style={styles.experienceContent}>
                  <Card.Cover
                    source={{ uri: experience.thumbnail }}
                    style={styles.experienceThumbnail}
                  />
                  
                  <View style={styles.experienceDetails}>
                    <Text style={styles.experienceTitle}>{experience.title}</Text>
                    <Text style={styles.experienceDescription} numberOfLines={2}>
                      {experience.description}
                    </Text>
                    
                    <View style={styles.experienceFooter}>
                      <Text style={styles.experienceDuration}>
                        🕐 {experience.duration}
                      </Text>
                      <View style={styles.vrBadge}>
                        <Text style={styles.vrBadgeText}>360° VR</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.playButtonContainer}>
                    <IconButton
                      icon="play"
                      iconColor={colors.onPrimary}
                      size={24}
                      style={styles.playButton}
                    />
                  </View>
                </View>
              </Card>
            </Animated.View>
          ))}
        </View>

        {/* VR Requirements */}
        <Animated.View entering={FadeInDown.delay(1000)} style={styles.requirementsSection}>
          <Card style={styles.requirementsCard}>
            <Card.Content style={styles.requirementsContent}>
              <Text style={styles.requirementsTitle}>For Best Experience:</Text>
              <Text style={styles.requirementsText}>
                • Use headphones for immersive audio{'\n'}
                • Rotate your device for 360° viewing{'\n'}
                • Ensure stable internet connection{'\n'}
                • Use VR headset if available
              </Text>
            </Card.Content>
          </Card>
        </Animated.View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  headerBackButton: {
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
  },
  infoButton: {
    backgroundColor: colors.surface,
  },
  introSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  introCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  introGradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  introIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  introTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: colors.onPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  introDescription: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.onPrimary,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  experiencesSection: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  experienceCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
  },
  experienceContent: {
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'center',
  },
  experienceThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  experienceDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  experienceTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  experienceDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  experienceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  experienceDuration: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  vrBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  vrBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: colors.onPrimary,
  },
  playButtonContainer: {
    marginLeft: spacing.md,
  },
  playButton: {
    backgroundColor: colors.primary,
  },
  requirementsSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  requirementsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  requirementsContent: {
    padding: spacing.md,
  },
  requirementsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  requirementsText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    lineHeight: 20,
  },
  // VR Player Styles
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  backButton: {
    backgroundColor: colors.surface,
  },
  playerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  playerTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
  },
  playerDuration: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  fullscreenButton: {
    backgroundColor: colors.surface,
  },
  webView: {
    flex: 1,
  },
  vrControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  exitButton: {
    borderColor: colors.primary,
    borderRadius: 25,
  },
  exitButtonLabel: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  vrActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    backgroundColor: colors.surface,
  },
});