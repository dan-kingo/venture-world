import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, IconButton, TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';

import { colors, spacing } from '../src/theme/theme';
import { useExperienceStore } from '../src/store/experienceStore';

interface BookingForm {
  fullName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

// Mock data - in real app, fetch based on params
const mockExperience = {
  id: '1',
  title: 'Lalibela Rock Churches AR Tour',
  image: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg',
  price: 150,
  provider: { name: 'Ethiopian Heritage Tours' },
};

const mockItinerary = {
  id: '1',
  title: '3-Day Cultural Trip',
  image: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg',
  price: 450,
  duration: '3 days',
  difficulty: 'Easy',
};

export default function BookingScreen() {
  const { experience: experienceId, itinerary: itineraryId } = useLocalSearchParams();
  const { bookExperience } = useExperienceStore();
  const [selectedDate, setSelectedDate] = useState('2024-02-15');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in real app, fetch based on IDs
  const experience = experienceId ? mockExperience : null;
  const itinerary = itineraryId ? mockItinerary : null;
  const item = experience || itinerary;
  const isItinerary = !!itinerary;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingForm>();

  const availableDates = [
    '2024-02-15',
    '2024-02-16',
    '2024-02-17',
    '2024-02-18',
    '2024-02-19',
  ];

  const availableTimes = [
    '8:00 AM',
    '10:00 AM',
    '2:00 PM',
    '4:00 PM',
  ];

  const totalPrice = item?.price ? item.price * numberOfPeople : 0;

  const onSubmit = async (data: BookingForm) => {
    setIsLoading(true);
    try {
      if (experience) {
        await bookExperience(experience.id);
      }
      
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Booking Confirmed!',
        `Your ${isItinerary ? 'itinerary' : 'experience'} has been booked successfully. You will receive a confirmation email shortly.`,
        [
          {
            text: 'OK',
            onPress: () => router.push('/(tabs)/bookings'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Booking Failed', 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Item not found</Text>
        <Button onPress={() => router.back()}>Go Back</Button>
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>Book {isItinerary ? 'Itinerary' : 'Experience'}</Text>
          <View style={styles.placeholder} />
        </Animated.View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Item Summary */}
          <Animated.View entering={FadeInDown.delay(400)}>
            <Card style={styles.summaryCard}>
              <View style={styles.summaryContent}>
                <Card.Cover source={{ uri: item.image }} style={styles.summaryImage} />
                <View style={styles.summaryDetails}>
                  <Text style={styles.summaryTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.summaryProvider}>
                    {isItinerary ? `${item.duration} • ${item.difficulty}` : `by ${item.provider?.name}`}
                  </Text>
                  <Text style={styles.summaryPrice}>${item.price} per person</Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Date Selection */}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.dateContainer}>
                {availableDates.map((date) => (
                  <Button
                    key={date}
                    mode={selectedDate === date ? 'contained' : 'outlined'}
                    onPress={() => setSelectedDate(date)}
                    style={[
                      styles.dateButton,
                      selectedDate === date && styles.selectedDateButton,
                    ]}
                    labelStyle={[
                      styles.dateButtonLabel,
                      selectedDate === date && styles.selectedDateButtonLabel,
                    ]}
                  >
                    {new Date(date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Button>
                ))}
              </View>
            </ScrollView>
          </Animated.View>

          {/* Time Selection */}
          {!isItinerary && (
            <Animated.View entering={FadeInDown.delay(800)} style={styles.section}>
              <Text style={styles.sectionTitle}>Select Time</Text>
              <View style={styles.timeContainer}>
                {availableTimes.map((time) => (
                  <Button
                    key={time}
                    mode={selectedTime === time ? 'contained' : 'outlined'}
                    onPress={() => setSelectedTime(time)}
                    style={[
                      styles.timeButton,
                      selectedTime === time && styles.selectedTimeButton,
                    ]}
                    labelStyle={[
                      styles.timeButtonLabel,
                      selectedTime === time && styles.selectedTimeButtonLabel,
                    ]}
                  >
                    {time}
                  </Button>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Number of People */}
          <Animated.View entering={FadeInDown.delay(1000)} style={styles.section}>
            <Text style={styles.sectionTitle}>Number of People</Text>
            <View style={styles.peopleContainer}>
              <IconButton
                icon="minus"
                iconColor={colors.primary}
                size={24}
                onPress={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                style={styles.peopleButton}
                disabled={numberOfPeople <= 1}
              />
              <Text style={styles.peopleCount}>{numberOfPeople}</Text>
              <IconButton
                icon="plus"
                iconColor={colors.primary}
                size={24}
                onPress={() => setNumberOfPeople(numberOfPeople + 1)}
                style={styles.peopleButton}
              />
            </View>
          </Animated.View>

          {/* Contact Information */}
          <Animated.View entering={FadeInDown.delay(1200)} style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            <Controller
              control={control}
              name="fullName"
              rules={{ required: 'Full name is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Full Name"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  mode="outlined"
                  style={styles.input}
                  outlineColor={colors.surfaceVariant}
                  activeOutlineColor={colors.primary}
                  textColor={colors.text}
                  error={!!errors.fullName}
                />
              )}
            />
            {errors.fullName && (
              <Text style={styles.errorText}>{errors.fullName.message}</Text>
            )}

            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Email"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  mode="outlined"
                  style={styles.input}
                  outlineColor={colors.surfaceVariant}
                  activeOutlineColor={colors.primary}
                  textColor={colors.text}
                  error={!!errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}

            <Controller
              control={control}
              name="phone"
              rules={{ required: 'Phone number is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Phone Number"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  mode="outlined"
                  style={styles.input}
                  outlineColor={colors.surfaceVariant}
                  activeOutlineColor={colors.primary}
                  textColor={colors.text}
                  error={!!errors.phone}
                  keyboardType="phone-pad"
                />
              )}
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone.message}</Text>
            )}

            <Controller
              control={control}
              name="specialRequests"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Special Requests (Optional)"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  mode="outlined"
                  style={styles.input}
                  outlineColor={colors.surfaceVariant}
                  activeOutlineColor={colors.primary}
                  textColor={colors.text}
                  multiline
                  numberOfLines={3}
                />
              )}
            />
          </Animated.View>

          {/* Price Summary */}
          <Animated.View entering={FadeInDown.delay(1400)} style={styles.section}>
            <Card style={styles.priceCard}>
              <Card.Content style={styles.priceContent}>
                <Text style={styles.priceSummaryTitle}>Price Summary</Text>
                
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>
                    ${item.price} x {numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'}
                  </Text>
                  <Text style={styles.priceValue}>${totalPrice}</Text>
                </View>
                
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Service fee</Text>
                  <Text style={styles.priceValue}>$0</Text>
                </View>
                
                <View style={[styles.priceRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>${totalPrice}</Text>
                </View>
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Book Button */}
          <Animated.View entering={FadeInDown.delay(1600)} style={styles.bookingSection}>
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              style={styles.bookButton}
              contentStyle={styles.bookButtonContent}
              labelStyle={styles.bookButtonLabel}
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : `Confirm Booking - $${totalPrice}`}
            </Button>
            
            <Text style={styles.bookingNote}>
              You will receive a confirmation email after booking. Free cancellation up to 24 hours before the experience.
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.text,
    fontSize: 16,
    marginBottom: spacing.md,
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
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  summaryContent: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  summaryImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  summaryDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  summaryProvider: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  summaryPrice: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  dateButton: {
    borderColor: colors.primary,
    borderRadius: 20,
  },
  selectedDateButton: {
    backgroundColor: colors.primary,
  },
  dateButtonLabel: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  selectedDateButtonLabel: {
    color: colors.onPrimary,
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeButton: {
    borderColor: colors.primary,
    borderRadius: 20,
    marginBottom: spacing.sm,
  },
  selectedTimeButton: {
    backgroundColor: colors.primary,
  },
  timeButtonLabel: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  selectedTimeButtonLabel: {
    color: colors.onPrimary,
  },
  peopleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 25,
    paddingVertical: spacing.sm,
  },
  peopleButton: {
    backgroundColor: colors.surfaceVariant,
  },
  peopleCount: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    marginHorizontal: spacing.lg,
    minWidth: 40,
    textAlign: 'center',
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  priceCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  priceContent: {
    padding: spacing.md,
  },
  priceSummaryTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
  },
  bookingSection: {
    marginBottom: spacing.xl,
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    marginBottom: spacing.md,
  },
  bookButtonContent: {
    paddingVertical: spacing.sm,
  },
  bookButtonLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: colors.onPrimary,
  },
  bookingNote: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});