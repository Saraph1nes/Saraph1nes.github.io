// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { watch } from 'vue'
import { ConfigProvider } from 'tdesign-vue-next'

import 'tdesign-vue-next/es/style/index.css';

import './tdesign-theme.css';

import './style.css'

export default {
  extends: DefaultTheme,
  setup() {
    const { isDark } = useData()

    // 监听 VitePress 主题变化
    watch(isDark, (newValue) => {
      // 设置 TDesign 主题
      document.documentElement.setAttribute('theme-mode', newValue ? 'dark' : 'light')
    }, { immediate: true })
  },
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme
