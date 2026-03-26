// src/store/gameStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useGameStore = create(
  persist(
    (set, get) => ({
      // 캐릭터 커스터마이징
      character: {
        name: '',
        skinColor: '#FDBCB4',
        hairStyle: 'short',
        hairColor: '#3D2010',
        outfitColor: '#6C8EBF',
        faceStyle: 'happy',
        created: false,
      },

      // 게임 진행 상태
      coins: 50,
      gems: 5,
      totalMins: 0,
      todayMins: 0,
      streak: 0,
      sessions: 0,
      longestSession: 0,
      lastStudyDate: null,
      visitedBuildings: [],
      shopBuyCount: 0,
      missionsDone: [],

      // 펫
      unlockedPets: [],
      activePet: null,

      // 아이템
      ownedItems: ['flower_basic'],
      equippedItems: [],

      // 마이룸
      myRoom: {
        wallColor: '#F5E6D3',
        floorStyle: 'wood',
        furniture: [],
        decorations: [],
      },

      // 현재 건물
      currentBuilding: null,
      selectedSeat: null,

      // 타이머
      timerMins: 25,
      timerRunning: false,

      // Actions
      setCharacter: (char) => set(s => ({ character: { ...s.character, ...char } })),

      addCoins: (amount) => set(s => ({ coins: s.coins + amount })),
      spendCoins: (amount) => {
        const { coins } = get();
        if (coins < amount) return false;
        set(s => ({ coins: s.coins - amount }));
        return true;
      },

      completeSession: (mins) => {
        const s = get();
        const coinsEarned = Math.floor(mins / 5) * 5 + (mins >= 60 ? 10 : 0);
        const today = new Date().toDateString();
        const lastDate = s.lastStudyDate;
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        let newStreak = s.streak;
        if (lastDate === yesterday) newStreak = s.streak + 1;
        else if (lastDate !== today) newStreak = 1;

        set({
          coins: s.coins + coinsEarned,
          totalMins: s.totalMins + mins,
          todayMins: lastDate === today ? s.todayMins + mins : mins,
          sessions: s.sessions + 1,
          longestSession: Math.max(s.longestSession, mins),
          streak: newStreak,
          lastStudyDate: today,
        });

        return coinsEarned;
      },

      unlockPet: (petId) => set(s => ({
        unlockedPets: s.unlockedPets.includes(petId)
          ? s.unlockedPets
          : [...s.unlockedPets, petId]
      })),

      setActivePet: (petId) => set({ activePet: petId }),

      buyItem: (itemId, price) => {
        const success = get().spendCoins(price);
        if (success) {
          set(s => ({
            ownedItems: [...s.ownedItems, itemId],
            shopBuyCount: s.shopBuyCount + 1,
          }));
        }
        return success;
      },

      toggleEquip: (itemId) => set(s => ({
        equippedItems: s.equippedItems.includes(itemId)
          ? s.equippedItems.filter(i => i !== itemId)
          : [...s.equippedItems, itemId]
      })),

      completeMission: (missionId, reward) => set(s => ({
        missionsDone: [...s.missionsDone, missionId],
        coins: s.coins + reward,
      })),

      visitBuilding: (buildingId) => set(s => ({
        visitedBuildings: s.visitedBuildings.includes(buildingId)
          ? s.visitedBuildings
          : [...s.visitedBuildings, buildingId]
      })),

      setCurrentBuilding: (b) => set({ currentBuilding: b }),
      setSelectedSeat: (i) => set({ selectedSeat: i }),

      updateMyRoom: (updates) => set(s => ({
        myRoom: { ...s.myRoom, ...updates }
      })),
    }),
    {
      name: 'studytown-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
