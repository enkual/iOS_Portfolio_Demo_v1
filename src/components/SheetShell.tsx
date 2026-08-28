import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { colors } from '../theme/tokens';
import { font } from '../theme/typography';
import { OutlineButton } from './Button';

interface Props {
  kicker: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

/** Modal bottom sheet: semi-transparent backdrop (tap to dismiss) + a panel sliding up from the
 * bottom, matching the source's sheetUp/fadeIn keyframes. Used by both the add/sell sheet and
 * the closed-lot adjust sheet. */
export function SheetShell({ kicker, title, onClose, children }: Props) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} style={StyleSheet.absoluteFill}>
        <Pressable style={styles.backdrop} onPress={onClose} />
      </Animated.View>
      <Animated.View entering={SlideInDown.duration(260)} exiting={SlideOutDown.duration(200)} style={styles.panelWrap}>
        <View style={styles.panel}>
          <View style={styles.head}>
            <View>
              <Text style={font(600, 9, { color: colors.neutral600, letterSpacingEm: 0.18, uppercase: true })}>{kicker}</Text>
              <Text style={[font(800, 22, { color: colors.ink, letterSpacingEm: -0.01 }), styles.title]}>{title}</Text>
            </View>
            <OutlineButton label="Close" onPress={onClose} style={styles.closeBtn} />
          </View>
          <ScrollView keyboardShouldPersistTaps="handled">{children}</ScrollView>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(32,30,29,0.55)' },
  panelWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '88%' },
  panel: { backgroundColor: colors.bg, borderTopWidth: 2, borderTopColor: colors.ink, maxHeight: '100%' },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
  },
  title: { marginTop: 5 },
  closeBtn: { paddingVertical: 7, paddingHorizontal: 11 },
});
