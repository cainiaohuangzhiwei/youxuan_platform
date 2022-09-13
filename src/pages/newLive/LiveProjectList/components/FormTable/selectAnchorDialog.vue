<template>
	<yx-dialog title="添加主播" :bottomBtn="bottomBtn" :visible.sync="visible">
		<div>
			<yx-form
				:inline="true"
				:data="dialogData"
				:items.sync="dialogCfg"
				:formAction="dialogAction"
			>
			</yx-form>
			<el-row>
				<yx-table
					v-loading="showLoading"
					:columns="tialogColumns"
					:pagination="tialogPage"
					:data="tialogData"
				>
					<template slot="userId" slot-scope="scope">
						<el-radio
							v-model="selectedAnchor.anchorId"
							:label="scope.row.anchorId"
							@change="changeAnchor(scope.row)"
							>选择</el-radio
						>
					</template>
				</yx-table>
			</el-row>
		</div>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getAnchor } from '@/api/yhtPlusCmsLiveUserAction'
export default {
	components: {
		YxDialog,
		YxForm,
		YxTable,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		// 机构
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			showLoading: false,
			visible: false,
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveAnchor()
					},
				},
			],
			selectedAnchor: {},
			tialogData: [],
			tialogPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getAnchor()
				},
			},
			tialogColumns: [
				{
					type: 'string',
					dataIndex: 'anchorId',
					title: '主播ID',
				},
				{
					type: 'string',
					dataIndex: 'nickName',
					title: '主播昵称',
				},
				{
					type: 'custom',
					dataIndex: 'userId',
					title: '选择',
				},
			],
			dialogData: {
				anchorIdAndNickname: '', // 主播昵称/主播Id
			},
			dialogCfg: [
				{
					type: 'input',
					title: '筛选',
					dataIndex: 'anchorIdAndNickname',
					placeholder: '主播昵称/主播ID',
				},
			],
			dialogAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getAnchor(true)
					},
				},
			],
		}
	},
	methods: {
		changeAnchor(row) {
			this.selectedAnchor = Object.assign({}, row)
		},
		saveAnchor() {
			this.$emit('handleSelectedAnchor', this.selectedAnchor)
			this.visible = false
		},
		findAnchorParams(flag) {
			// 主播搜索条件
			let paramJson = Object.assign(this.dialogData, {
				startIndex: 0,
				filterForbid: 1,
				length: 1,
			})
			// 每页的加载数据长度
			paramJson.length = this.tialogPage.length
			// 当前页的条数开始
			if (flag) {
				this.tialogPage.currentPage = 1
			}
			paramJson.startIndex =
				(this.tialogPage.currentPage - 1) * this.tialogPage.length
			return paramJson
		},
		async _getAnchor(flag) {
			// 主播列表
			this.showLoading = true
			let paramJson = this.findAnchorParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getAnchor(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tialogData = resultData.datalist
				this.tialogPage.count = resultData.count
			} else {
				this.tialogPage.count = 0
				this.tialogData = []
			}
		},
	},
	watch: {
		itemInfo() {
			const tempArr = JSON.parse(JSON.stringify(this.itemInfo))
			this.selectedAnchor.anchorId = tempArr.nickname
			this.selectedAnchor.nickName = tempArr.anchorId
		},
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible) {
				this._getAnchor(true)
			}
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},
}
</script>
