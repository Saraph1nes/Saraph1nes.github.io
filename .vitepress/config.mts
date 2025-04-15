import {defineConfig} from "vitepress";
import frontendTechRouter from "./router/frontend-tech.mjs";
import algorithmRouter from "./router/algorithm.mjs";
import photographRouter from "./router/photograph.mjs";
import rustRouter from "./router/rust.mjs";

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
			{text: "主页", link: "/"},
			{
				text: "专题",
				items: [
					{text: "前端面试", link: "/books/frontendTech/"},
					{text: "算法整理", link: "/books/algorithm/"},
					{text: "摄影知识", link: "/books/photograph/"},
					{text: "Rust专题", link: "/books/rust/"}
				],
			},
			{text: "AI工具", link: "/ai-tools"},
			{text: "摄影集", link: "/photo-album"},
			{
				text: "关于",
				items: [
					{text: "关于我", link: "/me"},
					{text: "我的产品", link: "/product"},
					{text: "博客历史", link: "/blog-history"},
				],
			},
		],

		sidebar: {
			"/books/frontendTech/": frontendTechRouter,
			"/books/algorithm/": algorithmRouter,
			"/books/photograph/": photographRouter,
			"/books/rust/": rustRouter,
		},

		socialLinks: [{icon: "github", link: "https://github.com/Saraph1nes"}],
	},
	// 指定放置生成的静态资源的目录
	assetsDir: 'static',
	// 站点将部署到的 base URL
	base: "/",
	head: [
		['link', {rel: 'icon', href: 'logo.svg'}]
	],
	lastUpdated: true,
});
