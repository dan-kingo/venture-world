import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, Card, RadioButton, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';

import { colors, spacing } from '../../src/theme/theme';
import { useAuthStore } from '../../src/store/authStore';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'am', name: 'አማርኛ (Amharic)', flag: '🇪🇹' },
  { code: 'or', name: 'Afaan Oromo', flag: '🇪🇹' },
];

export default function LanguageScreen() {
  const { language, setLanguage } = useAuthStore();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleContinue = async () => {
    await setLanguage(selectedLanguage);
    router.push('/register');
  };

  const renderLanguageItem = ({ item, index }: { item: typeof languages[0]; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100)}>
      <Card style={styles.languageCard} onPress={() => setSelectedLanguage(item.code)}>
        <Card.Content style={styles.languageContent}>
          <View style={styles.languageInfo}>
            <Text style={styles.flag}>{item.flag}</Text>
            <Text style={styles.languageName}>{item.name}</Text>
          </View>
          <RadioButton
            value={item.code}
            status={selectedLanguage === item.code ? 'checked' : 'unchecked'}
            onPress={() => setSelectedLanguage(item.code)}
            color={colors.primary}
          />
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
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
            <IconButton
              icon="arrow-left"
              iconColor={colors.primary}
              size={24}
              onPress={() => router.back()}
              style={styles.backButton}
            />
            <Text style={styles.title}>Choose Your Language</Text>
            <Text style={styles.subtitle}>
              Select your preferred language for the best experience
            </Text>
          </Animated.View>

          <FlatList
            data={languages}
            renderItem={renderLanguageItem}
            keyExtractor={(item) => item.code}
            style={styles.languageList}
            showsVerticalScrollIndicator={false}
          />

          <Animated.View entering={FadeInDown.delay(600)} style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleContinue}
              style={styles.continueButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Continue
            </Button>
          </Animated.View>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
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
    lineHeight: 24,
  },
  languageList: {
    flex: 1,
  },
  languageCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    borderRadius: 12,
    elevation: 2,
  },
  languageContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  languageName: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    flex: 1,
  },
  buttonContainer: {
    paddingBottom: spacing.lg,
  },
  continueButton: {
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
});