// src/components/Character.js
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Svg, {
  Circle, Ellipse, Rect, Path, G, Defs,
  RadialGradient, Stop, LinearGradient, ClipPath
} from 'react-native-svg';
import Animated, {
  useSharedValue, useAnimatedProps, withRepeat,
  withTiming, withSequence, Easing, interpolate,
  useAnimatedStyle, withDelay,
} from 'react-native-reanimated';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

// ─── Color maps ──────────────────────────────────────────────
const SKIN = {
  s1: { base: '#FDBCB4', shadow: '#F09080', highlight: '#FFD8D0' },
  s2: { base: '#F4A574', shadow: '#D07040', highlight: '#FFD090' },
  s3: { base: '#C88050', shadow: '#A05030', highlight: '#E0A070' },
  s4: { base: '#8A5530', shadow: '#6A3510', highlight: '#AA7550' },
  s5: { base: '#6B3A2A', shadow: '#4A2010', highlight: '#8B5A4A' },
};

const HAIR = {
  hc1: '#1A0A00', hc2: '#3D2010', hc3: '#8B5E3C',
  hc4: '#C8A050', hc5: '#E8D070', hc6: '#D4607A',
  hc7: '#6080E8', hc8: '#A050C0',
};

const OUTFIT = {
  oc1: '#6C8EBF', oc2: '#E8806A', oc3: '#6DBF8E',
  oc4: '#C080D0', oc5: '#E8C050', oc6: '#7090A0',
  oc7: '#E87090', oc8: '#808080',
};

// ─── Main Character Component ────────────────────────────────
export default function Character({
  customization,
  mode = 'idle', // idle | walking | studying | stretching | celebrate
  size = 100,
  style,
}) {
  const skin = SKIN[customization?.skinColor] || SKIN.s1;
  const hairC = HAIR[customization?.hairColor] || HAIR.hc2;
  const outfitC = OUTFIT[customization?.outfitColor] || OUTFIT.oc1;
  const hairStyle = customization?.hairStyle || 'short';

  // ── Animations ──
  const bodyBob = useSharedValue(0);
  const headTilt = useSharedValue(0);
  const leftArmRot = useSharedValue(0);
  const rightArmRot = useSharedValue(0);
  const leftLegRot = useSharedValue(0);
  const rightLegRot = useSharedValue(0);
  const blinkScale = useSharedValue(1);
  const breathe = useSharedValue(1);
  const eyeHappy = useSharedValue(0);

  useEffect(() => {
    // Blink every 3 seconds
    const blinkLoop = () => {
      blinkScale.value = withSequence(
        withTiming(0.1, { duration: 80 }),
        withTiming(1, { duration: 80 }),
        withDelay(3000, withTiming(1, { duration: 0 }))
      );
      setTimeout(blinkLoop, 3200 + Math.random() * 2000);
    };
    blinkLoop();

    if (mode === 'idle') {
      bodyBob.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.sin) })
        ), -1, true
      );
      breathe.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
        ), -1, true
      );
      leftArmRot.value = withRepeat(
        withSequence(withTiming(5, { duration: 1200 }), withTiming(-5, { duration: 1200 })),
        -1, true
      );
      rightArmRot.value = withRepeat(
        withSequence(withTiming(-5, { duration: 1200 }), withTiming(5, { duration: 1200 })),
        -1, true
      );
    }

    if (mode === 'walking') {
      bodyBob.value = withRepeat(
        withSequence(withTiming(-4, { duration: 300 }), withTiming(0, { duration: 300 })),
        -1, true
      );
      leftArmRot.value = withRepeat(
        withSequence(withTiming(25, { duration: 300 }), withTiming(-25, { duration: 300 })),
        -1, true
      );
      rightArmRot.value = withRepeat(
        withSequence(withTiming(-25, { duration: 300 }), withTiming(25, { duration: 300 })),
        -1, true
      );
      leftLegRot.value = withRepeat(
        withSequence(withTiming(-20, { duration: 300 }), withTiming(20, { duration: 300 })),
        -1, true
      );
      rightLegRot.value = withRepeat(
        withSequence(withTiming(20, { duration: 300 }), withTiming(-20, { duration: 300 })),
        -1, true
      );
    }

    if (mode === 'studying') {
      bodyBob.value = withRepeat(
        withSequence(withTiming(-1, { duration: 2000 }), withTiming(0, { duration: 2000 })),
        -1, true
      );
      // Writing motion
      rightArmRot.value = withRepeat(
        withSequence(
          withTiming(8, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(-8, { duration: 400, easing: Easing.inOut(Easing.ease) })
        ), -1, true
      );
      headTilt.value = withRepeat(
        withSequence(withTiming(-3, { duration: 3000 }), withTiming(3, { duration: 3000 })),
        -1, true
      );
    }

    if (mode === 'stretching') {
      // Arms up stretch
      leftArmRot.value = withSequence(
        withTiming(-120, { duration: 800, easing: Easing.out(Easing.back(1.5)) }),
        withDelay(1500, withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) }))
      );
      rightArmRot.value = withSequence(
        withTiming(120, { duration: 800, easing: Easing.out(Easing.back(1.5)) }),
        withDelay(1500, withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) }))
      );
      bodyBob.value = withSequence(
        withTiming(-6, { duration: 800 }),
        withDelay(1500, withTiming(0, { duration: 600 }))
      );
      eyeHappy.value = withSequence(
        withTiming(1, { duration: 400 }),
        withDelay(2000, withTiming(0, { duration: 400 }))
      );
    }

    if (mode === 'celebrate') {
      bodyBob.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 200, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 200, easing: Easing.in(Easing.quad) })
        ), 4, true
      );
      leftArmRot.value = withRepeat(
        withSequence(withTiming(-100, { duration: 200 }), withTiming(-80, { duration: 200 })),
        4, true
      );
      rightArmRot.value = withRepeat(
        withSequence(withTiming(100, { duration: 200 }), withTiming(80, { duration: 200 })),
        4, true
      );
      eyeHappy.value = withTiming(1, { duration: 300 });
    }
  }, [mode]);

  // Scale
  const S = size / 100;

  // Animated styles
  const bodyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bodyBob.value }],
  }));

  const cx = 50, cy = 50; // center

  return (
    <Animated.View style={[{ width: size, height: size * 1.4 }, bodyStyle, style]}>
      <Svg
        width={size}
        height={size * 1.4}
        viewBox="0 0 100 140"
      >
        <Defs>
          <RadialGradient id="skinGrad" cx="40%" cy="35%" r="60%">
            <Stop offset="0%" stopColor={skin.highlight} />
            <Stop offset="100%" stopColor={skin.base} />
          </RadialGradient>
          <RadialGradient id="eyeGrad" cx="30%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#5060A0" />
            <Stop offset="100%" stopColor="#1A1A40" />
          </RadialGradient>
          <LinearGradient id="outfitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={outfitC} />
            <Stop offset="100%" stopColor={darken(outfitC, 20)} />
          </LinearGradient>
          <LinearGradient id="pantsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#4A5A7A" />
            <Stop offset="100%" stopColor="#2A3A5A" />
          </LinearGradient>
        </Defs>

        {/* Shadow */}
        <Ellipse cx={cx} cy={133} rx={22} ry={5} fill="rgba(0,0,0,0.12)" />

        {/* ── LEFT ARM ── */}
        <AnimatedArm
          x={cx - 14} y={cy + 8}
          side="left"
          rotValue={leftArmRot}
          skinColor={skin.base}
          outfitColor={outfitC}
        />

        {/* ── RIGHT ARM ── */}
        <AnimatedArm
          x={cx + 14} y={cy + 8}
          side="right"
          rotValue={rightArmRot}
          skinColor={skin.base}
          outfitColor={outfitC}
        />

        {/* ── BODY / TORSO ── */}
        <Path
          d={`M${cx - 14},${cy + 6} Q${cx - 16},${cy + 28} ${cx - 10},${cy + 36} L${cx + 10},${cy + 36} Q${cx + 16},${cy + 28} ${cx + 14},${cy + 6} Z`}
          fill="url(#outfitGrad)"
        />
        {/* Shirt collar */}
        <Path
          d={`M${cx - 5},${cy + 6} L${cx},${cy + 12} L${cx + 5},${cy + 6}`}
          fill={lighten(outfitC, 30)}
          stroke={darken(outfitC, 10)}
          strokeWidth="0.5"
        />
        {/* Shirt button */}
        <Circle cx={cx} cy={cy + 18} r={1.5} fill={darken(outfitC, 30)} />
        <Circle cx={cx} cy={cy + 24} r={1.5} fill={darken(outfitC, 30)} />

        {/* ── LEGS ── */}
        <AnimatedLeg
          x={cx - 6} y={cy + 36}
          side="left"
          rotValue={leftLegRot}
        />
        <AnimatedLeg
          x={cx + 6} y={cy + 36}
          side="right"
          rotValue={rightLegRot}
        />

        {/* ── NECK ── */}
        <Rect
          x={cx - 5} y={cy - 6}
          width={10} height={12}
          rx={4}
          fill={skin.base}
        />

        {/* ── HEAD ── */}
        {/* Head shape */}
        <Ellipse
          cx={cx} cy={cy - 18}
          rx={18} ry={20}
          fill="url(#skinGrad)"
        />
        {/* Jaw shadow */}
        <Ellipse
          cx={cx} cy={cy - 6}
          rx={14} ry={8}
          fill={skin.shadow}
          opacity={0.15}
        />
        {/* Ear left */}
        <Ellipse cx={cx - 18} cy={cy - 18} rx={5} ry={6} fill={skin.base} />
        <Ellipse cx={cx - 18} cy={cy - 18} rx={3} ry={4} fill={skin.shadow} opacity={0.4} />
        {/* Ear right */}
        <Ellipse cx={cx + 18} cy={cy - 18} rx={5} ry={6} fill={skin.base} />
        <Ellipse cx={cx + 18} cy={cy - 18} rx={3} ry={4} fill={skin.shadow} opacity={0.4} />

        {/* ── HAIR ── */}
        <HairComponent style={hairStyle} color={hairC} cx={cx} cy={cy} />

        {/* ── FACE ── */}
        {/* Cheeks */}
        <Ellipse cx={cx - 12} cy={cy - 12} rx={6} ry={4} fill="#FFB0B0" opacity={0.45} />
        <Ellipse cx={cx + 12} cy={cy - 12} rx={6} ry={4} fill="#FFB0B0" opacity={0.45} />

        {/* Eyes */}
        <AnimatedEyes
          cx={cx} cy={cy}
          blinkScale={blinkScale}
          eyeHappy={eyeHappy}
          customization={customization}
        />

        {/* Nose */}
        <Ellipse cx={cx} cy={cy - 12} rx={2} ry={1.5} fill={skin.shadow} opacity={0.5} />

        {/* Mouth */}
        <AnimatedMouth cx={cx} cy={cy} eyeHappy={eyeHappy} mode={mode} />

        {/* Study accessories */}
        {mode === 'studying' && (
          <G>
            {/* Glasses */}
            <Rect x={cx - 14} y={cy - 21} width={10} height={7} rx={2}
              fill="none" stroke="#6A4020" strokeWidth={1.5} />
            <Rect x={cx + 4} y={cy - 21} width={10} height={7} rx={2}
              fill="none" stroke="#6A4020" strokeWidth={1.5} />
            <Path d={`M${cx - 4},${cy - 17} L${cx + 4},${cy - 17}`}
              stroke="#6A4020" strokeWidth={1.5} />
          </G>
        )}
      </Svg>
    </Animated.View>
  );
}

// ── Arm component ──────────────────────────────────────────
function AnimatedArm({ x, y, side, rotValue, skinColor, outfitColor }) {
  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x },
      { translateY: y },
      { rotate: `${rotValue.value}deg` },
      { translateX: -x },
      { translateY: -y },
    ],
  }));

  const flipX = side === 'right' ? 1 : -1;

  return (
    <Animated.View style={[{ position: 'absolute' }, animStyle]}>
      <Svg width={100} height={140} viewBox="0 0 100 140" style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Sleeve */}
        <Rect
          x={side === 'left' ? x - 18 : x + 4}
          y={y}
          width={14} height={18} rx={5}
          fill={outfitColor}
        />
        {/* Forearm */}
        <Rect
          x={side === 'left' ? x - 17 : x + 5}
          y={y + 15}
          width={12} height={16} rx={4}
          fill={skinColor}
        />
        {/* Hand */}
        <Ellipse
          cx={side === 'left' ? x - 11 : x + 11}
          cy={y + 33}
          rx={7} ry={7}
          fill={skinColor}
        />
      </Svg>
    </Animated.View>
  );
}

// ── Leg component ──────────────────────────────────────────
function AnimatedLeg({ x, y, side, rotValue }) {
  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x },
      { translateY: y },
      { rotate: `${rotValue.value}deg` },
      { translateX: -x },
      { translateY: -y },
    ],
  }));

  return (
    <Animated.View style={[{ position: 'absolute' }, animStyle]}>
      <Svg width={100} height={140} viewBox="0 0 100 140" style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Pants */}
        <Rect x={side === 'left' ? x - 9 : x - 1} y={y} width={12} height={22} rx={4}
          fill="url(#pantsGrad)" />
        {/* Shoe */}
        <Ellipse
          cx={side === 'left' ? x - 3 : x + 5}
          cy={y + 26}
          rx={9} ry={5}
          fill="#2A2A3A"
        />
        <Ellipse
          cx={side === 'left' ? x - 1 : x + 7}
          cy={y + 24}
          rx={4} ry={2}
          fill="#4A4A5A"
        />
      </Svg>
    </Animated.View>
  );
}

// ── Hair component ─────────────────────────────────────────
function HairComponent({ style, color, cx, cy }) {
  const shadowColor = darken(color, 20);
  const highlightColor = lighten(color, 20);

  if (style === 'short') {
    return (
      <G>
        <Ellipse cx={cx} cy={cy - 28} rx={18} ry={10} fill={color} />
        <Ellipse cx={cx} cy={cy - 22} rx={19} ry={7} fill={color} />
        <Ellipse cx={cx - 16} cy={cy - 20} rx={5} ry={8} fill={color} />
        <Ellipse cx={cx + 16} cy={cy - 20} rx={5} ry={8} fill={color} />
        {/* Highlight streak */}
        <Path d={`M${cx - 4},${cy - 36} Q${cx + 2},${cy - 32} ${cx + 4},${cy - 26}`}
          stroke={highlightColor} strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.5} />
      </G>
    );
  }
  if (style === 'long') {
    return (
      <G>
        <Ellipse cx={cx} cy={cy - 28} rx={18} ry={10} fill={color} />
        <Ellipse cx={cx} cy={cy - 22} rx={19} ry={7} fill={color} />
        <Rect x={cx - 20} y={cy - 26} width={8} height={45} rx={4} fill={color} />
        <Rect x={cx + 12} y={cy - 26} width={8} height={45} rx={4} fill={color} />
        <Path d={`M${cx - 20},${cy + 10} Q${cx - 22},${cy + 18} ${cx - 18},${cy + 20}`}
          stroke={color} strokeWidth={6} strokeLinecap="round" fill="none" />
        <Path d={`M${cx + 20},${cy + 10} Q${cx + 22},${cy + 18} ${cx + 18},${cy + 20}`}
          stroke={color} strokeWidth={6} strokeLinecap="round" fill="none" />
        <Path d={`M${cx - 4},${cy - 36} Q${cx + 2},${cy - 32} ${cx + 4},${cy - 26}`}
          stroke={highlightColor} strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.5} />
      </G>
    );
  }
  if (style === 'curly') {
    const curls = Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2;
      return { x: cx + Math.cos(a) * 14, y: cy - 22 + Math.sin(a) * 9 };
    });
    return (
      <G>
        {curls.map((c, i) => (
          <Circle key={i} cx={c.x} cy={c.y} r={7} fill={color} />
        ))}
        <Circle cx={cx} cy={cy - 22} r={12} fill={color} />
        <Circle cx={cx - 2} cy={cy - 30} r={7} fill={highlightColor} opacity={0.4} />
      </G>
    );
  }
  if (style === 'bun') {
    return (
      <G>
        <Ellipse cx={cx} cy={cy - 28} rx={18} ry={9} fill={color} />
        <Ellipse cx={cx} cy={cy - 22} rx={18} ry={6} fill={color} />
        {/* Bun */}
        <Circle cx={cx} cy={cy - 40} r={10} fill={color} />
        <Circle cx={cx - 3} cy={cy - 43} r={4} fill={highlightColor} opacity={0.45} />
        {/* Hair band */}
        <Ellipse cx={cx} cy={cy - 34} rx={12} ry={4} fill={shadowColor} />
      </G>
    );
  }
  if (style === 'twin') {
    return (
      <G>
        <Ellipse cx={cx} cy={cy - 28} rx={18} ry={10} fill={color} />
        <Ellipse cx={cx} cy={cy - 22} rx={19} ry={7} fill={color} />
        {/* Twin tails */}
        <Path d={`M${cx - 18},${cy - 24} Q${cx - 28},${cy - 10} ${cx - 22},${cy + 12} Q${cx - 18},${cy + 22} ${cx - 14},${cy + 20}`}
          stroke={color} strokeWidth={8} strokeLinecap="round" fill="none" />
        <Path d={`M${cx + 18},${cy - 24} Q${cx + 28},${cy - 10} ${cx + 22},${cy + 12} Q${cx + 18},${cy + 22} ${cx + 14},${cy + 20}`}
          stroke={color} strokeWidth={8} strokeLinecap="round" fill="none" />
        {/* Hair bands */}
        <Circle cx={cx - 18} cy={cy - 20} r={4} fill={shadowColor} />
        <Circle cx={cx + 18} cy={cy - 20} r={4} fill={shadowColor} />
        <Path d={`M${cx - 4},${cy - 36} Q${cx + 2},${cy - 32} ${cx + 4},${cy - 26}`}
          stroke={highlightColor} strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.5} />
      </G>
    );
  }
  return null;
}

// ── Eyes ──────────────────────────────────────────────────
function AnimatedEyes({ cx, cy, blinkScale, eyeHappy, customization }) {
  const eyeScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: blinkScale.value }],
  }));
  const happyStyle = useAnimatedStyle(() => ({
    opacity: eyeHappy.value,
  }));
  const normalStyle = useAnimatedStyle(() => ({
    opacity: 1 - eyeHappy.value * 0.8,
  }));

  return (
    <G>
      {/* Normal eyes */}
      <Animated.View style={[{ position: 'absolute' }, normalStyle]}>
        <Svg width={100} height={140} viewBox="0 0 100 140" style={{ position: 'absolute' }}>
          <Ellipse cx={cx - 7} cy={cy - 18} rx={5} ry={5.5} fill="url(#eyeGrad)" />
          <Ellipse cx={cx + 7} cy={cy - 18} rx={5} ry={5.5} fill="url(#eyeGrad)" />
          <Circle cx={cx - 6} cy={cy - 19} r={2} fill="white" opacity={0.9} />
          <Circle cx={cx + 8} cy={cy - 19} r={2} fill="white" opacity={0.9} />
          <Circle cx={cx - 5} cy={cy - 20} r={1} fill="white" opacity={0.6} />
          {/* Eyelashes top */}
          <Path d={`M${cx - 12},${cy - 23} Q${cx - 7},${cy - 26} ${cx - 2},${cy - 24}`}
            stroke="#1A1A30" strokeWidth={1.5} fill="none" strokeLinecap="round" />
          <Path d={`M${cx + 2},${cy - 23} Q${cx + 7},${cy - 26} ${cx + 12},${cy - 24}`}
            stroke="#1A1A30" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </Svg>
      </Animated.View>
      {/* Happy ^ ^ eyes */}
      <Animated.View style={[{ position: 'absolute' }, happyStyle]}>
        <Svg width={100} height={140} viewBox="0 0 100 140" style={{ position: 'absolute' }}>
          <Path d={`M${cx - 12},${cy - 18} Q${cx - 7},${cy - 24} ${cx - 2},${cy - 18}`}
            stroke="#1A1A30" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <Path d={`M${cx + 2},${cy - 18} Q${cx + 7},${cy - 24} ${cx + 12},${cy - 18}`}
            stroke="#1A1A30" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </Svg>
      </Animated.View>
    </G>
  );
}

// ── Mouth ──────────────────────────────────────────────────
function AnimatedMouth({ cx, cy, eyeHappy, mode }) {
  const happyStyle = useAnimatedStyle(() => ({
    opacity: eyeHappy.value,
  }));
  const normalStyle = useAnimatedStyle(() => ({
    opacity: 1 - eyeHappy.value * 0.8,
  }));

  return (
    <G>
      <Animated.View style={[{ position: 'absolute' }, normalStyle]}>
        <Svg width={100} height={140} viewBox="0 0 100 140" style={{ position: 'absolute' }}>
          <Path
            d={`M${cx - 5},${cy - 8} Q${cx},${cy - 5} ${cx + 5},${cy - 8}`}
            stroke="#C06060" strokeWidth={1.8} fill="none" strokeLinecap="round"
          />
        </Svg>
      </Animated.View>
      <Animated.View style={[{ position: 'absolute' }, happyStyle]}>
        <Svg width={100} height={140} viewBox="0 0 100 140" style={{ position: 'absolute' }}>
          <Path
            d={`M${cx - 7},${cy - 10} Q${cx},${cy - 2} ${cx + 7},${cy - 10}`}
            stroke="#C06060" strokeWidth={2} fill="#FFB0B0" strokeLinecap="round"
          />
        </Svg>
      </Animated.View>
    </G>
  );
}

// ── Helpers ────────────────────────────────────────────────
function darken(hex, amount) {
  try {
    let r = parseInt(hex.slice(1, 3), 16) - amount;
    let g = parseInt(hex.slice(3, 5), 16) - amount;
    let b = parseInt(hex.slice(5, 7), 16) - amount;
    return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
  } catch { return hex; }
}

function lighten(hex, amount) {
  try {
    let r = parseInt(hex.slice(1, 3), 16) + amount;
    let g = parseInt(hex.slice(3, 5), 16) + amount;
    let b = parseInt(hex.slice(5, 7), 16) + amount;
    return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
  } catch { return hex; }
}
