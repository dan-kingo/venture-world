import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, IconButton, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { colors, spacing } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

interface RegisterScreenProps {
  navigation: any;
}

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const interestOptions = [
  'Culture', 'History', 'Adventure', 'Nature', 'Food', 'Art', 'Music', 'Photography'
];

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { register, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>();

  const password = watch('password');

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const onSubmit = async (data: RegisterForm) => {
    try {
      await register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: 'traveler',
        interests: selectedInterests,
      });
    } catch (error) {
      Alert.alert('Registration Failed', 'Please try again.');
    }
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.surface]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header */}
            <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
              <IconButton
                icon="arrow-left"
                iconColor={colors.primary}
                size={24}
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              />
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join the adventure and explore Ethiopia</Text>
            </Animated.View>

            {/* Form */}
            <Animated.View entering={FadeInDown.delay(400)} style={styles.form}>
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
                name="password"
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Password"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    mode="outlined"
                    style={styles.input}
                    outlineColor={colors.surfaceVariant}
                    activeOutlineColor={colors.primary}
                    textColor={colors.text}
                    error={!!errors.password}
                    secureTextEntry={!showPassword}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? 'eye-off' : 'eye'}
                        iconColor={colors.textSecondary}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    }
                  />
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}

              <Controller
                control={control}
                name="confirmPassword"
                rules={{
                  required: 'Please confirm your password',
                  validate: value =>
                    value === password || 'Passwords do not match',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Confirm Password"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    mode="outlined"
                    style={styles.input}
                    outlineColor={colors.surfaceVariant}
                    activeOutlineColor={colors.primary}
                    textColor={colors.text}
                    error={!!errors.confirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    right={
                      <TextInput.Icon
                        icon={showConfirmPassword ? 'eye-off' : 'eye'}
                        iconColor={colors.textSecondary}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    }
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
              )}

              {/* Interests Section */}
              <View style={styles.interestsSection}>
                <Text style={styles.interestsTitle}>Your Interests (Optional)</Text>
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
              </View>
            </Animated.View>

            {/* Register Button */}
            <Animated.View entering={FadeInDown.delay(600)} style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                style={styles.registerButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                loading={isLoading}
                disabled={isLoading}
              >
                Create Account
              </Button>
            </Animated.View>

            {/* Login Link */}
            <Animated.View entering={FadeInDown.delay(800)} style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Button
                mode="text"
                onPress={() => navigation.navigate('Login')}
                labelStyle={styles.loginButtonLabel}
              >
                Sign In
              </Button>
            </Animated.View>
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing.xl,
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
  interestsSection: {
    marginTop: spacing.md,
  },
  interestsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: spacing.md,
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
  buttonContainer: {
    marginBottom: spacing.lg,
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: colors.onPrimary,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  loginButtonLabel: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
});