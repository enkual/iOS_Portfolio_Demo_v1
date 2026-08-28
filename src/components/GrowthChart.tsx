import React from 'react';
import Svg, { Line, Path } from 'react-native-svg';

import { CONTENT_WIDTH, colors } from '../theme/tokens';

/** Indexed-to-100 dual line chart: portfolio solid red, benchmark dashed ink. Mirrors the
 * source's fixed 362x132 viewBox exactly (see combo()/path() in the .dc.html). */
export function GrowthChart({ portPath, benchPath }: { portPath: string; benchPath: string }) {
  return (
    <Svg viewBox={`0 0 ${CONTENT_WIDTH} 132`} width="100%" height={132}>
      <Line x1="0" y1="131" x2={CONTENT_WIDTH} y2="131" stroke={colors.ink} strokeWidth={2} />
      <Line x1="0" y1="4" x2={CONTENT_WIDTH} y2="4" stroke="rgba(32,30,29,0.18)" strokeWidth={1} />
      <Line x1="0" y1="67" x2={CONTENT_WIDTH} y2="67" stroke="rgba(32,30,29,0.18)" strokeWidth={1} />
      <Path d={benchPath} fill="none" stroke={colors.ink} strokeWidth={1.5} strokeDasharray={[4, 3]} />
      <Path d={portPath} fill="none" stroke={colors.accent} strokeWidth={2.25} />
    </Svg>
  );
}
