import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, IconButton, Avatar, Card, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';

import { colors, spacing } from '../../src/theme/theme';
import { useAuthStore } from '../../src/store/authStore';

interface EditProfileForm {
  name: string;
  email: string;
  phone: string;
}

const interestOptions = [
  'Culture', 'History', 'Adventure', 'Nature', 'Food', 'Art', 'Music', 'Photography'
];

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuthStore();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || []);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileForm>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const onSubmit = async (data: EditProfileForm) => {
    setIsLoading(true);
    try {
      await updateProfile({
        ...data,
        interests: selectedInterests,
      });
      
      Alert.alert(
        'Profile Updated',
        'Your profile has been updated successfully.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.placeholder} />
        </Animated.View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Picture Section */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.avatarSection}>
            <Card style={styles.avatarCard}>
              <Card.Content style={styles.avatarContent}>
                <Avatar.Text
                  size={80}
                  label={user?.name?.charAt(0) || 'U'}
                  style={styles.avatar}
                  labelStyle={styles.avatarLabel}
                />
                <Button
                  mode="outlined"
                  onPress={() => Alert.alert('Coming Soon', 'Photo upload feature will be available soon.')}
                  style={styles.changePhotoButton}
                  labelStyle={styles.changePhotoLabel}
                  icon="camera"
                >
                  Change Photo
                </Button>
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Personal Information */}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <Controller
              control={control}
              name="name"
              rules={{ required: 'Name is required' }}
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
                  error={!!errors.name}
                />
              )}
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name.message}</Text>
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
                  keyboardType="phone-pad"
                />
              )}
            />
          </Animated.View>

          {/* Interests Section */}
          <Animated.View entering={FadeInDown.delay(800)} style={styles.section}>
            <Text style={styles.sectionTitle}>Your Interests</Text>
            <Text style={styles.sectionDescription}>
              Select topics that interest you to get personalized recommendations
            </Text>
            
            <View style={styles.interestsContainer}>
              {interestOptions.map((interest) => (
                <Chip
                  key={interest}
                  selected={selectedInterests.includes(interest)}
                  onPress={() => toggleInterest(interest)}
                  style={[
                    styles.interestChip,
                    selectedInterests.includes(interest) && styles.selectedChip,
                  ]}
                  textStyle={[
                    styles.chipText,
                    selectedInterests.includes(interest) && styles.selectedChipText,
                  ]}
                >
                  {interest}
                </Chip>
              ))}
            </View>
          </Animated.View>

          {/* Save Button */}
          <Animated.View entering={FadeInDown.delay(1000)} style={styles.saveSection}>
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              style={styles.saveButton}
              contentStyle={styles.saveButtonContent}
              labelStyle={styles.saveButtonLabel}
              loading={isLoading}
              disabled={isLoading}
            >
              Save Changes
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
  avatarSection: {
    marginBottom: spacing.lg,
  },
  avatarCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  avatarContent: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  avatar: {
    backgroundColor: colors.primary,
    marginBottom: spacing.md,
  },
  avatarLabel: {
    color: colors.onPrimary,
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
  },
  changePhotoButton: {
    borderColor: colors.primary,
    borderRadius: 20,
  },
  changePhotoLabel: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  interestChip: {
    backgroundColor: colors.surfaceVariant,
    marginBottom: spacing.sm,
  },
  selectedChip: {
    backgroundColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  selectedChipText: {
    color: colors.onPrimary,
    fontFamily: 'Poppins-SemiBold',
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