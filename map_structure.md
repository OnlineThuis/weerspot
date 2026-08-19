weerspot/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   └── (routes)/
│       ├── about/
│       │   └── page.tsx
│       └── contact/
│           └── page.tsx
├── components/
│   ├── layout/
│   │   ├── footer.tsx
│   │   ├── header.tsx
│   │   └── navbar.tsx
│   ├── shared/
│   └── ui/
├── hooks/
├── lib/
│   ├── constants.ts
│   └── utils.ts
├── services/
└── types/
    └── index.ts


    Open .env.local
Paste in your real NEXT_PUBLIC_GOOGLE_PLACES_API_KEY, NEXT_PUBLIC_STADIA_API_KEY, and NEXT_PUBLIC_OPENWEATHER_API_KEY.
Restart your development server (npm run dev)

map (https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=YOUR_KEY). This will overlay the live precipitation/radar blobs.
Requirement: Needs NEXT_PUBLIC_OPENWEATHER_API_KEY.
