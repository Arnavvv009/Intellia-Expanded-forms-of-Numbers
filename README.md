# Place Value Pioneers — Expanded Form of Numbers to 1,000

A gamified, simulation-driven web module teaching Grade 2 students the concept of **Expanded Form of Numbers up to 1,000** (e.g., 472 = 400 + 70 + 2), aligned to the Singapore MOE Primary 2 Mathematics syllabus.

## 🚀 Features

- **3-panel structure**: Story → Simulate → Play
- **7 narrated story scenes** with Captain Hundred's Place Value Galaxy
- **4 interactive simulation stations**: Base-Ten Builder, Crate Counter, Digit Detective, Number Line Rocket
- **100-question quiz arena** with 5 question types and 4 difficulty tiers
- **Full gamification**: stars, streaks, hearts, XP, badges, level-up
- **ElevenLabs "Alice" voice** narration with offline pre-generation
- **Galaxy space theme** with twinkling star field, Framer Motion animations, confetti

## 🛠️ Stack

- React 18 + Vite + JavaScript
- Framer Motion (animations)
- canvas-confetti (celebrations)
- @dnd-kit/core (drag & drop)
- ElevenLabs TTS (via serverless proxy)
- Vercel deployment

## 🏃 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Generate pre-recorded audio (requires ELEVENLABS_API_KEY in .env.local)
node scripts/generate_audio.js

# Clean orphaned audio files
node scripts/clean_audio.js
```

## 🔑 Environment Variables

Create `.env.local`:
```
ELEVENLABS_API_KEY=your_key_here
VITE_ELEVENLABS_API_KEY=your_key_here
```

For Vercel deployment, set `ELEVENLABS_API_KEY` in the project's environment variables dashboard.

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/     Header, TabNav, MascotFooter
│   ├── story/      StoryPanel, WonderQuestion
│   ├── simulate/   SimulatePanel + 4 stations
│   ├── play/       PlayPanel, QuestionCard + 5 question types
│   └── shared/     PlaceValueBlock, ExpandedFormStrip, StarBurst, StarField
├── context/        GameContext (global state + reducer)
├── engine/         questionEngine, distractorEngine, rng
├── utils/          audio, audioMap, narration, placeValue
└── styles/         theme.css, animations.css
```

## 🎮 Question Types

1. **MCQ** — 4-option multiple choice (expanded↔standard form)
2. **Fill Tiles** — type in H + T + O values
3. **True/False** — is this expanded form correct?
4. **Match Pairs** — match 3–4 standard↔expanded pairs
5. **Build It** — use base-ten block builder

## 🏅 Badges

| Badge | Condition |
|---|---|
| 🚀 First Blast-Off | Complete Story panel |
| 🧱 Block Builder | Complete all 3 Simulate stations |
| 💯 Hundreds Hero | 10 correct in a row |
| ⚡ Tens Titan | (unlockable) |
| 🌟 Ones Ace | (unlockable) |
| 🏆 Place Value Pro | Answer 50 questions |
| 🌌 Galaxy Champion | Complete 100-question session |

## 📚 Curriculum

**Singapore MOE Primary 2 Maths — Whole Numbers: Numbers to 1,000**
- Place value (H/T/O)
- Expanded notation: 358 = 300 + 50 + 8
- Standard ↔ expanded form conversion
- Numbers including zero digits (405, 270, 300)
- Special case: 1000 = 1000 + 0 + 0
