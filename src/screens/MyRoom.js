import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Polygon, G, Circle, Ellipse } from 'react-native-svg';
import Character from '../components/Character';
import { useGameStore } from '../store/gameStore';
import { SHOP_ITEMS } from '../utils/constants';

const { width: SW } = Dimensions.get('window');

function shadeHex(hex, amt) {
  try {
    const r = Math.max(0, Math.min(255, parseInt(hex.slice(1,3),16)+amt));
    const g = Math.max(0, Math.min(255, parseInt(hex.slice(3,5),16)+amt));
    const b = Math.max(0, Math.min(255, parseInt(hex.slice(5,7),16)+amt));
    return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
  } catch { return hex; }
}

export default function MyRoomScreen() {
  const store = useGameStore();
  const [activeTab, setActiveTab] = useState('room');

  const wallColors = {
    wall_cream:'#F5E6D3', wall_mint:'#C8EAD8', wall_lavender:'#E8D8F0',
    wall_sky:'#C8E8F8', wall_dark:'#2D3A4A', wall_forest:'#2D4A38',
  };
  const floorColors = {
    floor_wood:'#C8A060', floor_tile:'#D0D8E0', floor_marble:'#E8E4F0', floor_carpet:'#C8A0C0',
  };

  const equippedWall = store.equippedItems.find(i => i.startsWith('wall_')) || 'wall_cream';
  const equippedFloor = store.equippedItems.find(i => i.startsWith('floor_')) || 'floor_wood';
  const wallColor = wallColors[equippedWall] || '#F5E6D3';
  const floorColor = floorColors[equippedFloor] || '#C8A060';
  const has = (id) => store.equippedItems.includes(id);

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F4EE' }}>
      <LinearGradient colors={['#F8F4EE', '#FFFFFF']} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>🏠 내 방</Text>
          <View style={styles.chip}><Text style={styles.chipText}>🪙 {store.coins}</Text></View>
        </View>

        {/* Room View */}
        <View style={{ height: 220, position: 'relative' }}>
          <Svg width={SW} height={220} viewBox={`0 0 ${SW} 220`}>
            <Rect x={0} y={0} width={SW} height={130} fill={wallColor} />
            {Array.from({length:8},(_,i)=>(
              <Rect key={i} x={i*(SW/8)} y={0} width={1} height={130} fill="rgba(0,0,0,0.03)" />
            ))}
            <Polygon points={`0,130 ${SW},130 ${SW},220 0,220`} fill={floorColor} />
            {Array.from({length:10},(_,row)=>Array.from({length:14},(_,col)=>{
              const even=(row+col)%2===0;
              const pw=SW/7, ph=12;
              return <Rect key={`${row}-${col}`} x={col*pw-(row%2)*pw/2} y={130+row*ph}
                width={pw-1} height={ph-1} fill={even?floorColor:shadeHex(floorColor,-10)} rx={1} />
            }))}
            <Rect x={0} y={128} width={SW} height={8} fill="rgba(0,0,0,0.06)" />
            {/* Desk */}
            <Rect x={SW*0.05} y={100} width={SW*0.38} height={50} rx={6} fill="#C8A060" />
            <Rect x={SW*0.05} y={100} width={SW*0.38} height={12} rx={[6,6,0,0]} fill="#A08040" />
            <Rect x={SW*0.08} y={150} width={8} height={25} rx={3} fill="#8B6030" />
            <Rect x={SW*0.05+SW*0.38-12} y={150} width={8} height={25} rx={3} fill="#8B6030" />
            {has('desk_fancy') && (
              <G>
                <Rect x={SW*0.12} y={62} width={SW*0.20} height={38} rx={4} fill="#1A2030" />
                <Rect x={SW*0.13} y={64} width={SW*0.18} height={34} rx={3} fill="#2A6AA0" />
              </G>
            )}
            {has('bookshelf') && (
              <G>
                <Rect x={SW*0.72} y={20} width={SW*0.25} height={110} fill="#8B6030" />
                {['#E05050','#5070E0','#50B050','#E0A030','#B050B0','#50C0C0'].map((c,i)=>(
                  <Rect key={i} x={SW*0.73+i*(SW*0.04)} y={25} width={SW*0.038} height={100} rx={2} fill={c} />
                ))}
              </G>
            )}
            {has('plant_small') && (
              <G>
                <Circle cx={SW*0.55} cy={95} r={18} fill="#4A9A3A" />
                <Circle cx={SW*0.55} cy={86} r={12} fill="#5ABB4A" />
                <Rect x={SW*0.548} y={112} width={8} height={18} rx={3} fill="#8B6030" />
              </G>
            )}
            {has('fairy_lights') && Array.from({length:16},(_,i)=>(
              <Circle key={i} cx={i*(SW/16)+16} cy={18+Math.sin(i*0.9)*5} r={3}
                fill={`hsl(${40+i*20},100%,72%)`} />
            ))}
            {has('rug') && (
              <Ellipse cx={SW*0.3} cy={185} rx={SW*0.22} ry={22} fill="#C080A0" opacity={0.6} />
            )}
          </Svg>
          <View style={{ position:'absolute', left: SW*0.28-35, top:50 }}>
            <Character customization={store.character} mode="idle" size={70} />
          </View>
          {store.activePet && (
            <View style={{ position:'absolute', left: SW*0.44, top:120 }}>
              <Text style={{ fontSize:28 }}>
                {store.activePet==='cat'?'🐱':store.activePet==='dog'?'🐶':'🐾'}
              </Text>
            </View>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {['room','character'].map(tab=>(
            <TouchableOpacity key={tab}
              style={[styles.tab, activeTab===tab && styles.tabActive]}
              onPress={()=>setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab===tab && styles.tabTextActive]}>
                {tab==='room'?'🏠 방 꾸미기':'👗 캐릭터'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={{ flex:1 }} contentContainerStyle={{ padding:16, gap:12 }}>
          {Object.entries(SHOP_ITEMS).map(([category, items])=>(
            <View key={category} style={{ width:'100%', marginBottom:8 }}>
              <Text style={styles.catLabel}>
                {category==='wallpaper'?'🖼 벽지':category==='floor'?'🪵 바닥':
                 category==='furniture'?'🪑 가구':'✨ 장식'}
              </Text>
              <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8 }}>
                {items.map(item=>{
                  const owned=store.ownedItems.includes(item.id);
                  const equipped=store.equippedItems.includes(item.id);
                  return (
                    <TouchableOpacity key={item.id}
                      style={[styles.item, owned&&styles.itemOwned, equipped&&styles.itemEquipped]}
                      onPress={()=>{
                        if(owned){ store.toggleEquip(item.id); }
                        else {
                          const ok=store.buyItem(item.id, item.price);
                          if(!ok) alert('코인이 부족해요!');
                        }
                      }}>
                      <Text style={styles.itemEmoji}>
                        {category==='wallpaper'?'🖼':category==='floor'?'🪵':
                         category==='furniture'?'🪑':'✨'}
                      </Text>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemPrice}>
                        {owned?(equipped?'✓장착':'장착'):`🪙${item.price}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection:'row', alignItems:'center', justifyContent:'space-between',
    paddingTop:56, paddingHorizontal:16, paddingBottom:10 },
  title: { fontSize:22, fontWeight:'800', color:'#2D1A08' },
  chip: { backgroundColor:'white', borderRadius:16, paddingHorizontal:12, paddingVertical:4 },
  chipText: { fontSize:14, fontWeight:'700', color:'#2D1A08' },
  tabs: { flexDirection:'row', marginHorizontal:16, gap:8, marginVertical:8 },
  tab: { flex:1, paddingVertical:9, borderRadius:20, backgroundColor:'#EEE8DC', alignItems:'center' },
  tabActive: { backgroundColor:'#FFC107' },
  tabText: { fontSize:13, fontWeight:'700', color:'#8B6040' },
  tabTextActive: { color:'#4A2E00' },
  catLabel: { fontSize:13, fontWeight:'700', color:'#8B6040', marginBottom:8 },
  item: { width:90, backgroundColor:'white', borderRadius:14, padding:8, alignItems:'center',
    borderWidth:2, borderColor:'transparent',
    shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.06, shadowRadius:6 },
  itemOwned: { borderColor:'#4CAF7D' },
  itemEquipped: { borderColor:'#A078FA', backgroundColor:'#F5F0FF' },
  itemEmoji: { fontSize:22 },
  itemName: { fontSize:10, fontWeight:'700', color:'#2D1A08', textAlign:'center', marginTop:2 },
  itemPrice: { fontSize:10, color:'#8B6040', marginTop:2 },
});
