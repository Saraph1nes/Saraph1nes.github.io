import { Album } from './types'
import { natureAlbum } from './nature'
import { urbanAlbum } from './urban'
import { portraitAlbum } from './portrait'
import { travelAlbum } from './travel'

export const albumsData: Record<string, Album> = {
  nature: natureAlbum,
  urban: urbanAlbum,
  portrait: portraitAlbum,
  travel: travelAlbum
}

export * from './types' 