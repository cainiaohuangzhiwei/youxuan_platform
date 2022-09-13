<template>
	<div v-if="!item.hidden" class="sidebar-item">
		<!-- TODO: 无子路由则隐藏 -->
		<template
			v-if="
				hasOneShowingChild(item.children, item) &&
				(!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
				!item.alwaysShow
			"
		>
			<app-link
				class="wg-left"
				v-if="onlyOneChild.meta && !onlyOneChild.auth"
				:link="onlyOneChild.link"
				:oldLink="onlyOneChild.meta.oldLink"
				:to="resolvePath(onlyOneChild.path)"
			>
				<el-menu-item
					:index="resolvePath(onlyOneChild.path)"
					:class="{ 'submenu-title-noDropdown': !isNest }"
				>
					<item
						:icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
						:title="onlyOneChild.meta.title"
					/>
				</el-menu-item>
			</app-link>
		</template>
		<template v-else>
			<el-submenu
				ref="subMenu"
				:index="resolvePath(item.path)"
				class="submenu"
				popper-append-to-body
			>
				<template slot="title">
					<item
						v-if="item.meta"
						:icon="item.meta.icon"
						:title="item.meta.title"
					/>
				</template>
				<sidebar-item
					v-for="child in item.children"
					:key="child.path"
					:is-nest="true"
					:item="child"
					:base-path="resolvePath(child.path)"
					class="nest-menu"
				/>
			</el-submenu>
		</template>
	</div>
</template>
<script>
import path from 'path'
import FixiOSBug from './FixiOSBug'
import { isExternal } from '@/utils/validate'
export default {
	name: 'SidebarItem',
	mixins: [FixiOSBug],
	components: {
		Item: () => import('./Item'),
		AppLink: () => import('./Link'),
	},
	props: {
		// route object
		item: {
			type: Object,
			required: true,
		},
		isNest: {
			type: Boolean,
			default: false,
		},
		basePath: {
			type: String,
			default: '',
		},
	},
	data() {
		this.onlyOneChild = null
		return {}
	},
	methods: {
		hasOneShowingChild(children = [], parent = {}) {
			const showingChildren = children.filter((item) => {
				if (item.hidden) {
					return false
				} else {
					// TODO:
					this.onlyOneChild = item
					return true
				}
			})
			if (showingChildren.length === 1) {
				return true
			}
			if (showingChildren.length === 0) {
				// 处理权限菜单选择详情页时, 详情页没有添加权限, 导致菜单还会父级目录, 根据添加auth属性来判断
				if (parent.children && parent.children.length > 0) {
					parent.auth = true
				}
				this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
				return true
			}
			return false
		},
		resolvePath(routePath) {
			if (isExternal(routePath)) {
				return routePath
			}
			if (isExternal(this.basePath)) {
				return this.basePath
			}
			return path.resolve(this.basePath, routePath)
		},
	},
}
</script>

<style lang="scss" scoped>
.nest-menu {
	background: #202d3c;
}
</style>
