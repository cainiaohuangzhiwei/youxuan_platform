<template>
	<yx-dialog
		:bottomBtn="bottomBtn"
		:visible.sync="localVisible"
		:before-close="resetForm"
	>
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
				<template slot="brandParentName" slot-scope="scope">
					<div class="slot">
						<div>
							<img
								class="goods_img"
								:src="
									getSmallImg(scope.row.brandImgUrl || scope.row.brandLogoUrl)
								"
								alt=""
							/>
						</div>
						<p>{{ scope.row.brandParentName }}</p>
					</div>
				</template>
			</yx-table>
		</el-row>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getSmallImg } from '@/utils/imageTool'
import { brandParentList } from '@/api/newMaterial'
export default {
	components: {
		YxDialog,
		YxForm,
		YxTable,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			define: false,
		},
		mainBrandsRow: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			getSmallImg: getSmallImg,
			selectGroupList: [],
			showLoading: false,
			currentTime: '',
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveBrand()
					},
				},
				{
					title: '取消',
					click: () => {
						this.resetForm()
					},
				},
			],
			dialogData: {
				keyword: '',
			},
			dialogCfg: [
				{
					type: 'input',
					title: '品牌',
					dataIndex: 'keyword',
				},
			],
			dialogAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._brandParentList(true)
					},
				},
			],
			tialogColumns: [
				{
					type: 'custom',
					dataIndex: 'brandParentName',
					title: '品牌信息',
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
					this._brandParentList()
				},
			},
			tialogData: [],
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
	mounted() {},
	watch: {
		localVisible(val) {
			if (val) {
				this.selectGroupList = JSON.parse(JSON.stringify(this.mainBrandsRow))
				this._brandParentList()
			}
		},
	},
	methods: {
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			// this.$refs.form.$refs.YxForm.resetFields()
		},
		saveBrand() {
			if (this.selectGroupList && this.selectGroupList.length > 5) {
				return this.$message.warning('主推品牌不能超过5个')
			}
			this.$emit('saveBrand', this.selectGroupList)
			this.localVisible = false
		},
		findIndex(row) {
			// 判断是否已经添加用户
			let ids = this.selectGroupList.map((item) => {
				return item.brandParentId
			})
			return ids.indexOf(row.brandParentId) == -1
		},
		editUserList(row) {
			// 添加/移除用户
			let ids = this.selectGroupList.map((item) => {
				return item.brandParentId
			})
			if (ids.indexOf(row.brandParentId) == -1) {
				this.selectGroupList.push(row)
			} else {
				this.selectGroupList.splice(ids.indexOf(row.brandParentId), 1)
			}
		},
		findUserParams(flag) {
			// 用户搜索条件
			let paramJson = {
				keyword: this.dialogData.keyword,
				pageNum: 1,
				pageSize: 10,
			}
			// 每页的加载数据长度
			paramJson.pageSize = this.tialogPage.length
			// 当前页的条数开始
			if (flag) {
				this.tialogPage.currentPage = 1
			}
			paramJson.pageNum = this.tialogPage.currentPage
			return paramJson
		},
		async _brandParentList(flag) {
			// 用户列表
			this.showLoading = true
			let paramJson = this.findUserParams(flag)
			let {
				data: { resultCode, resultData },
			} = await brandParentList(paramJson)
			this.showLoading = false
			console.log(resultData, 'aafdfasdfdsfdf====')
			if (resultCode == 0) {
				this.tialogData = resultData.voList
				this.tialogPage.count = resultData.total
			} else {
				this.tialogPage.count = 0
				this.tialogData = []
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.slot {
	display: flex;
	align-items: center;
	justify-content: center;
}
.goods_img {
	width: 60px;
	height: 60px;
	margin-right: 10px;
	line-height: 155px;
}
</style>
