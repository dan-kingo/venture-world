import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Chip, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { colors, spacing } from '../../theme/theme';

interface BookingsScreenProps {
  navigation: any;
}

// Mock booking data
const mockBookings = [
  {
    id: '1',
    experienceTitle: 'Lalibela Rock Churches AR Tour',
    experienceImage: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg',
    status: 'confirmed',
    date: '2024-02-15',
    time: '10:00 AM',
    price: 150,
    provider: 'Ethiopian Heritage Tours',
  },
  {
    id: '2',
    experienceTitle: 'Bale Mountains Eco Adventure',
    experienceImage: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg',
    status: 'pending',
    date: '2024-02-20',
    time: '8:00 AM',
    price: 200,
    provider: 'Mountain Adventures Ethiopia',
  },
  {
    id: '3',
    experienceTitle: 'Coffee Ceremony Cultural Experience',
    experienceImage: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg',
    status: 'completed',
    date: '2024-01-10',
    time: '2:00 PM',
    price: 50,
    provider: 'Cultural Connections',
  },
];

const statusColors = {
  pending: colors.warning,
  confirmed: colors.success,
  completed: colors.textSecondary,
  cancelled: colors.error,
};

export default function BookingsScreen({ navigation }: BookingsScreenProps) {
  const [bookings] = useState(mockBookings);

  const getStatusChipStyle = (status: string) => ({
    backgroundColor: statusColors[status as keyof typeof statusColors] + '20',
  });

  const getStatusTextStyle = (status: string) => ({
    color: statusColors[status as keyof typeof statusColors],
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
  });

  const renderBooking = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100)}>
      <Card style={styles.bookingCard}>
        <View style={styles.bookingContent}>
          <Card.Cover source={{ uri: item.experienceImage }} style={styles.bookingImage} />
          
          <View style={styles.bookingDetails}>
            <View style={styles.bookingHeader}>
              <Text style={styles.bookingTitle} numberOfLines={2}>
                {item.experienceTitle}
              </Text>
              <Chip
                style={getStatusChipStyle(item.status)}
                textStyle={getStatusTextStyle(item.status)}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Chip>
            </View>
            
            <Text style={styles.bookingProvider}>{item.provider}</Text>
            
            <View style={styles.bookingInfo}>
              <Text style={styles.bookingDate}>📅 {item.date}</Text>
              <Text style={styles.bookingTime}>🕐 {item.time}</Text>
            </View>
            
            <View style={styles.bookingFooter}>
              <Text style={styles.bookingPrice}>${item.price}</Text>
              
              <View style={styles.bookingActions}>
                {item.status === 'pending' && (
                  <Button
                    mode="outlined"
                    onPress={() => {}}
                    style={styles.actionButton}
                    labelStyle={styles.actionButtonLabel}
                  >
                    Cancel
                  </Button>
                )}
                {item.status === 'confirmed' && (
                  <Button
                    mode="contained"
                    onPress={() => {}}
                    style={styles.primaryActionButton}
                    labelStyle={styles.primaryActionButtonLabel}
                  >
                    View Details
                  </Button>
                )}
                {item.status === 'completed' && (
                  <Button
                    mode="outlined"
                    onPress={() => {}}
                    style={styles.actionButton}
                    labelStyle={styles.actionButtonLabel}
                  >
                    Review
                  </Button>
                )}
              </View>
            </View>
          </View>
        </View>
      </Card>
    </Animated.View>
  );

  const renderEmptyState = () => (
    <Animated.View entering={FadeInDown.delay(400)} style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>📅</Text>
      <Text style={styles.emptyStateTitle}>No Bookings Yet</Text>
      <Text style={styles.emptyStateDescription}>
        Start exploring and book your first experience!
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Explore')}
        style={styles.exploreButton}
        labelStyle={styles.exploreButtonLabel}
      >
        Explore Experiences
      </Button>
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
          <Text style={styles.title}>My Bookings</Text>
          <Text style={styles.subtitle}>Track your adventures</Text>
        </Animated.View>

        {/* Bookings List */}
        {bookings.length > 0 ? (
          <FlatList
            data={bookings}
            renderItem={renderBooking}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.bookingsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          renderEmptyState()
        )}
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
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  bookingsList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  bookingCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bookingContent: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  bookingImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  bookingDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  bookingTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  bookingProvider: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  bookingInfo: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  bookingDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  bookingTime: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingPrice: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
  },
  bookingActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    borderColor: colors.primary,
    borderRadius: 20,
  },
  actionButtonLabel: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  primaryActionButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  primaryActionButtonLabel: {
    color: colors.onPrimary,
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyStateDescription: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  exploreButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
  },
  exploreButtonLabel: {
    color: colors.onPrimary,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});