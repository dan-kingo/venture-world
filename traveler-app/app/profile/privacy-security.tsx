import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Switch, IconButton, Button, List, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';

import { colors, spacing } from '../../src/theme/theme';

interface PrivacySettings {
  profileVisibility: boolean;
  locationSharing: boolean;
  activityStatus: boolean;
  dataCollection: boolean;
  marketingEmails: boolean;
  twoFactorAuth: boolean;
}

export default function PrivacySecurityScreen() {
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: true,
    locationSharing: false,
    activityStatus: true,
    dataCollection: true,
    marketingEmails: false,
    twoFactorAuth: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateSetting = (key: keyof PrivacySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Settings Saved',
        'Your privacy and security preferences have been updated successfully.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'This feature will redirect you to a secure password change form.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => {} },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Account Deletion',
              'Please contact support to proceed with account deletion.',
              [{ text: 'OK' }]
            );
          }
        },
      ]
    );
  };

  const handleDownloadData = () => {
    Alert.alert(
      'Download Data',
      'We will prepare your data and send a download link to your email address within 24 hours.',
      [{ text: 'OK' }]
    );
  };

  const PrivacyItem = ({ 
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
    <View style={styles.privacyItem}>
      <View style={styles.privacyInfo}>
        <Text style={styles.privacyIcon}>{icon}</Text>
        <View style={styles.privacyText}>
          <Text style={styles.privacyTitle}>{title}</Text>
          <Text style={styles.privacyDescription}>{description}</Text>
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
          <Text style={styles.headerTitle}>Privacy & Security</Text>
          <View style={styles.placeholder} />
        </Animated.View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Privacy Settings */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Privacy Settings</Text>
                
                <PrivacyItem
                  title="Profile Visibility"
                  description="Allow other users to see your profile"
                  value={settings.profileVisibility}
                  onValueChange={(value) => updateSetting('profileVisibility', value)}
                  icon="👤"
                />
                
                <Divider style={styles.divider} />
                
                <PrivacyItem
                  title="Location Sharing"
                  description="Share your location for better recommendations"
                  value={settings.locationSharing}
                  onValueChange={(value) => updateSetting('locationSharing', value)}
                  icon="📍"
                />
                
                <Divider style={styles.divider} />
                
                <PrivacyItem
                  title="Activity Status"
                  description="Show when you're active on the app"
                  value={settings.activityStatus}
                  onValueChange={(value) => updateSetting('activityStatus', value)}
                  icon="🟢"
                />
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Data & Analytics */}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Data & Analytics</Text>
                
                <PrivacyItem
                  title="Data Collection"
                  description="Allow us to collect usage data to improve the app"
                  value={settings.dataCollection}
                  onValueChange={(value) => updateSetting('dataCollection', value)}
                  icon="📊"
                />
                
                <Divider style={styles.divider} />
                
                <PrivacyItem
                  title="Marketing Communications"
                  description="Receive marketing emails and promotional content"
                  value={settings.marketingEmails}
                  onValueChange={(value) => updateSetting('marketingEmails', value)}
                  icon="📧"
                />
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Security Settings */}
          <Animated.View entering={FadeInDown.delay(800)} style={styles.section}>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Security Settings</Text>
                
                <PrivacyItem
                  title="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                  value={settings.twoFactorAuth}
                  onValueChange={(value) => updateSetting('twoFactorAuth', value)}
                  icon="🔐"
                />
                
                <Divider style={styles.divider} />
                
                <List.Item
                  title="Change Password"
                  description="Update your account password"
                  left={(props) => <List.Icon {...props} icon="lock" color={colors.primary} />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" color={colors.textSecondary} />}
                  onPress={handleChangePassword}
                  titleStyle={styles.listItemTitle}
                  descriptionStyle={styles.listItemDescription}
                  style={styles.listItem}
                />
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Data Management */}
          <Animated.View entering={FadeInDown.delay(1000)} style={styles.section}>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Data Management</Text>
                
                <List.Item
                  title="Download My Data"
                  description="Get a copy of all your data"
                  left={(props) => <List.Icon {...props} icon="download" color={colors.primary} />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" color={colors.textSecondary} />}
                  onPress={handleDownloadData}
                  titleStyle={styles.listItemTitle}
                  descriptionStyle={styles.listItemDescription}
                  style={styles.listItem}
                />
                
                <Divider style={styles.divider} />
                
                <List.Item
                  title="Delete Account"
                  description="Permanently delete your account and all data"
                  left={(props) => <List.Icon {...props} icon="delete" color={colors.error} />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" color={colors.textSecondary} />}
                  onPress={handleDeleteAccount}
                  titleStyle={[styles.listItemTitle, { color: colors.error }]}
                  descriptionStyle={styles.listItemDescription}
                  style={styles.listItem}
                />
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Legal Information */}
          <Animated.View entering={FadeInDown.delay(1200)} style={styles.section}>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Legal Information</Text>
                
                <List.Item
                  title="Privacy Policy"
                  description="Read our privacy policy"
                  left={(props) => <List.Icon {...props} icon="file-document" color={colors.primary} />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" color={colors.textSecondary} />}
                  onPress={() => {}}
                  titleStyle={styles.listItemTitle}
                  descriptionStyle={styles.listItemDescription}
                  style={styles.listItem}
                />
                
                <Divider style={styles.divider} />
                
                <List.Item
                  title="Terms of Service"
                  description="Read our terms of service"
                  left={(props) => <List.Icon {...props} icon="file-document-outline" color={colors.primary} />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" color={colors.textSecondary} />}
                  onPress={() => {}}
                  titleStyle={styles.listItemTitle}
                  descriptionStyle={styles.listItemDescription}
                  style={styles.listItem}
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
              Save Privacy Settings
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
  privacyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  privacyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  privacyIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  privacyText: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  privacyDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    lineHeight: 16,
  },
  listItem: {
    paddingVertical: spacing.xs,
  },
  listItemTitle: {
    color: colors.text,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  listItemDescription: {
    color: colors.textSecondary,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
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