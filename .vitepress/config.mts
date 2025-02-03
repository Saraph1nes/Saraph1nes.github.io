import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/sablog/",
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
          { text: "前端技术", link: "/posts/frontendTech/asdasd.md" },
          { text: "其他技术", link: "/posts/otherTech/asdasd.md" },
          { text: "一些文章", link: "/posts/about/me.md" },
          { text: "其他分类", link: "/posts/about/history.md" },
        ],
      },
      {
        text: "关于",
        items: [
          { text: "关于我", link: "/posts/about/me.md" },
          { text: "我的项目", link: "/posts/about/product.md" },
          { text: "博客历史", link: "/posts/about/history.md" },
        ],
      },
    ],

    sidebar: {
      "/posts/frontendTech/": [
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
});
