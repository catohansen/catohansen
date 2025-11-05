<!--
Copyright (c) 2025 Cato Hansen. All rights reserved.

Proprietary - Unauthorized copying, modification, distribution, or use
of this software, via any medium is strictly prohibited without express
written permission from Cato Hansen.

License: PROPRIETARY
Author: Cato Hansen
Contact: cato@catohansen.no
Website: www.catohansen.no
-->

# Nora SDK v2.0

**The Living Mind Behind Hansen Global**

Revolutionary AI SDK that's more advanced than Siri, Alexa, and Google Assistant.

**Programmed by Cato Hansen — System Architect from Drøbak, Norway**

---

## Installation

```bash
npm install @hansenglobal/nora
```

---

## Quick Start

```typescript
import { Nora } from '@hansenglobal/nora'

// Initialize client
const nora = new Nora({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.catohansen.no/nora', // Optional
  userId: 'user-123', // Optional
  pageContext: '/dashboard' // Optional
})

// Chat with Nora
const response = await nora.chat('Hei Nora, fortell meg om Pengeplan 2.0!')
console.log(response.content)

// Stream chat (Server-Sent Events)
for await (const chunk of nora.chatStream('Hei Nora!')) {
  process.stdout.write(chunk)
}
```

---

## Features

- 💬 **Chat API** - Real-time conversation with Nora
- 🌊 **Streaming** - Server-Sent Events for real-time responses
- 💾 **Memory** - Semantic search and memory management
- 📊 **Statistics** - Memory stats and analytics
- 📈 **Status** - System health and heartbeat

---

## API Reference

### Chat

```typescript
// Simple chat
const response = await nora.chat('Hello Nora!')

// Chat with options
const response = await nora.chat('Hello!', {
  persona: 'coach',
  stream: false,
  conversationHistory: []
})
```

### Streaming

```typescript
// Stream response
for await (const chunk of nora.chatStream('Hello!')) {
  console.log(chunk) // Word-by-word output
}
```

### Memory

```typescript
// Search memories
const memories = await nora.searchMemories('economics', {
  limit: 10,
  threshold: 0.75,
  context: 'finance'
})

// Store memory
const { memoryId } = await nora.storeMemory('User prefers dark mode', {
  context: 'preferences',
  source: 'chat'
})

// Get statistics
const stats = await nora.getMemoryStats()
console.log(stats.totalMemories)
```

### Status

```typescript
const status = await nora.getStatus()
console.log(status.version) // "2.0.2"
console.log(status.active_persona) // "General Nora"
```

---

## License

**PROPRIETARY** — Copyright © 2025 Cato Hansen. All rights reserved.

Unauthorized copying, modification, distribution, or use of this software is strictly prohibited without express written permission from Cato Hansen.

---

## Support

- **Website:** www.catohansen.no
- **Contact:** cato@catohansen.no
- **Author:** Cato Hansen (System Architect, Drøbak, Norway)

---

**Copyright © 2025 Cato Hansen. All rights reserved.**



