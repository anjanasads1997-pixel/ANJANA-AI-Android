# ANJANA AI — Android Starter (OpenAI + Avatar + Chat)

මෙය වෙනම GitHub repository එකක් ලෙස ආරම්භ කිරීමට සකස් කළ Starter Project එකකි.

## Mobile UI
- Login screen නැත.
- App open වූ විට Avatar preview සහ Chat පමණක්.
- Voice input (browser Web Speech API සහාය ඇති devices වල)
- Text-to-speech
- LiveAvatar API integration සඳහා backend route placeholder.
- Lip-sync/LiveAvatar session සඳහා provider-specific API schema තහවුරු කර පසුව සම්පූර්ණ කරන්න.

## API keys ආරක්ෂාව
Render Environment Variables භාවිතා කරන්න. `OPENAI_API_KEY`, `LIVEAVATAR_API_KEY` වැනි secrets frontend හෝ APK එකට embed නොකරන්න.
මෙම starter එකේ ඔබගේ සැබෑ keys ඇතුළත් කර නැත.

## Render variables (ඔබ දුන් screenshot අනුව)
- `AI_PROVIDER=openai` (server code එක OpenAI mode support කරනවා නම්)
- `OPENAI_API_KEY` = OpenAI secret
- `OPENAI_BASE_URL=https://api.openai.com/v1`
- `OPENAI_MODEL=gpt-4.1-mini` (ඔබගේ account එකේ model access තිබේද පරීක්ෂා කරන්න)
- `LIVEAVATAR_API_KEY` = LiveAvatar secret
- `LIVEAVATAR_AVATAR_ID` = avatar identifier
- `LIVEAVATAR_MODE= LITE` (provider docs අනුව value එක පරීක්ෂා කරන්න)
- `PORT` Render විසින් සපයයි

Existing variables `BACKUP_OPENAI_*`, `GEMINI_*`, `OLLAMA_*` මෙම OpenAI-only starter එකට අවශ්‍ය නොවේ.

## Local run
```bash
npm install
npm start
```
Open `http://localhost:3000`

## GitHub → APK
1. ZIP extract කරන්න.
2. GitHub → New repository → `ANJANA-AI-Android` (Public/Private ඔබේ තීරණය).
3. Extract කළ files upload/commit කරන්න.
4. Actions tab → `Build Android APK` → Run workflow.
5. Build සාර්ථක වූ පසු workflow run එකේ Artifacts තුළ `anjana-ai-debug-apk` download කරන්න.

APK build workflow Capacitor + Android Gradle භාවිතා කරයි. Native Android project එක CI එකේ generate/sync කරයි.

## Avatar image
`public/avatar.png` වෙත ඔබ කලින් භාවිතා කළ avatar image එක copy කරන්න. ZIP එකේ placeholder SVG පමණක් ඇත; ඔබගේ private portrait image එක මෙහි නොතිබූ නිසා embed කළ නොහැකි විය.

## LiveAvatar
`server.js` හි `/api/avatar/session` route එක intentionally safe placeholder එකක්. LiveAvatar provider එකේ ඔබගේ account/API version එකට අදාල session-create endpoint සහ request/response schema official dashboard/API docs වලින් තහවුරු කරලා එම route එක implement කරන්න. API key client වෙත යවන්නේ නැත.
