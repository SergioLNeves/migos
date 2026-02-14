import { Redirect, Slot } from 'expo-router';
import { useAuth } from '@/providers/auth-context';

export default function PrivateLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Redirect href="/(public)/login" />;
  }

  return <Slot />;
}
