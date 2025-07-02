import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Button, IconButton, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';

import { colors, spacing } from '../../src/theme/theme';
import { Experience, useExperienceStore } from '../../src/store/experienceStore';

const { width } = Dimensions.get('window');

// Mock experience data - in real app, fetch based on ID

export default function ExperienceDetailScreen() {

  const { id } = useLocalSearchParams();
  console.log(id, 'Experience ID from params');
  const { fetchExperienceById,experiences } = useExperienceStore();
   const [experience, setExperience] = useState<Experience | null>(null);

  useEffect(() => {
    // First check if we already have it in store
    const existing = experiences.find(exp => exp._id === id);
    if (existing) {
      setExperience(existing);
      return;
    }
    
    // Otherwise fetch it
    fetchExperienceById(id as string)
      .then(setExperience)
      .catch(console.error);
  }, [id, fetchExperienceById, experiences]);
  
  // Find the experience by ID
 
  // If experience not found or still loading, show nothing (you might want to add loading/error states)
  if (!experience) {
    return null;
  }

  const features = [
    { icon: '📱', title: 'AR Experience', description: 'Augmented reality features' },
    { icon: '🎧', title: 'Audio Guide', description: 'Professional narration' },
    { icon: '📸', title: 'Photo Spots', description: 'Best photography locations' },
    { icon: '🗺️', title: 'Interactive Map', description: 'Detailed route guidance' },
  ];

  const reviews = [
    {
      id: '1',
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Amazing experience! The AR features were incredible.',
      date: '2 days ago',
    },
    {
      id: '2',
      name: 'Michael Chen',
      rating: 4,
      comment: 'Great tour guide and beautiful locations. Highly recommended!',
      date: '1 week ago',
    },
    {
      id: '3',
      name: 'Emma Wilson',
      rating: 5,
      comment: 'Perfect blend of technology and culture. Loved every moment.',
      date: '2 weeks ago',
    },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header with Image */}
        <View style={styles.imageContainer}>
          <Card.Cover source={{ uri: experience.image }} style={styles.heroImage} />
          
          {/* Header Controls */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.headerControls}>
            <IconButton
              icon="arrow-left"
              iconColor={colors.text}
              size={24}
              onPress={() => router.back()}
              style={styles.backButton}
            />
            <View style={styles.headerActions}>
              <IconButton
                icon="heart-outline"
                iconColor={colors.text}
                size={24}
                onPress={() => {}}
                style={styles.actionButton}
              />
              <IconButton
                icon="share-variant"
                iconColor={colors.text}
                size={24}
                onPress={() => {}}
                style={styles.actionButton}
              />
            </View>
          </Animated.View>

          {/* Category Badge */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.categoryBadge}>
            <Chip style={styles.categoryChip} textStyle={styles.categoryText}>
              {experience.category}
            </Chip>
          </Animated.View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title and Basic Info */}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.titleSection}>
            <Text style={styles.title}>{experience.title}</Text>
            <View style={styles.basicInfo}>
              <Text style={styles.provider}>by {experience.provider?.name || 'Local Guide'}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>⭐ {experience.rating || '4.8'}</Text>
                <Text style={styles.duration}>🕐 {experience.duration || '2 hours'}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Price and Book Button */}
          <Animated.View entering={FadeInDown.delay(800)} style={styles.priceSection}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price per person</Text>
              <Text style={styles.price}>${experience.price || '25'}</Text>
            </View>
            <Button
              mode="contained"
              onPress={() => router.push(`/booking?experience=${experience._id}`)}
              style={styles.bookButton}
              labelStyle={styles.bookButtonLabel}
            >
              Book Now
            </Button>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInDown.delay(1000)} style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About This Experience</Text>
            <Text style={styles.description}>
              {experience.description || 'This immersive experience combines technology with local culture to create unforgettable memories.'}
            </Text>
          </Animated.View>

          {/* Features */}
          <Animated.View entering={FadeInDown.delay(1200)} style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>What's Included</Text>
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <Animated.View
                  key={feature.title}
                  entering={FadeInDown.delay(1400 + index * 100)}
                  style={styles.featureCard}
                >
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Location */}
          <Animated.View entering={FadeInDown.delay(1600)} style={styles.locationSection}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Card style={styles.locationCard}>
              <Card.Content style={styles.locationContent}>
                <Text style={styles.locationName}>📍 {experience.location || 'Central Meeting Point'}</Text>
                <Text style={styles.locationDescription}>
                  Meeting point and detailed directions will be provided after booking.
                </Text>
                <Button
                  mode="outlined"
                  onPress={() => {}}
                  style={styles.mapButton}
                  labelStyle={styles.mapButtonLabel}
                  icon="map"
                >
                  View on Map
                </Button>
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Reviews */}
          <Animated.View entering={FadeInDown.delay(1800)} style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <Button
                mode="text"
                onPress={() => {}}
                labelStyle={styles.seeAllButton}
              >
                See All
              </Button>
            </View>
            
            {reviews.slice(0, 2).map((review, index) => (
              <Animated.View
                key={review.id}
                entering={FadeInDown.delay(2000 + index * 100)}
              >
                <Card style={styles.reviewCard}>
                  <Card.Content style={styles.reviewContent}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewerName}>{review.name}</Text>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                    <View style={styles.reviewRating}>
                      {[...Array(review.rating)].map((_, i) => (
                        <Text key={i} style={styles.star}>⭐</Text>
                      ))}
                    </View>
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  </Card.Content>
                </Card>
              </Animated.View>
            ))}
          </Animated.View>

          {/* Bottom Booking Section */}
          <Animated.View entering={FadeInDown.delay(2200)} style={styles.bottomBookingSection}>
            <Card style={styles.bottomBookingCard}>
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.bottomBookingGradient}
              >
                <Text style={styles.bottomBookingTitle}>Ready for Adventure?</Text>
                <Text style={styles.bottomBookingDescription}>
                  Book now and create unforgettable memories
                </Text>
                <Button
                  mode="contained"
                  onPress={() => router.push(`/booking?experience=${experience._id}`)}
                  style={styles.bottomBookButton}
                  labelStyle={styles.bottomBookButtonLabel}
                >
                  Book Experience - ${experience.price || '25'}
                </Button>
              </LinearGradient>
            </Card>
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
  imageContainer: {
    position: 'relative',
  },
  heroImage: {
    height: 300,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerControls: {
    position: 'absolute',
    top: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  backButton: {
    backgroundColor: colors.background + '80',
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    backgroundColor: colors.background + '80',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
  },
  categoryChip: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    color: colors.onPrimary,
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
  titleSection: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  basicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  provider: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  duration: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    marginLeft: spacing.md,
  },
  bookButtonLabel: {
    color: colors.onPrimary,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  descriptionSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    lineHeight: 24,
  },
  featuresSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  featureCard: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  featureTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  locationSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  locationCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  locationContent: {
    padding: spacing.md,
  },
  locationName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  locationDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  mapButton: {
    borderColor: colors.primary,
    borderRadius: 20,
  },
  mapButtonLabel: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  reviewsSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  seeAllButton: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  reviewCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    borderRadius: 12,
  },
  reviewContent: {
    padding: spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  reviewerName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  star: {
    fontSize: 12,
  },
  reviewComment: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  bottomBookingSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  bottomBookingCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  bottomBookingGradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  bottomBookingTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: colors.onPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  bottomBookingDescription: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.onPrimary,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: spacing.lg,
  },
  bottomBookButton: {
    backgroundColor: colors.background,
    borderRadius: 25,
  },
  bottomBookButtonLabel: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});