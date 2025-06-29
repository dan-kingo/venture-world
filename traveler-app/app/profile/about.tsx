import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Text, Card, IconButton, List, Divider, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';

import { colors, spacing } from '../../src/theme/theme';

const appInfo = {
  version: '1.0.0',
  buildNumber: '100',
  releaseDate: 'January 2025',
  developer: 'Venture World Team',
  website: 'https://ventureworld.com',
  email: 'info@ventureworld.com',
};

const teamMembers = [
  { name: 'Development Team', role: 'App Development & Design' },
  { name: 'Content Team', role: 'Experience Curation' },
  { name: 'Support Team', role: 'Customer Support' },
];

const technologies = [
  'React Native',
  'Expo',
  'TypeScript',
  'Node.js',
  'MongoDB',
  'Firebase',
  'WebAR.js',
  'A-Frame VR',
];

const socialLinks = [
  {
    name: 'Website',
    icon: 'web',
    url: 'https://ventureworld.com',
  },
  {
    name: 'Facebook',
    icon: 'facebook',
    url: 'https://facebook.com/ventureworld',
  },
  {
    name: 'Twitter',
    icon: 'twitter',
    url: 'https://twitter.com/ventureworld',
  },
  {
    name: 'Instagram',
    icon: 'instagram',
    url: 'https://instagram.com/ventureworld',
  },
];

export default function AboutScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

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
          <Text style={styles.headerTitle}>About</Text>
          <View style={styles.placeholder} />
        </Animated.View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* App Logo & Info */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <Card style={styles.logoCard}>
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.logoGradient}
              >
                <Text style={styles.logoIcon}>🌍</Text>
                <Text style={styles.appName}>Venture World</Text>
                <Text style={styles.appTagline}>
                  Discover Ethiopia through AR & VR
                </Text>
                <Text style={styles.appVersion}>
                  Version {appInfo.version} ({appInfo.buildNumber})
                </Text>
              </LinearGradient>
            </Card>
          </Animated.View>

          {/* App Description */}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>About Venture World</Text>
                <Text style={styles.description}>
                  Venture World is an innovative travel app that brings Ethiopian heritage sites to life through cutting-edge Augmented Reality (AR) and Virtual Reality (VR) technologies. 
                  {'\n\n'}
                  Our mission is to make Ethiopia's rich cultural heritage accessible to travelers worldwide, offering immersive experiences that blend traditional tourism with modern technology.
                  {'\n\n'}
                  Whether you're exploring ancient rock-hewn churches, trekking through stunning landscapes, or learning about local traditions, Venture World provides unique, educational, and unforgettable experiences.
                </Text>
              </Card.Content>
            </Card>
          </Animated.View>

          {/* App Information */}
          <Animated.View entering={FadeInDown.delay(800)} style={styles.section}>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>App Information</Text>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Version:</Text>
                  <Text style={styles.infoValue}>{appInfo.version}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Build Number:</Text>
                  <Text style={styles.infoValue}>{appInfo.buildNumber}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Release Date:</Text>
                  <Text style={styles.infoValue}>{appInfo.releaseDate}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Developer:</Text>
                  <Text style={styles.infoValue}>{appInfo.developer}</Text>
                </View>
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Technologies Used */}
          <Animated.View entering={FadeInDown.delay(1000)} style={styles.section}>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Built With</Text>
                <Text style={styles.technologiesDescription}>
                  This app is built using modern technologies to ensure the best performance and user experience:
                </Text>
                
                <View style={styles.technologiesContainer}>
                  {technologies.map((tech, index) => (
                    <View key={tech} style={styles.technologyChip}>
                      <Text style={styles.technologyText}>{tech}</Text>
                    </View>
                  ))}
                </View>
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Team */}
          <Animated.View entering={FadeInDown.delay(1200)} style={styles.section}>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Our Team</Text>
                
                {teamMembers.map((member, index) => (
                  <View key={member.name}>
                    <View style={styles.teamMember}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberRole}>{member.role}</Text>
                    </View>
                    {index < teamMembers.length - 1 && <Divider style={styles.divider} />}
                  </View>
                ))}
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Contact & Social */}
          <Animated.View entering={FadeInDown.delay(1400)} style={styles.section}>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Connect With Us</Text>
                
                <List.Item
                  title="Website"
                  description={appInfo.website}
                  left={(props) => <List.Icon {...props} icon="web" color={colors.primary} />}
                  right={(props) => <List.Icon {...props} icon="open-in-new" color={colors.textSecondary} />}
                  onPress={() => openLink(appInfo.website)}
                  titleStyle={styles.listItemTitle}
                  descriptionStyle={styles.listItemDescription}
                  style={styles.listItem}
                />
                
                <Divider style={styles.divider} />
                
                <List.Item
                  title="Email"
                  description={appInfo.email}
                  left={(props) => <List.Icon {...props} icon="email" color={colors.primary} />}
                  right={(props) => <List.Icon {...props} icon="open-in-new" color={colors.textSecondary} />}
                  onPress={() => openLink(`mailto:${appInfo.email}`)}
                  titleStyle={styles.listItemTitle}
                  descriptionStyle={styles.listItemDescription}
                  style={styles.listItem}
                />
                
                <Divider style={styles.divider} />
                
                <Text style={styles.socialTitle}>Follow Us</Text>
                <View style={styles.socialContainer}>
                  {socialLinks.map((social) => (
                    <Button
                      key={social.name}
                      mode="outlined"
                      onPress={() => openLink(social.url)}
                      style={styles.socialButton}
                      labelStyle={styles.socialButtonLabel}
                      icon={social.icon}
                    >
                      {social.name}
                    </Button>
                  ))}
                </View>
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Legal */}
          <Animated.View entering={FadeInDown.delay(1600)} style={styles.section}>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Legal</Text>
                
                <List.Item
                  title="Privacy Policy"
                  description="Read our privacy policy"
                  left={(props) => <List.Icon {...props} icon="shield-account" color={colors.primary} />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" color={colors.textSecondary} />}
                  onPress={() => openLink(`${appInfo.website}/privacy`)}
                  titleStyle={styles.listItemTitle}
                  descriptionStyle={styles.listItemDescription}
                  style={styles.listItem}
                />
                
                <Divider style={styles.divider} />
                
                <List.Item
                  title="Terms of Service"
                  description="Read our terms of service"
                  left={(props) => <List.Icon {...props} icon="file-document" color={colors.primary} />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" color={colors.textSecondary} />}
                  onPress={() => openLink(`${appInfo.website}/terms`)}
                  titleStyle={styles.listItemTitle}
                  descriptionStyle={styles.listItemDescription}
                  style={styles.listItem}
                />
                
                <Divider style={styles.divider} />
                
                <List.Item
                  title="Licenses"
                  description="View open source licenses"
                  left={(props) => <List.Icon {...props} icon="license" color={colors.primary} />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" color={colors.textSecondary} />}
                  onPress={() => openLink(`${appInfo.website}/licenses`)}
                  titleStyle={styles.listItemTitle}
                  descriptionStyle={styles.listItemDescription}
                  style={styles.listItem}
                />
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Copyright */}
          <Animated.View entering={FadeInDown.delay(1800)} style={styles.copyrightSection}>
            <Text style={styles.copyrightText}>
              © 2025 Venture World. All rights reserved.
            </Text>
            <Text style={styles.copyrightSubtext}>
              Made with ❤️ for Ethiopian tourism
            </Text>
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
  logoCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  logoGradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  appName: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: colors.onPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  appTagline: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.onPrimary,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: spacing.sm,
  },
  appVersion: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.onPrimary,
    textAlign: 'center',
    opacity: 0.8,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  sectionContent: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
  },
  technologiesDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  technologiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  technologyChip: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginBottom: spacing.xs,
  },
  technologyText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: colors.primary,
  },
  teamMember: {
    paddingVertical: spacing.sm,
  },
  memberName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  memberRole: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
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
  socialTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  socialContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  socialButton: {
    borderColor: colors.primary,
    borderRadius: 20,
    marginBottom: spacing.xs,
  },
  socialButtonLabel: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  copyrightSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.xl,
  },
  copyrightText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  copyrightSubtext: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});