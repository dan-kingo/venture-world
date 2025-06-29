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

const AR_HTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>WebAR Experience</title>
    <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/aframe/build/aframe-ar.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #000;
            color: #fff;
            overflow: hidden;
            position: fixed;
            width: 100%;
            height: 100%;
        }
        
        #arContainer {
            position: relative;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
        }
        
        #loadingScreen {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 3000;
            transition: opacity 0.5s ease;
        }
        
        .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(0,0,0,0.1);
            border-left: 4px solid #000;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .progress-bar {
            width: 250px;
            height: 6px;
            background: rgba(0,0,0,0.2);
            border-radius: 3px;
            overflow: hidden;
            margin-top: 20px;
        }
        
        .progress-fill {
            height: 100%;
            background: #000;
            width: 0%;
            transition: width 0.3s ease;
        }
        
        #arInfo {
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 12px;
            border-radius: 8px;
            z-index: 2000;
            text-align: center;
            font-size: 14px;
            line-height: 1.4;
            opacity: 1;
            transition: opacity 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        #arInstructions {
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
            background: rgba(255, 215, 0, 0.95);
            color: #000;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
            z-index: 2000;
            font-size: 13px;
            line-height: 1.3;
            opacity: 1;
            transition: opacity 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .hidden {
            opacity: 0 !important;
            pointer-events: none;
        }
        
        a-scene {
            width: 100% !important;
            height: 100% !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
        }
        
        #errorScreen {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #FF6B6B, #FF8E53);
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 4000;
            text-align: center;
            padding: 20px;
        }
        
        .error-icon {
            font-size: 64px;
            margin-bottom: 20px;
        }
        
        .retry-button {
            background: #fff;
            color: #FF6B6B;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
            transition: all 0.3s ease;
        }
        
        .retry-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <div id="arContainer">
        <div id="loadingScreen">
            <div class="spinner"></div>
            <h2 style="color: #000; margin: 0 0 10px 0; font-size: 24px;">Loading AR Experience</h2>
            <p style="color: #000; margin: 0 0 15px 0; font-size: 16px;">Initializing camera and AR engine...</p>
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill"></div>
            </div>
        </div>
        
        <div id="errorScreen">
            <div class="error-icon">⚠️</div>
            <h2 style="color: #fff; margin: 0 0 10px 0;">AR Initialization Failed</h2>
            <p style="color: #fff; margin: 0 0 20px 0; line-height: 1.5;">
                Unable to start AR experience. This could be due to:<br>
                • Camera permissions not granted<br>
                • Device not supporting WebAR<br>
                • Network connectivity issues
            </p>
            <button class="retry-button" onclick="retryAR()">Try Again</button>
        </div>
        
        <div id="arInfo">
            <strong>🏛️ Lalibela Rock Churches AR</strong><br>
            Point your camera at a flat surface to place the 3D model
        </div>
        
        <div id="arInstructions">
            📱 Move device slowly • 🎯 Tap golden spheres for info • 👆 Touch to show/hide controls
        </div>
        
        <a-scene
            embedded
            arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3; trackingMethod: best; sourceWidth:1280; sourceHeight:960; displayWidth: 1280; displayHeight: 960;"
            vr-mode-ui="enabled: false"
            renderer="logarithmicDepthBuffer: true; colorManagement: true; sortObjects: true; antialias: true; alpha: true;"
            loading-screen="enabled: false"
            device-orientation-permission-ui="enabled: false"
            gesture-detector
            id="arScene">
            
            <a-assets>
                <a-mixin id="church-material" material="color: #8B4513; metalness: 0.3; roughness: 0.7; shader: standard;"></a-mixin>
                <a-mixin id="gold-material" material="color: #FFD700; metalness: 0.8; roughness: 0.2; shader: standard;"></a-mixin>
                <a-mixin id="stone-material" material="color: #A0522D; metalness: 0.1; roughness: 0.9; shader: standard;"></a-mixin>
            </a-assets>
            
            <a-light type="ambient" color="#404040" intensity="0.6"></a-light>
            <a-light type="directional" position="2 4 2" color="#ffffff" intensity="0.8" shadow="cast: true"></a-light>
            
            <a-marker preset="hiro" raycaster="objects: .clickable" emitevents="true" cursor="fuse: false; rayOrigin: mouse;" markerhandler>
                <a-entity id="church-complex" position="0 0 0" scale="0.8 0.8 0.8">
                    <a-box 
                        position="0 0.5 0" 
                        rotation="0 0 0" 
                        scale="1.5 1 2"
                        mixin="church-material"
                        class="clickable"
                        animation="property: rotation; to: 0 360 0; loop: true; dur: 30000; easing: linear;"
                        shadow="cast: true; receive: true">
                    </a-box>
                    
                    <a-box
                        position="0 0.3 1"
                        scale="0.8 0.6 0.2"
                        mixin="stone-material"
                        shadow="cast: true; receive: true">
                    </a-box>
                    
                    <a-cylinder
                        position="0 1.8 0"
                        radius="0.4"
                        height="1.5"
                        mixin="church-material"
                        animation="property: scale; to: 1.1 1.1 1.1; dir: alternate; loop: true; dur: 4000;"
                        shadow="cast: true; receive: true">
                    </a-cylinder>
                    
                    <a-entity position="0 2.8 0">
                        <a-box position="0 0.15 0" scale="0.1 0.4 0.1" mixin="gold-material"></a-box>
                        <a-box position="0 0.05 0" scale="0.4 0.1 0.1" mixin="gold-material"></a-box>
                    </a-entity>
                    
                    <a-box position="1.2 0.3 0" scale="0.8 0.6 1" mixin="stone-material" shadow="cast: true; receive: true"></a-box>
                    <a-box position="-1.2 0.3 0" scale="0.8 0.6 1" mixin="stone-material" shadow="cast: true; receive: true"></a-box>
                    
                    <a-cylinder position="0.8 0.8 0.8" radius="0.1" height="1.6" mixin="gold-material"></a-cylinder>
                    <a-cylinder position="-0.8 0.8 0.8" radius="0.1" height="1.6" mixin="gold-material"></a-cylinder>
                    <a-cylinder position="0.8 0.8 -0.8" radius="0.1" height="1.6" mixin="gold-material"></a-cylinder>
                    <a-cylinder position="-0.8 0.8 -0.8" radius="0.1" height="1.6" mixin="gold-material"></a-cylinder>
                </a-entity>
                
                <a-text 
                    value="Lalibela Rock Churches\\n12th Century UNESCO Site\\nCarved from Volcanic Rock"
                    position="0 3.5 0"
                    align="center"
                    color="#FFD700"
                    scale="1.2 1.2 1.2"
                    animation="property: position; to: 0 4 0; dir: alternate; loop: true; dur: 4000; easing: easeInOutSine;">
                </a-text>
                
                <a-sphere
                    position="2 1 1"
                    radius="0.15"
                    mixin="gold-material"
                    class="clickable"
                    animation="property: rotation; to: 360 360 360; loop: true; dur: 8000"
                    click-handler>
                </a-sphere>
                <a-sphere
                    position="-2 1 1"
                    radius="0.15"
                    mixin="gold-material"
                    class="clickable"
                    animation="property: rotation; to: -360 -360 -360; loop: true; dur: 8000"
                    click-handler>
                </a-sphere>
            </a-marker>
            
            <a-entity camera look-controls wasd-controls="enabled: false" cursor="rayOrigin: mouse"></a-entity>
        </a-scene>
    </div>
    
    <script>
        let loadingProgress = 0;
        let isLoaded = false;
        let arScene;
        let hideTimeout;
        
        function updateProgress() {
            if (loadingProgress < 100 && !isLoaded) {
                loadingProgress += Math.random() * 15;
                if (loadingProgress > 100) loadingProgress = 100;
                
                const progressFill = document.getElementById('progressFill');
                if (progressFill) {
                    progressFill.style.width = loadingProgress + '%';
                }
                
                if (loadingProgress >= 100) {
                    setTimeout(() => {
                        const loadingScreen = document.getElementById('loadingScreen');
                        if (loadingScreen) {
                            loadingScreen.style.opacity = '0';
                            setTimeout(() => {
                                loadingScreen.style.display = 'none';
                                isLoaded = true;
                                startAutoHide();
                                sendMessage('arReady', 'AR experience loaded successfully');
                            }, 500);
                        }
                    }, 1000);
                } else {
                    setTimeout(updateProgress, 200);
                }
            }
        }
        
        function startAutoHide() {
            setTimeout(() => {
                if (isLoaded) {
                    const info = document.getElementById('arInfo');
                    const instructions = document.getElementById('arInstructions');
                    if (info) info.style.opacity = '0.3';
                    if (instructions) instructions.style.opacity = '0.3';
                }
            }, 8000);
        }
        
        function showControls() {
            if (isLoaded) {
                const info = document.getElementById('arInfo');
                const instructions = document.getElementById('arInstructions');
                
                if (info) info.style.opacity = '1';
                if (instructions) instructions.style.opacity = '1';
                
                clearTimeout(hideTimeout);
                hideTimeout = setTimeout(() => {
                    if (info) info.style.opacity = '0.3';
                    if (instructions) instructions.style.opacity = '0.3';
                }, 5000);
            }
        }
        
        function sendMessage(type, message) {
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type, message }));
            }
        }
        
        function showError(message) {
            const loadingScreen = document.getElementById('loadingScreen');
            const errorScreen = document.getElementById('errorScreen');
            
            if (loadingScreen) loadingScreen.style.display = 'none';
            if (errorScreen) errorScreen.style.display = 'flex';
            
            sendMessage('error', message);
        }
        
        function retryAR() {
            const errorScreen = document.getElementById('errorScreen');
            const loadingScreen = document.getElementById('loadingScreen');
            
            if (errorScreen) errorScreen.style.display = 'none';
            if (loadingScreen) {
                loadingScreen.style.display = 'flex';
                loadingScreen.style.opacity = '1';
            }
            
            loadingProgress = 0;
            isLoaded = false;
            updateProgress();
        }
        
        // A-Frame component registration
        AFRAME.registerComponent('markerhandler', {
            init: function() {
                const marker = this.el;
                
                marker.addEventListener('markerFound', function() {
                    console.log('Marker found');
                    const instructions = document.getElementById('arInstructions');
                    if (instructions) {
                        instructions.innerHTML = '✅ AR Site Detected! Explore the 3D model • 🎯 Tap golden spheres';
                        instructions.style.background = 'rgba(76, 175, 80, 0.95)';
                        instructions.style.color = '#fff';
                    }
                    sendMessage('markerFound', 'AR marker detected successfully');
                });
                
                marker.addEventListener('markerLost', function() {
                    console.log('Marker lost');
                    const instructions = document.getElementById('arInstructions');
                    if (instructions) {
                        instructions.innerHTML = '📱 Move device slowly • 🎯 Look for flat surfaces • 👆 Touch to show/hide controls';
                        instructions.style.background = 'rgba(255, 215, 0, 0.95)';
                        instructions.style.color = '#000';
                    }
                    sendMessage('markerLost', 'AR marker lost');
                });
            }
        });
        
        AFRAME.registerComponent('click-handler', {
            init: function() {
                this.el.addEventListener('click', function() {
                    const infoTexts = [
                        'This represents the spiritual energy of Lalibela',
                        'Each church was carved from a single piece of rock',
                        'The churches are still used for worship today',
                        'Lalibela is often called the New Jerusalem'
                    ];
                    
                    const randomInfo = infoTexts[Math.floor(Math.random() * infoTexts.length)];
                    
                    const infoDiv = document.getElementById('arInfo');
                    if (infoDiv) {
                        infoDiv.innerHTML = '<strong>🏛️ Lalibela Information</strong><br>' + randomInfo;
                        infoDiv.style.background = 'rgba(255, 215, 0, 0.95)';
                        infoDiv.style.color = '#000';
                        
                        setTimeout(() => {
                            infoDiv.innerHTML = '<strong>🏛️ Lalibela Rock Churches AR</strong><br>Point your camera at a flat surface to place the 3D model';
                            infoDiv.style.background = 'rgba(0, 0, 0, 0.8)';
                            infoDiv.style.color = '#fff';
                        }, 3000);
                    }
                    
                    sendMessage('elementClicked', randomInfo);
                });
            }
        });
        
        // Event listeners
        document.addEventListener('click', showControls);
        document.addEventListener('touchstart', showControls);
        
        // Scene ready handler
        document.addEventListener('DOMContentLoaded', function() {
            arScene = document.querySelector('a-scene');
            
            if (arScene) {
                arScene.addEventListener('loaded', function() {
                    console.log('A-Frame scene loaded');
                    setTimeout(updateProgress, 500);
                });
                
                arScene.addEventListener('renderstart', function() {
                    console.log('A-Frame rendering started');
                });
            } else {
                setTimeout(() => {
                    showError('Failed to initialize AR scene');
                }, 3000);
            }
        });
        
        // Error handling
        window.addEventListener('error', function(e) {
            console.error('AR Error:', e);
            showError('AR initialization error: ' + e.message);
        });
        
        // Orientation change handler
        window.addEventListener('orientationchange', function() {
            setTimeout(() => {
                if (arScene) {
                    arScene.resize();
                }
            }, 500);
        });
        
        // Start loading after a short delay
        setTimeout(() => {
            if (!isLoaded) {
                updateProgress();
            }
        }, 1000);
    </script>
</body>
</html>
`;

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
            source={{ html: AR_HTML }}
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