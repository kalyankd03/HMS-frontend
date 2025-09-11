import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@hms/core';
import type { LoginForm } from '@hms/core';
import { RootStackParamList } from '../../App';
import { Button, Card, Input } from '@hms/ui-mobile';
import { theme, commonStyles } from '@hms/design-tokens/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      // TODO: Implement login logic with API client
      console.log('Login data:', data);
      
      // Simulate API call
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      
      // Navigate to dashboard on success
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Login error:', error);
      // TODO: Handle error (show alert, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={[commonStyles.h2, styles.title]}>
                Welcome back
              </Text>
              <Text style={[commonStyles.bodySmall, styles.subtitle]}>
                Sign in to your account to continue
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <Controller
                  name="email"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Enter your email"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.email?.message}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  )}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <Controller
                  name="password"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Enter your password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.password?.message}
                      secureTextEntry
                    />
                  )}
                />
              </View>

              <Button
                title={isLoading ? "Signing in..." : "Sign in"}
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                disabled={isLoading}
                style={styles.submitButton}
              />
            </View>

            <View style={styles.footer}>
              <Text style={[commonStyles.bodySmall, styles.footerText]}>
                Don't have an account?{' '}
                <Text 
                  style={styles.linkText}
                  onPress={() => {
                    // TODO: Navigate to register screen
                    console.log('Navigate to register');
                  }}
                >
                  Register here
                </Text>
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.semantic.surface,
  },
  
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  
  content: {
    padding: theme.spacing.semantic.componentPadding.lg,
  },
  
  card: {
    padding: theme.spacing.semantic.cardPadding.lg,
  },
  
  cardHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing[2],
    color: theme.colors.semantic.text,
  },
  
  subtitle: {
    textAlign: 'center',
    color: theme.colors.semantic.textMuted,
  },
  
  form: {
    marginBottom: theme.spacing[6],
  },
  
  inputGroup: {
    marginBottom: theme.spacing[4],
  },
  
  label: {
    fontSize: theme.typography.textStyles.label.fontSize,
    fontWeight: theme.typography.textStyles.label.fontWeight,
    color: theme.colors.semantic.text,
    marginBottom: theme.spacing[2],
  },
  
  submitButton: {
    marginTop: theme.spacing[2],
  },
  
  footer: {
    alignItems: 'center',
  },
  
  footerText: {
    textAlign: 'center',
    color: theme.colors.semantic.textMuted,
  },
  
  linkText: {
    color: theme.colors.semantic.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
});