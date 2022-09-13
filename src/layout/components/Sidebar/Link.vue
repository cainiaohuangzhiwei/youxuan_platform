<template>
	<div>
		<component :is="type" v-bind="linkProps(to)">
			<slot />
		</component>
		<a
			class="wg-old"
			v-if="oldLink && $store.state.app.sidebar.opened"
			:href="oldLink"
			target="_blank"
		>
			<i class="el-icon-right" />
		</a>
	</div>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
	props: {
		to: {
			type: String,
			required: true,
		},
		link: {
			type: Boolean,
			default: false,
			required: false,
		},
		oldLink: {
			type: String,
			default: '',
		},
	},
	computed: {
		isExternal() {
			return this.link || isExternal(this.to)
		},
		type() {
			if (this.isExternal) {
				return 'a'
			}
			return 'router-link'
		},
	},
	methods: {
		linkProps(to) {
			if (this.isExternal) {
				return {
					href: to,
					target: '_blank',
					rel: 'noopener',
				}
			}
			return {
				to: to,
			}
		},
	},
}
</script>
