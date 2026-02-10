import { Button, Card } from '@/components';
import { ButtonText } from '@/components/molecules/button';
import { View } from 'react-native';

export default function ButtonSection() {
  return (
    <Card title="BUTTONS">
      <View className="gap-3">
        <Button variant="default" onPress={() => console.log('default clicked')}>
          <ButtonText variant="default">default</ButtonText>
        </Button>
        <Button variant="outline" onPress={() => console.log('outline clicked')}>
          <ButtonText variant="outline">outline</ButtonText>
        </Button>
        <Button variant="link" onPress={() => console.log('link clicked')}>
          <ButtonText variant="link">link</ButtonText>
        </Button>
        <Button variant="secondary" onPress={() => console.log('secondary clicked')}>
          <ButtonText variant="secondary">secondary</ButtonText>
        </Button>
        <Button variant="ghost" onPress={() => console.log('ghost clicked')}>
          <ButtonText variant="ghost">ghost</ButtonText>
        </Button>
        <Button variant="destructive" onPress={() => console.log('destructive clicked')}>
          <ButtonText variant="destructive">destructive</ButtonText>
        </Button>
        <Button disabled={true}>
          <ButtonText disabled={true}>disabled</ButtonText>
        </Button>
      </View>
    </Card>
  );
}
