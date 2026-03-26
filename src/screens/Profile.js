import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Character from '../components/Character';
import { useGameStore } from '../store/gameStore';

export default function ProfileScreen() {
  const store = useGameStore();
  const char = store.character;

  const stats = [
    ['⏱️ 총 공부', `${store.totalMins}분`],
    ['📚 세션 수', `${store.sessions}회`],
    ['🔥 연속', `${store.streak}일`],
    ['🪙 보유 코인', `${store.coins}개`],
    ['🐾 보유 펫', `${store.unlockedPets.length}/12`],
    ['✅ 미션 완료', `${store.missionsDone.length}개`],
    ['⚡ 최장 집중', `${store.longestSession}분`],
    ['🏠 방문 건물', `${store.visitedBuildings.length}/6`],
  ];

  return (
    <SafeAreaView style={{ flex:1 }}>
      <LinearGradient colors={['#F8F4EE','#FFFFFF']} style={{ flex:1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>👤 프로필</Text>
          <View style={styles.charWrap}>
            <LinearGradient colors={['#E8F4F0','#F0F8FF']} style={styles.charBg}>
              <Character customization={char} mode="idle" size={120} />
            </LinearGradient>
          </View>
          <Text style={styles.name}>{char.name}</Text>
          <View style={styles.grid}>
            {stats.map(([label, val]) => (
              <View key={label} style={styles.statCard}>
                <Text style={styles.statVal}>{val}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => Alert.alert('캐릭터 재설정', '정말 재설정하시겠어요?', [
              { text:'취소', style:'cancel' },
              { text:'재설정', onPress: () => store.setCharacter({ created:false }) },
            ])}
          >
            <Text style={styles.resetText}>캐릭터 다시 만들기</Text>
          </TouchableOpacity>
          <View style={{ height:40 }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding:16, alignItems:'center', gap:16 },
  title: { fontSize:22, fontWeight:'800', color:'#2D1A08', alignSelf:'flex-start' },
  charWrap: { width:150, height:180, borderRadius:24, overflow:'hidden',
    shadowColor:'#000', shadowOffset:{width:0,height:8}, shadowOpacity:0.1, shadowRadius:20 },
  charBg: { flex:1, alignItems:'center', justifyContent:'center' },
  name: { fontSize:26, fontWeight:'800', color:'#2D1A08' },
  grid: { flexDirection:'row', flexWrap:'wrap', gap:10, width:'100%' },
  statCard: { width:'47%', backgroundColor:'white', borderRadius:16, padding:14,
    shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.06, shadowRadius:8 },
  statVal: { fontSize:22, fontWeight:'800', color:'#2D1A08' },
  statLabel: { fontSize:12, color:'#8B7355', marginTop:2 },
  resetBtn: { backgroundColor:'#F0E8DC', borderRadius:20, paddingHorizontal:24, paddingVertical:12 },
  resetText: { fontSize:14, color:'#8B6040' },
});
