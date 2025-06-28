import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, List, Avatar, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';

import { colors, spacing } from '../../src/theme/theme';
import { useAuthStore } from '../../src/store/authStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const profileStats = [
    { label: 'Experiences', value: '12' },
    { label: 'Countries', value: '1' },
    { label: 'Reviews', value: '8' },
  ];

  const menuItems = [
    {
      title: 'Edit Profile',
      icon: 'account-edit',
      onPress: () => {},
    },
    {
      title: 'Language Settings',
      icon: 'translate',
      onPress: () => router.push('/(auth)/language'),
    },
    {
      title: 'Notifications',
      icon: 'bell-outline',
      onPress: () => {},
    },
    {
      title: 'Privacy & Security',
      icon: 'shield-account',
      onPress: () => {},
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => {},
    },
    {
      title: 'About',
      icon: 'information-outline',
      onPress: () => {},
    },
  ];

  return (
    <LinearGradient
      colors={[colors.background, colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <Animated.View entering={FadeInDown.delay(200)}>
            <Card style={styles.profileCard}>
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.profileGradient}
              >
                <Avatar.Text
                  size={80}
                  label={user?.name?.charAt(0) || 'U'}
                  style={styles.avatar}
                  labelStyle={styles.avatarLabel}
                />
                <Text style={styles.userName}>{user?.name || 'User'}</Text>
                <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
                
                <View style={styles.statsContainer}>
                  {profileStats.map((stat, index) => (
                    <View key={stat.label} style={styles.statItem}>
                      <Text style={styles.statValue}>{stat.value}</Text>
                      <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>
            </Card>
          </Animated.View>

          {/* Interests */}
          {user?.interests && user.interests.length > 0 && (
            <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
              <Text style={styles.sectionTitle}>Your Interests</Text>
              <Card style={styles.interestsCard}>
                <Card.Content style={styles.interestsContent}>
                  <View style={styles.interestsContainer}>
                    {user.interests.map((interest) => (
                      <View key={interest} style={styles.interestChip}>
                        <Text style={styles.interestText}>{interest}</Text>
                      </View>
                    ))}
                  </View>
                </Card.Content>
              </Card>
            </Animated.View>
          )}

          {/* Menu Items */}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <Card style={styles.menuCard}>
              {menuItems.map((item, index) => (
                <View key={item.title}>
                  <List.Item
                    title={item.title}
                    left={(props) => (
                      <List.Icon {...props} icon={item.icon} color={colors.primary} />
                    )}
                    right={(props) => (
                      <List.Icon {...props} icon="chevron-right" color={colors.textSecondary} />
                    )}
                    onPress={item.onPress}
                    titleStyle={styles.menuItemTitle}
                    style={styles.menuItem}
                  />
                  {index < menuItems.length - 1 && <Divider style={styles.divider} />}
                </View>
              ))}
            </Card>
          </Animated.View>

          {/* Logout Button */}
          <Animated.View entering={FadeInDown.delay(800)} style={styles.logoutSection}>
            <Button
              mode="outlined"
              onPress={handleLogout}
              style={styles.logoutButton}
              labelStyle={styles.logoutButtonLabel}
              icon="logout"
            >
              Logout
            </Button>
          </Animated.View>

          {/* App Version */}
          <Animated.View entering={FadeInDown.delay(1000)} style={styles.versionSection}>
            <Text style={styles.versionText}>Venture World v1.0.0</Text>
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
  scrollView: {
    flex: 1,
  },
  profileCard: {
    margin: spacing.lg,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileGradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: colors.background,
    marginBottom: spacing.md,
  },
  avatarLabel: {
    color: colors.primary,
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: colors.onPrimary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.onPrimary,
    opacity: 0.8,
    marginBottom: spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: colors.onPrimary,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.onPrimary,
    opacity: 0.8,
  },
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  interestsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  interestsContent: {
    padding: spacing.md,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  interestChip: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  interestText: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    paddingVertical: spacing.sm,
  },
  menuItemTitle: {
    color: colors.text,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  divider: {
    backgroundColor: colors.surfaceVariant,
    marginHorizontal: spacing.md,
  },
  logoutSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  logoutButton: {
    borderColor: colors.error,
    borderRadius: 25,
  },
  logoutButtonLabel: {
    color: colors.error,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  versionSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
});