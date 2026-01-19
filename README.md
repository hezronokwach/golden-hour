# ElderLink: Compassionate AI Companion for Elderly Care

ElderLink is an empathic AI companion designed specifically for elderly users. By combining **Hume AI's Empathic Voice Interface (EVI)** with proactive intervention tools, ElderLink detects loneliness, confusion, and distress in real-time and provides supportive interventions before they escalate.

![ElderLink](https://img.shields.io/badge/Care-Compassionate-blue)
![Framework](https://img.shields.io/badge/Framework-Next.js%2016-black)
![Intelligence](https://img.shields.io/badge/Intelligence-Hume%20EVI-blueviolet)

---

## Core Functionality

### 1. Emotional Intelligence (Prosody Sensing)
ElderLink analyzes vocal tones, rhythms, and expressions using Hume's EVI. It calculates real-time emotional scores for:
- **Loneliness** (0-100)
- **Confusion** (0-100)
- **Distress** (0-100)

### 2. Proactive Interventions
When ElderLink detects emotional needs, it automatically triggers supportive interventions:
- **Photo Album**: Display family photos to combat loneliness
- **Music Player**: Play favorite songs to lift spirits
- **Family Notification**: Alert family members when needed
- **Calm Guidance**: Provide orientation for time, date, and schedule
- **Calm Activities**: Guide through breathing exercises and reminiscence

### 3. Emotional Analytics
Track emotional well-being with a dedicated dashboard featuring:
- **Emotional Trends Chart**: Real-time visualization of loneliness, confusion, and distress
- **Intervention History**: Track which interventions were most helpful

---

## Getting Started

### Prerequisites
- Node.js 18+
- [Hume AI API Key](https://beta.hume.ai/)
- [Firebase Account](https://console.firebase.google.com/) (optional, for session logging)

### 1. Environment Configuration
Create a `.env` file in the root directory:

```bash
# Hume AI
NEXT_PUBLIC_HUME_API_KEY=your_api_key
NEXT_PUBLIC_HUME_CONFIG_ID=your_config_id

# Firebase (Optional)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 2. Hume Portal Setup
See `ELDERLINK_HUME_CONFIG.md` for complete configuration instructions.

You must configure 5 tools in the [Hume Portal](https://app.hume.ai/evi/configs):
1. `show_photo_album` - Display family photos
2. `play_music` - Play favorite songs
3. `notify_family` - Alert family members
4. `provide_orientation` - Help with time/date/schedule
5. `start_calm_activity` - Guide calming activities

**Important**: Select **Claude 3.5 Sonnet**, **GPT-4o**, or **Gemini 1.5 Flash** as your supplemental LLM.

### 3. Installation
```bash
npm install
npm run dev
```

---

## Technical Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **State**: Zustand with persistence
- **Animations**: Framer Motion
- **Intelligence**: Hume EVI SDK
- **Charts**: Recharts
- **Persistence**: Firebase Firestore (optional)

---

## Design Philosophy: Elderly-Friendly
ElderLink follows an **Elderly-Friendly Design System**:
- **Soft Blue (#5B9BD5)**: Calm/Comfortable state
- **Warm Orange (#F4A460)**: Concerned/Needs attention
- **Gentle Purple (#9B7EBD)**: Alert/Intervention needed
- **Large Fonts**: 24px base font size for readability
- **High Contrast**: Easy-to-read text and UI elements
- **Simple Interactions**: Large buttons and clear visual feedback

---

## Testing ElderLink
1. Start a session
2. Say: *"I'm feeling lonely today, I miss my family."*
3. Watch as ElderLink detects loneliness and automatically shows family photos
4. Say: *"What day is it?"*
5. ElderLink will provide orientation with time, date, and schedule information

---

Developed for compassionate elderly care.
