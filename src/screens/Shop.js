import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/gameStore';
import { PETS } from '../utils/constants';

export default function ShopScreen() {
  const store = useGameStore();

  return (
    <SafeAreaView style={{ flex:1 }}>
      <LinearGradient colors={['#F8F4EE','#FFFFFF']} style={{ flex:1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>🐾 펫 도감</Text>
          <View style={styles.chip}><Text style={styles.chipText}>🪙 {store.coins}</Text></View>
        </View>
        <Text style={styles.sub}>미션을 완료해서 펫을 획득하세요!</Text>
        <ScrollView contentContainerStyle={styles.grid}>
          {PETS.map(pet => {
            const unlocked = store.unlockedPets.includes(pet.id);
            const active = store.activePet === pet.id;
            return (
              <TouchableOpacity
                key={pet.id}
                style={[styles.card, unlocked && styles.cardUnlocked, active && styles.cardActive]}
                onPress={() => unlocked && store.setActivePet(active ? null : pet.id)}
                activeOpacity={unlocked ? 0.8 : 1}
              >
                <Text style={[styles.petEmoji, !unlocked && { opacity:0.3 }]}>{pet.emoji}</Text>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petCond}>
                  {unlocked ? (active ? '✓ 동행중' : '탭하여 선택') : pet.conditionLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
          <View style={{ height:20 }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop:56, paddingHorizontal:16, paddingBottom:8,
    flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  title: { fontSize:22, fontWeight:'800', color:'#2D1A08' },
  sub: { fontSize:13, color:'#8B7355', paddingHorizontal:16, marginBottom:12 },
  chip: { backgroundColor:'white', borderRadius:16, paddingHorizontal:12, paddingVertical:4 },
  chipText: { fontSize:14, fontWeight:'700', color:'#2D1A08' },
  grid: { padding:16, flexDirection:'row', flexWrap:'wrap', gap:12 },
  card: { width:'30%', backgroundColor:'white', borderRadius:18, padding:12,
    alignItems:'center', gap:4, borderWidth:2, borderColor:'transparent',
    shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.08, shadowRadius:10 },
  cardUnlocked: { borderColor:'#FFB0C0' },
  cardActive: { borderColor:'#4CAF7D', backgroundColor:'#F0FFF4' },
  petEmoji: { fontSize:36 },
  petName: { fontSize:13, fontWeight:'800', color:'#2D1A08' },
  petCond: { fontSize:10, color:'#8B7355', textAlign:'center' },
});
