import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Button, Card } from '@hms/ui-mobile';
import { theme, commonStyles } from '@hms/design-tokens/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={[commonStyles.h1, styles.heroTitle]}>
            Hospital Management System
          </Text>
          <Text style={[commonStyles.body, styles.heroDescription]}>
            Streamline your healthcare operations with our comprehensive hospital management platform. 
            Manage patients, staff, and appointments all in one place.
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Get Started"
              onPress={() => navigation.navigate('Login')}
              style={styles.primaryButton}
            />
            <Button
              title="Learn More"
              variant="outline"
              onPress={() => {
                // TODO: Navigate to info screen
                console.log('Learn more pressed');
              }}
              style={styles.secondaryButton}
            />
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={[commonStyles.h2, styles.sectionTitle]}>
            Key Features
          </Text>
          
          <View style={styles.featuresGrid}>
            <Card style={styles.featureCard}>
              <Text style={commonStyles.h3}>👥 Patient Management</Text>
              <Text style={commonStyles.bodySmall}>
                Register and manage patient records, medical history, and treatment plans efficiently.
              </Text>
            </Card>

            <Card style={styles.featureCard}>
              <Text style={commonStyles.h3}>📅 Appointment Scheduling</Text>
              <Text style={commonStyles.bodySmall}>
                Schedule and manage appointments with automated reminders and queue management.
              </Text>
            </Card>

            <Card style={styles.featureCard}>
              <Text style={commonStyles.h3}>🏥 Staff Management</Text>
              <Text style={commonStyles.bodySmall}>
                Manage doctors, nurses, and administrative staff with role-based access control.
              </Text>
            </Card>

            <Card style={styles.featureCard}>
              <Text style={commonStyles.h3}>📊 Analytics & Reports</Text>
              <Text style={commonStyles.bodySmall}>
                Generate comprehensive reports and analytics to improve hospital operations.
              </Text>
            </Card>
          </View>
        </View>

        {/* CTA Section */}
        <Card style={styles.ctaSection}>
          <Text style={[commonStyles.h2, styles.ctaTitle]}>
            Ready to get started?
          </Text>
          <Text style={[commonStyles.body, styles.ctaDescription]}>
            Join hundreds of healthcare facilities already using our platform.
          </Text>
          <Button
            title="Start Free Trial"
            onPress={() => navigation.navigate('Login')}
            style={styles.ctaButton}
          />
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.semantic.componentPadding.md,
  },
  
  heroSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing[12],
    marginBottom: theme.spacing[8],
  },
  
  heroTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing[4],
    color: theme.colors.semantic.text,
  },
  
  heroDescription: {
    textAlign: 'center',
    marginBottom: theme.spacing[8],
    paddingHorizontal: theme.spacing[4],
    color: theme.colors.semantic.textMuted,
    lineHeight: theme.typography.textStyles.body.lineHeight * theme.typography.textStyles.body.fontSize,
  },
  
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing[4],
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  
  primaryButton: {
    minWidth: 120,
  },
  
  secondaryButton: {
    minWidth: 120,
  },
  
  featuresSection: {
    marginBottom: theme.spacing[8],
  },
  
  sectionTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing[6],
    color: theme.colors.semantic.text,
  },
  
  featuresGrid: {
    gap: theme.spacing[4],
  },
  
  featureCard: {
    marginBottom: theme.spacing[4],
  },
  
  ctaSection: {
    alignItems: 'center',
    padding: theme.spacing[6],
    backgroundColor: theme.colors.semantic.surface,
  },
  
  ctaTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing[3],
    color: theme.colors.semantic.text,
  },
  
  ctaDescription: {
    textAlign: 'center',
    marginBottom: theme.spacing[6],
    color: theme.colors.semantic.textMuted,
  },
  
  ctaButton: {
    minWidth: 150,
  },
});