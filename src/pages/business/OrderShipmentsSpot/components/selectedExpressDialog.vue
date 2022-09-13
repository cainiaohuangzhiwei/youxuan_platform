<template>
	<yx-dialog title="选择物流" :bottomBtn="bottomBtn" :visible.sync="visible">
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
					<template slot="expressId" slot-scope="scope">
						<el-radio
							v-model="rowData.expressId"
							:label="scope.row.expressId"
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
import { getExpressList } from '@/api/public'
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
		selectedList: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			rowData: {},
			showLoading: false,
			visible: false,
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveCoupon()
					},
				},
			],
			dialogData: {
				// 选择物流搜索条件
				expressName: '', // 物流名称
			},
			dialogCfg: [
				// 物流配置项
				{
					type: 'input',
					dataIndex: 'keyword',
					title: '筛选',
				},
			],
			dialogAction: [
				// 物流按钮
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getValidCouponPage(true)
					},
				},
			],
			tialogColumns: [
				// 物流配置项
				{
					type: 'custom',
					dataIndex: 'expressId',
					title: '选择',
				},
				{
					type: 'string',
					dataIndex: 'expressName',
					title: '物流名称',
				},
			],
			tialogPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getValidCouponPage()
				},
			},
			tialogData: [],
		}
	},
	methods: {
		// 单选
		changeAnchor(row) {
			this.rowData = Object.assign({}, row)
		},
		saveCoupon() {
			if (!this.rowData.expressId) {
				return this.$message.warning('请选择物流！')
			}
			this.$emit('fatherMethodInit', this.rowData)
			this.rowData = {}
			this.visible = false
		},
		findCouponIndex(row) {
			// 判断是否已经添加物流
			let selectCouponList = this.selectedList.map((item) => {
				return item.yxCouponId
			})
			return selectCouponList.indexOf(row.yxCouponId) == -1
		},
		findCounponParams(flag) {
			// 物流搜索条件
			let paramJson = Object.assign(this.dialogData, {
				startIndex: 0,
				length: 1,
				status: 1,
				isVoucherCenter: 1,
				shelfState: 2,
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
		async _getValidCouponPage(flag) {
			// 物流列表
			this.showLoading = true
			let paramJson = this.findCounponParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getExpressList(paramJson)
			this.showLoading = false
			if (resultCode == 0) {
				this.tialogData = resultData.expressList
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
				this._getValidCouponPage(true)
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
