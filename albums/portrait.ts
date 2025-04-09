import { Album } from './types'

export const portraitAlbum: Album = {
  id: 'portrait',
  name: '人像摄影',
  description: '捕捉真实的情感',
  photos: [
    {
      id: 1,
      title: '微笑瞬间',
      description: '自然流露的笑容',
      url: '/images/portrait/smile.jpg',
      date: '2024-03-25'
    },
    {
      id: 2,
      title: '沉思时刻',
      description: '安静思考的瞬间',
      url: '/images/portrait/thinking.jpg',
      date: '2024-03-22'
    }
  ]
} 