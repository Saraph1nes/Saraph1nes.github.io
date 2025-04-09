---
# https://vitepress.dev/reference/default-theme-home-page
layout: doc
editLink: false
lastUpdated: false
isNoComment: true
isNoBackBtn: true
aside: false
---

<div class="photo-albums">
  <h1 class="title">我的摄影集</h1>
  
  <div class="albums-container">
    <div class="album-card" v-for="album in albums" :key="album.id" @click="goToAlbum(album.id)">
      <div class="album-cover">
        <img :src="album.coverImage" :alt="album.name">
      </div>
      <div class="album-info">
        <h2>{{ album.name }}</h2>
        <p>{{ album.description }}</p>
        <span class="photo-count">{{ album.photoCount }}张照片</span>
      </div>
    </div>
  </div>
</div>

<script lang="ts" setup>
import { ref } from 'vue'

const albums = ref([
  {
    id: 'nature',
    name: '自然风光',
    description: '大自然的美丽瞬间',
    coverImage: '/images/albums/nature-cover.jpg',
    photoCount: 24
  },
  {
    id: 'urban',
    name: '城市街拍',
    description: '都市生活的点滴',
    coverImage: '/images/albums/urban-cover.jpg',
    photoCount: 18
  },
  {
    id: 'portrait',
    name: '人像摄影',
    description: '捕捉真实的情感',
    coverImage: '/images/albums/portrait-cover.jpg',
    photoCount: 15
  },
  {
    id: 'travel',
    name: '旅行日记',
    description: '世界各地的美景',
    coverImage: '/images/albums/travel-cover.jpg',
    photoCount: 32
  }
])

const goToAlbum = (albumId: string) => {
  window.location.href = `/albums/${albumId}`
}
</script>

<style lang="scss" scoped>
.photo-albums {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  .title {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
  }
  
  .albums-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }
  
  .album-card {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }
    
    .album-cover {
      height: 200px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s;
      }
    }
    
    &:hover .album-cover img {
      transform: scale(1.05);
    }
    
    .album-info {
      padding: 1.2rem;
      
      h2 {
        margin: 0 0 0.5rem;
        font-size: 1.4rem;
      }
      
      p {
        color: #666;
        margin: 0 0 0.8rem;
        font-size: 0.9rem;
      }
      
      .photo-count {
        display: block;
        font-size: 0.8rem;
        color: #888;
      }
    }
  }
}

@media (max-width: 768px) {
  .photo-albums {
    padding: 1rem;
    
    .albums-container {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.5rem;
    }
  }
}
</style>