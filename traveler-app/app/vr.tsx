import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text, Button, IconButton, Card } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { router } from 'expo-router';

import { colors, spacing } from '../src/theme/theme';

const { width, height } = Dimensions.get('window');

const vrExperiences = [
  {
    id: '1',
    title: 'Lalibela Rock Churches',
    description: 'Explore the magnificent rock-hewn churches in 360°',
    thumbnail: 'https://images.unsplash.com/flagged/photo-1572644973628-e9be84915d59?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    videoId: 'JJS5txGEbWA', // Example 360° video ID
    duration: '3 min',
  },
  {
    id: '2',
    title: 'Simien Mountains',
    description: 'Breathtaking views of Ethiopia\'s highest peaks',
    thumbnail: 'https://plus.unsplash.com/premium_photo-1661963813165-de22e1c7d406?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    videoId: 'ME3rb2kd5C8', // Example 360° video ID
    duration: '2 min',
  },
  {
    id: '3',
    title: 'Gonder Castle',
    description: 'Journey to one of the greatest castles in Africa',
    thumbnail: 'https://whc.unesco.org/uploads/thumbs/site_0019_0001-1200-630-20151104170938.jpg',
    videoId: '9X9glTHr1PQ', // Example 360° video ID
    duration: '3 min',
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
            transition: opacity 0.3s ease;
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
            transition: opacity 0.3s ease;
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
            transition: background 0.3s ease;
        }
        
        .control-button:hover {
            background: #333;
        }
        
        .control-button:active {
            background: #555;
        }
        
        #loadingIndicator {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: #FFD700;
            padding: 20px;
            border-radius: 10px;
            z-index: 2000;
            text-align: center;
        }
        
        .spinner {
            border: 3px solid #333;
            border-top: 3px solid #FFD700;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .dismiss-button {
            background: #FFD700;
            color: #000;
            border: none;
            padding: 8px 16px;
            margin-top: 10px;
            border-radius: 20px;
            font-size: 12px;
            cursor: pointer;
            transition: background 0.3s ease;
        }

        .dismiss-button:hover {
            background: #ffcc00;
        }

        .dismiss-button:active {
            background: #e6b800;
        }
    </style>
</head>
<body>
    <div id="vrContainer">
        <div id="loadingIndicator">
            <div class="spinner"></div>
            <p>Loading VR Experience...</p>
        </div>
        
        <div id="vrOverlay">
            <p>For a better immersive experience, visit this video on YouTube</p>
            <button class="dismiss-button" onclick="dismissOverlay()">Dismiss</button>
        </div>
        
        <iframe
            id="youtube-player"
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&showinfo=0&fs=1&playsinline=1&enablejsapi=1"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
        </iframe>
        
        <div id="vrControls">
            <p>🎮 VR Controls</p>
            <button class="control-button" onclick="toggleFullscreen()">📺 Fullscreen</button>
            <button class="control-button" onclick="resetView()">🔄 Reset View</button>
            <button class="control-button" onclick="toggleQuality()">⚙️ Quality</button>
            <button class="control-button" onclick="togglePlayback()">⏯️ Play/Pause</button>
            <button class="control-button" onclick="openInYouTube()">Open in YouTube</button>
        </div>
    </div>
    
    <script>
        let isFullscreen = false;
        let player;
        let isPlaying = true;
        
        // YouTube API ready
        function onYouTubeIframeAPIReady() {
            player = new YT.Player('youtube-player', {
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }
        
        function onPlayerReady(event) {
            document.getElementById('loadingIndicator').style.display = 'none';
            console.log('YouTube player ready');
        }
        
        function onPlayerStateChange(event) {
            if (event.data == YT.PlayerState.PLAYING) {
                isPlaying = true;
            } else if (event.data == YT.PlayerState.PAUSED) {
                isPlaying = false;
            }
        }
        
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
            // For YouTube 360° videos, this would require YouTube API
            console.log('Reset view - feature requires YouTube API integration');
            if (player && player.seekTo) {
                player.seekTo(0);
            }
        }
        
        function toggleQuality() {
            console.log('Toggle quality - feature requires YouTube API integration');
            // This would require YouTube API to change quality
            alert('Quality settings available in fullscreen mode');
        }
        
        function togglePlayback() {
            if (player) {
                if (isPlaying) {
                    player.pauseVideo();
                } else {
                    player.playVideo();
                }
            }
        }
        
        function dismissOverlay() {
            document.getElementById('vrOverlay').style.display = 'none';
        }

        function openInYouTube() {
            // Open directly in Chrome browser with the web URL
            const webUrl = 'https://www.youtube.com/watch?v=${videoId}';
            window.open(webUrl, '_system');
        }

        // Hide controls after 5 seconds
        setTimeout(() => {
            document.getElementById('vrOverlay').style.opacity = '0.3';
            document.getElementById('vrControls').style.opacity = '0.3';
        }, 5000);
        
        // Show controls on touch/click
        let hideTimeout;
        document.addEventListener('click', () => {
            const overlay = document.getElementById('vrOverlay');
            const controls = document.getElementById('vrControls');
            
            overlay.style.opacity = '1';
            controls.style.opacity = '1';
            
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                overlay.style.opacity = '0.3';
                controls.style.opacity = '0.3';
            }, 3000);
        });
        
        // Handle fullscreen changes
        document.addEventListener('fullscreenchange', () => {
            isFullscreen = !!document.fullscreenElement;
        });
        
        document.addEventListener('webkitfullscreenchange', () => {
            isFullscreen = !!document.webkitFullscreenElement;
        });
        
        document.addEventListener('mozfullscreenchange', () => {
            isFullscreen = !!document.mozFullScreenElement;
        });
        
        // Load YouTube API
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        // Remove loading indicator after 5 seconds as fallback
        setTimeout(() => {
            const loading = document.getElementById('loadingIndicator');
            if (loading) {
                loading.style.display = 'none';
            }
        }, 5000);
    </script>
</body>
</html>
`;
export default function VRScreen() {
  const [selectedExperience, setSelectedExperience] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRequirements, setShowRequirements] = useState(true);
  
  const requirementsOpacity = useSharedValue(1);

  useEffect(() => {
    // Auto-hide requirements card after 5 seconds
    const timer = setTimeout(() => {
      requirementsOpacity.value = withTiming(0.3, { duration: 500 });
      setShowRequirements(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const toggleRequirements = () => {
    if (showRequirements) {
      requirementsOpacity.value = withTiming(0.3, { duration: 300 });
      setShowRequirements(false);
    } else {
      requirementsOpacity.value = withTiming(1, { duration: 300 });
      setShowRequirements(true);
    }
  };

  const requirementsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: requirementsOpacity.value,
  }));

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
            onMessage={(event) => {
              console.log('VR WebView message:', event.nativeEvent.data);
            }}
          />

          {/* Floating Requirements Card */}
          <Animated.View style={[styles.floatingRequirements, requirementsAnimatedStyle]}>
            <Card style={styles.floatingCard} onPress={toggleRequirements}>
              <Card.Content style={styles.floatingContent}>
                <View style={styles.floatingHeader}>
                  <Text style={styles.floatingTitle}>VR Tips</Text>
                  <IconButton
                    icon={showRequirements ? "chevron-up" : "chevron-down"}
                    iconColor={colors.primary}
                    size={20}
                    onPress={toggleRequirements}
                  />
                </View>
                {showRequirements && (
                  <Text style={styles.floatingText}>
                    • Use headphones for immersive audio{'\n'}
                    • Rotate device for 360° viewing{'\n'}
                    • Tap screen to show/hide controls
                  </Text>
                )}
              </Card.Content>
            </Card>
          </Animated.View>

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

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
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
                  Experience Ethiopia's wonders from anywhere in the world with immersive 360° YouTube videos
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
                          <Text style={styles.vrBadgeText}>360° YouTube</Text>
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
                  • Use VR headset if available{'\n'}
                  • Tap screen to show/hide controls
                </Text>
              </Card.Content>
            </Card>
          </Animated.View>
        </ScrollView>
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
    paddingBottom: spacing.sm,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
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
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
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
  floatingRequirements: {
    position: 'absolute',
    top: 80,
    right: spacing.md,
    left: spacing.md,
    zIndex: 1000,
  },
  floatingCard: {
    backgroundColor: colors.surface,
    borderRadius:12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingContent: {
    padding: spacing.sm,
  },
  floatingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  floatingTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
  },
  floatingText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    lineHeight: 16,
    marginTop: spacing.xs,
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