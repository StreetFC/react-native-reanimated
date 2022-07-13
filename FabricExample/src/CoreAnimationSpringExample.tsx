import { StyleSheet, View, Button } from 'react-native';

import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export default function CoreAnimationSpringExample() {
  const sv = useSharedValue(0);

  const ref = React.useRef(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: sv.value }],
    };
  });

  const handlePress = () => {
    sv.value = withSpring(ref.current * 90);
    ref.current = -ref.current;
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, animatedStyle]} />
      <Button title="Animate" onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 130,
    height: 130,
    marginVertical: 30,
    backgroundColor: 'navy',
  },
});