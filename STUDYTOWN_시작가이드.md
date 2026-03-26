# 🏡 StudyTown 앱 개발 시작 가이드

## 1단계: 환경 설치 (10분)

터미널을 열고 아래 명령어를 순서대로 실행하세요.

### Node.js 설치
```bash
# Homebrew가 없으면 먼저 설치
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js 설치
brew install node
```

### Expo CLI 설치
```bash
npm install -g expo-cli
npx create-expo-app StudyTown --template blank
cd StudyTown
```

### 필요한 패키지 설치
```bash
npx expo install expo-av expo-haptics expo-linear-gradient expo-blur
npm install @react-navigation/native @react-navigation/stack
npm install react-native-safe-area-context react-native-screens
npm install @shopify/react-native-skia
npm install zustand
npm install react-native-reanimated
npm install react-native-gesture-handler
```

## 2단계: 폰에서 실행

1. App Store / Google Play에서 **"Expo Go"** 앱 설치
2. 터미널에서 `npx expo start` 실행
3. QR 코드를 Expo Go로 스캔
4. 앱이 폰에서 바로 실행됨!

## 3단계: 파일 구조

아래 파일들을 StudyTown 폴더 안에 만드세요:

```
StudyTown/
├── App.js                    ← 메인 진입점
├── src/
│   ├── screens/
│   │   ├── CharacterCreate.js   ← 캐릭터 생성
│   │   ├── TownMap.js           ← 마을 지도
│   │   ├── Interior.js          ← 건물 내부
│   │   ├── MyRoom.js            ← 마이룸
│   │   ├── Missions.js          ← 미션
│   │   └── Profile.js           ← 프로필
│   ├── components/
│   │   ├── Character.js         ← 캐릭터 컴포넌트
│   │   ├── TimerDial.js         ← 다이얼 타이머
│   │   ├── IsometricRoom.js     ← 3D룸 렌더러
│   │   └── UI.js                ← 공통 UI
│   ├── store/
│   │   └── gameStore.js         ← 게임 상태 관리
│   └── utils/
│       └── constants.js         ← 상수/데이터
```

## 4단계: Google Play 출시

1. `npx expo build:android` 실행
2. Google Play Console 가입 ($25)
3. APK 업로드
4. 심사 후 출시 (1~3일)

---

다음 메시지에서 각 파일의 전체 코드를 드릴게요!
