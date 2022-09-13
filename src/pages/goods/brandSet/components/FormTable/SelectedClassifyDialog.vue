<template>
	<yx-dialog title="选择品牌" :bottomBtn="bottomBtn" :visible.sync="visible">
		<yx-form
			:inline="true"
			:data="dialogData"
			:items="dialogCfg"
			:formAction="dialogAction"
		></yx-form>
		<el-row>
			<yx-table
				v-loading="showLoading"
				:columns="tialogColumns"
				:pagination="tialogPage"
				:data="tialogData"
			>
			</yx-table>
		</el-row>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { findBrandCategoryClassifyByParam } from '@/api/yhtPlusWebGoods'
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
		classifys: {
			type: Array,
			default: () => [],
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
						this.saveUsers()
					},
				},
			],
			dialogData: {
				keyword: '', // 用户id
			},
			dialogCfg: [
				{
					type: 'input',
					title: '品牌名称',
					dataIndex: 'keyword',
					placeholder: '品牌名称',
				},
			],
			dialogAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._findBrandCategoryClassifyByParam(true)
					},
				},
			],
			tialogColumns: [
				{
					type: 'string',
					dataIndex: 'firstClassify',
					title: '分组名称',
				},
				{
					type: 'string',
					dataIndex: 'sort',
					title: '排序',
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.editUserList(row)
							},
							customRender: (action, row) => {
								action.title = this.findIndex(row) ? '添加' : '移除'
								return action
							},
						},
					],
				},
			],
			tialogPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._findBrandCategoryClassifyByParam()
				},
			},
			tialogData: [],
		}
	},
	methods: {
		saveUsers() {
			this.visible = false
		},
		findIndex(row) {
			// 判断是否已经添加用户
			// console.log(this.classifys, 'this.classifys----------')
			let ids = this.classifys.map((item) => {
				return item.id
			})
			return ids.indexOf(row.id) == -1
		},
		editUserList(row) {
			// 添加/移除用户
			let ids = this.classifys.map((item) => {
				return item.id
			})
			if (ids.indexOf(row.id) == -1) {
				this.classifys.push(row)
			} else {
				this.classifys.splice(ids.indexOf(row.id), 1)
			}
		},
		findUserParams(flag) {
			// 用户搜索条件
			let paramJson = Object.assign(this.dialogData, {
				startIndex: 0,
				length: 1,
				groupId: 2,
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
		async _findBrandCategoryClassifyByParam(flag) {
			// 用户列表
			this.showLoading = true
			let paramJson = this.findUserParams(flag)
			let {
				data: { resultCode, resultData },
			} = await findBrandCategoryClassifyByParam(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tialogData = resultData.brandCategoryClassifyList
				this.tialogPage.count = resultData.count
			} else {
				this.tialogPage.count = 0
				this.tialogData = []
			}
		},
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible) {
				this._findBrandCategoryClassifyByParam(true)
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
