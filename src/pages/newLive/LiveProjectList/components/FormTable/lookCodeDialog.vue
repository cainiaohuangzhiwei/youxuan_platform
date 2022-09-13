<template>
	<div>
		<el-dialog
			width="300px"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<img class="img" :src="`${appletCode}`" v-if="appletCode" />
			<div class="loading" v-loading="loading" v-else />
		</el-dialog>
	</div>
</template>

<script>
import store from '@/store'
import { getBigImg } from '@/utils/imageTool'
import { generateVieweCode } from '@/api/livePlan'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			loading: false,
			appletCode: '',
		}
	},

	computed: {
		localVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			},
		},
	},

	methods: {
		// 回显
		async detail(row) {
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await generateVieweCode({
				livePlanId: row.livePlanId,
				timeStamp: new Date() * 1,
				groupId: store.state.user.userInfo.groupId,
				sortField: 0,
				userId: store.state.user.userInfo.userId,
			})

			if (resultCode == 0 && resultData) {
				this.appletCode = getBigImg(resultData)
				this.loading = false
			} else {
				this.loading = false
			}
		},

		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.appletCode = ''
		},
	},
}
</script>

<style lang="scss" scoped>
.img {
	width: 260px;
	height: 257px;
	margin: 0 auto;
}

.loading {
	height: 260px;
}
</style>
