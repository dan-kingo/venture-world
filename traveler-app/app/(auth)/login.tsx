import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, IconButton, Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';

import { colors, spacing } from '../../src/theme/theme';
import { useAuthStore } from '../../src/store/authStore';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
    }
  };

  // Demo accounts for testing
  const demoAccounts = [
    { email: 'john@example.com', password: 'password123', role: 'Traveler' },
    { email: 'sarah@example.com', password: 'password123', role: 'Provider' },
    { email: 'admin@example.com', password: 'admin123', role: 'Admin' },
  ];

  const fillDemoAccount = (email: string, password: string) => {
    // This would typically use setValue from react-hook-form
    // For now, we'll just show an alert with the credentials
    Alert.alert(
      'Demo Account',
      `Email: ${email}\nPassword: ${password}\n\nPlease enter these credentials manually.`,
      [{ text: 'OK' }]
    );
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
                onPress={() => router.back()}
                style={styles.backButton}
              />
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue your journey</Text>
            </Animated.View>

            {/* Demo Accounts */}
            <Animated.View entering={FadeInDown.delay(300)} style={styles.demoSection}>
              <Text style={styles.demoTitle}>Demo Accounts (Mock Login)</Text>
              {demoAccounts.map((account, index) => (
                <Card
                  key={index}
                  style={styles.demoCard}
                  onPress={() => fillDemoAccount(account.email, account.password)}
                >
                  <Card.Content style={styles.demoContent}>
                    <Text style={styles.demoRole}>{account.role}</Text>
                    <Text style={styles.demoEmail}>{account.email}</Text>
                    <Text style={styles.demoPassword}>Password: {account.password}</Text>
                  </Card.Content>
                </Card>
              ))}
            </Animated.View>

            {/* Form */}
            <Animated.View entering={FadeInDown.delay(400)} style={styles.form}>
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
                        color={colors.textSecondary}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    }
                  />
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}

              <Button
                mode="text"
                onPress={() => {}}
                style={styles.forgotButton}
                labelStyle={styles.forgotButtonLabel}
              >
                Forgot Password?
              </Button>
            </Animated.View>

            {/* Login Button */}
            <Animated.View entering={FadeInDown.delay(600)} style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                loading={isLoading}
                disabled={isLoading}
              >
                Sign In
              </Button>
            </Animated.View>

            {/* Register Link */}
            <Animated.View entering={FadeInDown.delay(800)} style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <Button
                mode="text"
                onPress={() => router.push('/(auth)/register')}
                labelStyle={styles.registerButtonLabel}
              >
                Sign Up
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
    marginBottom: spacing.lg,
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
  demoSection: {
    marginBottom: spacing.lg,
  },
  demoTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  demoCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
    borderRadius: 12,
  },
  demoContent: {
    padding: spacing.sm,
  },
  demoRole: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
  },
  demoEmail: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.text,
  },
  demoPassword: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
  },
  forgotButtonLabel: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  buttonContainer: {
    marginBottom: spacing.lg,
  },
  loginButton: {
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  registerText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  registerButtonLabel: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
});