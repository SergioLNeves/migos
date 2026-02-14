import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Button, ButtonText, Input, Logo } from '@/components';
import { useLoginMutation } from '@/services/auth';
import { ApiError } from '@/lib/api-client';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLoginMutation();

  function handleLogin() {
    login.mutate({ email: email.trim(), password });
  }

  const errorMessage =
    login.error instanceof ApiError ? login.error.problem.detail : login.error?.message;

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
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />

            {errorMessage && (
              <Text className="font-mono text-sm text-destructive">{errorMessage}</Text>
            )}

            <Button onPress={handleLogin} disabled={login.isPending || !email || !password}>
              <ButtonText>{login.isPending ? 'Signing in...' : 'Sign In'}</ButtonText>
            </Button>
          </View>

          <Link href="/(public)/create-account" asChild>
            <Button variant="link">
              <ButtonText variant="link">Create Account</ButtonText>
            </Button>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
