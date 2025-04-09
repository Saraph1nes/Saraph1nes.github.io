import { Album } from './types'

export const natureAlbum: Album = {
  id: 'nature',
  name: '自然风光',
  description: '大自然的美丽瞬间',
  photos: [
    {
      id: 1,
      title: '山川日落',
      description: '在黄山拍摄的壮丽日落景色',
      url: '/images/nature/sunset.jpg',
      date: '2024-03-15'
    },
    {
      id: 2,
      title: '森林晨雾',
      description: '清晨森林中的薄雾缭绕',
      url: '/images/nature/forest.jpg',
      date: '2024-03-10'
    }
  ]
} 