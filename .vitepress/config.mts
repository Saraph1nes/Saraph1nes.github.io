import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Saraph1nes Blog",
  description: "Saraph1nes的博客",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local'
    },
    logo: "/logo.svg",
    nav: [
      { text: "主页", link: "/" },
      { text: "文章", link: "/src/article/" },
      {
        text: "专题",
        items: [
          { text: "前端专题", link: "/src/frontendTech/" },
          { text: "算法专题", link: "/src/algorithm/" },
        ],
      },
      {
        text: "关于",
        items: [
          { text: "关于我", link: "/src/about/me" },
          { text: "我的项目", link: "/src/about/product" },
          { text: "博客历史", link: "/src/about/history" },
        ],
      },
    ],

    sidebar: {
      "/src/frontendTech/": [
        {
          text: "React",
          items: [
            { text: "React useState 原理", link: "/src/frontendTech/react-use-state-principle" },
            { text: "ReactDOM.createRoot().render()解析", link: "/src/frontendTech/react-dom-create-root" },
          ],
        },
        {
          text: "Vue",
          items: [
            {
              text: "Vue3响应式学习",
              link: "/src/frontendTech/vue3-reactivity-principle",
            },
            {
              text: "vue-router 导航守卫学习笔记",
              link: "/src/frontendTech/vue-router-navigation-guards",
            },
          ],
        },
        {
          text: "Javascript",
          items: [
            {
              text: "var、let、const",
              link: "/posts/frontendTech/javascript基础.md",
            },
            {
              text: "JS数据类型检测",
              link: "/posts/frontendTech/javascript基础.md",
            },
          ],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/Saraph1nes" }],
  },
  // 指定放置生成的静态资源的目录
  assetsDir: 'static',
  // 站点将部署到的 base URL
  base: "/sablog/",
  head: [
      ['link', { rel: 'icon', href: 'logo.svg' }]
  ],
  lastUpdated: true,
});
