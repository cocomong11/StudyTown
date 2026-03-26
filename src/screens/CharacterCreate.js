import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Dimensions, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Character from '../components/Character';
import { useGameStore } from '../store/gameStore';
import { SKIN_COLORS, HAIR_STYLES, HAIR_COLORS, OUTFIT_COLORS } from '../utils/constants';

const { width: SW } = Dimensions.get('window');

export default function CharacterCreateScreen() {
  const setCharacter = useGameStore(s => s.setCharacter);
  const [custom, setCustom] = useState({
    name: '',
    skinColor: 's1',
    hairStyle: 'short',
    hairColor: 'hc1',
    outfitColor: 'oc1',
  });

  const update = (key, val) => setCustom(p => ({ ...p, [key]: val }));

  const handleStart = () => {
    if (!custom.name.trim()) {
      alert('닉네임을 입력해주세요!');
      return;
    }
    setCharacter({ ...custom, created: true });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#D4F0FF', '#B8E8C8', '#F0F8D0']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>🏡 StudyTown</Text>
          <Text style={styles.sub}>나만의 캐릭터를 만들어보세요!</Text>

          <View style={styles.previewBox}>
            <LinearGradient colors={['#F0F8FF', '#E8F4F0']} style={styles.previewGradient}>
              <Character customization={custom} mode="idle" size={120} />
            </LinearGradient>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>닉네임</Text>
            <TextInput
              style={styles.nameInput}
              value={custom.name}
              onChangeText={v => update('name', v)}
              placeholder="나만의 닉네임을 입력하세요"
              placeholderTextColor="#B0A090"
              maxLength={10}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>피부색</Text>
            <View style={styles.optRow}>
              {SKIN_COLORS.map(s => (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.colorOpt, { backgroundColor: s.color },
                    custom.skinColor === s.id && styles.optSelected]}
                  onPress={() => update('skinColor', s.id)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>머리 스타일</Text>
            <View style={styles.optRow}>
              {HAIR_STYLES.map(h => (
                <TouchableOpacity
                  key={h.id}
                  style={[styles.textOpt, custom.hairStyle === h.id && styles.textOptActive]}
                  onPress={() => update('hairStyle', h.id)}
                >
                  <Text style={[styles.textOptLabel, custom.hairStyle === h.id && styles.textOptLabelActive]}>
                    {h.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>머리색</Text>
            <View style={styles.optRow}>
              {HAIR_COLORS.map(h => (
                <TouchableOpacity
                  key={h.id}
                  style={[styles.colorOpt, { backgroundColor: h.color },
                    custom.hairColor === h.id && styles.optSelected]}
                  onPress={() => update('hairColor', h.id)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>옷 색상</Text>
            <View style={styles.optRow}>
              {OUTFIT_COLORS.map(o => (
                <TouchableOpacity
                  key={o.id}
                  style={[styles.colorOpt, { backgroundColor: o.color },
                    custom.outfitColor === o.id && styles.optSelected]}
                  onPress={() => update('outfitColor', o.id)}
                />
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
            <LinearGradient colors={['#6DBF8E', '#4CAF7D']} style={styles.startBtnGradient}>
              <Text style={styles.startBtnText}>🏡 마을 입장하기!</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: 'center', gap: 20 },
  title: { fontFamily: 'Jua', fontSize: 32, color: '#2D1A08' },
  sub: { fontSize: 15, color: '#6B5040' },
  previewBox: {
    width: 160, height: 200, borderRadius: 24, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 6,
  },
  previewGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  section: { width: '100%' },
  sectionLabel: { fontSize: 14, color: '#8B6040', marginBottom: 10, fontWeight: '700' },
  optRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorOpt: { width: 38, height: 38, borderRadius: 19, borderWidth: 3, borderColor: 'transparent' },
  optSelected: { borderColor: '#4A2E1A', transform: [{ scale: 1.1 }] },
  textOpt: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    borderWidth: 2, borderColor: '#E8D8C0', backgroundColor: 'rgba(255,255,255,0.7)',
  },
  textOptActive: { backgroundColor: '#FFC107', borderColor: '#E6A800' },
  textOptLabel: { fontSize: 13, color: '#8B6040' },
  textOptLabelActive: { color: '#4A2E00' },
  nameInput: {
    width: '100%', padding: 14, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)', borderWidth: 2,
    borderColor: 'rgba(200,165,100,0.3)', fontSize: 16, color: '#2D1A08',
  },
  startBtn: {
    width: '100%', borderRadius: 24, overflow: 'hidden',
    shadowColor: '#4CAF7D', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  startBtnGradient: { paddingVertical: 16, alignItems: 'center' },
  startBtnText: { fontSize: 20, color: 'white', fontWeight: '800' },
});
