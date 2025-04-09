import { Album } from './types'

export const travelAlbum: Album = {
  id: 'travel',
  name: '旅行日记',
  description: '世界各地的美景',
  photos: [
    {
      id: 1,
      title: '海边日落',
      description: '马尔代夫的黄昏',
      url: '/images/travel/beach.jpg',
      date: '2024-03-28'
    },
    {
      id: 2,
      title: '古城街道',
      description: '丽江古城的街景',
      url: '/images/travel/street.jpg',
      date: '2024-03-26'
    }
  ]
} 