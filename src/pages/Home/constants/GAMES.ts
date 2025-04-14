export interface Game {
  id: string
  name: string
  logoUrl: string
}

export const GAMES: Game[] = [
  {
    id: 'overwatch',
    name: '오버워치',
    logoUrl: 'src/assets/images/Overwatch_logo.png',
  },
  {
    id: 'lol',
    name: '롤',
    logoUrl: 'src/assets/images/lol-logo.png',
  },
  {
    id: 'valorant',
    name: '발로란트',
    logoUrl: 'src/assets/images/valorant-logo.png',
  },
  {
    id: 'battleground',
    name: '배틀그라운드',
    logoUrl: 'src/assets/images/csgo-logo.png',
  },
] as const
