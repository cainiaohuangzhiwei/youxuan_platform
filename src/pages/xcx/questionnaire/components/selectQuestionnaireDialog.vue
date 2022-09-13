<template>
	<yx-dialog
		title="选择问卷"
		:bottomBtn="bottomBtn"
		:visible.sync="localVisible"
	>
		<div>
			<yx-table
				v-loading="showLoading"
				:columns="tialogColumns"
				:pagination="tialogPage"
				:data="tialogData"
			>
				<template slot="userId" slot-scope="scope">
					<el-radio
						v-model="selectedQuestionnaire.queQuestionnaireId"
						:label="scope.row.queQuestionnaireId"
						@change="selQuestionnaire(scope.row)"
						>选择</el-radio
					>
				</template>
			</yx-table>
		</div>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxTable from '@wg-vue-materials/yx-table'
import { questionNaireList } from '@/api/questionNaire'
export default {
	components: {
		YxDialog,
		YxTable,
	},
	props: {
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			showLoading: false,
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveQuestionnaire()
					},
				},
			],
			selectedQuestionnaire: {},
			tialogData: [],
			tialogPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getQuestionnaireList()
				},
			},
			tialogColumns: [
				{
					type: 'string',
					dataIndex: 'queQuestionnaireId',
					title: '问卷ID',
				},
				{
					type: 'string',
					dataIndex: 'title',
					title: '问卷标题',
				},
				{
					type: 'custom',
					dataIndex: 'userId',
					title: '选择',
				},
			],
		}
	},

	computed: {
		localVisible: {
			get() {
				return this.dialogVisible
			},
			set(val) {
				this.$emit('update:dialogVisible', val)
			},
		},
	},

	methods: {
		selQuestionnaire(row) {
			this.selectedQuestionnaire = Object.assign({}, row)
		},
		saveQuestionnaire() {
			this.$emit('handleSelectedAnchor', this.selectedQuestionnaire)
			this.localVisible = false
		},
		async getQuestionnaireList() {
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await questionNaireList({
				currentPage: this.tialogPage.currentPage,
				length: this.tialogPage.length,
			})
			this.showLoading = false
			if (resultCode == 0) {
				this.tialogData = resultData.records
				this.tialogPage.count = resultData.total
			} else {
				this.tialogPage.count = 0
				this.tialogData = []
			}
		},
	},
	watch: {
		dialogVisible(newVlaue) {
			if (newVlaue) {
				this.tialogPage.currentPage = 1 // 重置
				this.getQuestionnaireList()
			}
		},
		itemInfo() {
			this.selectedQuestionnaire = Object.assign({}, this.itemInfo)
		},
	},
}
</script>
