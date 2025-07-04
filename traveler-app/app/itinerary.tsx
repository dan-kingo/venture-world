import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, Card, Button, IconButton, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { router } from 'expo-router';

import { colors, spacing } from '../src/theme/theme';
import { itineraries } from '../src/store/itineraryStore';



const difficultyColors = {
  Easy: colors.success,
  Moderate: colors.warning,
  Challenging: colors.error,
};

export default function ItineraryScreen() {
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null);

  const renderItineraryCard = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100)}>
      <Card
        style={styles.itineraryCard}
        onPress={() => setSelectedItinerary(item)}
      >
        <Card.Cover source={{ uri: item.image }} style={styles.itineraryImage} />
        <Card.Content style={styles.itineraryContent}>
          <View style={styles.itineraryHeader}>
            <Text style={styles.itineraryTitle}>{item.title}</Text>
            <Text style={styles.itineraryPrice}>${item.price}</Text>
          </View>
          
          <Text style={styles.itineraryDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.itineraryDetails}>
            <Text style={styles.itineraryDuration}>🕐 {item.duration}</Text>
            <Chip
              style={[
                styles.difficultyChip,
                { backgroundColor: difficultyColors[item.difficulty as keyof typeof difficultyColors] + '20' }
              ]}
              textStyle={[
                styles.difficultyText,
                { color: difficultyColors[item.difficulty as keyof typeof difficultyColors] }
              ]}
            >
              {item.difficulty}
            </Chip>
          </View>
          
          <View style={styles.tagsContainer}>
            {item.tags.map((tag: string) => (
              <Chip key={tag} style={styles.tagChip} textStyle={styles.tagText}>
                {tag}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>
    </Animated.View>
  );

  const renderPlaceCard = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInRight.delay(index * 100)}>
      <Card style={styles.placeCard}>
        <Card.Cover source={{ uri: item.image }} style={styles.placeImage} />
        <Card.Content style={styles.placeContent}>
          <Text style={styles.placeName}>{item.name}</Text>
          <Text style={styles.placeDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.placeDuration}>⏱️ {item.duration}</Text>
        </Card.Content>
      </Card>
    </Animated.View>
  );

  if (selectedItinerary) {
    return (
      <LinearGradient
        colors={[colors.background, colors.surface]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Detail Header */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.detailHeader}>
            <IconButton
              icon="arrow-left"
              iconColor={colors.primary}
              size={24}
              onPress={() => setSelectedItinerary(null)}
              style={styles.backButton}
            />
            <Text style={styles.detailTitle}>{selectedItinerary.title}</Text>
            <IconButton
              icon="share-variant"
              iconColor={colors.primary}
              size={24}
              onPress={() => {}}
              style={styles.shareButton}
            />
          </Animated.View>

          <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
            {/* Itinerary Overview */}
            <Animated.View entering={FadeInDown.delay(400)}>
              <Card style={styles.overviewCard}>
                <Card.Cover source={{ uri: selectedItinerary.image }} style={styles.overviewImage} />
                <Card.Content style={styles.overviewContent}>
                  <Text style={styles.overviewDescription}>
                    {selectedItinerary.description}
                  </Text>
                  
                  <View style={styles.overviewDetails}>
                    <View style={styles.overviewItem}>
                      <Text style={styles.overviewLabel}>Duration</Text>
                      <Text style={styles.overviewValue}>{selectedItinerary.duration}</Text>
                    </View>
                    <View style={styles.overviewItem}>
                      <Text style={styles.overviewLabel}>Difficulty</Text>
                      <Text style={styles.overviewValue}>{selectedItinerary.difficulty}</Text>
                    </View>
                    <View style={styles.overviewItem}>
                      <Text style={styles.overviewLabel}>Price</Text>
                      <Text style={styles.overviewValue}>${selectedItinerary.price}</Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            </Animated.View>

            {/* Places to Visit */}
            <Animated.View entering={FadeInDown.delay(600)} style={styles.placesSection}>
              <Text style={styles.sectionTitle}>Places to Visit</Text>
              <FlatList
                data={selectedItinerary.places}
                renderItem={renderPlaceCard}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.placesList}
              />
            </Animated.View>

            {/* Book Itinerary */}
            <Animated.View entering={FadeInDown.delay(800)} style={styles.bookingSection}>
              <Card style={styles.bookingCard}>
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  style={styles.bookingGradient}
                >
                  <Text style={styles.bookingTitle}>Ready to Explore?</Text>
                  <Text style={styles.bookingDescription}>
                    Book this itinerary and start your Ethiopian adventure
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => router.push(`/booking?itinerary=${selectedItinerary.id}`)}
                    style={styles.bookButton}
                    labelStyle={styles.bookButtonLabel}
                  >
                    Book Now - ${selectedItinerary.price}
                  </Button>
                </LinearGradient>
              </Card>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.background, colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <IconButton
            icon="arrow-left"
            iconColor={colors.primary}
            size={24}
            onPress={() => router.back()}
            style={styles.headerBackButton}
          />
          <Text style={styles.headerTitle}>Smart Itineraries</Text>
          <IconButton
            icon="filter-variant"
            iconColor={colors.primary}
            size={24}
            onPress={() => {}}
            style={styles.filterButton}
          />
        </Animated.View>

        {/* Introduction */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.introSection}>
          <Card style={styles.introCard}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.introGradient}
            >
              <Text style={styles.introIcon}>🗺️</Text>
              <Text style={styles.introTitle}>AI-Powered Itineraries</Text>
              <Text style={styles.introDescription}>
                Discover curated travel plans designed specifically for Ethiopian adventures
              </Text>
            </LinearGradient>
          </Card>
        </Animated.View>

        {/* Itineraries List */}
        <FlatList
          data={itineraries}
          renderItem={renderItineraryCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.itinerariesList}
          showsVerticalScrollIndicator={false}
        />
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
  headerBackButton: {
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
  },
  filterButton: {
    backgroundColor: colors.surface,
  },
  introSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  introCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  introGradient: {
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
    color: colors.onPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  introDescription: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.onPrimary,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  itinerariesList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  itineraryCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
  },
  itineraryImage: {
    height: 200,
  },
  itineraryContent: {
    padding: spacing.md,
  },
  itineraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  itineraryTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  itineraryPrice: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
  },
  itineraryDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  itineraryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  itineraryDuration: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  difficultyChip: {
    borderRadius: 16,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tagChip: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  // Detail View Styles
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  backButton: {
    backgroundColor: colors.surface,
  },
  detailTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
    flex: 1,
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: colors.surface,
  },
  detailContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  overviewCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  overviewImage: {
    height: 200,
  },
  overviewContent: {
    padding: spacing.md,
  },
  overviewDescription: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  overviewDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewItem: {
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  overviewValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
  },
  placesSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  placesList: {
    paddingRight: spacing.lg,
  },
  placeCard: {
    width: 200,
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: spacing.md,
  },
  placeImage: {
    height: 120,
  },
  placeContent: {
    padding: spacing.sm,
  },
  placeName: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  placeDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: spacing.xs,
  },
  placeDuration: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: colors.primary,
  },
  bookingSection: {
    marginBottom: spacing.xl,
  },
  bookingCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  bookingGradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  bookingTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: colors.onPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  bookingDescription: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.onPrimary,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: spacing.lg,
  },
  bookButton: {
    backgroundColor: colors.background,
    borderRadius: 25,
  },
  bookButtonLabel: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});