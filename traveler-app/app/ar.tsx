import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button, IconButton, Card } from 'react-native-paper';
import { Camera, CameraView } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';

import { colors, spacing } from '../src/theme/theme';

const { width, height } = Dimensions.get('window');

export default function ARScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isARActive, setIsARActive] = useState(false);
  const [arInfo, setArInfo] = useState<any>(null);
  const cameraRef = useRef<CameraView>(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const startARExperience = () => {
    setIsARActive(true);
    // Simulate AR detection after 2 seconds
    setTimeout(() => {
      setArInfo({
        title: 'Lalibela Rock Church',
        description: 'This 12th-century church was carved directly from volcanic rock.',
        historicalFacts: [
          'Built during the reign of King Lalibela',
          'UNESCO World Heritage Site since 1978',
          'Represents the New Jerusalem',
        ],
      });
    }, 2000);
  };

  const stopARExperience = () => {
    setIsARActive(false);
    setArInfo(null);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <Button
          mode="contained"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Camera View */}
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
        >
          {/* Header */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
            <IconButton
              icon="arrow-left"
              iconColor={colors.text}
              size={24}
              onPress={() => router.back()}
              style={styles.backIconButton}
            />
            <Text style={styles.headerTitle}>AR Experience</Text>
            <IconButton
              icon="information-outline"
              iconColor={colors.text}
              size={24}
              onPress={() => {}}
              style={styles.infoButton}
            />
          </Animated.View>

          {/* AR Overlay */}
          {isARActive && (
            <View style={styles.arOverlay}>
              {/* AR Detection Indicator */}
              <Animated.View entering={FadeInDown.delay(300)} style={styles.arIndicator}>
                <View style={styles.scanningFrame} />
                <Text style={styles.scanningText}>
                  {arInfo ? 'Site Detected!' : 'Scanning for historical sites...'}
                </Text>
              </Animated.View>

              {/* AR Information Panel */}
              {arInfo && (
                <Animated.View entering={FadeInUp.delay(500)} style={styles.arInfoPanel}>
                  <Card style={styles.infoCard}>
                    <Card.Content style={styles.infoContent}>
                      <Text style={styles.infoTitle}>{arInfo.title}</Text>
                      <Text style={styles.infoDescription}>{arInfo.description}</Text>
                      
                      <View style={styles.factsContainer}>
                        <Text style={styles.factsTitle}>Historical Facts:</Text>
                        {arInfo.historicalFacts.map((fact: string, index: number) => (
                          <Text key={index} style={styles.factItem}>
                            • {fact}
                          </Text>
                        ))}
                      </View>
                    </Card.Content>
                  </Card>
                </Animated.View>
              )}
            </View>
          )}

          {/* Controls */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.controls}>
            {!isARActive ? (
              <Button
                mode="contained"
                onPress={startARExperience}
                style={styles.startButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                icon="camera"
              >
                Start AR Experience
              </Button>
            ) : (
              <View style={styles.activeControls}>
                <Button
                  mode="outlined"
                  onPress={stopARExperience}
                  style={styles.stopButton}
                  labelStyle={styles.stopButtonLabel}
                  icon="stop"
                >
                  Stop AR
                </Button>
                
                <IconButton
                  icon="camera"
                  iconColor={colors.primary}
                  size={32}
                  onPress={() => {}}
                  style={styles.captureButton}
                />
                
                <IconButton
                  icon="volume-high"
                  iconColor={colors.primary}
                  size={24}
                  onPress={() => {}}
                  style={styles.audioButton}
                />
              </View>
            )}
          </Animated.View>

          {/* Instructions */}
          {!isARActive && (
            <Animated.View entering={FadeInDown.delay(600)} style={styles.instructions}>
              <Card style={styles.instructionsCard}>
                <Card.Content style={styles.instructionsContent}>
                  <Text style={styles.instructionsTitle}>How to use AR:</Text>
                  <Text style={styles.instructionsText}>
                    1. Point your camera at historical sites{'\n'}
                    2. Wait for the app to detect the location{'\n'}
                    3. Explore interactive information overlays{'\n'}
                    4. Listen to audio narrations
                  </Text>
                </Card.Content>
              </Card>
            </Animated.View>
          )}
        </CameraView>
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
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  backButton: {
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  backIconButton: {
    backgroundColor: colors.background + '80',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
  },
  infoButton: {
    backgroundColor: colors.background + '80',
  },
  arOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  arIndicator: {
    alignItems: 'center',
    marginTop: height * 0.2,
  },
  scanningFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  scanningText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    textAlign: 'center',
    backgroundColor: colors.background + '80',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  arInfoPanel: {
    position: 'absolute',
    bottom: 120,
    left: spacing.md,
    right: spacing.md,
  },
  infoCard: {
    backgroundColor: colors.surface + 'E6',
    borderRadius: 16,
  },
  infoContent: {
    padding: spacing.md,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  infoDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  factsContainer: {
    marginTop: spacing.sm,
  },
  factsTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  factItem: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  controls: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
  },
  startButton: {
    backgroundColor: colors.primary,
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
  activeControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stopButton: {
    borderColor: colors.primary,
    borderRadius: 25,
    flex: 1,
    marginRight: spacing.md,
  },
  stopButtonLabel: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  captureButton: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.sm,
  },
  audioButton: {
    backgroundColor: colors.surface,
  },
  instructions: {
    position: 'absolute',
    bottom: 140,
    left: spacing.md,
    right: spacing.md,
  },
  instructionsCard: {
    backgroundColor: colors.surface + 'E6',
    borderRadius: 16,
  },
  instructionsContent: {
    padding: spacing.md,
  },
  instructionsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  instructionsText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    lineHeight: 20,
  },
});