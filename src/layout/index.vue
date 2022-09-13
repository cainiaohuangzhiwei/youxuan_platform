<!--
 * @Description: 全局布局组件
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-07-09 14:08:14
 * @LastEditTime: 2020-09-03 11:21:29
 * @LastEditors: huwenpiao
-->
<template>
	<div :class="classObj" class="container">
		<!-- sidebar -->
		<el-scrollbar class="sidebar" :native="false" :noresize="false">
			<Sidebar></Sidebar>
		</el-scrollbar>
		<!-- main -->
		<main class="main-wrap">
			<!-- header -->
			<header class="header">
				<Navbar></Navbar>
				<TagsView></TagsView>
			</header>

			<!-- pages-view -->
			<transition name="fade-transform" mode="out-in">
				<keep-alive :include="cachedViews">
					<router-view
						:key="key"
						class="main main-scrollbar__wrap"
					></router-view>
				</keep-alive>
			</transition>
			<el-backtop target=".main-wrap"> </el-backtop>
		</main>
	</div>
</template>
<script>
export default {
	name: 'layout-index',
	components: {
		TagsView: () => import('./components/TagsView/index.vue'),
		Navbar: () => import('./components/Navbar'),
		Sidebar: () => import('./components/Sidebar'),
	},
	data() {
		return {}
	},
	methods: {},
	computed: {
		classObj() {
			return {
				hideSidebar: !this.$store.state.app.sidebar.opened,
				openSidebar: this.$store.state.app.sidebar.opened,
				withoutAnimation: this.$store.state.app.sidebar.opened.withoutAnimation,
			}
		},
		cachedViews() {
			return this.$store.state.tagsView.cachedViews
		},
		key() {
			return this.$route.path
		},
	},
}
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100vh;
	max-height: 100vh;
	display: flex;
	flex-direction: row;
	.sidebar {
		flex-basis: $LIGHT_SIDEBAR_WIDTH;
		flex-shrink: 0;
		transition: width 0.28s;
	}
	.main-wrap {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: auto;
		background: $LIGHT_BACKGROUND_COLOR_DEFAULT;
		position: relative;
		.header {
			position: sticky;
			top: 0;
			z-index: 1000;
		}
		.main {
			flex: 1;
			margin: 20px;
			padding: 20px;
			background: $LIGHT_BACKGROUND_COLOR_WHITE;
		}
	}
}
::v-deep .el-scrollbar__wrap {
	overflow-y: auto;
	overflow-x: auto;
}
</style>
<style lang="scss">
// .el-submenu__title {
// 	height: 48px;
// 	line-height: 48px;
// }
// .el-submenu .el-menu-item {
// 	height: 42px;
// 	line-height: 42px;
// }
.sidebar {
	.el-submenu {
		.el-menu-item {
			background-color: #1f2d3d !important;
		}
		.el-menu-item:hover {
			background-color: rgb(38, 52, 69) !important;
		}
	}
}
.nest-menu {
	.el-submenu {
		& > .el-submenu__title {
			background-color: #1f2d3d !important;
		}
	}
}
.hideSidebar {
	.sidebar {
		flex-basis: 54px !important;
		width: 54px !important;
	}

	.submenu-title-noDropdown {
		padding: 0 !important;
		position: relative;

		.el-tooltip {
			padding: 0 !important;

			.svg-icon {
				margin-left: 20px;
			}

			.sub-el-icon {
				margin-left: 19px;
			}
		}
	}

	.el-submenu {
		overflow: hidden;

		& > .el-submenu__title {
			padding: 0 !important;

			.svg-icon {
				margin-left: 20px;
			}

			.sub-el-icon {
				margin-left: 19px;
			}

			.el-submenu__icon-arrow {
				display: none;
			}
		}
	}

	.el-menu--collapse {
		.el-submenu {
			& > .el-submenu__title {
				& > span {
					height: 0;
					width: 0;
					overflow: hidden;
					visibility: hidden;
					display: inline-block;
				}
			}
		}
	}
}
</style>
