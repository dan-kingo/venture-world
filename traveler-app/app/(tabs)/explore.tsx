import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Text, Card, Searchbar, Chip, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';

import { colors, spacing } from '../../src/theme/theme';
import { useExperienceStore } from '../../src/store/experienceStore';

const { width } = Dimensions.get('window');

const categories = ['All', 'AR site', 'eco-tour', 'heritage'];

export default function ExploreScreen() {
  const { experiences, fetchExperiences, isLoading } = useExperienceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredExperiences, setFilteredExperiences] = useState(experiences);

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    let filtered = experiences;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(exp => exp.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(exp =>
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredExperiences(filtered);
  }, [experiences, selectedCategory, searchQuery]);

  const renderExperience = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100)}>
      <Card
        style={styles.experienceCard}
        onPress={() => router.push(`/experience/${item._id}`)}
      >
        <Card.Cover source={{ uri: item.image }} style={styles.experienceImage} />
        <Card.Content style={styles.experienceContent}>
          <View style={styles.experienceHeader}>
            <Text style={styles.experienceTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.experiencePrice}>${item.price}</Text>
          </View>
          
          <Text style={styles.experienceDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.experienceFooter}>
            <View style={styles.experienceInfo}>
              <Text style={styles.experienceLocation}>📍 {item.location}</Text>
              <Text style={styles.experienceRating}>⭐ {item.rating}</Text>
            </View>
            <Text style={styles.experienceCategory}>{item.category}</Text>
          </View>
        </Card.Content>
      </Card>
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={[colors.background, colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Explore</Text>
            <IconButton
              icon="filter-variant"
              iconColor={colors.primary}
              size={24}
              onPress={() => {}}
              style={styles.filterButton}
            />
          </View>
          
          <Searchbar
            placeholder="Search experiences..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
            iconColor={colors.primary}
            placeholderTextColor={colors.textSecondary}
          />
        </Animated.View>

        {/* Categories */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.categoriesSection}>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
            renderItem={({ item }) => (
              <Chip
                selected={selectedCategory === item}
                onPress={() => setSelectedCategory(item)}
                style={[
                  styles.categoryChip,
                  selectedCategory === item && styles.selectedCategoryChip,
                ]}
                textStyle={[
                  styles.categoryChipText,
                  selectedCategory === item && styles.selectedCategoryChipText,
                ]}
              >
                {item}
              </Chip>
            )}
            keyExtractor={(item) => item}
          />
        </Animated.View>

        {/* Results Count */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.resultsSection}>
          <Text style={styles.resultsText}>
            {filteredExperiences.length} experience{filteredExperiences.length !== 1 ? 's' : ''} found
          </Text>
        </Animated.View>

        {/* Experiences List */}
        <FlatList
          data={filteredExperiences}
          renderItem={renderExperience}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[styles.experiencesList, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={fetchExperiences}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
  },
  filterButton: {
    backgroundColor: colors.surface,
  },
  searchBar: {
    backgroundColor: colors.surface,
    borderRadius: 25,
  },
  searchInput: {
    color: colors.text,
    fontFamily: 'Poppins-Regular',
  },
  categoriesSection: {
    marginBottom: spacing.md,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryChip: {
    backgroundColor: colors.surfaceVariant,
  },
  selectedCategoryChip: {
    backgroundColor: colors.primary,
  },
  categoryChipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  selectedCategoryChipText: {
    color: colors.onPrimary,
    fontFamily: 'Poppins-SemiBold',
  },
  resultsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  resultsText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  experiencesList: {
    paddingHorizontal: spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
  },
  experienceCard: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  experienceImage: {
    height: 120,
  },
  experienceContent: {
    padding: spacing.sm,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  experienceTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    flex: 1,
    marginRight: spacing.xs,
  },
  experiencePrice: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
  },
  experienceDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  experienceFooter: {
    gap: spacing.xs,
  },
  experienceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  experienceLocation: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    flex: 1,
  },
  experienceRating: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  experienceCategory: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: colors.primary,
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
});