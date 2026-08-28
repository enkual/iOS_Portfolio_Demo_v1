import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';

import { CONTENT_WIDTH, colors } from '../theme/tokens';
import { font, tabularNums } from '../theme/typography';
import { toneColor } from '../theme/colorFor';
import { RollChart } from '../state/derive';

/** One rolling-metric chart card (Sharpe / Beta / Jensen's Alpha), each sharing the Window control. */
export function RollingChartCard({ rc }: { rc: RollChart }) {
  return (
    <View style={styles.card}>
      <View style={styles.headRow}>
        <Text style={font(800, 12.5, { color: colors.ink, letterSpacingEm: 0.02, uppercase: true })}>{rc.title}</Text>
        <Text style={[font(700, 20, { color: toneColor(rc.tone) }), tabularNums]}>{rc.current}</Text>
      </View>
      <Text style={[font(500, 10.5, { color: colors.neutral700, lineHeight: 1.4 }), styles.explain]}>{rc.explain}</Text>
      <Svg viewBox={`0 0 ${CONTENT_WIDTH} 84`} width="100%" height={84} style={styles.svg}>
        <Line x1="0" y1={rc.refY} x2={CONTENT_WIDTH} y2={rc.refY} stroke="rgba(32,30,29,0.35)" strokeWidth={1} strokeDasharray={[3, 3]} />
        <Path d={rc.path} fill="none" stroke={colors.chartGreen} strokeWidth={2} strokeLinecap="butt" />
        <Line x1="0" y1="83" x2={CONTENT_WIDTH} y2="83" stroke={colors.ink} strokeWidth={1.5} />
      </Svg>
      <View style={styles.footRow}>
        <Text style={[font(500, 9.5, { color: colors.neutral600 }), tabularNums]}>{rc.lo}</Text>
        <Text style={[font(500, 9.5, { color: colors.neutral600 }), tabularNums]}>{rc.refLabel}</Text>
        <Text style={[font(500, 9.5, { color: colors.neutral600 }), tabularNums]}>{rc.hi}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 2, borderBottomColor: colors.ink },
  headRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  explain: { marginTop: 5, maxWidth: 330 },
  svg: { marginTop: 10 },
  footRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
});
