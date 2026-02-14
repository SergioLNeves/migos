import { Text, View } from 'react-native';
import { Button, ButtonText, Logo } from '@/components';
import { useAuth } from '@/providers/auth-context';
import { useLogoutMutation } from '@/services/auth';

export default function DashboardScreen() {
  const { user } = useAuth();
  const logout = useLogoutMutation();

  return (
    <View className="flex-1 items-center justify-center gap-8 bg-canvas p-6">
      <Logo className="text-ansi-orange" size="sm" />

      <View className="items-center gap-2">
        <Text className="font-mono text-base text-foreground">{user?.name}</Text>
        <Text className="font-mono text-sm text-text-muted">{user?.email}</Text>
      </View>

      <Button variant="destructive" onPress={() => logout.mutate()} disabled={logout.isPending}>
        <ButtonText variant="destructive">
          {logout.isPending ? 'Signing out...' : 'Sign Out'}
        </ButtonText>
      </Button>
    </View>
  );
}
