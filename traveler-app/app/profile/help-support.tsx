import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { Text, Card, IconButton, List, Divider, Button, TextInput, Searchbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';

import { colors, spacing } from '../../src/theme/theme';

const faqData = [
  {
    id: '1',
    question: 'How do I book an experience?',
    answer: 'To book an experience, browse our catalog, select the experience you want, choose your preferred date and time, and complete the booking process with your payment information.',
    category: 'Booking',
  },
  {
    id: '2',
    question: 'Can I cancel my booking?',
    answer: 'Yes, you can cancel your booking up to 24 hours before the scheduled experience for a full refund. Cancellations made within 24 hours may be subject to a cancellation fee.',
    category: 'Booking',
  },
  {
    id: '3',
    question: 'How do AR experiences work?',
    answer: 'AR experiences use your device\'s camera and sensors to overlay digital content onto the real world. Simply point your camera at the designated area and follow the on-screen instructions.',
    category: 'Technology',
  },
  {
    id: '4',
    question: 'What devices support VR experiences?',
    answer: 'VR experiences work on most modern smartphones. For the best experience, we recommend using VR headsets, but they can also be viewed in 360° mode on your phone.',
    category: 'Technology',
  },
  {
    id: '5',
    question: 'How do I change my language settings?',
    answer: 'Go to Profile > Language Settings and select your preferred language from the available options. The app interface will update immediately.',
    category: 'Account',
  },
  {
    id: '6',
    question: 'Is my payment information secure?',
    answer: 'Yes, we use industry-standard encryption and secure payment processors to protect your financial information. We never store your complete payment details on our servers.',
    category: 'Security',
  },
];

const contactOptions = [
  {
    title: 'Email Support',
    description: 'Get help via email within 24 hours',
    icon: 'email',
    action: () => Linking.openURL('mailto:support@ventureworld.com'),
  },
  {
    title: 'Live Chat',
    description: 'Chat with our support team',
    icon: 'chat',
    action: () => Alert.alert('Live Chat', 'Live chat feature coming soon!'),
  },
  {
    title: 'Phone Support',
    description: 'Call us during business hours',
    icon: 'phone',
    action: () => Linking.openURL('tel:+251911234567'),
  },
  {
    title: 'WhatsApp',
    description: 'Message us on WhatsApp',
    icon: 'whatsapp',
    action: () => Linking.openURL('https://wa.me/251911234567'),
  },
];

export default function HelpSupportScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const submitFeedback = async () => {
    if (!feedbackText.trim()) {
      Alert.alert('Error', 'Please enter your feedback before submitting.');
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Feedback Submitted',
        'Thank you for your feedback! We\'ll review it and get back to you if needed.',
        [{ text: 'OK', onPress: () => setFeedbackText('') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmittingFeedback(false);
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
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={styles.placeholder} />
        </Animated.View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Quick Actions */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <Card style={styles.quickActionsCard}>
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.quickActionsGradient}
              >
                <Text style={styles.quickActionsTitle}>Need Help?</Text>
                <Text style={styles.quickActionsDescription}>
                  We're here to help you have the best experience possible
                </Text>
              </LinearGradient>
            </Card>
          </Animated.View>

          {/* Contact Options */}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionContent}>
                {contactOptions.map((option, index) => (
                  <View key={option.title}>
                    <List.Item
                      title={option.title}
                      description={option.description}
                      left={(props) => <List.Icon {...props} icon={option.icon} color={colors.primary} />}
                      right={(props) => <List.Icon {...props} icon="chevron-right" color={colors.textSecondary} />}
                      onPress={option.action}
                      titleStyle={styles.listItemTitle}
                      descriptionStyle={styles.listItemDescription}
                      style={styles.listItem}
                    />
                    {index < contactOptions.length - 1 && <Divider style={styles.divider} />}
                  </View>
                ))}
              </Card.Content>
            </Card>
          </Animated.View>

          {/* FAQ Section */}
          <Animated.View entering={FadeInDown.delay(800)} style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            
            <Searchbar
              placeholder="Search FAQs..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
              inputStyle={styles.searchInput}
              iconColor={colors.primary}
              placeholderTextColor={colors.textSecondary}
            />

            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionContent}>
                {filteredFAQs.map((faq, index) => (
                  <View key={faq.id}>
                    <List.Item
                      title={faq.question}
                      description={expandedFAQ === faq.id ? faq.answer : `${faq.category} • Tap to expand`}
                      left={(props) => <List.Icon {...props} icon="help-circle" color={colors.primary} />}
                      right={(props) => (
                        <List.Icon 
                          {...props} 
                          icon={expandedFAQ === faq.id ? "chevron-up" : "chevron-down"} 
                          color={colors.textSecondary} 
                        />
                      )}
                      onPress={() => toggleFAQ(faq.id)}
                      titleStyle={styles.faqTitle}
                      descriptionStyle={[
                        styles.faqDescription,
                        expandedFAQ === faq.id && styles.faqAnswerExpanded
                      ]}
                      style={styles.faqItem}
                      titleNumberOfLines={expandedFAQ === faq.id ? 0 : 2}
                      descriptionNumberOfLines={expandedFAQ === faq.id ? 0 : 1}
                    />
                    {index < filteredFAQs.length - 1 && <Divider style={styles.divider} />}
                  </View>
                ))}
                
                {filteredFAQs.length === 0 && (
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No FAQs found matching your search.</Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Feedback Section */}
          <Animated.View entering={FadeInDown.delay(1000)} style={styles.section}>
            <Text style={styles.sectionTitle}>Send Feedback</Text>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionContent}>
                <Text style={styles.feedbackDescription}>
                  Help us improve by sharing your thoughts and suggestions
                </Text>
                
                <TextInput
                  label="Your Feedback"
                  value={feedbackText}
                  onChangeText={setFeedbackText}
                  mode="outlined"
                  style={styles.feedbackInput}
                  outlineColor={colors.surfaceVariant}
                  activeOutlineColor={colors.primary}
                  textColor={colors.text}
                  multiline
                  numberOfLines={4}
                  placeholder="Tell us about your experience or suggest improvements..."
                />
                
                <Button
                  mode="contained"
                  onPress={submitFeedback}
                  style={styles.feedbackButton}
                  labelStyle={styles.feedbackButtonLabel}
                  loading={isSubmittingFeedback}
                  disabled={isSubmittingFeedback || !feedbackText.trim()}
                  icon="send"
                >
                  Submit Feedback
                </Button>
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Additional Resources */}
          <Animated.View entering={FadeInDown.delay(1200)} style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Resources</Text>
            <Card style={styles.sectionCard}>
              <Card.Content style={styles.sectionContent}>
                <List.Item
                  title="User Guide"
                  description="Learn how to use all app features"
                  left={(props) => <List.Icon {...props} icon="book-open" color={colors.primary} />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" color={colors.textSecondary} />}
                  onPress={() => Alert.alert('User Guide', 'User guide feature coming soon!')}
                  titleStyle={styles.listItemTitle}
                  descriptionStyle={styles.listItemDescription}
                  style={styles.listItem}
                />
                
                <Divider style={styles.divider} />
                
                <List.Item
                  title="Video Tutorials"
                  description="Watch step-by-step tutorials"
                  left={(props) => <List.Icon {...props} icon="play-circle" color={colors.primary} />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" color={colors.textSecondary} />}
                  onPress={() => Alert.alert('Video Tutorials', 'Video tutorials coming soon!')}
                  titleStyle={styles.listItemTitle}
                  descriptionStyle={styles.listItemDescription}
                  style={styles.listItem}
                />
                
                <Divider style={styles.divider} />
                
                <List.Item
                  title="Community Forum"
                  description="Connect with other travelers"
                  left={(props) => <List.Icon {...props} icon="forum" color={colors.primary} />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" color={colors.textSecondary} />}
                  onPress={() => Alert.alert('Community Forum', 'Community forum coming soon!')}
                  titleStyle={styles.listItemTitle}
                  descriptionStyle={styles.listItemDescription}
                  style={styles.listItem}
                />
              </Card.Content>
            </Card>
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
  section: {
    marginBottom: spacing.lg,
  },
  quickActionsCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  quickActionsGradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  quickActionsTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: colors.onPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  quickActionsDescription: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.onPrimary,
    textAlign: 'center',
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  sectionContent: {
    padding: spacing.md,
  },
  listItem: {
    paddingVertical: spacing.xs,
  },
  listItemTitle: {
    color: colors.text,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  listItemDescription: {
    color: colors.textSecondary,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  divider: {
    backgroundColor: colors.surfaceVariant,
    marginVertical: spacing.sm,
  },
  searchBar: {
    backgroundColor: colors.surface,
    borderRadius: 25,
    marginBottom: spacing.md,
  },
  searchInput: {
    color: colors.text,
    fontFamily: 'Poppins-Regular',
  },
  faqItem: {
    paddingVertical: spacing.sm,
  },
  faqTitle: {
    color: colors.text,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    lineHeight: 20,
  },
  faqDescription: {
    color: colors.textSecondary,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  faqAnswerExpanded: {
    color: colors.text,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  noResultsText: {
    color: colors.textSecondary,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  feedbackDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  feedbackInput: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  feedbackButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
  },
  feedbackButtonLabel: {
    color: colors.onPrimary,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
});