import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Alert, Platform, ScrollView } from 'react-native';
import { Text, Button, IconButton, Card } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, CameraView } from 'expo-camera';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';

import { colors, spacing } from '../src/theme/theme';

const { width, height } = Dimensions.get('window');

const AR_URL='https://lalibela-mock-ar-by-dan.netlify.app'

export default function ARScreen() {
  const [isARActive, setIsARActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'This app needs camera access to provide AR experiences. Please enable camera permissions in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {} },
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setHasPermission(false);
    }
  };

  const startARExperience = async () => {
    if (!hasPermission) {
      await requestCameraPermission();
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsARActive(true);
      setIsLoading(false);
    }, 1500);
  };

  const stopARExperience = () => {
    setIsARActive(false);
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('AR WebView message:', data);
      
      switch (data.type) {
        case 'markerFound':
          break;
        case 'markerLost':
          break;
        case 'elementClicked':
          Alert.alert('AR Info', data.message);
          break;
        case 'error':
          Alert.alert('AR Error', data.message);
          break;
        case 'arReady':
          console.log('AR experience ready');
          break;
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
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
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          AR experiences require camera access to work properly.
        </Text>
        <Button
          mode="contained"
          onPress={requestCameraPermission}
          style={styles.permissionButton}
        >
          Grant Permission
        </Button>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.backToHomeButton}
        >
          Back to Home
        </Button>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.loadingContent}>
          <Text style={styles.loadingIcon}>📱</Text>
          <Text style={styles.loadingTitle}>Initializing AR</Text>
          <Text style={styles.loadingText}>Setting up camera and AR engine...</Text>
        </Animated.View>
      </View>
    );
  }

  if (isARActive) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
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
              icon="camera-flip"
              iconColor={colors.text}
              size={24}
              onPress={() => webViewRef.current?.reload()}
              style={styles.cameraButton}
            />
          </Animated.View>

          <WebView
            ref={webViewRef}
            source={{ uri:AR_URL}}
            style={styles.webView}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
            domStorageEnabled
            allowsFullscreenVideo
            mixedContentMode="compatibility"
            onMessage={handleWebViewMessage}
            onError={(error) => {
              console.error('WebView error:', error);
              Alert.alert('AR Error', 'Failed to load AR experience. Please try again.');
            }}
            onLoadStart={() => console.log('WebView loading started')}
            onLoadEnd={() => console.log('WebView loading finished')}
          />

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
                icon="information-outline"
                iconColor={colors.primary}
                size={28}
                onPress={() => Alert.alert(
                  'AR Instructions',
                  '• Point camera at flat surfaces\n• Look for the Hiro marker\n• Tap golden spheres for info\n• Move device slowly for best tracking'
                )}
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
            onPress={() => Alert.alert(
              'About AR',
              'Experience Ethiopian heritage sites through cutting-edge Augmented Reality technology powered by WebAR.js and A-Frame.'
            )}
            style={styles.infoButton}
          />
        </Animated.View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
                  <Text style={styles.featureTitle}>Surface Tracking</Text>
                  <Text style={styles.featureDescription}>
                    Point at surfaces or use Hiro markers for AR activation
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(800)} style={styles.startSection}>
            <Button
              mode="contained"
              onPress={startARExperience}
              style={styles.startButton}
              contentStyle={styles.startButtonContent}
              labelStyle={styles.startButtonLabel}
              icon="camera"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Initializing...' : 'Start AR Experience'}
            </Button>
            
            <Text style={styles.startNote}>
              Make sure you have good lighting and camera permissions enabled. Point your camera at flat surfaces or use a Hiro marker for best results.
            </Text>
          </Animated.View>
        </ScrollView>
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
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  permissionTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    marginBottom: spacing.md,
  },
  backToHomeButton: {
    borderColor: colors.primary,
    borderRadius: 25,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  loadingTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
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
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
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
  arHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
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
    borderTopWidth: 1,
    borderTopColor: colors.surface,
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