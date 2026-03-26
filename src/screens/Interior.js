import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Circle, Path, G } from 'react-native-svg';
import Character from '../components/Character';
import { useGameStore } from '../store/gameStore';

const { width: SW, height: SH } = Dimensions.get('window');

export default function InteriorScreen({ navigation, route }) {
  const building = route.params?.building;
  const store = useGameStore();
  const char = store.character;
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [timerMins, setTimerMins] = useState(25);
  const [timerRunning, setTimerRunning] = useState(false);

  // 타이머 카운트다운 로직 (초 단위로 관리)
  useEffect(() => {
    let interval = null;
    if (timerRunning && timerMins > 0) {
      interval = setInterval(() => {
        setTimerMins((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!timerRunning && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerMins]);

  const handleSeatSelect = (index) => {
    setSelectedSeat(selectedSeat === index ? null : index);
  };

  const handleStartSession = () => {
    if (!selectedSeat) {
      Alert.alert('좌석을 선택해주세요', '시작하려면 좌석을 선택하세요');
      return;
    }
    setTimerRunning(!timerRunning);
  };

  const handleEndSession = () => {
    store.completeSession(timerMins);
    Alert.alert('세션 종료!', `${timerMins}분 학습 완료!`);
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={['#F5F5DC', '#F0F0E0', '#E8E8D8']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{building?.name}</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.sceneContainer}>
        <Svg width={SW - 40} height={250} viewBox='0 0 300 250'>
          <Rect x={0} y={0} width={300} height={150} fill='#E8E8D0' />
          <Rect x={0} y={150} width={300} height={100} fill='#8B8860' />
          {[50, 100, 150, 200, 250].map((x, i) => (
            <G key={i}>
              <Rect
                x={x - 15}
                y={100}
                width={30}
                height={60}
                rx={3}
                fill='#6B5D4F'
              />
              <Circle
                cx={x}
                cy={85}
                r={12}
                fill={selectedSeat === i ? '#FFD700' : '#C0C0C0'}
                onPress={() => handleSeatSelect(i)}
                stroke={selectedSeat === i ? '#B8860B' : '#000'}
                strokeWidth={2}
              />
            </G>
          ))}
        </Svg>
      </View>

      <View style={styles.characterPreview}>
        <Character customization={char} mode='studying' size={60} />
      </View>

      <View style={styles.control}>
        <View style={styles.timerBox}>
          <Text style={styles.timerLabel}>남은 시간</Text>
          <Text style={styles.timerValue}>
            {Math.floor(timerMins / 60)}:
            {(timerMins % 60).toString().padStart(2, '0')}
          </Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleStartSession}>
          <Text style={styles.btnText}>{timerRunning ? '정지' : '시작'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: '#8B5E3C' }]}
          onPress={handleEndSession}
        >
          <Text style={styles.btnText}>종료</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  closeBtn: { fontSize: 28, color: '#8B5E3C' },
  title: { fontFamily: 'Jua', fontSize: 20, color: '#2D1A08' },
  sceneContainer: { alignItems: 'center', marginVertical: 20 },
  characterPreview: { alignItems: 'center', marginVertical: 10 },
  control: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    alignItems: 'center',
  },
  timerBox: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  timerLabel: { fontFamily: 'Nunito', fontSize: 12, color: '#8B7355' },
  timerValue: { fontFamily: 'Jua', fontSize: 24, color: '#2D1A08' },
  btn: {
    backgroundColor: '#6C8EBF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnText: { fontFamily: 'Jua', fontSize: 14, color: '#FFFFFF' },
});
