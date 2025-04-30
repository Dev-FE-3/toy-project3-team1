import LolLogo from '@/assets/images/lol_logo.webp'
import WhiteOverwatchLogo from '@/assets/images/Overwatch_logo_white.webp'
import ValorantLogo from '@/assets/images/Valorant_logo_name.webp'

export interface Game {
  id: string
  name: string
  logoUrl: string
}

export const GAMES: Game[] = [
  {
    id: 'overwatch',
    name: '오버워치',
    logoUrl: WhiteOverwatchLogo,
  },
  {
    id: 'lol',
    name: '롤',
    logoUrl: LolLogo,
  },
  {
    id: 'valorant',
    name: '발로란트',
    logoUrl: ValorantLogo,
  },
  // {
  //   id: 'battleground',
  //   name: '배틀그라운드',
  //   logoUrl: CsLogo,
  // },
] as const
