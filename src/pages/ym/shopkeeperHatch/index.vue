<template>
	<div class="shopkeeperHatch">
		<basicContainer>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns103"
				:pagination="page103"
				:data="tableData103"
			>
				<template slot="hatchingStatus" slot-scope="scope">
					<div>
						<el-tag type="danger" v-if="scope.row.hatchingStatus == 1"
							>未开始</el-tag
						>
						<el-tag type="info" v-if="scope.row.hatchingStatus == 3"
							>已结束</el-tag
						>
						<el-tag v-if="scope.row.hatchingStatus == 2">进行中</el-tag>
					</div>
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle104"
				:visible="dialogVisible104"
				:width="dialogWidth104"
				:bottomBtn="dialogBottomBtn104"
				@before-close="dialogVisible104 = false"
			>
				<div class="goods-group-btn-box">
					<el-button type="success" @click="exportBtn">导出excel</el-button>
				</div>
				<yx-table
					:select="false"
					v-loading="loading105"
					:columns="tableColumns105"
					:pagination="page105"
					:data="tableData105"
				></yx-table>
			</Dialog>
			<Dialog
				:title="dialogTitle106"
				:visible="dialogVisible106"
				:width="dialogWidth106"
				:bottomBtn="dialogBottomBtn106"
				@before-close="dialogVisible106 = false"
			>
				<yx-form
					ref="dialog110"
					labelWidth="120px"
					:formDisabled="true"
					:data="formData107"
					:items="formCfg107"
					:formAction="formAction107"
				>
					<template slot="areasImage">
						<div>
							<el-image
								class="code-image"
								fit="cover"
								z-index="2100"
								:src="formData107.posterUrl"
								:preview-src-list="[formData107.posterUrl]"
							>
								<div slot="error" class="image-slot">
									<i class="el-icon-picture-outline"></i>
								</div>
							</el-image>
						</div>
					</template>
					<template slot="excelList">
						<div class="excel_list">
							<p
								v-for="(item, index) in formData107.hatchingRelationList"
								:key="index"
							>
								店铺ID:{{ item.organizationId }} , 店铺手机号:{{
									item.organizationPhone
								}}
							</p>
						</div>
					</template>
				</yx-form>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import YxForm from '@wg-vue-materials/yx-form'
import Dialog from '@/components/Dialog'
import moment from 'moment'
import {
	hatchingList,
	findHatchingEnteredList,
	findHatchingDetail,
} from '@/api/actHatching'
import { downloadFile } from '@/utils/helper/common'
import { exportHatchingEntered } from '@/api/webImport'
import { getBigImg } from '@/utils/imageTool'

export default {
	components: {
		BasicContainer,
		YxTable,
		YxForm,
		Dialog,
	},
	props: [],
	data() {
		return {
			loading105: false,
			loading: false,
			actHatchingId: null,
			tableData103: [],
			tableColumns103: [
				{
					type: 'string',
					dataIndex: 'actHatchingId',
					title: '活动id',
				},
				{
					type: 'string',
					dataIndex: 'enteredBeginTime',
					title: '报名时间',
					customRender: (row) => {
						return (
							moment(row.enteredBeginTime).format('YYYY-MM-DD HH:mm:ss') +
							'-' +
							moment(row.enteredEndTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'reachingNum',
					title: '达标店主数',
				},
				{
					type: 'string',
					dataIndex: 'enteredNum',
					title: '报名数量',
				},
				{
					type: 'custom',
					dataIndex: 'hatchingStatus',
					title: '状态',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '查看活动配置',
							auth: '',
							dialogId: 106,
							click: ({ actHatchingId }) => {
								this._findHatchingDetail(actHatchingId)
							},
						},
						{
							title: '查看活动数据',
							auth: '',
							dialogId: 104,
							click: ({ actHatchingId }) => {
								this.actHatchingId = actHatchingId
								this._findHatchingEnteredList()
								this.dialogVisible104 = true
							},
						},
					],
				},
			],
			page103: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData103()
				},
			},
			dialogTitle104: 'vip店主孵化活动报名数据',
			dialogWidth104: '800px',
			dialogVisible104: false,
			dialogBottomBtn104: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible104 = false
					},
				},
			],
			tableData105: [],
			tableColumns105: [
				{
					type: 'string',
					dataIndex: 'organizationName',
					title: '店铺名称',
				},
				{
					type: 'string',
					dataIndex: 'organizationPhone',
					title: '店铺手机',
				},
				{
					type: 'string',
					dataIndex: 'maintDepartment',
					title: '店铺维护部门',
				},
				{
					type: 'date',
					dataIndex: 'enteredTime',
					title: '报名时间',
				},
				{
					type: 'string',
					dataIndex: 'enteredNum',
					title: '报名次数',
				},
			],
			page105: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._findHatchingEnteredList()
				},
			},
			dialogTitle106: 'vip店主孵化计划活动配置',
			dialogWidth106: '600px',
			dialogVisible106: false,
			dialogBottomBtn106: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible106 = false
					},
				},
			],
			formData107: {
				enteredBeginTime: '',
				enteredEndTime: '',
				posterUrl: '',
				excel_list: '',
			},
			formCfg107: [
				{
					title: '活动时间',
					type: 'datetimerange',
					dataIndex: ['enteredBeginTime', 'enteredEndTime'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					title: '图标',
					type: 'custom',
					dataIndex: 'areasImage',
				},
				{
					title: '店主',
					type: 'custom',
					dataIndex: 'excelList',
				},
			],
			formAction107: [],
		}
	},

	created() {
		this.getData103(true)
	},

	methods: {
		// 获取vip店主孵化计划活动配置信息
		async _findHatchingDetail(actHatchingId) {
			let {
				data: { resultCode, resultData },
			} = await findHatchingDetail({ actHatchingId })
			if (resultCode == 0) {
				resultData.posterUrl = getBigImg(resultData.posterUrl)
				this.formData107 = resultData
				this.dialogVisible106 = true
			}
		},
		// 导出报名列表
		exportBtn: async function () {
			let { data } = await exportHatchingEntered({
				actHatchingId: this.actHatchingId,
			})
			downloadFile(data, '孵化活动报名列表导出.xlsx')
		},
		// 获取报名列表数据
		async _findHatchingEnteredList(flag) {
			this.loading105 = true
			let paramJson = this.findSearchParams105(flag)
			const {
				data: { resultCode, resultData },
			} = await findHatchingEnteredList(paramJson)
			if (resultCode == 0) {
				this.tableData105 = resultData.hatchingEnteredList
				this.page105.count = resultData.count
			} else {
				this.tableData105 = []
				this.page105.count = 0
			}
			this.loading105 = false
		},
		findSearchParams105(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page105.currentPage = 1
			}
			const paramJson = Object.assign(
				{ actHatchingId: this.actHatchingId },
				{
					length: this.page105.length,
					startIndex: (this.page105.currentPage - 1) * this.page105.length,
				}
			)
			return paramJson
		},
		async getData103(flag) {
			this.loading = true
			let paramJson = this.findSearchParams103(flag)
			const {
				data: { resultCode, resultData },
			} = await hatchingList(paramJson)
			if (resultCode == 0) {
				this.tableData103 = resultData.hatchingList
				this.page103.count = resultData.count
			} else {
				this.tableData103 = []
				this.page103.count = 0
			}
			this.loading = false
		},
		findSearchParams103(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page103.currentPage = 1
			}
			const paramJson = Object.assign(
				{},
				{
					length: this.page103.length,
					startIndex: (this.page103.currentPage - 1) * this.page103.length,
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
.excel_list {
	max-height: 200px;
	overflow-y: scroll;
}
.code-image {
	width: 200px;
	height: 200px;
}
</style>
