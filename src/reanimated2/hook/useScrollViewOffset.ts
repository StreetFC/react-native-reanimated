import { RefObject, useEffect } from 'react';

import { findNodeHandle } from 'react-native';
import type Animated from 'react-native-reanimated';
import { runOnUI } from '../';
import { useEvent, useSharedValue } from '.';
import { SharedValue } from '../commonTypes';
import { ScrollEvent } from './useAnimatedScrollHandler';

const subscribeForEvents = [
  'onScroll',
  'onScrollBeginDrag',
  'onScrollEndDrag',
  'onMomentumScrollBegin',
  'onMomentumScrollEnd',
];

export class ScrollViewOffset {
  public get value() {
    return 0;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public set value(v: number) {}
}

export function useScrollViewOffset(
  aref: RefObject<Animated.ScrollView>
): SharedValue<ScrollViewOffset> {
  const offsetRef = useSharedValue(new ScrollViewOffset());

  runOnUI((sharedValue: SharedValue<ScrollViewOffset>) => {
    'worklet';
    class ScrollViewOffset {
      private _aref: RefObject<Animated.ScrollView>;
      private offset = useSharedValue(0);

      constructor(aref: RefObject<Animated.ScrollView>) {
        this._aref = aref;
      }

      public get value(): number {
        return this.offset.value;
      }

      public set value(v: number) {
        this._aref.current?.scrollTo(v);
      }
    }

    sharedValue.value = new ScrollViewOffset(aref);
  })(offsetRef);

  const event = useEvent<ScrollEvent>((event: ScrollEvent) => {
    'worklet';
    offsetRef.value.value =
      event.contentOffset.x === 0
        ? event.contentOffset.y
        : event.contentOffset.x;
  }, subscribeForEvents);

  useEffect(() => {
    const viewTag = findNodeHandle(aref.current);
    event.current?.registerForEvents(viewTag as number);
  }, [aref.current]);

  return offsetRef;
}
