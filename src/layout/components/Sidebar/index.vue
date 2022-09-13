<!--
 * @Description: 布局组件-侧边栏
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-09 14:11:26
 * @LastEditTime: 2020-08-28 05:27:56
 * @LastEditors: Navi
-->
<template>
	<div class="container un-selected">
		<el-menu
			ref="menu"
			class="sidebar"
			:unique-opened="false"
			:default-active="$route.path"
			:background-color="theme.LIGHT_SIDEBAR_BACKGROUND_COLOR"
			:text-color="theme.LIGHT_SIDEBAR_COLOR_GRAY"
			:active-text-color="theme.LIGHT_SIDEBAR_SELECT_COLOR_BLUE"
			:collapse-transition="false"
			:collapse="isCollapse"
			mode="vertical"
		>
			<!-- logo组件 -->
			<div class="logo">
				<logo v-if="true" :collapse="isCollapse" />
			</div>
			<!-- 递归组件 -->
			<sidebar-item
				v-for="route in $store.state.permission.routes"
				:key="route.path"
				:item="route"
				:base-path="route.path"
			></sidebar-item>
		</el-menu>
	</div>
</template>
<script>
import theme from '@/style/variables.scss'
export default {
	name: 'Sidebar',
	components: {
		SidebarItem: () => import('./SidebarItem'),
		Logo: () => import('./Logo'),
	},
	data() {
		return {}
	},

	methods: {},
	computed: {
		theme() {
			return theme
		},
		isCollapse() {
			return !this.$store.state.app.sidebar.opened
		},
	},
}
</script>

<style lang="scss" scoped>
.logo {
	position: sticky;
	top: 0;
	z-index: 1000;
}
.openSidebar {
	.sidebar {
		width: $LIGHT_SIDEBAR_WIDTH;
		min-width: $LIGHT_SIDEBAR_WIDTH;
		border-right-width: 0;
	}
}
</style>
