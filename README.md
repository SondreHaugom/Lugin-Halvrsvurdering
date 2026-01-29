# Lugin Halvårsvurdering 

En prototype av en chattetjeneste for alle ansatte i Telemark Fylkeskommune. 

![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Mistral AI](https://img.shields.io/badge/Mistral%20AI-4F8CBF?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDIgMC04LTMuNTgtOC04czMuNTgtOCA4LTggOCAzLjU4IDggOC0zLjU4IDgtOCA4eiIvPjwvc3ZnPg==&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)


---
[![Svelte](https://img.shields.io/badge/Svelte-5%2B-ff3e00?logo=svelte)](https://svelte.dev)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2%2B-ff3e00?logo=svelte)](https://kit.svelte.dev)
[![Status](https://img.shields.io/badge/status-under%20arbeid-yellow)](#)


## Innholdsfortegnelse
- [Funksjoner](#-Funksjoner)
- [Om prosjektet](#-Om prosjektet)
- [Prosjektstruktur](#-Prosjektstruktur)
- [Dataflyt](#-Dataflyt)
- [Filforklaring](#-Filforklaring)
- [Arkitektur-prinsipper](#-Arkitektur-prinsipper)
- [Biblioteker og begrunnelse](#-Biblioteker og begrunnelse)
- [Installasjon og oppsett](#-Installasjon og oppsett)
- [Sikkerhet og personvern](#-Sikkerhet og personvern)


## Funksjoner
- **Moderne chatgrensesnitt** med Svelte
- **Multi-agent-system** mulighet for flere agenter
 - **Mistral Large 3** (Mistral) Generell agent for Lugin
 - **GPT-5.1** (OpenAi) Koblet opp OpenAi som valgmulighet
- **Bytte modell underveis** Kan bytte mellom agentene under samtalen
- **Responsivt design** med gradient-bakgrunner og moderne styling
- **Modulær arkitektur** med separert agent-logikk
- **Tastaturnavigasjon** (Enter for å sende)





## Om prosjektet

Dette er en prototype av en chatbot som er satt opp met en multi agent arkitektur bygget med SvelteKit. Systemet lar brukeren velge mellom to ulige agenter som gir bruker mer valg muligheter etter ønsket leverandør. Man kan bytte mellom agenter underveis, men agenten vil ikke kunne kjenne igjen hva andre agenters respons. Dette er en Halvårsoppgave ettersom at jeg har vert lærling i over 6 måender. 



## Prosjektstruktur

```
Lugin-Halvrsvurdering/
├── 📁 src/                          # Hovedkildekode
│   ├── 📄 app.html                  # HTML-mal for appen
│   ├── 📁 lib/                      # Gjenbrukbare komponenter og utilities
│   │   ├── 📄 index.js              # Hovedeksport fil
│   │   ├── 📄 selectAgent.js        # 🔄 Agent-velger logikk (kobler frontend til backend)
│   │   ├── 📁 assets/               # Statiske ressurser
│   │   │   └── 📄 favicon.svg       # Nettstedikon
│   │   └── 📁 logo/                 # Logoer og bilder
│   │       ├── 📄 artificial intelligence.png
│   │       └── 📄 artificial intelligence - Logo2.png
│   │
│   └── 📁 routes/                   # SvelteKit routing struktur
│       ├── 📄 +layout.svelte        # Global layout og CSS variabler
│       ├── 📄 +page.svelte          # Hovedside med chat-interface
│       ├── 📁 Mistralai/            # Mistral AI API endpoint
│       │   ├── 📄 +server.js        # Server-side API for Mistral (tool calls support)
│       │   └── 📄 Test.py           # Python test script for Mistral API
│       └── 📁 Openai/               # OpenAI API endpoint  
│           └── 📄 +server.js        # Server-side API for OpenAI
│
├── 📁 static/                       # Statiske filer (tilgjengelig via URL)
│   └── 📄 robots.txt               # Søkemotor instruksjoner
│
├── 📄 package.json                 # Prosjektavhengigheter og scripts
├── 📄 package-lock.json            # Låst avhengighetsversioner
├── 📄 svelte.config.js             # SvelteKit konfigurasjon
├── 📄 vite.config.js               # Vite bundler konfigurasjon
├── 📄 jsconfig.json                # JavaScript/TypeScript konfigurasjon
└── 📄 README.md                    # Dette dokumentet
```

### Dataflyt

```
👤 Bruker skriver melding
    ↓
📱 Frontend (+page.svelte)
    ↓
🔄 selectAgent.js (bestemmer hvilken agent)
    ↓
🤖 API Endpoint (/Mistralai eller /Openai)
    ↓
🌐 Eksterne AI API (Mistral AI / OpenAI)
    ↓
📝 JSON Response tilbake til frontend
    ↓
💬 Vises i chat-grensesnitt
```

### Filforklaring

| Fil/Mappe | Funksjon | Type |
|-----------|----------|------|
| `+page.svelte` | Chat-grensesnitt, brukerinteraksjon, DOM-håndtering | 🖥️ Frontend |
| `selectAgent.js` | Router meldinger til riktig AI-agent | 🔄 Middleware |
| `Mistralai/+server.js` | API endpoint for Mistral AI med tool calls support | 🤖 Backend API |
| `Openai/+server.js` | API endpoint for OpenAI GPT modeller | 🤖 Backend API |
| `+layout.svelte` | Global styling, CSS variabler, favicon | 🎨 Layout |
| `Test.py` | Python test script for å validere Mistral API | 🧪 Testing |

### Arkitektur-prinsipper

- **Frontend**: Svelte/SvelteKit for reaktiv UI
- **Backend**: SvelteKit API routes (`+server.js` filer)  
- **Agent-system**: Modulær oppbygning hvor hver AI-leverandør har sitt eget API endpoint
- **Responsiv design**: Mobile-first tilnærming med CSS Grid/Flexbox
- **Tool calls**: Mistral støtter funksjonskall (f.eks. Chuck Norris vitser)



## Biblioteker og begrunnelse

| Import / Bibliotek           | Formål                                                                 |
|------------------------------|------------------------------------------------------------------------|
| `$env/dynamic/private`       | Henter miljøvariabler (API-nøkler) som ikke skal være synlige for klienten |
| `@sveltejs/kit` (`json`)     | Returnerer JSON-responser fra server-endepunkter på standardisert måte |
| `path`                       | Node.js-modul for håndtering av filstier på serveren               |
| `openai`                     | OpenAI-klient for kommunikasjon med API og AI-generering |
| `mistral`                    | MistralAI-klient for kommunikasjon med API og AI-genererin|
| `selectLogic.js`              | Sentral routing-logikk for multi-agent systemet                    |



## Installasjon og oppsett
## 🧰 Installasjon og oppsett

### 📋 Forutsetninger

- ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
- ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)
- OpenAI API-nøkkel

### 1️⃣ Kloning av repository

```bash
git clone https://github.com/ditt-brukernavn/FagAssistenten.git
cd FagAssistenten
```

### 2️⃣ Installer avhengigheter

```bash
npm install
```

### 3️⃣ Opprett miljøvariabler

Lag en `.env`-fil i prosjektroten:

```env
OPENAI_API_KEY=din_openai_api_nokkel
# Tilleggskonfigurationer for agenter (valgfritt)
# VECTOR_STORE_ID=din_vector_store_id  
# INSTRUCTIONS=instruksjoner_til_botten
```

### 4️⃣ Start utviklingsserver

```bash
npm run dev
```

Åpne nettleseren på `http://localhost:5173`


## Sikkerhet og personvern

For å beskytte personvernet i dette prosjektet har jeg benyttet meg av samme løsning som det er i dagens Hugin. Med AI-leverandørene er det avtaler som zero retention avtale med Mistral og 30 dagers lagring av OpenAI. Med disse avtalene sikres det at:

### 🔒 Datahåndtering

- **Mistral AI**: Zero retention policy - ingen data lagres permanent
- **OpenAI**: 30 dagers lagringspolicy før automatisk sletting
- **Lokal lagring**: Ingen sensitiv data lagres lokalt i nettleseren
- **API-nøkler**: Sikret gjennom miljøvariabler på serversiden

### 🛡️ Sikkerhetstiltak

- **Server-side API calls**: Alle forespørsler går via backend for å skjule API-nøkler
- **Miljøvariabler**: Sensitive data eksponeres ikke til frontend

### 📋 Personvernshensyn

- **Ingen persistent lagring**: Chat-historikk lagres ikke permanent
- **Anonymisering**: Ingen personidentifiserbar informasjon samles inn
- **Transparent**: Brukere informeres om hvilken AI-leverandør som brukes
