<!--
 * @Description: 单页面应用挂载模板
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-06 20:56:30
 * @LastEditTime: 2020-09-11 16:02:11
 * @LastEditors: lufengkai
-->
<template>
	<div id="app">
		<router-view />
	</div>
</template>
<script>
// import Cookie from 'js-cookie'
// import { setToken } from '@/utils/auth'
import CONSOLE_STYLE from '@/utils/console.js'
import { version, name } from '../package.json'
import { delCookie } from '@/utils/helper/common'
export default {
	name: 'App',
	async created() {
		delCookie('yhtplus/web/token')
		delCookie(encodeURIComponent('yhtplus/web/token'))
		delCookie('yhtplus/web/tokens')
		delCookie('yhtplus/web/yxToken')
		delCookie('yhtplus/web/yxToken2020')
		if (JSON.stringify(this.$store.state.user.userInfo) == '{}') {
			await this.$store.dispatch('user/setUserInfo')
		}
		console.log(
			`%c ${name}初始化成功，当前版本为：${version}`,
			CONSOLE_STYLE.success
		)
	},
}
</script>

<style lang="scss">
#app {
	font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
		'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	width: 100vw;
	max-width: 100vw;
	height: 100vh;
}
</style>
