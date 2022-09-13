<template>
	<div class="activityFloor">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData119"
				:items="formCfg119"
				:formAction="formAction119"
			>
			</yx-form>
			<yx-table
				:select="true"
				:selectionChange="selectionChange"
				v-loading="loading"
				:columns="tableColumns120"
				:pagination="page120"
				:data="tableData120"
			></yx-table>
			<Dialog
				:title="dialogTitle121"
				:visible.sync="dialogVisible121"
				:width="dialogWidth121"
				:bottomBtn="dialogBottomBtn121"
			>
				<yx-form
					labelWidth="100px"
					:data="formData122"
					:items="formCfg122"
					:formAction="formAction122"
				>
				</yx-form>
			</Dialog>
			<Dialog
				title="查看活动码"
				:visible.sync="dialogVisible119"
				width="360px"
				:bottomBtn="dialogBottomBtn119"
			>
				<div class="code-box">
					<el-image
						class="c_image"
						z-index="2100"
						fit="cover"
						:src="codeImagePath"
						:preview-src-list="[codeImagePath]"
					>
						<div slot="error" class="image-slot">
							<i class="el-icon-picture-outline"></i>
						</div>
					</el-image>
				</div>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import {
	activityFloorListForHome,
	deleteActivityFloor,
	generateQRCodeForHome,
	addSyncAppletForHome,
} from '@/api/yhtPlusCmsActArea'
import { getBigImg } from '@/utils/imageTool'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	props: [],
	data() {
		return {
			loading: false,
			dialogVisible119: false,
			dialogBottomBtn119: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible119 = false
					},
				},
			],
			formData119: {
				floorName: '',
				floorState: '',
			},
			formCfg119: [
				{
					type: 'input',
					title: '楼层名称',
					dataIndex: 'floorName',
					placeholder: '请输入楼层名称',
				},
				{
					title: '',
					type: 'select',
					dataIndex: 'floorState',
					label: 'value',
					options: [
						{
							value: '全部',
							floorState: '',
						},
						{
							floorState: 0,
							value: '未开始',
						},
						{
							floorState: 2,
							value: '已结束',
						},
						{
							floorState: 1,
							value: '进行中',
						},
					],
				},
			],
			formAction119: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData120(true)
					},
					tableId: 120,
				},
				{
					title: '新增楼层',
					type: 'success',
					auth: '',
					click: () => {
						this.$router.push({
							path: `/xcx/activityFloorDetails`,
						})
					},
				},
				{
					title: '同步到小程序',
					type: 'warning',
					click: () => {
						this._addSyncAppletForHome()
					},
				},
				{
					title: '预览',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.selectedList.length) {
							return this.$message.error('请选择楼层')
						}
						this.dialogVisible121 = true
					},
					dialogId: 121,
				},
			],
			tableData120: [],
			tableColumns120: [
				{
					type: 'string',
					dataIndex: 'id',
					title: '楼层ID',
				},
				{
					type: 'string',
					dataIndex: 'floorName',
					title: '楼层名称',
				},
				{
					type: 'string',
					dataIndex: 'sort',
					title: '显示顺序',
				},
				{
					type: 'string',
					dataIndex: 'startTime',
					title: '楼层时间',
					customRender: (row) => {
						return (
							moment(row.startTime).format('YYYY-MM-DD HH:mm:ss') +
							'-' +
							moment(row.endTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					type: 'string',
					dataIndex: 'floorStyle',
					title: '楼层样式',
					customRender: ({ floorStyle }) => {
						return `1:${floorStyle}`
					},
				},
				{
					type: 'newMap',
					dataIndex: 'syncState',
					title: '同步状态',
					options: [
						['1', '未同步'],
						['2', '已同步'],
					],
				},
				{
					type: 'newMap',
					dataIndex: 'floorState',
					title: '楼层状态',
					options: [
						['0', '未开始'],
						['1', '进行中'],
						['2', '已结束'],
					],
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '编辑楼层',
							auth: '',
							click: ({ id }) => {
								this.$router.push({
									path: `/xcx/activityFloorDetails/${id}`,
								})
							},
						},
						{
							title: '删除',
							popconfirm: true,
							popconfirmTitle: '确定要删除楼层吗',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._deleteActivityFloor(row)
							},
						},
					],
				},
			],
			page120: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData120()
				},
			},
			dialogTitle121: '请选择预览页面',
			dialogWidth121: '500px',
			dialogVisible121: false,
			dialogBottomBtn121: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this._generateQRCodeForHome()
					},
				},
			],
			formData122: {
				userType: 0,
			},
			formCfg122: [
				{
					type: 'radio',
					title: '预览页面',
					dataIndex: 'userType',
					label: 'value',
					options: [
						{
							value: 'C页面',
							userType: 0,
						},
						{
							value: 'B页面',
							userType: 1,
						},
					],
				},
			],
			formAction122: [],
			selectedList: [],
			codeImagePath: '',
		}
	},

	created() {
		this.getData120(true)
	},

	methods: {
		_addSyncAppletForHome: async function () {
			if (!this.selectedList.length) {
				return this.$message.error('请选择楼层')
			}
			let idlist = this.selectedList.map((item) => {
				return item.id
			})
			let {
				data: { resultCode, resultMsg },
			} = await addSyncAppletForHome({
				idlist,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.getData120(true)
			}
		},
		_generateQRCodeForHome: async function () {
			let paramJson = {
				userType: this.formData122.userType,
				page:
					this.formData122.userType == 0
						? 'pages/mine/store'
						: 'pages/store/store',
			}
			paramJson.idList = this.selectedList.map((item) => {
				return item.id
			})
			let {
				data: { resultCode, resultData },
			} = await generateQRCodeForHome(paramJson)
			if (resultCode == 0) {
				this.codeImagePath = getBigImg(resultData.codeImagePath)
				this.dialogVisible121 = false
				this.dialogVisible119 = true
			}
		},
		selectionChange(list) {
			this.selectedList = list
		},
		_deleteActivityFloor: async function ({ floorState, id }) {
			if (floorState == 0 || floorState == 1) {
				this.$message.warning('不可以删除')
				return
			} else {
				let {
					data: { resultCode },
				} = await deleteActivityFloor({
					activityAreaFloorId: id,
					type: 1,
				})
				if (resultCode == 0) {
					this.$message.success('楼层删除成功')
					this.getData120(true)
				}
			}
		},
		async getData120(flag) {
			this.loading = true
			let paramJson = this.findSearchParams120(flag)
			const {
				data: { resultCode, resultData },
			} = await activityFloorListForHome(paramJson)
			if (resultCode == 0) {
				this.tableData120 = resultData.activityFloorList
				this.page120.count = resultData.count
			} else {
				this.tableData120 = []
				this.page120.count = 0
			}
			this.loading = false
		},
		findSearchParams120(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page120.currentPage = 1
			}
			const paramJson = Object.assign(this.formData119, {
				length: this.page120.length,
				type: 1,
				startIndex: (this.page120.currentPage - 1) * this.page120.length,
			})
			return paramJson
		},
	},
}
</script>
<style scope>
.c_image {
	height: 200px;
	width: 200px;
}
.code-box {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
