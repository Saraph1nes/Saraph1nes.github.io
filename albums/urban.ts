import { Album } from './types'

export const urbanAlbum: Album = {
  id: 'urban',
  name: '城市街拍',
  description: '都市生活的点滴',
  photos: [
    {
      id: 1,
      title: '城市夜景',
      description: '繁华都市的夜晚',
      url: '/images/urban/night.jpg',
      date: '2024-03-20'
    },
    {
      id: 2,
      title: '街头艺人',
      description: '充满活力的街头表演',
      url: '/images/urban/street.jpg',
      date: '2024-03-18'
    }
  ]
} 