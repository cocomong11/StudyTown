// ===== Missions.js =====
import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/gameStore';
import { MISSIONS } from '../utils/constants';

export default function MissionsScreen() {
  const store = useGameStore();

  const getProgress = (m) => {
    if (m.type==='sessions') return Math.min(store.sessions, m.goal);
    if (m.type==='totalMins') return Math.min(store.totalMins, m.goal);
    if (m.type==='streak') return Math.min(store.streak, m.goal);
    if (m.type==='singleSession') return Math.min(store.longestSession, m.goal);
    if (m.type==='buildings') return Math.min(store.visitedBuildings.length, m.goal);
    if (m.type==='shopBuy') return Math.min(store.shopBuyCount||0, m.goal);
    if (m.type==='missionsDone') return Math.min(store.missionsDone.length, m.goal);
    if (m.type==='pets') return Math.min(store.unlockedPets.length, m.goal);
    return 0;
  };

  const sorted = [...MISSIONS].sort((a,b) => {
    const ad = store.missionsDone.includes(a.id) ? 1 : 0;
    const bd = store.missionsDone.includes(b.id) ? 1 : 0;
    return ad - bd;
  });

  return (
    <SafeAreaView style={{ flex:1 }}>
      <LinearGradient colors={['#F8F4EE','#FFFFFF']} style={{ flex:1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>📋 미션</Text>
          <Text style={styles.sub}>{store.missionsDone.length}/{MISSIONS.length} 완료</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding:16, gap:10 }}>
          {sorted.map(m => {
            const done = store.missionsDone.includes(m.id);
            const prog = getProgress(m);
            const pct = Math.min(1, prog/m.goal);
            return (
              <View key={m.id} style={[styles.card, done && styles.cardDone]}>
                <Text style={styles.mIcon}>{done ? '✅' : m.icon}</Text>
                <View style={{ flex:1 }}>
                  <Text style={styles.mName}>{m.name}</Text>
                  <Text style={styles.mDesc}>{m.desc} {!done && `(${prog}/${m.goal})`}</Text>
                  {!done && (
                    <View style={styles.progTrack}>
                      <View style={[styles.progFill, { width:`${pct*100}%` }]} />
                    </View>
                  )}
                </View>
                <Text style={styles.reward}>+{m.reward}🪙</Text>
              </View>
            );
          })}
          <View style={{ height:20 }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop:56, paddingHorizontal:16, paddingBottom:12,
    flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  title: { fontSize:22, fontWeight:'800', color:'#2D1A08' },
  sub: { fontSize:14, fontWeight:'700', color:'#8B7355' },
  card: { flexDirection:'row', alignItems:'center', backgroundColor:'white',
    borderRadius:18, padding:14, gap:12,
    shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.06, shadowRadius:8 },
  cardDone: { backgroundColor:'#F0FFF4' },
  mIcon: { fontSize:28 },
  mName: { fontSize:15, fontWeight:'800', color:'#2D1A08' },
  mDesc: { fontSize:12, color:'#8B7355', marginTop:2 },
  progTrack: { height:5, backgroundColor:'#F0E8DC', borderRadius:3, marginTop:6, overflow:'hidden' },
  progFill: { height:'100%', backgroundColor:'#4CAF7D', borderRadius:3 },
  reward: { fontSize:13, fontWeight:'700', color:'#B88000' },
});
