<template>
	<div class="activeList">
		<basicContainer>
			<div class="goods-group-btn-box">
				<el-button type="primary" @click="addShopOwner">新增</el-button>
			</div>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns101"
				:pagination="page101"
				:data="tableData101"
			></yx-table>
			<Dialog
				:title="dialogTitle102"
				:visible.sync="dialogVisible102"
				:width="dialogWidth102"
				:bottomBtn="dialogBottomBtn102"
			>
				<yx-form
					ref="dialog103"
					labelWidth="100px"
					:data="formData103"
					:items="formCfg103"
					:formAction="formAction103"
					:rules="formRules103"
				>
					<template slot="addShopOwnerList">
						<div>
							<el-button @click="addShopOwnerList" type="text"
								>添加店主指引</el-button
							>
							<yx-table :columns="tableColumns106" :data="tableData106">
								<template slot="sort" slot-scope="scope">
									<div>
										<span v-if="scope.row.inputVisible">{{
											scope.row.sort
										}}</span>
										<el-input
											v-else
											type="number"
											v-model="scope.row.sort"
											:ref="'saveTagInput' + scope.row.directMaterialId"
											size="small"
											:autofocus="true"
											@keyup.enter.native="handleInputConfirm(scope.index)"
											@blur="handleInputConfirm(scope.index)"
										></el-input>
									</div>
								</template>
							</yx-table>
						</div>
					</template>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle105"
				:visible.sync="dialogVisible105"
				:width="dialogWidth105"
				:bottomBtn="dialogBottomBtn105"
			>
				<yx-table
					:select="false"
					v-loading="loading104"
					:columns="tableColumns104"
					:pagination="page104"
					:data="tableData104"
				>
				</yx-table>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import YxForm from '@wg-vue-materials/yx-form'
import Dialog from '@/components/Dialog'
import {
	getNewGuidelinesRecord,
	handlerNewGuidelinesRecord,
} from '@/api/newGuidelines'
import { getDirectMaterialList } from '@/api/directMaterial'

export default {
	components: {
		BasicContainer,
		YxTable,
		Dialog,
		YxForm,
	},
	props: [],
	data() {
		return {
			loading104: false,
			loading: false,
			dialogTitle105: '选择分组',
			dialogWidth105: '800px',
			dialogVisible105: false,
			dialogBottomBtn105: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible105 = false
					},
				},
			],
			tableData104: [],
			tableColumns104: [
				{
					type: 'string',
					dataIndex: 'directMaterialName',
					title: '指引名称',
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
				{
					type: 'string',
					dataIndex: 'skipUrl',
					title: '跳转路径',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.setTableData106(row)
							},
							customRender: (action, row) => {
								let flag = this.tableData106.some(
									(item) => item.directMaterialId === row.directMaterialId
								)
								action.title = flag ? '移除' : '添加'
								return action
							},
						},
					],
				},
			],
			page104: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData104()
				},
			},
			tableData106: [],
			tableColumns106: [
				{
					type: 'string',
					dataIndex: 'directMaterialName',
					title: '指引名称',
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '备注',
				},
				{
					type: 'custom',
					dataIndex: 'sort',
					title: '排序值',
				},
				{
					type: 'action',
					fixed: 'right',
					title: '操作',
					actions: [
						{
							title: '编辑排序值',
							click: (row, e, index) => {
								this.tableData106[index].inputVisible = false
								this.$forceUpdate()
							},
						},
					],
				},
			],
			tableData101: [],
			tableColumns101: [
				{
					type: 'string',
					dataIndex: 'newGuidelinesId',
					title: 'id',
					width: 50,
				},
				{
					type: 'string',
					dataIndex: 'channelsWay',
					title: '渠道店主',
				},
				{
					type: 'newMap',
					dataIndex: 'status',
					title: '状态',
					width: 80,
					options: [
						['0', '禁用'],
						['1', '启用'],
					],
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					width: 180,
					actions: [
						{
							title: '编辑',
							auth: '',
							dialogId: 102,
							click: (row) => {
								this.dialogTitle102 = '编辑'
								this.formData103 = JSON.parse(JSON.stringify(row))
								if (
									this.formData103.directMaterial &&
									this.formData103.directMaterial.length
								) {
									this.formData103.directMaterial.map((item) => {
										item.inputVisible = true
									})
								} else {
									this.formData103.directMaterial = []
								}
								this.formData103.channel =
									this.formData103.channelsWay.split(',') || []
								this.tableData106 =
									JSON.parse(JSON.stringify(this.formData103.directMaterial)) ||
									[]
								this.dialogVisible102 = true
							},
						},
						{
							title: '删除',
							popconfirm: true,
							popconfirmTitle: '确认要删除该新店主指引吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._handlerNewGuidelinesRecord(row)
							},
						},
					],
				},
			],
			page101: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData101()
				},
			},
			dialogTitle102: '编辑',
			dialogWidth102: '800px',
			dialogVisible102: false,
			dialogBottomBtn102: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog103.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveAddActBannerList()
								// this.dialogVisible105 = false
							}
						})
						// this.dialogVisible102 = false
					},
				},
			],
			formData103: {
				channel: [],
				status: 0,
			},
			formRules103: {
				channel: [
					{ required: true, message: '请添加渠道店主', trigger: 'change' },
				],
				addShopOwnerList: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.tableData106.length) {
								callback(new Error('请添加店主指引!'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
			},
			formCfg103: [
				{
					type: 'checkbox',
					title: '渠道店主',
					dataIndex: 'channel',
					label: 'value',
					change: () => {
						this.$forceUpdate()
					},
					options: [
						{
							value: '渠道服务商3',
							channel: '渠道服务商3',
						},
						{
							channel: '百度搜索',
							value: '百度搜索',
						},
						{
							channel: '360搜索',
							value: '360搜索',
						},
						{
							channel: '凌希2',
							value: '凌希2',
						},
						{
							channel: '橙陨首购CPA',
							value: '橙陨首购CPA',
						},
						{
							channel: '繁笙首购CPA',
							value: '繁笙首购CPA',
						},
						{
							channel: '凌希首购CPA',
							value: '凌希首购CPA',
						},
						{
							channel: '正西首购CPA',
							value: '正西首购CPA',
						},
						{
							channel: '宏创首购CPA',
							value: '宏创首购CPA',
						},
						{
							channel: '渠道示例',
							value: '渠道示例',
						},
						{
							channel: '西瓜皮公众号',
							value: '西瓜皮公众号',
						},
						{
							channel: '亿远UV_A',
							value: '亿远UV_A',
						},
						{
							channel: '百姓网wap_BD',
							value: '百姓网wap_BD',
						},
						{
							channel: '新先视CPS微信',
							value: '新先视CPS微信',
						},
						{
							channel: '微信群',
							value: '微信群',
						},
						{
							channel: '朋友圈广告',
							value: '朋友圈广告',
						},
						{
							channel: 'TZ',
							value: 'TZ',
						},
						{
							channel: '斗米兼职',
							value: '斗米兼职',
						},
						{
							channel: 'JNY',
							value: 'JNY',
						},
						{
							channel: 'mmg',
							value: 'mmg',
						},
						{
							channel: 'ytt',
							value: 'ytt',
						},
						{
							channel: '头条渠道',
							value: '头条渠道',
						},
						{
							channel: '孩教圈推广',
							value: '孩教圈推广',
						},
						{
							channel: '小程序引导页',
							value: '小程序引导页',
						},
						{
							channel: '推广渠道',
							value: '推广渠道',
						},
						{
							channel: '渠道代理商',
							value: '渠道代理商',
						},
						{
							channel: '腾讯广告推广',
							value: '腾讯广告推广',
						},
						{
							channel: '邀请码注册',
							value: '邀请码注册',
						},
						{
							channel: '未知',
							value: '未知',
						},
						{
							channel: '淘客-黄蜂',
							value: '淘客-黄蜂',
						},
						{
							channel: '淘客-野蛮',
							value: '淘客-野蛮',
						},
						{
							channel: '淘客-核桃',
							value: '淘客-核桃',
						},
						{
							channel: '备用1',
							value: '备用1',
						},
						{
							channel: '备用2',
							value: '备用2',
						},
						{
							channel: '备用3',
							value: '备用3',
						},
						{
							channel: '备用4',
							value: '备用4',
						},
						{
							channel: '备用5',
							value: '备用5',
						},
						{
							channel: '备用6',
							value: '备用6',
						},
						{
							channel: '备用7',
							value: '备用7',
						},
						{
							channel: '备用8',
							value: '备用8',
						},
						{
							channel: '备用9',
							value: '备用9',
						},
						{
							channel: '备用10',
							value: '备用10',
						},
					],
				},
				{
					type: 'custom',
					title: '指引',
					dataIndex: 'addShopOwnerList',
				},
				{
					type: 'radio',
					title: '状态',
					dataIndex: 'status',
					label: 'value',
					options: [
						{
							value: '禁用',
							status: 0,
						},
						{
							value: '启用',
							status: 1,
						},
					],
				},
			],
			formAction103: [],
		}
	},

	created() {
		this.init(true)
	},

	methods: {
		async saveAddActBannerList() {
			let paramJson = {
				status: this.formData103.status,
				channelsWay: this.formData103.channel.join(','),
			}
			let newGuidelinesVo = this.tableData106.map((item) => {
				return {
					id: item.directMaterialId,
					sort: item.sort,
				}
			})
			paramJson.newGuidelinesVo = newGuidelinesVo
			if (this.formData103.newGuidelinesId) {
				paramJson.newGuidelinesId = this.formData103.newGuidelinesId
			}
			let {
				data: { resultCode, resultMsg },
			} = await handlerNewGuidelinesRecord(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible102 = false
				this.init(true)
			}
		},
		_handlerNewGuidelinesRecord: async function ({ newGuidelinesId }) {
			// 删除
			let {
				data: { resultCode, resultMsg },
			} = await handlerNewGuidelinesRecord({
				newGuidelinesId, //分组id
				isDel: 1,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.init(true)
			}
		},
		handleInputConfirm(index) {
			this.tableData106[index].inputVisible = true
		},
		setTableData106(row) {
			let newRow = JSON.parse(JSON.stringify(row))
			newRow.inputVisible = true
			newRow.sort = 10
			let flag = this.tableData106.some(
				(item) => item.directMaterialId === newRow.directMaterialId
			)
			if (!flag) {
				this.tableData106.push(newRow)
			} else {
				let index = this.tableData106.findIndex((item) => {
					return item.directMaterialId == newRow.directMaterialId
				})
				this.tableData106.splice(index, 1)
			}
		},
		addShopOwner() {
			this.dialogVisible102 = true
			this.dialogTitle102 = '新增'
			this.tableData106 = []
			this.formData103 = {
				channel: [],
				status: 0,
			}
			this.$nextTick(() => {
				this.$refs.dialog103.$refs.YxForm.clearValidate()
			})
		},
		addShopOwnerList() {
			this.getData104(true)
			this.dialogVisible105 = true
		},
		async getData104(flag) {
			this.loading104 = true
			let paramJson = this.findSearchParams104(flag)
			const {
				data: { resultCode, resultData },
			} = await getDirectMaterialList(paramJson)
			if (resultCode == 0) {
				this.tableData104 = resultData.list
				this.page104.count = resultData.count || resultData.list.length
			} else {
				this.tableData104 = []
				this.page104.count = 0
			}
			this.loading104 = false
		},
		findSearchParams104(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page104.currentPage = 1
			}
			const paramJson = Object.assign(
				{},
				{
					length: this.page104.length,
					startIndex: (this.page104.currentPage - 1) * this.page104.length,
				}
			)
			return paramJson
		},
		async init(flag) {
			this.loading = true
			let paramJson = this.findSearchParams101(flag)
			const {
				data: { resultCode, resultData },
			} = await getNewGuidelinesRecord(paramJson)
			if (resultCode == 0) {
				this.tableData101 = resultData.list
				this.page101.count = resultData.count
			} else {
				this.tableData101 = []
				this.page101.count = 0
			}
			this.loading = false
		},
		findSearchParams101(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page101.currentPage = 1
			}
			const paramJson = Object.assign(
				{},
				{
					length: this.page101.length,
					startIndex: (this.page101.currentPage - 1) * this.page101.length,
				}
			)
			return paramJson
		},
	},
}
</script>
<style scoped>
.goods-group-btn-box {
	margin-bottom: 20px;
}
</style>
