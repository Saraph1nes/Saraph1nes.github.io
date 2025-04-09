---
layout: doc
editLink: false
lastUpdated: false
isNoComment: true
aside: false
---

<div class="album-detail">
  <div class="album-header">
    <h1 class="album-title">{{ album.name }}</h1>
    <p class="album-description">{{ album.description }}</p>
  </div>

  <div class="photos-grid">
    <div v-for="photo in album.photos" :key="photo.id" class="photo-item" @click="showPhotoDetail(photo)">
      <img :src="photo.url" :alt="photo.title">
      <div class="photo-info">
        <h3>{{ photo.title }}</h3>
        <p>{{ photo.date }}</p>
      </div>
    </div>
  </div>

  <!-- 照片详情弹窗 -->
  <div v-if="selectedPhoto" class="photo-modal" @click="closePhotoDetail">
    <div class="modal-content" @click.stop>
      <img :src="selectedPhoto.url" :alt="selectedPhoto.title">
      <div class="modal-info">
        <h2>{{ selectedPhoto.title }}</h2>
        <p>{{ selectedPhoto.description }}</p>
        <p class="photo-date">{{ selectedPhoto.date }}</p>
      </div>
      <button class="close-btn" @click="closePhotoDetail">&times;</button>
    </div>
  </div>
</div>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useData } from 'vitepress'
import { albumsData } from './index'

const { params } = useData()
const albumId = params.value.id

const album = ref(albumsData[albumId as keyof typeof albumsData])
const selectedPhoto = ref(null)

const showPhotoDetail = (photo) => {
  selectedPhoto.value = photo
  document.body.style.overflow = 'hidden'
}

const closePhotoDetail = () => {
  selectedPhoto.value = null
  document.body.style.overflow = 'auto'
}

onMounted(() => {
  if (!album.value) {
    // 如果找不到相册，重定向到首页
    window.location.href = '/photo-album'
  }
})
</script>

<style lang="scss" scoped>
.album-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  .album-header {
    text-align: center;
    margin-bottom: 3rem;

    .album-title {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .album-description {
      color: #666;
      font-size: 1.1rem;
    }
  }

  .photos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }

  .photo-item {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;

    &:hover {
      transform: translateY(-5px);

      .photo-info {
        opacity: 1;
      }
    }

    img {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }

    .photo-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      color: white;
      opacity: 0;
      transition: opacity 0.3s;

      h3 {
        margin: 0 0 0.5rem;
        font-size: 1.2rem;
      }

      p {
        margin: 0;
        font-size: 0.9rem;
      }
    }
  }
}

.photo-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  .modal-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    background: white;
    border-radius: 8px;
    overflow: hidden;

    img {
      max-width: 100%;
      max-height: 70vh;
      object-fit: contain;
    }

    .modal-info {
      padding: 1.5rem;

      h2 {
        margin: 0 0 1rem;
        font-size: 1.8rem;
      }

      p {
        margin: 0 0 0.5rem;
        color: #666;
      }

      .photo-date {
        font-size: 0.9rem;
        color: #888;
      }
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 2rem;
      color: white;
      cursor: pointer;
      padding: 0.5rem;
      line-height: 1;
    }
  }
}

@media (max-width: 768px) {
  .album-detail {
    padding: 1rem;

    .photos-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .photo-item img {
      height: 250px;
    }
  }
}
</style> 