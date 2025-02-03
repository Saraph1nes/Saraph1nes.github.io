import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Saraph1nes Blog",
  description: "Saraph1nes的博客",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/logo.svg",
    nav: [
      { text: "主页", link: "/" },
      {
        text: "文章",
        items: [
          { text: "前端技术", link: "/src/frontendTech/asdasd.md" },
          { text: "其他技术", link: "/src/otherTech/asdasd.md" },
          { text: "一些文章", link: "/src/about/me.md" },
          { text: "其他分类", link: "/src/about/history.md" },
        ],
      },
      {
        text: "关于",
        items: [
          { text: "关于我", link: "/src/about/me.md" },
          { text: "我的项目", link: "/src/about/product.md" },
          { text: "博客历史", link: "/src/about/history.md" },
        ],
      },
    ],

    sidebar: {
      "/src/frontendTech/": [
        {
          text: "React",
          items: [
            { text: "React useState 原理", link: "/guide/" },
            { text: "ReactDOM.createRoot().render()解析", link: "/guide/one" },
          ],
        },
        {
          text: "Vue",
          items: [
            {
              text: "Vue3响应式学习",
              link: "/posts/frontendTech/vue3响应式原理.md",
            },
            {
              text: "vue-router 导航守卫学习笔记",
              link: "/posts/frontendTech/vue3响应式原理.md",
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
});
