import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, RadioButton, IconButton, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';

import { colors, spacing } from '../../src/theme/theme';
import { useAuthStore } from '../../src/store/authStore';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'am', name: 'Amharic', flag: '🇪🇹', nativeName: 'አማርኛ' },
  { code: 'or', name: 'Oromo', flag: '🇪🇹', nativeName: 'Afaan Oromo' },
  { code: 'ti', name: 'Tigrinya', flag: '🇪🇹', nativeName: 'ትግርኛ' },
  { code: 'so', name: 'Somali', flag: '🇸🇴', nativeName: 'Soomaali' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
];

export default function LanguageSettingsScreen() {
  const { language, setLanguage } = useAuthStore();
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (selectedLanguage === language) {
      router.back();
      return;
    }

    setIsLoading(true);
    try {
      await setLanguage(selectedLanguage);
      Alert.alert(
        'Language Updated',
        'Your language preference has been updated successfully.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update language. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderLanguageItem = ({ item, index }: { item: typeof languages[0]; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100)}>
      <Card 
        style={[
          styles.languageCard,
          selectedLanguage === item.code && styles.selectedLanguageCard
        ]} 
        onPress={() => setSelectedLanguage(item.code)}
      >
        <Card.Content style={styles.languageContent}>
          <View style={styles.languageInfo}>
            <Text style={styles.flag}>{item.flag}</Text>
            <View style={styles.languageText}>
              <Text style={styles.languageName}>{item.name}</Text>
              <Text style={styles.languageNative}>{item.nativeName}</Text>
            </View>
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
        {/* Header */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
          <IconButton
            icon="arrow-left"
            iconColor={colors.primary}
            size={24}
            onPress={() => router.back()}
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>Language Settings</Text>
          <View style={styles.placeholder} />
        </Animated.View>

        <View style={styles.content}>
          {/* Description */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.descriptionSection}>
            <Text style={styles.description}>
              Choose your preferred language for the app interface. This will change the language of menus, buttons, and other interface elements.
            </Text>
          </Animated.View>

          {/* Languages List */}
          <FlatList
            data={languages}
            renderItem={renderLanguageItem}
            keyExtractor={(item) => item.code}
            style={styles.languagesList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.languagesContent}
          />

          {/* Save Button */}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.saveSection}>
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
              contentStyle={styles.saveButtonContent}
              labelStyle={styles.saveButtonLabel}
              loading={isLoading}
              disabled={isLoading || selectedLanguage === language}
            >
              {selectedLanguage === language ? 'Current Language' : 'Save Changes'}
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
  descriptionSection: {
    marginBottom: spacing.lg,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  languagesList: {
    flex: 1,
  },
  languagesContent: {
    paddingBottom: spacing.lg,
  },
  languageCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    borderRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedLanguageCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
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
  languageText: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
  },
  languageNative: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  saveSection: {
    paddingBottom: spacing.lg,
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