import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Switch, IconButton, Button, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';

import { colors, spacing } from '../../src/theme/theme';

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  bookingUpdates: boolean;
  promotionalOffers: boolean;
  experienceRecommendations: boolean;
  securityAlerts: boolean;
  weeklyDigest: boolean;
  inAppSounds: boolean;
  vibration: boolean;
}

export default function NotificationsScreen() {
  const [settings, setSettings] = useState<NotificationSettings>({
    pushNotifications: true,
    emailNotifications: true,
    bookingUpdates: true,
    promotionalOffers: false,
    experienceRecommendations: true,
    securityAlerts: true,
    weeklyDigest: false,
    inAppSounds: true,
    vibration: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Settings Saved',
        'Your notification preferences have been updated successfully.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const NotificationItem = ({ 
    title, 
    description, 
    value, 
    onValueChange, 
    icon 
  }: {
    title: string;
    description: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    icon: string;
  }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationInfo}>
        <Text style={styles.notificationIcon}>{icon}</Text>
        <View style={styles.notificationText}>
          <Text style={styles.notificationTitle}>{title}</Text>
          <Text style={styles.notificationDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        color={colors.primary}
      />
    </View>
  );

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
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.placeholder} />
        </Animated.View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* General Notifications */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>General Notifications</Text>
                
                <NotificationItem
                  title="Push Notifications"
                  description="Receive notifications on your device"
                  value={settings.pushNotifications}
                  onValueChange={(value) => updateSetting('pushNotifications', value)}
                  icon="📱"
                />
                
                <Divider style={styles.divider} />
                
                <NotificationItem
                  title="Email Notifications"
                  description="Receive notifications via email"
                  value={settings.emailNotifications}
                  onValueChange={(value) => updateSetting('emailNotifications', value)}
                  icon="📧"
                />
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Booking & Travel */}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Booking & Travel</Text>
                
                <NotificationItem
                  title="Booking Updates"
                  description="Get notified about booking confirmations and changes"
                  value={settings.bookingUpdates}
                  onValueChange={(value) => updateSetting('bookingUpdates', value)}
                  icon="📅"
                />
                
                <Divider style={styles.divider} />
                
                <NotificationItem
                  title="Experience Recommendations"
                  description="Receive personalized experience suggestions"
                  value={settings.experienceRecommendations}
                  onValueChange={(value) => updateSetting('experienceRecommendations', value)}
                  icon="🎯"
                />
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Marketing & Promotions */}
          <Animated.View entering={FadeInDown.delay(800)} style={styles.section}>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Marketing & Promotions</Text>
                
                <NotificationItem
                  title="Promotional Offers"
                  description="Get notified about special deals and discounts"
                  value={settings.promotionalOffers}
                  onValueChange={(value) => updateSetting('promotionalOffers', value)}
                  icon="🎁"
                />
                
                <Divider style={styles.divider} />
                
                <NotificationItem
                  title="Weekly Digest"
                  description="Receive a weekly summary of new experiences"
                  value={settings.weeklyDigest}
                  onValueChange={(value) => updateSetting('weeklyDigest', value)}
                  icon="📰"
                />
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Security & Account */}
          <Animated.View entering={FadeInDown.delay(1000)} style={styles.section}>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Security & Account</Text>
                
                <NotificationItem
                  title="Security Alerts"
                  description="Important security and account notifications"
                  value={settings.securityAlerts}
                  onValueChange={(value) => updateSetting('securityAlerts', value)}
                  icon="🔒"
                />
              </Card.Content>
            </Card>
          </Animated.View>

          {/* App Behavior */}
          <Animated.View entering={FadeInDown.delay(1200)} style={styles.section}>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>App Behavior</Text>
                
                <NotificationItem
                  title="In-App Sounds"
                  description="Play sounds for in-app notifications"
                  value={settings.inAppSounds}
                  onValueChange={(value) => updateSetting('inAppSounds', value)}
                  icon="🔊"
                />
                
                <Divider style={styles.divider} />
                
                <NotificationItem
                  title="Vibration"
                  description="Vibrate for notifications"
                  value={settings.vibration}
                  onValueChange={(value) => updateSetting('vibration', value)}
                  icon="📳"
                />
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Save Button */}
          <Animated.View entering={FadeInDown.delay(1400)} style={styles.saveSection}>
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
              contentStyle={styles.saveButtonContent}
              labelStyle={styles.saveButtonLabel}
              loading={isLoading}
              disabled={isLoading}
            >
              Save Preferences
            </Button>
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
  },
  backButton: {
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  sectionContent: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  notificationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  notificationIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  notificationDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    lineHeight: 16,
  },
  divider: {
    backgroundColor: colors.surfaceVariant,
    marginVertical: spacing.sm,
  },
  saveSection: {
    marginBottom: spacing.xl,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
  },
  saveButtonContent: {
    paddingVertical: spacing.sm,
  },
  saveButtonLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: colors.onPrimary,
  },
});