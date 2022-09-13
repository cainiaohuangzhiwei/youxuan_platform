/*
 * @Description: webpack配置文件
 配置文档： https://cli.vuejs.org/zh/config/
 与package.json同级的vue.config.js会被vue-cli 的serve命令加载
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-01 18:00:28
 * @LastEditTime: 2020-12-18 17:18:11
 * @LastEditors: linjing
 */
// const { SkeletonPlugin } = require('page-skeleton-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { GenerateSW } = require('workbox-webpack-plugin')
const eggConfig = require('./config/config.default')
const youxuan_config = eggConfig({ name: 'youxuan_web' })
const path = require('path')

function resolve(dir) {
	return path.join(__dirname, dir)
}
module.exports = {
	// 自定义webpack配置，会被vue-cli 使用webpack.merge 合并设置
	configureWebpack: {
		optimization: {
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						ecma: undefined,
						warnings: false,
						parse: {},
						compress: {
							drop_console: true,
							drop_debugger: true,
							pure_funcs: ['console.log', 'console.yxlog'], // 移除console
						},
					},
				}),
				new GenerateSW(),
			],
		},
		plugins: [
			// new SkeletonPlugin({
			// 	port: '9527',
			// 	pathname: path.resolve(__dirname, './public'), // 用来存储 shell 文件的地址
			// 	staticDir: path.resolve(__dirname, './app/public'), // 最好和 `output.path` 相同
			// 	routes: ['/'], // 将需要生成骨架屏的路由添加到数组中
			// }),
		],
	},
	pages: {
		app: {
			// page 的入口
			entry: path.join(__dirname, './src/main.js'),
			template: path.join(__dirname, './public/index.html'),
			filename: 'index.html',
			title: '云货优选',
		},
	},
	// 定义打包后的文件位置
	outputDir: 'app/public',
	// 定义生产环境的部署目录
	publicPath:
		process.env.NODE_ENV === 'production'
			? `${youxuan_config.static.prefix}`
			: '/',
	// vue-eslint 在开发环境里每次保存检测一次代码规范
	lintOnSave: process.env.NODE_ENV !== 'production',
	// 是否启动生产环境的sourcemap
	productionSourceMap: false,
	// 是否根据电脑os数开启线程来打包以及编译ts
	parallel: true,
	css: {
		loaderOptions: {
			sass: {
				prependData: `@import '@/style/variables.scss';`,
			},
		},
	},
	pwa: {
		name: '云货优选',
		themeColor: '#4DBA87',
		msTileColor: '#000000',
		start_url: '.',
		display: 'standalone',
		appleMobileWebAppCapable: 'yes',
		appleMobileWebAppStatusBarStyle: 'black',
		iconPaths: {
			favicon32: './static/images/favicon.jpg',
			favicon16: './static/images/favicon.jpg',
			appleTouchIcon: null,
			maskIcon: null,
			msTileImage: null,
		},
	},
	chainWebpack(config) {
		// set svg-sprite-loader
		config.module.rule('svg').exclude.add(resolve('src/assets/icons')).end()
		config.module
			.rule('icons')
			.test(/\.svg$/)
			.include.add(resolve('src/assets/icons'))
			.end()
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({
				symbolId: 'icon-[name]',
			})
			.end()
	},
}
