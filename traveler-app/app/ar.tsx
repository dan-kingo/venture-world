import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button, IconButton, Card } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';

import { colors, spacing } from '../src/theme/theme';

const { width, height } = Dimensions.get('window');

const AR_HTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebAR Experience</title>
    <script src="https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/aframe/build/aframe-ar.js"></script>
    <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #000;
            color: #fff;
            overflow: hidden;
        }
        
        #arContainer {
            position: relative;
            width: 100vw;
            height: 100vh;
        }
        
        #info {
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 15px;
            border-radius: 10px;
            z-index: 1000;
            text-align: center;
        }
        
        #instructions {
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
        
        .hidden {
            display: none;
        }
        
        a-scene {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <div id="arContainer">
        <div id="info">
            <h3>🏛️ Lalibela Rock Churches AR</h3>
            <p>Point your camera at any surface to see the AR experience</p>
        </div>
        
        <div id="instructions">
            <p>📱 Move your device slowly to detect surfaces</p>
        </div>
        
        <a-scene
            embedded
            arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
            vr-mode-ui="enabled: false"
            renderer="logarithmicDepthBuffer: true;"
            loading-screen="enabled: false">
            
            <!-- Assets -->
            <a-assets>
                <a-mixin id="church-material" material="color: #8B4513; metalness: 0.2; roughness: 0.8;"></a-mixin>
                <a-mixin id="gold-material" material="color: #FFD700; metalness: 0.8; roughness: 0.2;"></a-mixin>
            </a-assets>
            
            <!-- AR Marker -->
            <a-marker preset="hiro" raycaster="objects: .clickable" emitevents="true" cursor="fuse: false; rayOrigin: mouse;" markerhandler>
                <!-- Main Church Structure -->
                <a-box 
                    position="0 0.5 0" 
                    rotation="0 45 0" 
                    scale="1 1 1.5"
                    mixin="church-material"
                    animation="property: rotation; to: 0 405 0; loop: true; dur: 20000">
                </a-box>
                
                <!-- Church Tower -->
                <a-cylinder
                    position="0 1.5 0"
                    radius="0.3"
                    height="1"
                    mixin="church-material">
                </a-cylinder>
                
                <!-- Cross on top -->
                <a-box
                    position="0 2.2 0"
                    scale="0.1 0.3 0.1"
                    mixin="gold-material">
                </a-box>
                <a-box
                    position="0 2.1 0"
                    scale="0.3 0.1 0.1"
                    mixin="gold-material">
                </a-box>
                
                <!-- Information Text -->
                <a-text 
                    value="Lalibela Rock Churches\\n12th Century UNESCO Site\\nCarved from Volcanic Rock"
                    position="0 3 0"
                    align="center"
                    color="#FFD700"
                    scale="1.5 1.5 1.5"
                    animation="property: position; to: 0 3.5 0; dir: alternate; loop: true; dur: 3000">
                </a-text>
                
                <!-- Historical Facts -->
                <a-text 
                    value="Built during King Lalibela's reign\\nRepresents New Jerusalem\\nStill active place of worship"
                    position="0 -1 0"
                    align="center"
                    color="#FFFFFF"
                    scale="1 1 1">
                </a-text>
                
                <!-- Decorative elements -->
                <a-sphere
                    position="1 0.5 1"
                    radius="0.1"
                    mixin="gold-material"
                    animation="property: rotation; to: 360 360 360; loop: true; dur: 5000">
                </a-sphere>
                <a-sphere
                    position="-1 0.5 1"
                    radius="0.1"
                    mixin="gold-material"
                    animation="property: rotation; to: -360 -360 -360; loop: true; dur: 5000">
                </a-sphere>
                <a-sphere
                    position="1 0.5 -1"
                    radius="0.1"
                    mixin="gold-material"
                    animation="property: rotation; to: 360 -360 360; loop: true; dur: 5000">
                </a-sphere>
                <a-sphere
                    position="-1 0.5 -1"
                    radius="0.1"
                    mixin="gold-material"
                    animation="property: rotation; to: -360 360 -360; loop: true; dur: 5000">
                </a-sphere>
            </a-marker>
            
            <!-- Camera -->
            <a-entity camera></a-entity>
        </a-scene>
    </div>
    
    <script>
        // AR.js event handlers
        AFRAME.registerComponent('markerhandler', {
            init: function() {
                const marker = this.el;
                
                marker.addEventListener('markerFound', function() {
                    console.log('Marker found');
                    document.getElementById('instructions').innerHTML = 
                        '<p>✅ AR Site Detected! Explore the 3D model of Lalibela</p>';
                    document.getElementById('instructions').style.background = 'rgba(76, 175, 80, 0.9)';
                    document.getElementById('instructions').style.color = '#fff';
                });
                
                marker.addEventListener('markerLost', function() {
                    console.log('Marker lost');
                    document.getElementById('instructions').innerHTML = 
                        '<p>📱 Move your device slowly to detect surfaces</p>';
                    document.getElementById('instructions').style.background = 'rgba(255, 215, 0, 0.9)';
                    document.getElementById('instructions').style.color = '#000';
                });
            }
        });
        
        // Simulate detection after 3 seconds if no marker found
        setTimeout(() => {
            const instructions = document.getElementById('instructions');
            if (instructions.innerHTML.includes('Move your device')) {
                instructions.innerHTML = '<p>🎯 Try pointing at a flat surface or use the Hiro marker</p>';
            }
        }, 3000);
        
        // Add click interaction
        document.addEventListener('click', function() {
            const info = document.getElementById('info');
            const instructions = document.getElementById('instructions');
            
            if (info.style.opacity === '0.3') {
                info.style.opacity = '1';
                instructions.style.opacity = '1';
            } else {
                info.style.opacity = '0.3';
                instructions.style.opacity = '0.3';
            }
        });
        
        // Auto-hide UI after 5 seconds
        setTimeout(() => {
            document.getElementById('info').style.opacity = '0.3';
            document.getElementById('instructions').style.opacity = '0.3';
        }, 5000);
    </script>
</body>
</html>
`;

export default function ARScreen() {
  const [isARActive, setIsARActive] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const startARExperience = () => {
    setIsARActive(true);
  };

  const stopARExperience = () => {
    setIsARActive(false);
  };

  if (isARActive) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* AR Header */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.arHeader}>
            <IconButton
              icon="arrow-left"
              iconColor={colors.text}
              size={24}
              onPress={stopARExperience}
              style={styles.backButton}
            />
            <Text style={styles.headerTitle}>AR Experience</Text>
            <IconButton
              icon="camera"
              iconColor={colors.text}
              size={24}
              onPress={() => {}}
              style={styles.cameraButton}
            />
          </Animated.View>

          {/* WebAR View */}
          <WebView
            ref={webViewRef}
            source={{ html: AR_HTML }}
            style={styles.webView}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
            domStorageEnabled
            allowsFullscreenVideo
            mixedContentMode="compatibility"
            onMessage={(event) => {
              console.log('WebAR message:', event.nativeEvent.data);
            }}
          />

          {/* AR Controls */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.arControls}>
            <Button
              mode="outlined"
              onPress={stopARExperience}
              style={styles.exitButton}
              labelStyle={styles.exitButtonLabel}
              icon="exit-to-app"
            >
              Exit AR
            </Button>
            
            <View style={styles.arActions}>
              <IconButton
                icon="refresh"
                iconColor={colors.primary}
                size={28}
                onPress={() => webViewRef.current?.reload()}
                style={styles.actionButton}
              />
              <IconButton
                icon="volume-high"
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
    <View style={styles.container}>
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
          <Text style={styles.headerTitle}>AR Experience</Text>
          <IconButton
            icon="information-outline"
            iconColor={colors.primary}
            size={24}
            onPress={() => {}}
            style={styles.infoButton}
          />
        </Animated.View>

        {/* AR Introduction */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.introSection}>
          <Card style={styles.introCard}>
            <Card.Content style={styles.introContent}>
              <Text style={styles.introIcon}>📱</Text>
              <Text style={styles.introTitle}>Augmented Reality Tours</Text>
              <Text style={styles.introDescription}>
                Experience Ethiopian heritage sites through cutting-edge AR technology powered by WebAR.js
              </Text>
            </Card.Content>
          </Card>
        </Animated.View>

        {/* Features */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>AR Features</Text>
          
          <Card style={styles.featureCard}>
            <Card.Content style={styles.featureContent}>
              <Text style={styles.featureIcon}>🏛️</Text>
              <View style={styles.featureDetails}>
                <Text style={styles.featureTitle}>3D Historical Models</Text>
                <Text style={styles.featureDescription}>
                  View detailed 3D reconstructions of ancient sites using WebAR.js
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.featureCard}>
            <Card.Content style={styles.featureContent}>
              <Text style={styles.featureIcon}>📚</Text>
              <View style={styles.featureDetails}>
                <Text style={styles.featureTitle}>Interactive Information</Text>
                <Text style={styles.featureDescription}>
                  Access historical facts and cultural insights in real-time
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.featureCard}>
            <Card.Content style={styles.featureContent}>
              <Text style={styles.featureIcon}>🎯</Text>
              <View style={styles.featureDetails}>
                <Text style={styles.featureTitle}>Marker-based Tracking</Text>
                <Text style={styles.featureDescription}>
                  Point at surfaces or use Hiro markers for AR activation
                </Text>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>

        {/* Start AR Button */}
        <Animated.View entering={FadeInDown.delay(800)} style={styles.startSection}>
          <Button
            mode="contained"
            onPress={startARExperience}
            style={styles.startButton}
            contentStyle={styles.startButtonContent}
            labelStyle={styles.startButtonLabel}
            icon="camera"
          >
            Start AR Experience
          </Button>
          
          <Text style={styles.startNote}>
            Make sure you have good lighting and camera permissions enabled. Point your camera at flat surfaces or use a Hiro marker for best results.
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    backgroundColor: colors.surface,
    borderRadius: 20,
  },
  introContent: {
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
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  introDescription: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  featureCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    borderRadius: 16,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  featureDetails: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  startSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    marginBottom: spacing.md,
  },
  startButtonContent: {
    paddingVertical: spacing.sm,
  },
  startButtonLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: colors.onPrimary,
  },
  startNote: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  // AR Active Styles
  arHeader: {
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
  cameraButton: {
    backgroundColor: colors.surface,
  },
  webView: {
    flex: 1,
  },
  arControls: {
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
  arActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    backgroundColor: colors.surface,
  },
});