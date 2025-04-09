export interface Photo {
  id: number
  title: string
  description: string
  url: string
  date: string
}

export interface Album {
  id: string
  name: string
  description: string
  photos: Photo[]
} 