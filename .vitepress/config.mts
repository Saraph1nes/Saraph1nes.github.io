import {defineConfig} from "vitepress";

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
			{text: "文章", link: "/src/article/"},
			{
				text: "专题",
				items: [
					{text: "前端专题", link: "/src/frontendTech/"},
					{text: "算法专题", link: "/src/algorithm/"},
				],
			},
			{
				text: "关于",
				items: [
					{text: "关于我", link: "/src/about/me"},
					{text: "我的项目", link: "/src/about/product"},
					{text: "博客历史", link: "/src/about/history"},
				],
			},
		],

		sidebar: {
			"/src/frontendTech/": [
				{
					text: "Javascript",
					items: [
						{
							text: "var、let、const",
							link: "/src/frontendTech/var-let-const",
						},
						{
							text: "数据类型检测",
							link: "/src/frontendTech/js-data-type-detection",
						},
						{
							text: "this指向",
							link: "/src/frontendTech/js-this",
						},
						{
							text: "Symbol",
							link: "/src/frontendTech/js-symbol",
						},
						{
							text: "Proxy & Reflect",
							link: "/src/frontendTech/js-proxy-reflect",
						},
						{
							text: "原型和原型链",
							link: "/src/frontendTech/js-prototype",
						},
						{
							text: "Promise",
							link: "/src/frontendTech/js-promise",
						},
						{
							text: "new 操作符",
							link: "/src/frontendTech/js-new",
						},
						{
							text: "Set 和 Map",
							link: "/src/frontendTech/js-set-map",
						},
						{
							text: "apply、call、bind",
							link: "/src/frontendTech/js-apply-call-bind",
						},
						{
							text: "Generator",
							link: "/src/frontendTech/js-generator",
						},
						{
							text: "BigInt",
							link: "/src/frontendTech/js-bigint",
						},
						{
							text: "箭头函数",
							link: "/src/frontendTech/js-arrow-function",
						},
					],
				},
				{
					text: "JS API实现",
					items: [
						{
							text: "防抖与节流",
							link: "/src/frontendTech/js-debounce-throttle",
						},
						{
							text: "浅拷贝与深拷贝",
							link: "/src/frontendTech/js-deep-copy",
						},
						{
							text: "async & await",
							link: "/src/frontendTech/js-async-await",
						},
						{
							text: "EventLoop & Promise",
							link: "/src/frontendTech/js-event-loop-promise",
						},
					]
				},
				{
					text: "浏览器 & Http",
					items: [
						{text: "性能优化", link: "/src/frontendTech/performance-optimization"},
						{text: "浏览器缓存", link: "/src/frontendTech/browser-cache"},
						{text: "CSP", link: "/src/frontendTech/csp"},
						{text: "跨域", link: "/src/frontendTech/cross-domain"},
						{text: "懒加载", link: "/src/frontendTech/lazy-load"},
					],
				},
				{
					text: "babel",
					items: [
						{text: "Babel简介", link: "/src/frontendTech/babel-introduction"},
						{text: "@babel/preset-env", link: "/src/frontendTech/babel-preset-env"},
						{text: "@babel/preset-react", link: "/src/frontendTech/babel-preset-react"},
					],
				},
				{
					text: "React",
					items: [
						{text: "React useState 原理", link: "/src/frontendTech/react-use-state-principle"},
						{text: "ReactDOM.createRoot().render()解析", link: "/src/frontendTech/react-dom-create-root"},
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
			],
		},

		socialLinks: [{icon: "github", link: "https://github.com/Saraph1nes"}],
	},
	// 指定放置生成的静态资源的目录
	assetsDir: 'static',
	// 站点将部署到的 base URL
	base: "/sablog/",
	head: [
		['link', {rel: 'icon', href: 'logo.svg'}]
	],
	lastUpdated: true,
});
