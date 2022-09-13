<template>
	<div>
		<el-dialog
			width="1000px"
			title="策略"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<scene-data
				ref="onlinePane"
				:abtStrategyId="newSceneRow.abtStrategyId"
				:sceneId="newSceneRow.sceneId"
				:flowRuleId="newSceneRow.flowRuleId"
				:returnContentList="returnContentList"
				:dataType="dataType"
			></scene-data>
		</el-dialog>
	</div>
</template>

<script>
import { optionsGet } from '@/api/scene'
import sceneData from './sceneData'
export default {
	components: {
		sceneData,
	},
	props: {
		visible: {
			type: Boolean,
			define: false,
		},
		newSceneRow: {
			define: false,
			default: () => {},
		},
		dataType: {
			type: Number,
		},
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

	data() {
		return {
			returnContentList: [],
		}
	},
	mounted() {
		this._optionsGet()
	},

	methods: {
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
		_optionsGet: async function () {
			let { data } = await optionsGet()
			if (data.resultCode == 0) {
				this.rankingModelList = data.resultData.rankingModelList.map((item) => {
					item.name = item.label + '———' + item.value
					return item
				})
				this.returnContentList = data.resultData.returnContentList
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>
