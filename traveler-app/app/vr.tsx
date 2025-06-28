import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button, IconButton, Card } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';

import { colors, spacing } from '../src/theme/theme';

const { width, height } = Dimensions.get('window');

const vrExperiences = [
  {
    id: '1',
    title: 'Lalibela Rock Churches',
    description: 'Explore the magnificent rock-hewn churches in 360°',
    thumbnail: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg',
    videoId: 'MJjjhrfYWqM', // Example 360° video ID
    duration: '8 min',
  },
  {
    id: '2',
    title: 'Simien Mountains',
    description: 'Breathtaking views of Ethiopia\'s highest peaks',
    thumbnail: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg',
    videoId: 'ChOhcHD8fBA', // Example 360° video ID
    duration: '12 min',
  },
  {
    id: '3',
    title: 'Danakil Depression',
    description: 'Journey to one of the hottest places on Earth',
    thumbnail: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    videoId: 'Uvufun6xer8', // Example 360° video ID
    duration: '15 min',
  },
];

const generateVRHTML = (videoId: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VR Experience - ${title}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #000;
            font-family: Arial, sans-serif;
            overflow: hidden;
        }
        
        #vrContainer {
            position: relative;
            width: 100vw;
            height: 100vh;
        }
        
        #youtube-player {
            width: 100%;
            height: 100%;
            border: none;
        }
        
        #vrOverlay {
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 15px;
            border-radius: 10px;
            z-index: 1000;
            text-align: center;
        }
        
        #vrControls {
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
            background: rgba(255, 215, 0, 0.9);
            color: #000;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            z-index: 1000;
        }
        
        .control-button {
            background: #000;
            color: #FFD700;
            border: none;
            padding: 10px 20px;
            margin: 5px;
            border-radius: 20px;
            font-size: 14px;
            cursor: pointer;
        }
        
        .control-button:hover {
            background: #333;
        }
    </style>
</head>
<body>
    <div id="vrContainer">
        <div id="vrOverlay">
            <h3>🥽 ${title}</h3>
            <p>Use your device's gyroscope or drag to look around in 360°</p>
        </div>
        
        <iframe
            id="youtube-player"
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&showinfo=0&fs=1&playsinline=1"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
        </iframe>
        
        <div id="vrControls">
            <p>🎮 VR Controls</p>
            <button class="control-button" onclick="toggleFullscreen()">📺 Fullscreen</button>
            <button class="control-button" onclick="resetView()">🔄 Reset View</button>
            <button class="control-button" onclick="toggleQuality()">⚙️ Quality</button>
        </div>
    </div>
    
    <script>
        let isFullscreen = false;
        
        function toggleFullscreen() {
            const container = document.getElementById('vrContainer');
            
            if (!isFullscreen) {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                } else if (container.mozRequestFullScreen) {
                    container.mozRequestFullScreen();
                }
                isFullscreen = true;
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                }
                isFullscreen = false;
            }
        }
        
        function resetView() {
            // Reset the YouTube player view (this would require YouTube API)
            console.log('Reset view');
        }
        
        function toggleQuality() {
            // Toggle video quality (this would require YouTube API)
            console.log('Toggle quality');
        }
        
        // Hide controls after 5 seconds
        setTimeout(() => {
            document.getElementById('vrOverlay').style.opacity = '0.5';
            document.getElementById('vrControls').style.opacity = '0.5';
        }, 5000);
        
        // Show controls on touch/click
        document.addEventListener('click', () => {
            document.getElementById('vrOverlay').style.opacity = '1';
            document.getElementById('vrControls').style.opacity = '1';
            
            setTimeout(() => {
                document.getElementById('vrOverlay').style.opacity = '0.5';
                document.getElementById('vrControls').style.opacity = '0.5';
            }, 3000);
        });
    </script>
</body>
</html>
`;

export default function VRScreen() {
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
            source={{ html: generateVRHTML(selectedExperience.videoId, selectedExperience.title) }}
            style={styles.webView}
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
            mixedContentMode="compatibility"
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
            onPress={() => router.back()}
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
    color: colors.text,
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