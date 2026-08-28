import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface IconProps {
  color: string;
  size?: number;
}

const strokeProps = { fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export function UserIcon({ color, size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...strokeProps} stroke={color}>
      <Circle cx="12" cy="8" r="4" />
      <Path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </Svg>
  );
}

export function BellIcon({ color, size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...strokeProps} stroke={color}>
      <Path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
      <Path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </Svg>
  );
}

export function PortfolioTabIcon({ color, size = 19 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...strokeProps} stroke={color}>
      <Path d="M3 21V9l9-6 9 6v12" />
      <Path d="M9 21v-7h6v7" />
    </Svg>
  );
}

export function AnalysisTabIcon({ color, size = 19 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...strokeProps} stroke={color}>
      <Path d="M3 3v18h18" />
      <Path d="M7 15l4-5 3 3 5-7" />
    </Svg>
  );
}

export function DividendsTabIcon({ color, size = 19 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...strokeProps} stroke={color}>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 7v10" />
      <Path d="M14.6 9.5c-.4-.9-1.4-1.4-2.6-1.4-1.5 0-2.6.8-2.6 2s1.1 1.8 2.6 2 2.7.7 2.7 2-1.2 2-2.7 2c-1.3 0-2.3-.5-2.7-1.5" />
    </Svg>
  );
}
