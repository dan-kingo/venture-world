import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Button, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { router } from 'expo-router';

import { colors, spacing } from '../../src/theme/theme';
import { useAuthStore } from '../../src/store/authStore';
import { useExperienceStore } from '../../src/store/experienceStore';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { featuredExperiences, fetchFeaturedExperiences, isLoading } = useExperienceStore();

  useEffect(() => {
    fetchFeaturedExperiences();
  }, []);

  const quickActions: {
    title: string;
    icon: string;
    description: string;
    onPress: () => void;
    gradient: [string, string];
  }[] = [
    {
      title: 'AR Experience',
      icon: '📱',
      description: 'Explore in AR',
      onPress: () => router.push('/ar'),
      gradient: [colors.primary, colors.secondary],
    },
    {
      title: 'VR Tours',
      icon: '🥽',
      description: 'Virtual Reality',
      onPress: () => router.push('/vr'),
      gradient: [colors.secondary, colors.accent],
    },
    {
      title: 'Smart Itinerary',
      icon: '🗺️',
      description: 'AI Suggestions',
      onPress: () => router.push('/itinerary'),
      gradient: [colors.accent, colors.primary],
    },
  ];

  return (
    <LinearGradient
      colors={[colors.background, colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.greeting}>Welcome back,</Text>
                <Text style={styles.userName}>{user?.name || 'Explorer'}</Text>
              </View>
              <IconButton
                icon="bell-outline"
                iconColor={colors.primary}
                size={24}
                onPress={() => {}}
                style={styles.notificationButton}
              />
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickActionsContainer}
            >
              {quickActions.map((action, index) => (
                <Animated.View
                  key={action.title}
                  entering={FadeInRight.delay(600 + index * 100)}
                >
                  <Card style={styles.quickActionCard} onPress={action.onPress}>
                    <LinearGradient
                      colors={action.gradient}
                      style={styles.quickActionGradient}
                    >
                      <Text style={styles.quickActionIcon}>{action.icon}</Text>
                      <Text style={styles.quickActionTitle}>{action.title}</Text>
                      <Text style={styles.quickActionDescription}>{action.description}</Text>
                    </LinearGradient>
                  </Card>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Featured Experiences */}
          <Animated.View entering={FadeInDown.delay(800)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Experiences</Text>
              <Button
                mode="text"
                onPress={() => router.push('/(tabs)/explore')}
                labelStyle={styles.seeAllButton}
              >
                See All
              </Button>
            </View>

            {featuredExperiences.map((experience, index) => (
              <Animated.View
                key={experience.id}
                entering={FadeInDown.delay(1000 + index * 100)}
              >
                <Card
                  style={styles.experienceCard}
                  onPress={() => router.push(`/experience/${experience.id}`)}
                >
                  <Card.Cover
                    source={{ uri: experience.image }}
                    style={styles.experienceImage}
                  />
                  <Card.Content style={styles.experienceContent}>
                    <Text style={styles.experienceTitle}>{experience.title}</Text>
                    <Text style={styles.experienceDescription} numberOfLines={2}>
                      {experience.description}
                    </Text>
                    <View style={styles.experienceDetails}>
                      <View style={styles.experienceInfo}>
                        <Text style={styles.experiencePrice}>
                          ${experience.price}
                        </Text>
                        <Text style={styles.experienceRating}>
                          ⭐ {experience.rating}
                        </Text>
                      </View>
                      <Text style={styles.experienceCategory}>
                        {experience.category}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              </Animated.View>
            ))}
          </Animated.View>

          {/* Explore More */}
          <Animated.View entering={FadeInDown.delay(1200)} style={styles.exploreSection}>
            <Card style={styles.exploreCard}>
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.exploreGradient}
              >
                <Text style={styles.exploreTitle}>Ready for Adventure?</Text>
                <Text style={styles.exploreDescription}>
                  Discover hidden gems and create unforgettable memories
                </Text>
                <Button
                  mode="contained"
                  onPress={() => router.push('/(tabs)/explore')}
                  style={styles.exploreButton}
                  labelStyle={styles.exploreButtonLabel}
                >
                  Explore Now
                </Button>
              </LinearGradient>
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
  },
  notificationButton: {
    backgroundColor: colors.surface,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
  },
  seeAllButton: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  quickActionsContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  quickActionCard: {
    width: 140,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  quickActionTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: colors.onPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  quickActionDescription: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: colors.onPrimary,
    textAlign: 'center',
    opacity: 0.8,
  },
  experienceCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  experienceImage: {
    height: 200,
  },
  experienceContent: {
    padding: spacing.md,
  },
  experienceTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  experienceDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  experienceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  experienceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  experiencePrice: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
  },
  experienceRating: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  experienceCategory: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.primary,
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  exploreSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  exploreCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  exploreGradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  exploreTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: colors.onPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  exploreDescription: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.onPrimary,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: spacing.lg,
  },
  exploreButton: {
    backgroundColor: colors.background,
    borderRadius: 25,
  },
  exploreButtonLabel: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});