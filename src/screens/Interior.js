// src/screens/Interior.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions, Alert, Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSpring, withSequence, withDelay,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { G, Rect, Polygon, Ellipse, Path, Circle, Text as SvgText } from 'react-native-svg';
import Character from '../components/Character';
import { useGameStore } from '../store/gameStore';

const { width: SW, height: SH } = Dimensions.get('window');

// NPC characters
const NPCS = [
  { id: 1, skin: 's1', hair: 'hc2', outfit: 'oc1', hairStyle: 'short', name: '민준', mode: 'studying' },
  { id: 2, skin: 's2', hair: 'hc4', outfit: 'oc2', hairStyle: 'long', name: '지아', mode: 'studying' },
  { id: 3, skin: 's3', hair: 'hc3', outfit: 'oc3', hairStyle: 'curly', name: '하율', mode: 'idle' },
  { id: 4, skin: 's1', hair: 'hc6', outfit: 'oc4', hairStyle: 'bun', name: '소연', mode: 'studying' },
];

const SEATS = [
  { id: 0, x: 0.18, y: 0.55 },
  { id: 1, x: 0.38, y: 0.48 },
  { id: 2, x: 0.58, y: 0.52 },
  { id: 3, x: 0.76, y: 0.46 },
  { id: 4, x: 0.28, y: 0.70 },
  { id: 5, x: 0.65, y: 0.68 },
];

export default function InteriorScreen({ navigation, route }) {
  const building = route.params?.building;
  const store = useGameStore();
  const char = store.character;

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [timerMins, setTimerMins] = useState(25);
  const [timerRemain, setTimerRemain] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [charMode, setCharMode] = useState('idle');
  const [showStretch, setShowStretch] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const timerRef = useRef(null);
  const stretchTimerRef = useRef(null);
  const [npcModes, setNpcModes] = useState(NPCS.map(n => n.mode));

  // UI animations
  const headerOpacity = useSharedValue(0);
  const roomScale = useSharedValue(0.92);
  const completionScale = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 400 });
    roomScale.value = withSpring(1, { damping: 15 });
    store.visitBuilding(building?.id);

    // Random NPC stretch every 45 seconds
    const npcInterval = setInterval(() => {
      const idx = Math.floor(Math.random() * NPCS.length);
      setNpcModes(prev => {
        const next = [...prev];
        next[idx] = 'stretching';
        setTimeout(() => setNpcModes(p => { const n2=[...p]; n2[idx]='studying'; return n2; }), 3000);
        return next;
      });
    }, 45000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(npcInterval);
      clearTimeout(stretchTimerRef.current);
    };
  }, []);

  // Timer logic
  const startTimer = useCallback(() => {
    if (!selectedSeat && selectedSeat !== 0) {
      Alert.alert('자리를 먼저 선택해주세요!', '초록 버튼을 눌러 자리를 선택하세요.');
      return;
    }
    setTimerRunning(true);
    setCharMode('studying');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Schedule stretches every 25 minutes
    stretchTimerRef.current = setTimeout(() => triggerStretch(), 25 * 60 * 1000);

    timerRef.current = setInterval(() => {
      setTimerRemain(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          completeSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [selectedSeat, timerMins]);

  const pauseTimer = useCallback(() => {
    setTimerRunning(false);
    setCharMode('idle');
    clearInterval(timerRef.current);
    clearTimeout(stretchTimerRef.current);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const resetTimer = useCallback(() => {
    pauseTimer();
    setTimerRemain(timerMins * 60);
    setSessionDone(false);
  }, [timerMins]);

  const triggerStretch = useCallback(() => {
    setShowStretch(true);
    setCharMode('stretching');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setTimeout(() => {
      setShowStretch(false);
      setCharMode('studying');
    }, 3500);
  }, []);

  const completeSession = useCallback(() => {
    setTimerRunning(false);
    setCharMode('celebrate');
    setSessionDone(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completionScale.value = withSpring(1, { damping: 12 });

    const coins = store.completeSession(timerMins);
    store.checkMissions?.();
  }, [timerMins]);

  const setPreset = (m) => {
    if (timerRunning) return;
    setTimerMins(m);
    setTimerRemain(m * 60);
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const progress = 1 - timerRemain / (timerMins * 60);

  // Animated styles
  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));
  const roomStyle = useAnimatedStyle(() => ({ transform: [{ scale: roomScale.value }] }));
  const completionStyle = useAnimatedStyle(() => ({
    transform: [{ scale: completionScale.value }],
    opacity: completionScale.value,
  }));

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={building?.bgColor ? [building.bgColor, '#FFFFFF'] : ['#FFF8F0', '#FFFFFF']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <Animated.View style={[styles.header, headerStyle]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{building?.emoji} {building?.name}</Text>
        <View style={[styles.timerChip, timerRunning && styles.timerChipActive]}>
          <Text style={styles.timerChipText}>{formatTime(timerRemain)}</Text>
        </View>
      </Animated.View>

      {/* Isometric Room */}
      <Animated.View style={[styles.roomContainer, roomStyle]}>
        <IsometricRoom building={building} />

        {/* NPCs */}
        {NPCS.map((npc, i) => (
          <View
            key={npc.id}
            style={[styles.npcWrap, {
              left: (0.15 + i * 0.22) * SW - 30,
              top: 60 + Math.sin(i) * 20,
            }]}
          >
            <Character
              customization={{ skinColor: npc.skin, hairColor: npc.hair, outfitColor: npc.outfit, hairStyle: npc.hairStyle }}
              mode={npcModes[i]}
              size={52}
            />
            <View style={styles.npcLabel}>
              <Text style={styles.npcName}>{npc.name}</Text>
            </View>
          </View>
        ))}

        {/* Player character at selected seat */}
        {(selectedSeat !== null) && (
          <View style={[styles.playerWrap, {
            left: SEATS[selectedSeat].x * SW - 35,
            top: SEATS[selectedSeat].y * 240 - 40,
          }]}>
            <Character
              customization={{
                skinColor: char.skinColor,
                hairColor: char.hairColor,
                outfitColor: char.outfitColor,
                hairStyle: char.hairStyle,
              }}
              mode={charMode}
              size={62}
            />
            <View style={[styles.npcLabel, { backgroundColor: 'rgba(100,80,220,0.9)' }]}>
              <Text style={styles.npcName}>{char.name}</Text>
            </View>
            {/* Pet companion */}
            {store.activePet && (
              <Text style={styles.petCompanion}>
                {store.activePet === 'cat' ? '🐱' : store.activePet === 'dog' ? '🐶' : '🐾'}
              </Text>
            )}
          </View>
        )}

        {/* Seat selection buttons */}
        {SEATS.map((seat, i) => {
          const isMine = selectedSeat === i;
          const isTaken = i < 3 && !isMine; // first 3 taken by NPCs
          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.seatBtn,
                { left: seat.x * SW - 14, top: seat.y * 240 + 20 },
                isTaken && styles.seatTaken,
                isMine && styles.seatMine,
              ]}
              onPress={() => {
                if (isTaken) return;
                setSelectedSeat(isMine ? null : i);
                if (!isMine) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              disabled={isTaken}
            >
              <Text style={styles.seatBtnText}>{isMine ? '나' : isTaken ? '×' : i + 1}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Stretch notification */}
        {showStretch && (
          <View style={styles.stretchBanner}>
            <Text style={styles.stretchText}>🧘 스트레칭 타임!</Text>
            <Text style={styles.stretchSub}>잠깐 몸을 풀어봐요</Text>
          </View>
        )}
      </Animated.View>

      {/* Controls */}
      <ScrollView style={styles.controls} contentContainerStyle={styles.controlsContent}>
        {/* Timer display */}
        <View style={styles.timerCard}>
          <Text style={styles.timerLabel}>집중 타이머</Text>
          <Text style={[styles.timerBig, timerRunning && styles.timerBigActive]}>
            {formatTime(timerRemain)}
          </Text>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>

          {/* Preset buttons */}
          <View style={styles.presets}>
            {[10, 25, 45, 60, 90, 120].map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.preset, timerMins === m && styles.presetActive]}
                onPress={() => setPreset(m)}
                disabled={timerRunning}
              >
                <Text style={[styles.presetText, timerMins === m && styles.presetTextActive]}>
                  {m < 60 ? `${m}분` : m === 60 ? '1시간' : '2시간'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            {!timerRunning ? (
              <TouchableOpacity style={styles.btnStart} onPress={startTimer}>
                <Text style={styles.btnText}>▶  시작하기</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.btnPause} onPress={pauseTimer}>
                <Text style={styles.btnText}>⏸  일시정지</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.btnReset} onPress={resetTimer}>
              <Text style={styles.btnResetText}>↺</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Who's studying */}
        <View style={styles.whoCard}>
          <Text style={styles.whoTitle}>지금 공부 중 👥</Text>
          <View style={styles.whoList}>
            {NPCS.map(npc => (
              <View key={npc.id} style={styles.whoItem}>
                <Character
                  customization={{ skinColor: npc.skin, hairColor: npc.hair, outfitColor: npc.outfit, hairStyle: npc.hairStyle }}
                  mode="idle"
                  size={40}
                />
                <Text style={styles.whoName}>{npc.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Session complete overlay */}
      {sessionDone && (
        <Animated.View style={[styles.completeOverlay, completionStyle]}>
          <BlurView intensity={80} style={StyleSheet.absoluteFill} />
          <View style={styles.completeCard}>
            <Text style={styles.completeEmoji}>🎉</Text>
            <Text style={styles.completeTitle}>집중 완료!</Text>
            <Text style={styles.completeSub}>{timerMins}분 공부 완료</Text>
            <Text style={styles.completeReward}>
              +{Math.floor(timerMins / 5) * 5} 코인 획득!
            </Text>
            <TouchableOpacity
              style={styles.btnStart}
              onPress={() => {
                setSessionDone(false);
                completionScale.value = withTiming(0, { duration: 300 });
                setCharMode('idle');
              }}
            >
              <Text style={styles.btnText}>계속하기</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

// ── Isometric Room SVG ─────────────────────────────────────
function IsometricRoom({ building }) {
  const W = SW, H = 240;
  const id = building?.id || 'cafe';

  const themes = {
    cafe:    { floor: '#D4A870', wall: '#F5E8D0', wallR: '#E8D4B8', accent: '#C8855A' },
    library: { floor: '#A8B8C8', wall: '#DCE8F5', wallR: '#C8D4E8', accent: '#5C7AB0' },
    park:    { floor: '#88C870', wall: '#D8F0C8', wallR: '#C4E0B0', accent: '#4A9A3A' },
    cinema:  { floor: '#6A4A8A', wall: '#E8D8F8', wallR: '#D4C4EC', accent: '#8060A0' },
    office:  { floor: '#7888A0', wall: '#DCE8F0', wallR: '#C8D4E4', accent: '#4A6080' },
    rooftop: { floor: '#2D3A5A', wall: '#1A2A4A', wallR: '#0D1A30', accent: '#3D4A6A' },
  };
  const t = themes[id] || themes.cafe;

  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* Back wall */}
      <Rect x={0} y={0} width={W} height={H * 0.55} fill={t.wall} />

      {/* Wall pattern - subtle grid */}
      {Array.from({ length: 6 }, (_, i) => (
        <Rect key={i} x={0} y={i * (H * 0.55 / 6)} width={W} height={1}
          fill="rgba(0,0,0,0.04)" />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <Rect key={i} x={i * (W / 10)} y={0} width={1} height={H * 0.55}
          fill="rgba(0,0,0,0.03)" />
      ))}

      {/* Windows */}
      {id !== 'rooftop' && [W * 0.15, W * 0.5, W * 0.82].map((wx, i) => (
        <G key={i}>
          <Rect x={wx - 30} y={12} width={60} height={70} rx={6}
            fill="rgba(180,230,255,0.5)" stroke="rgba(150,200,220,0.4)" strokeWidth={2} />
          <Rect x={wx - 1} y={12} width={2} height={70} fill="rgba(150,200,220,0.5)" />
          <Rect x={wx - 30} y={47} width={60} height={2} fill="rgba(150,200,220,0.5)" />
          {/* Window light */}
          <Rect x={wx - 28} y={14} width={26} height={31} rx={3}
            fill="rgba(255,255,200,0.15)" />
        </G>
      ))}

      {/* Floor */}
      <Polygon
        points={`0,${H * 0.55} ${W},${H * 0.55} ${W},${H} 0,${H}`}
        fill={t.floor}
      />
      {/* Floor planks - herringbone */}
      {Array.from({ length: 14 }, (_, row) =>
        Array.from({ length: 20 }, (_, col) => {
          const even = (row + col) % 2 === 0;
          const pw = W / 9, ph = 16;
          const x = col * pw - (row % 2) * pw / 2;
          const y = H * 0.55 + row * ph;
          return (
            <Rect key={`${row}-${col}`} x={x} y={y} width={pw - 1} height={ph - 1}
              fill={even ? t.floor : shadeHex(t.floor, -12)}
              rx={1}
            />
          );
        })
      )}

      {/* Floor-wall joint shadow */}
      <Rect x={0} y={H * 0.53} width={W} height={12}
        fill="rgba(0,0,0,0.08)" />

      {/* Furniture based on building type */}
      <RoomFurniture id={id} t={t} W={W} H={H} />
    </Svg>
  );
}

function RoomFurniture({ id, t, W, H }) {
  const floorY = H * 0.55;

  if (id === 'cafe' || id === 'park') {
    return (
      <G>
        {/* Counter */}
        <Rect x={W * 0.6} y={floorY - 5} width={W * 0.38} height={60} rx={6} fill={t.accent} />
        <Rect x={W * 0.6} y={floorY - 5} width={W * 0.38} height={16} rx={[6,6,0,0]} fill={shadeHex(t.accent, -15)} />
        {/* Coffee items on counter */}
        <Circle cx={W * 0.66} cy={floorY + 30} r={10} fill="#8B4513" />
        <Circle cx={W * 0.66} cy={floorY + 30} r={8} fill="#5C2A00" />
        <Ellipse cx={W * 0.73} cy={floorY + 28} rx={8} ry={14} fill="#D4B090" />
        <Ellipse cx={W * 0.73} cy={floorY + 22} rx={6} ry={5} fill="#E8D0B0" />
        {/* Couch */}
        <Rect x={W * 0.02} y={floorY + 8} width={W * 0.25} height={45} rx={10}
          fill="#5A8A50" />
        <Rect x={W * 0.02} y={floorY + 8} width={W * 0.25} height={16} rx={[10,10,0,0]}
          fill="#4A7A40" />
        <Rect x={W * 0.02} y={floorY + 8} width={8} height={45} rx={4} fill="#4A7A40" />
        <Rect x={W * 0.02 + W * 0.25 - 8} y={floorY + 8} width={8} height={45} rx={4} fill="#4A7A40" />
        {/* Coffee table */}
        <Rect x={W * 0.3} y={floorY + 25} width={W * 0.15} height={30} rx={6} fill="#C8A060" />
        {/* Plant */}
        <Circle cx={W * 0.58} cy={floorY - 20} r={18} fill="#4A9A3A" />
        <Circle cx={W * 0.55} cy={floorY - 26} r={12} fill="#5ABB4A" />
        <Rect x={W * 0.56} y={floorY - 4} width={8} height={18} rx={3} fill="#8B6030" />
        <Ellipse cx={W * 0.6} cy={floorY + 14} rx={10} ry={5} fill="#A07040" />
      </G>
    );
  }

  if (id === 'library') {
    return (
      <G>
        {/* Bookshelves */}
        {[0.0, 0.28, 0.72].map((xr, i) => (
          <G key={i}>
            <Rect x={W * xr} y={0} width={W * 0.22} height={floorY} fill="#8B6030" />
            {[0, 1, 2, 3, 4, 5].map(row => (
              ['#E05050', '#5070E0', '#50B050', '#E0A030', '#B050B0', '#50C0C0', '#E08050', '#5090B0'].map((col, j) => (
                <Rect key={j} x={W * xr + 4 + j * (W * 0.22 / 8 - 1)} y={row * (floorY / 6) + 4}
                  width={W * 0.22 / 8 - 2} height={floorY / 6 - 6} rx={2} fill={col} />
              ))
            ))}
          </G>
        ))}
        {/* Reading desks */}
        {[0.32, 0.52].map((xr, i) => (
          <G key={i}>
            <Rect x={W * xr} y={floorY + 10} width={W * 0.16} height={40} rx={5} fill="#C8A060" />
            <Rect x={W * xr} y={floorY + 10} width={W * 0.16} height={10} rx={5} fill="#A08040" />
          </G>
        ))}
      </G>
    );
  }

  if (id === 'office') {
    return (
      <G>
        {[0.02, 0.35, 0.67].map((xr, i) => (
          <G key={i}>
            <Rect x={W * xr} y={floorY + 8} width={W * 0.28} height={50} rx={5} fill="#C8D4E0" />
            <Rect x={W * xr} y={floorY + 8} width={W * 0.28} height={12} rx={[5,5,0,0]} fill="#B0C0D0" />
            {/* Monitor */}
            <Rect x={W * xr + W * 0.08} y={floorY - 28} width={W * 0.12} height={28} rx={3} fill="#1A2030" />
            <Rect x={W * xr + W * 0.09} y={floorY - 26} width={W * 0.10} height={24} rx={2} fill="#2A6AA0" />
            <Rect x={W * xr + W * 0.125} y={floorY} width={8} height={8} rx={2} fill="#1A2030" />
            {/* Keyboard */}
            <Rect x={W * xr + 4} y={floorY + 24} width={W * 0.10} height={16} rx={3} fill="#8090A0" />
          </G>
        ))}
        {/* Plants */}
        <Circle cx={W * 0.97} cy={floorY - 14} r={14} fill="#4A9A3A" />
        <Rect x={W * 0.94} y={floorY + 2} width={8} height={16} rx={3} fill="#8B6030" />
      </G>
    );
  }

  if (id === 'rooftop') {
    return (
      <G>
        {/* City skyline */}
        {[0.75, 0.82, 0.88, 0.93, 0.97].map((xr, i) => (
          <Rect key={i} x={W * xr} y={0} width={W * 0.04} height={H * 0.3 + i * 15}
            fill="rgba(100,120,180,0.2)" />
        ))}
        {/* Fairy lights */}
        {Array.from({ length: 20 }, (_, i) => (
          <Circle key={i} cx={i * (W / 20) + 10} cy={20 + Math.sin(i * 0.8) * 6}
            r={3} fill={`hsl(${40 + i * 15},100%,70%)`} />
        ))}
        {/* Outdoor tables */}
        {[0.15, 0.48, 0.76].map((xr, i) => (
          <G key={i}>
            <Ellipse cx={W * xr} cy={floorY + 20} rx={30} ry={12} fill="#3D4A6A" />
            <Rect x={W * xr - 3} y={floorY + 20} width={6} height={25} rx={3} fill="#2D3A5A" />
          </G>
        ))}
      </G>
    );
  }

  if (id === 'cinema') {
    return (
      <G>
        {/* Screen */}
        <Rect x={W * 0.05} y={8} width={W * 0.9} height={H * 0.38} rx={6} fill="#F0F0F0" />
        <Rect x={W * 0.06} y={12} width={W * 0.88} height={H * 0.34} rx={4} fill="#1A1A2E" />
        <Rect x={W * 0.1} y={16} width={W * 0.8} height={H * 0.26} rx={3}
          fill="rgba(80,120,200,0.2)" />
        {/* Seat rows */}
        {[0, 1].map(row =>
          Array.from({ length: 7 }, (_, i) => (
            <G key={`${row}-${i}`}>
              <Rect x={W * 0.07 + i * (W * 0.13)} y={floorY + row * 28 + 6}
                width={W * 0.10} height={22} rx={[8,8,0,0]} fill="#C03030" />
            </G>
          ))
        )}
      </G>
    );
  }

  return null;
}

function shadeHex(hex, amt) {
  try {
    const r = Math.max(0, Math.min(255, parseInt(hex.slice(1,3),16)+amt));
    const g = Math.max(0, Math.min(255, parseInt(hex.slice(3,5),16)+amt));
    const b = Math.max(0, Math.min(255, parseInt(hex.slice(5,7),16)+amt));
    return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
  } catch { return hex; }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 56, paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  backIcon: { fontSize: 18, color: '#2D1A08' },
  headerTitle: { flex: 1, fontFamily: 'Jua', fontSize: 18, color: '#2D1A08' },
  timerChip: {
    backgroundColor: '#4CAF7D', borderRadius: 16,
    paddingHorizontal: 14, paddingVertical: 5,
  },
  timerChipActive: { backgroundColor: '#2D9A5A' },
  timerChipText: { fontFamily: 'Nunito', fontWeight: '800', fontSize: 15, color: 'white' },

  roomContainer: {
    height: 280, position: 'relative', overflow: 'hidden',
  },
  npcWrap: { position: 'absolute', alignItems: 'center' },
  playerWrap: { position: 'absolute', alignItems: 'center' },
  npcLabel: {
    backgroundColor: 'rgba(45,26,8,0.75)', borderRadius: 8,
    paddingHorizontal: 6, paddingVertical: 2, marginTop: 2,
  },
  npcName: { color: 'white', fontSize: 9, fontFamily: 'Nunito', fontWeight: '700' },
  petCompanion: { fontSize: 18, marginTop: -10, marginLeft: 40 },

  seatBtn: {
    position: 'absolute', width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(76,175,80,0.9)', borderWidth: 2.5, borderColor: 'white',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4,
    elevation: 4,
  },
  seatTaken: { backgroundColor: 'rgba(200,80,80,0.85)' },
  seatMine: { backgroundColor: 'rgba(80,80,200,0.9)' },
  seatBtnText: { color: 'white', fontSize: 10, fontFamily: 'Nunito', fontWeight: '900' },

  stretchBanner: {
    position: 'absolute', bottom: 16, left: 20, right: 20,
    backgroundColor: 'rgba(255,200,50,0.95)', borderRadius: 16,
    padding: 12, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8,
  },
  stretchText: { fontFamily: 'Jua', fontSize: 18, color: '#4A2E00' },
  stretchSub: { fontFamily: 'Nunito', fontSize: 13, color: '#7A5000', marginTop: 2 },

  controls: { flex: 1 },
  controlsContent: { padding: 16, gap: 12 },

  timerCard: {
    backgroundColor: 'white', borderRadius: 24,
    padding: 20, alignItems: 'center', gap: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16,
    elevation: 4,
  },
  timerLabel: { fontFamily: 'Nunito', fontWeight: '700', fontSize: 13, color: '#8B7355', letterSpacing: 1 },
  timerBig: { fontFamily: 'Jua', fontSize: 52, color: '#2D1A08', letterSpacing: 2 },
  timerBigActive: { color: '#2D7A3A' },

  progressTrack: { width: '100%', height: 8, backgroundColor: '#F0E8DC', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#FFC107', borderRadius: 4 },

  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  preset: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, borderWidth: 2, borderColor: '#E8D8C0',
    backgroundColor: 'white',
  },
  presetActive: { backgroundColor: '#FFC107', borderColor: '#E6A800' },
  presetText: { fontFamily: 'Jua', fontSize: 13, color: '#8B6040' },
  presetTextActive: { color: '#4A2E00' },

  actionRow: { flexDirection: 'row', gap: 10, width: '100%' },
  btnStart: {
    flex: 1, backgroundColor: '#4CAF7D', borderRadius: 20,
    paddingVertical: 14, alignItems: 'center',
    shadowColor: '#4CAF7D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  btnPause: {
    flex: 1, backgroundColor: '#FF9944', borderRadius: 20,
    paddingVertical: 14, alignItems: 'center',
  },
  btnReset: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#F0E8DC', alignItems: 'center', justifyContent: 'center',
  },
  btnText: { fontFamily: 'Jua', fontSize: 17, color: 'white', letterSpacing: 1 },
  btnResetText: { fontFamily: 'Jua', fontSize: 22, color: '#8B6040' },

  whoCard: {
    backgroundColor: 'white', borderRadius: 20, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10,
  },
  whoTitle: { fontFamily: 'Jua', fontSize: 15, color: '#2D1A08', marginBottom: 12 },
  whoList: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  whoItem: { alignItems: 'center', gap: 4 },
  whoName: { fontFamily: 'Nunito', fontSize: 11, fontWeight: '700', color: '#8B7355' },

  completeOverlay: {
    ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  completeCard: {
    backgroundColor: 'white', borderRadius: 28, padding: 32,
    alignItems: 'center', gap: 10, width: SW * 0.85,
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.25, shadowRadius: 40,
  },
  completeEmoji: { fontSize: 60 },
  completeTitle: { fontFamily: 'Jua', fontSize: 28, color: '#2D1A08' },
  completeSub: { fontFamily: 'Nunito', fontWeight: '600', fontSize: 15, color: '#8B7355' },
  completeReward: { fontFamily: 'Jua', fontSize: 22, color: '#E6A800' },
});
