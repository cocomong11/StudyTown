import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Rect, Path, G, Ellipse } from 'react-native-svg';

export default function Character({ customization, mode = 'idle', size = 100 }) {
  const skinColor = customization?.skinColor || '#FDBCB4';
  const hairColor = customization?.hairColor || '#3D2010';
  const outfitColor = customization?.outfitColor || '#6C8EBF';

  return (
    <View style={{ width: size, height: size * 1.4 }}>
      <Svg width={size} height={size * 1.4} viewBox='0 0 100 140'>
        <Ellipse cx={50} cy={133} rx={22} ry={5} fill='rgba(0,0,0,0.12)' />
        <Rect x={20} y={65} width={10} height={40} rx={5} fill={skinColor} />
        <Rect x={70} y={65} width={10} height={40} rx={5} fill={skinColor} />
        <Rect x={35} y={60} width={30} height={50} rx={8} fill={outfitColor} />
        <Rect x={38} y={110} width={10} height={25} rx={5} fill='#2A3A5A' />
        <Rect x={52} y={110} width={10} height={25} rx={5} fill='#2A3A5A' />
        <Rect x={44} y={55} width={12} height={8} fill={skinColor} />
        <Circle cx={50} cy={40} r={20} fill={skinColor} />
        <Path d='M 30 35 Q 30 15, 50 10 Q 70 15, 70 35' fill={hairColor} />
        <Circle cx={28} cy={38} r={5} fill={skinColor} />
        <Circle cx={72} cy={38} r={5} fill={skinColor} />
        <Circle cx={42} cy={36} r={5} fill='#FFFFFF' />
        <Circle cx={58} cy={36} r={5} fill='#FFFFFF' />
        <Circle cx={42} cy={36} r={3} fill='#4A90E2' />
        <Circle cx={58} cy={36} r={3} fill='#4A90E2' />
        <Circle cx={42} cy={37} r={1.5} fill='#000000' />
        <Circle cx={58} cy={37} r={1.5} fill='#000000' />
        <Ellipse cx={50} cy={43} rx={2} ry={3} fill={skinColor} />
        <Path d='M 46 48 Q 50 50, 54 48' stroke='#E8A0A0' strokeWidth='1' fill='none' strokeLinecap='round' />
        <Circle cx={35} cy={42} r={5} fill='#FF9999' opacity='0.4' />
        <Circle cx={65} cy={42} r={5} fill='#FF9999' opacity='0.4' />
        <Circle cx={50} cy={75} r={1.5} fill='#444444' />
        <Circle cx={50} cy={85} r={1.5} fill='#444444' />
      </Svg>
    </View>
  );
}
