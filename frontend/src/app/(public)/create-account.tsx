import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Button, ButtonText, Input, Logo } from '@/components';
import { useCreateAccountMutation } from '@/services/auth';
import { ApiError } from '@/lib/api-client';

export default function CreateAccountScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const createAccount = useCreateAccountMutation();

  const passwordTooShort = password.length > 0 && password.length < 8;

  function handleCreateAccount() {
    createAccount.mutate({ name: name.trim(), email: email.trim(), password });
  }

  const errorMessage =
    createAccount.error instanceof ApiError
      ? createAccount.error.problem.detail
      : createAccount.error?.message;

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        className="flex-1 bg-canvas"
        contentContainerClassName="flex-1 justify-center p-6"
        keyboardShouldPersistTaps="handled">
        <View className="items-center gap-8">
          <Logo className="text-ansi-orange" size="sm" />

          <View className="w-full gap-4">
            <Input
              placeholder="Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
            />
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <Input
              placeholder="Password (min 8 characters)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
            />

            {passwordTooShort && (
              <Text className="font-mono text-sm text-warning">
                Password must be at least 8 characters
              </Text>
            )}

            {errorMessage && (
              <Text className="font-mono text-sm text-destructive">{errorMessage}</Text>
            )}

            <Button
              onPress={handleCreateAccount}
              disabled={createAccount.isPending || !name || !email || password.length < 8}>
              <ButtonText>
                {createAccount.isPending ? 'Creating account...' : 'Create Account'}
              </ButtonText>
            </Button>
          </View>

          <Link href="/(public)/login" asChild>
            <Button variant="link">
              <ButtonText variant="link">Already have an account? Sign In</ButtonText>
            </Button>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
