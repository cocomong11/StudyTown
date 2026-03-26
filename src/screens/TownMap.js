import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import Svg, { G, Polygon, Rect, Circle, Ellipse, Path } from 'react-native-svg';
import Character from '../components/Character';
import { useGameStore } from '../store/gameStore';
import { BUILDINGS } from '../utils/constants';

const { width: SW } = Dimensions.get('window');

export function TownMapScreen({ navigation }) {
  const store = useGameStore();
  const char = store?.character ?? {
    name: '초보',
    skinColor: '#FDBCB4',
    hairStyle: 'short',
    hairColor: '#3D2010',
    outfitColor: '#6C8EBF',
  };

  const todayMins = Number.isFinite(store?.todayMins) ? store.todayMins : 0;
  const totalMins = Number.isFinite(store?.totalMins) ? store.totalMins : 0;
  const progressPercent = Math.min(100, (todayMins / 120) * 100);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#C8F0D8', '#E8F8F0', '#F8FCF4']} style={{ flex: 1 }}>
        <View style={tmStyles.hud}>
          <View style={tmStyles.hudLeft}>
            <Character customization={char} mode="idle" size={36} />
            <Text style={tmStyles.hudName}>{char.name}</Text>
          </View>
          <View style={tmStyles.hudRight}>
            <View style={tmStyles.chip}>
              <Text style={tmStyles.chipText}> {store?.coins ?? 0}</Text>
            </View>
            <View style={tmStyles.chip}>
              <Text style={tmStyles.chipText}> {store?.streak ?? 0}일</Text>
            </View>
          </View>
        </View>

        <View style={tmStyles.progressCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={tmStyles.progressLabel}>오늘 공부 현황</Text>
            <Text style={tmStyles.progressVal}>{todayMins}분 / 120분</Text>
          </View>
          <View style={tmStyles.progressTrack}>
            <View style={[tmStyles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        <ScrollView contentContainerStyle={tmStyles.grid} showsVerticalScrollIndicator={false}>
          <Text style={tmStyles.sectionTitle}> 어디서 공부할까요?</Text>
          <View style={tmStyles.buildingGrid}>
            {BUILDINGS.map((b, i) => {
              const locked = totalMins < b.unlockMins;
              return (
                <BuildingCard
                  key={b.id}
                  building={b}
                  locked={locked}
                  index={i}
                  onPress={() => {
                    if (!locked) navigation.navigate('Interior', { building: b });
                  }}
                />
              );
            })}
          </View>
          <View style={{ height: 20 }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

function BuildingCard({ building: b, locked, index, onPress }) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(index * 80, withSpring(1, { damping: 14 }));
    opacity.value = withDelay(index * 80, withSpring(1));
  }, [index, scale, opacity]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: opacity.value }));

  return (
    <Animated.View style={style}>
      <TouchableOpacity
        style={[tmStyles.card, locked && tmStyles.cardLocked]}
        onPress={onPress}
        activeOpacity={locked ? 1 : 0.85}
      >
        <LinearGradient
          colors={locked ? ['#E8E0D0', '#D8D0C0'] : [b.bgColor || '#FFF8F0', '#FFFFFF']}
          style={tmStyles.cardGradient}
        >
          <BuildingMiniScene id={b.id} locked={locked} />
          <Text style={[tmStyles.cardName, locked && { color: '#A090808' }]}>
            {b.emoji} {b.name}
          </Text>
          <View style={tmStyles.cardFooter}>
            <Text style={tmStyles.onlineText}>
              {locked ? ` ${b.unlockMins}분` : ` ${b.npcCount}명 공부중`}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

function BuildingMiniScene({ id, locked }) {
  const W = (SW - 48) / 2 - 24;
  const H = 90;

  const scenes = {
    cafe: () => (
      <G>
        <Rect x={0} y={0} width={W} height={H * 0.6} fill="#F5E8D0" />
        <Polygon points={`0,${H * 0.6} ${W},${H * 0.6} ${W},${H} 0,${H}`} fill="#D4A870" />
        <Rect x={W * 0.55} y={H * 0.2} width={W * 0.42} height={H * 0.55} rx={4} fill="#C8855A" />
        <Rect x={W * 0.02} y={H * 0.3} width={W * 0.3} height={H * 0.4} rx={8} fill="#5A8A50" />
        <Circle cx={W * 0.52} cy={H * 0.15} r={H * 0.18} fill="#4A9A3A" />
        <Circle cx={W * 0.52} cy={H * 0.07} r={H * 0.12} fill="#5ABB4A" />
      </G>
    ),
    library: () => (
      <G>
        <Rect x={0} y={0} width={W} height={H * 0.6} fill="#DCE8F5" />
        <Polygon points={`0,${H * 0.6} ${W},${H * 0.6} ${W},${H} 0,${H}`} fill="#A8B8C8" />
        {[0, W * 0.28, W * 0.56].map((x, i) => (
          <G key={i}>
            <Rect x={x} y={H * 0.05} width={W * 0.24} height={H * 0.55} fill="#8B6030" />
            {['#E05050', '#5070E0', '#50B050', '#E0A030'].map((c, j) => (
              <Rect key={j} x={x + 3 + j * (W * 0.055)} y={H * 0.08} width={W * 0.05} height={H * 0.48} rx={2} fill={c} />
            ))}
          </G>
        ))}
      </G>
    ),
    park: () => (
      <G>
        <Rect x={0} y={0} width={W} height={H * 0.6} fill="#D8F0C8" />
        <Polygon points={`0,${H * 0.6} ${W},${H * 0.6} ${W},${H} 0,${H}`} fill="#88C870" />
        {[W * 0.1, W * 0.5, W * 0.8].map((cx, i) => (
          <G key={i}>
            <Circle cx={cx} cy={H * 0.25} r={H * 0.2} fill="#4A9A3A" />
            <Circle cx={cx} cy={H * 0.16} r={H * 0.14} fill="#5ABB4A" />
            <Rect x={cx - 4} y={H * 0.42} width={8} height={H * 0.2} rx={3} fill="#8B6030" />
          </G>
        ))}
      </G>
    ),
    cinema: () => (
      <G>
        <Rect x={0} y={0} width={W} height={H * 0.6} fill="#E8D8F8" />
        <Polygon points={`0,${H * 0.6} ${W},${H * 0.6} ${W},${H} 0,${H}`} fill="#6A4A8A" />
        <Rect x={W * 0.05} y={H * 0.05} width={W * 0.9} height={H * 0.4} rx={4} fill="#1A1A2E" />
        <Rect x={W * 0.08} y={H * 0.08} width={W * 0.84} height={H * 0.34} rx={3} fill="rgba(80,100,200,0.3)" />
        {[W * 0.12, W * 0.32, W * 0.52, W * 0.72].map((x, i) => (
          <Rect key={i} x={x} y={H * 0.65} width={W * 0.14} height={H * 0.18} rx={5} fill="#C03030" />
        ))}
      </G>
    ),
    office: () => (
      <G>
        <Rect x={0} y={0} width={W} height={H * 0.6} fill="#DCE8F0" />
        <Polygon points={`0,${H * 0.6} ${W},${H * 0.6} ${W},${H} 0,${H}`} fill="#7888A0" />
        {[W * 0.05, W * 0.38, W * 0.7].map((x, i) => (
          <G key={i}>
            <Rect x={x} y={H * 0.3} width={W * 0.28} height={H * 0.4} rx={4} fill="#C8D4E0" />
            <Rect x={x + W * 0.06} y={H * 0.05} width={W * 0.16} height={H * 0.25} rx={3} fill="#1A2030" />
            <Rect x={x + W * 0.07} y={H * 0.07} width={W * 0.14} height={H * 0.21} rx={2} fill="#2A6AA0" />
          </G>
        ))}
      </G>
    ),
    rooftop: () => (
      <G>
        <Rect x={0} y={0} width={W} height={H * 0.6} fill="#0D1A30" />
        <Polygon points={`0,${H * 0.6} ${W},${H * 0.6} ${W},${H} 0,${H}`} fill="#2D3A5A" />
        {Array.from({ length: 12 }, (_, i) => (
          <Circle key={i} cx={i * (W / 12) + 8} cy={H * 0.08 + Math.sin(i) * H * 0.05} r={2} fill={`hsl(${40 + i * 20},100%,75%)`} />
        ))}
        {[W * 0.15, W * 0.5, W * 0.82].map((cx, i) => (
          <G key={i}>
            <Ellipse cx={cx} cy={H * 0.52} rx={W * 0.12} ry={H * 0.08} fill="#3D4A6A" />
          </G>
        ))}
        <Circle cx={W * 0.85} cy={H * 0.12} r={H * 0.1} fill="#F8F4D0" opacity={0.9} />
      </G>
    ),
  };

  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ borderRadius: 12, overflow: 'hidden' }}>
      {scenes[id] ? scenes[id]() : null}
      {locked && (
        <G>
          <Rect x={0} y={0} width={W} height={H} fill="rgba(0,0,0,0.35)" />
          <Circle cx={W / 2} cy={H / 2} r={20} fill="rgba(0,0,0,0.5)" />
          <Path d={`M${W / 2 - 7},${H / 2 - 2} L${W / 2 - 7},${H / 2 + 8} L${W / 2 + 7},${H / 2 + 8} L${W / 2 + 7},${H / 2 - 2} Z`} fill="white" />
          <Path d={`M${W / 2 - 5},${H / 2 - 2} Q${W / 2 - 5},${H / 2 - 12} ${W / 2},${H / 2 - 12} Q${W / 2 + 5},${H / 2 - 12} ${W / 2 + 5},${H / 2 - 2}`} stroke="white" strokeWidth={3} fill="none" />
        </G>
      )}
    </Svg>
  );
}

const tmStyles = StyleSheet.create({
  hud: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  hudLeft: { flexDirection: 'row', alignItems: 'center' },
  hudName: { fontFamily: 'Jua', fontSize: 18, color: '#2D1A08', marginLeft: 8 },
  hudRight: { flexDirection: 'row' },
  chip: { backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4, marginLeft: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  chipText: { fontFamily: 'Jua', fontSize: 13, color: '#2D1A08' },
  progressCard: { marginHorizontal: 16, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, marginBottom: 8 },
  progressLabel: { fontFamily: 'Nunito', fontWeight: '700', fontSize: 13, color: '#8B7355' },
  progressVal: { fontFamily: 'Jua', fontSize: 13, color: '#2D1A08' },
  progressTrack: { height: 8, backgroundColor: '#F0E8DC', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#FFC107', borderRadius: 4 },
  grid: { paddingHorizontal: 16, paddingTop: 4 },
  sectionTitle: { fontFamily: 'Jua', fontSize: 14, color: '#8B6040', marginBottom: 12 },
  buildingGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: (SW - 44) / 2, marginBottom: 12, borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 4 },
  cardLocked: { opacity: 0.75 },
  cardGradient: { padding: 12, alignItems: 'center' },
  cardName: { fontFamily: 'Jua', fontSize: 14, color: '#2D1A08', textAlign: 'center' },
  cardFooter: {},
  onlineText: { fontFamily: 'Nunito', fontWeight: '600', fontSize: 11, color: '#8B7355' },
});

export default TownMapScreen;
