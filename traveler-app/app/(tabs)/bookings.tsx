import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { Text, Card, Chip, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";

import { colors, spacing } from "../../src/theme/theme";
import { bookingsAPI, Booking } from "../../src/services/api";

const statusColors = {
  pending: colors.warning,
  confirmed: colors.success,
  completed: colors.textSecondary,
  cancelled: colors.error,
};

export default function BookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await bookingsAPI.getMine();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const result = await bookingsAPI.cancelBooking(bookingId);

      // Optionally, refresh your bookings list or update UI
      fetchBookings?.(); // If you have a fetchBookings method
    } catch (error) {
      console.error("Error cancelling booking:", error);
      Alert.alert("Error", "Failed to cancel the booking. Please try again.");
    }
  };

  const getStatusChipStyle = (status: string) => ({
    backgroundColor: statusColors[status as keyof typeof statusColors] + "20",
  });

  const getStatusTextStyle = (status: string) => ({
    color: statusColors[status as keyof typeof statusColors],
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
  });

  const renderBooking = ({ item, index }: { item: Booking; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100)}>
      <Card style={styles.bookingCard}>
        <View style={styles.bookingContent}>
          <Card.Cover
            source={{ uri: item.experience.image }}
            style={styles.bookingImage}
          />

          <View style={styles.bookingDetails}>
            <View style={styles.bookingHeader}>
              <Text style={styles.bookingTitle} numberOfLines={2}>
                {item.experience.title}
              </Text>
              <Chip
                style={getStatusChipStyle(item.status)}
                textStyle={getStatusTextStyle(item.status)}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Chip>
            </View>

            <Text style={styles.bookingLocation}>
              📍 {item.experience.location}
            </Text>

            <View style={styles.bookingInfo}>
              <Text style={styles.bookingDate}>
                📅 {new Date(item.createdAt).toLocaleDateString()}
              </Text>
              <Text style={styles.bookingPrice}>${item.experience.price}</Text>
            </View>

            <View style={styles.bookingFooter}>
              <View style={styles.bookingActions}>
                {item.status === "pending" && (
                  <Button
                    mode="outlined"
                    onPress={() => {
                      Alert.alert(
                        "Cancel Booking",
                        "Are you sure you want to cancel this booking?",
                        [
                          { text: "No", style: "cancel" },
                          {
                            text: "Yes",
                            onPress: () => handleCancelBooking(item._id),
                          },
                        ]
                      );
                    }}
                    style={styles.actionButton}
                    labelStyle={styles.actionButtonLabel}
                  >
                    Cancel
                  </Button>
                )}

                {item.status === "confirmed" && (
                  <Button
                    mode="contained"
                    onPress={() => {
                      router.push(`/experience/${item.experience._id}`);
                    }}
                    style={styles.primaryActionButton}
                    labelStyle={styles.primaryActionButtonLabel}
                  >
                    View Details
                  </Button>
                )}
                {item.status === "completed" && (
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
        onPress={() => router.push("/(tabs)/explore")}
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
            keyExtractor={(item) => item._id}
            contentContainerStyle={[
              styles.bookingsList,
              { paddingBottom: 100 },
            ]}
            showsVerticalScrollIndicator={false}
            refreshing={isLoading}
            onRefresh={fetchBookings}
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
    fontFamily: "Poppins-Bold",
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: colors.textSecondary,
  },
  bookingsList: {
    paddingHorizontal: spacing.lg,
  },
  bookingCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    borderRadius: 16,
    overflow: "hidden",
  },
  bookingContent: {
    flexDirection: "row",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.xs,
  },
  bookingTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  bookingLocation: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  bookingInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  bookingDate: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: colors.textSecondary,
  },
  bookingPrice: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: colors.primary,
  },
  bookingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookingActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    borderColor: colors.primary,
    borderRadius: 20,
  },
  actionButtonLabel: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
  },
  primaryActionButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  primaryActionButtonLabel: {
    color: colors.onPrimary,
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  emptyStateDescription: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: colors.textSecondary,
    textAlign: "center",
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
    fontFamily: "Poppins-SemiBold",
  },
});
