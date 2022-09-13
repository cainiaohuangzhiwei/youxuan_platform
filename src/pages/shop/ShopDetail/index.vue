<!--
 * @Author       : linjing
 * @Date         : 2020-09-12 01:28:32
 * @LastEditors: lufengkai
 * @LastEditTime: 2020-09-21 15:25:32
 * @Description  :
-->
<template>
	<div class="ShopDetail-page">
		<!-- 基于element的信息组件 -->
		<Info />
	</div>
</template>
<script>
import Info from './components/Info'
export default {
	// FIXME: hacker 暂时让页面不缓存 - 2020-09-12 02:21:19
	// fix: 店铺详情页面不缓存，深度监听路由变化，立即初始化
	name: 'shopDetail',
	components: {
		Info,
	},
}
</script>
