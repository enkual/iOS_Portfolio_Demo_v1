import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Path, Rect } from 'react-native-svg';

import { CONTENT_WIDTH, colors } from '../theme/tokens';
import { font } from '../theme/typography';
import { HistBar, HistTick } from '../state/derive';

interface Props {
  histPort: HistBar[];
  histBench: HistBar[];
  normalPath: string;
  showNormal: boolean;
  zeroX: number;
  histTicks: HistTick[];
}

/** Overlapping return-distribution histogram: portfolio in translucent green, benchmark in
 * translucent ink, an optional normal-fit overlay, a zero-return reference line, and tick labels
 * rendered as Text below the SVG (kept out of the SVG itself, matching the source's fix for
 * crisp tick text). Tick x-positions are expressed in the fixed 362-wide viewBox space and
 * rescaled to the actually-measured row width so they line up with the (percentage-scaled) SVG
 * on any device width. */
export function Histogram({ histPort, histBench, normalPath, showNormal, zeroX, histTicks }: Props) {
  const [rowWidth, setRowWidth] = useState(CONTENT_WIDTH);
  const onLayout = (e: LayoutChangeEvent) => setRowWidth(e.nativeEvent.layout.width);
  return (
    <View>
      <Svg viewBox={`0 0 ${CONTENT_WIDTH} 138`} width="100%" height={138}>
        {histBench.map((b, i) => (
          <Rect key={'b' + i} x={b.x} y={b.y} width={b.w} height={b.h} fill="rgba(32,30,29,0.42)" />
        ))}
        {histPort.map((b, i) => (
          <Rect key={'p' + i} x={b.x} y={b.y} width={b.w} height={b.h} fill="#0F6A0D8C" />
        ))}
        {showNormal ? <Path d={normalPath} fill="none" stroke={colors.ink} strokeWidth={1.6} strokeDasharray={[4, 3]} /> : null}
        <Line x1={zeroX} y1="0" x2={zeroX} y2="132" stroke="rgba(32,30,29,0.45)" strokeWidth={1} />
        <Line x1="0" y1="132" x2={CONTENT_WIDTH} y2="132" stroke={colors.ink} strokeWidth={1.5} />
        {histTicks.map((t, i) => (
          <Line key={i} x1={t.x} y1="132" x2={t.x} y2="137" stroke="rgba(32,30,29,0.45)" strokeWidth={1} />
        ))}
      </Svg>
      <View style={styles.tickRow} onLayout={onLayout}>
        {histTicks.map((t, i) => (
          <Text
            key={i}
            style={[font(500, 9.5, { color: colors.neutral600 }), styles.tickLabel, { left: (t.x / CONTENT_WIDTH) * rowWidth - 12 }]}
          >
            {t.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tickRow: { position: 'relative', height: 14, width: '100%' },
  tickLabel: { position: 'absolute', width: 24, textAlign: 'center' },
});
