<template>
	<div class="onlineService">
		<basicContainer>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns111"
				:data="tableData111"
			>
				<template slot="actState" slot-scope="scope">
					<div>
						<el-tag type="danger" v-if="scope.row.status == 0">禁用</el-tag>
						<el-tag v-if="scope.row.status == 1">开启</el-tag>
					</div>
				</template>
			</yx-table>
			<Dialog
				:title="dialogTitle113"
				:visible.sync="dialogVisible113"
				:width="dialogWidth113"
				:bottomBtn="dialogBottomBtn113"
			>
				<yx-form
					labelWidth="100px"
					ref="dialog114"
					:data="formData114"
					:items="formCfg114"
					:formAction="formAction114"
					:rules="formRules114"
				>
					<template slot="btImageTip">
						<p>(建议大小140px*140px)</p>
					</template>
				</yx-form>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import { findCsListByParam, changeStatusCs, saveOrUpdateCs } from '@/api/cs'
import { getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'

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
			tableData111: [],
			tableColumns111: [
				{
					type: 'newMap',
					dataIndex: 'type',
					title: '在线客服',
					options: [
						['1', 'VIP'],
						['2', '普通客服'],
						['3', 'C端用户'],
					],
				},
				{
					type: 'string',
					dataIndex: 'sort',
					title: '按钮',
					customRender: ({ sort }) => {
						return `按钮${sort}`
					},
				},
				{
					type: 'string',
					dataIndex: 'csGroupId',
					title: '客服组ID',
				},
				{
					type: 'image',
					dataIndex: 'btImageUrl',
					title: '按钮图片',
					class: 'service-bt-image',
				},
				{
					type: 'string',
					dataIndex: 'btName',
					title: '按钮名称',
				},
				{
					type: 'custom',
					dataIndex: 'actState',
					title: '状态',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							auth: '',
							click: (row) => {
								this.tableRowData = Object.assign({}, row)
								this.formData114 = Object.assign(
									{
										typeText:
											row.type == 1
												? 'VIP'
												: row.type == 2
												? '普通客服'
												: 'C端用户',
										btImageList: [
											{
												btImageUrl: row.btImageUrl,
											},
										],
									},
									row
								)
								this.dialogVisible113 = true
							},
							dialogId: 113,
						},
						{
							title: '禁用',
							popconfirm: true,
							popconfirmTitle: '是否禁用',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._changeStatusCs(row)
							},
							customRender: (action, row) => {
								action.hide = row.status == 0
								return action
							},
						},
						{
							title: '开启',
							popconfirm: true,
							popconfirmTitle: '是否开启',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._changeStatusCs(row)
							},
							customRender: (action, row) => {
								action.hide = row.status == 1
								return action
							},
						},
					],
				},
			],
			tableRowData: {},
			dialogTitle113: '编辑',
			dialogWidth113: '800px',
			dialogVisible113: false,
			dialogBottomBtn113: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog114.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.onlineCustomerConfirm()
								// this.dialogVisible113 = false
							}
						})
					},
				},
			],
			formData114: {},
			formRules114: {
				csGroupId: [
					{ required: true, message: '请输入客服组ID', trigger: 'blur' },
				],
				btImageList: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData114.btImageList.length) {
								callback(new Error('请上传图片!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				btName: [
					{ required: true, message: '请输入按钮名称', trigger: 'blur' },
				],
			},
			formCfg114: [
				{
					type: 'text',
					title: '在线客服',
					dataIndex: 'typeText',
				},
				{
					type: 'text',
					title: '按钮',
					dataIndex: 'sort',
				},
				{
					title: '客服组ID',
					type: 'inputNumber',
					dataIndex: 'csGroupId',
				},
				{
					type: 'uploadImage',
					title: '弹框图片',
					dataIndex: 'btImageList',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'btImageUrl',
						httpRequest: (file) => this.uploadImageHttpRequest(file),
					},
				},
				{
					type: 'custom',
					title: '',
					dataIndex: 'btImageTip',
				},
				{
					title: '按钮名称',
					type: 'input',
					dataIndex: 'btName',
					placeholder: '请输入按钮名称',
				},
				{
					title: '',
					type: 'radio',
					dataIndex: 'status',
					label: 'value',
					options: [
						{
							status: 1,
							value: '开启',
						},
						{
							status: 0,
							value: '禁用',
						},
					],
				},
			],
			formAction114: [],
		}
	},

	created() {
		this._findCsListByParam()
	},

	methods: {
		async uploadImageHttpRequest(params) {
			//上传banner
			let formData = new FormData()
			formData.append('formId', '#portraitImageFrom')
			formData.append('data', JSON.stringify({ imageType: 35 }))
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				resultData.imageList[0].btImageUrl = getBigImg(
					resultData.imageList[0].imageUrl
				)
				this.formData114.btImageList = resultData.imageList
			}
			this.$forceUpdate()
		},
		onlineCustomerConfirm: async function () {
			// 是否开启-禁用 ( 0禁用 1开启)
			let generalArr = [],
				vipArr = [],
				userSideArr = []
			this.tableData111.map((item) => {
				if (item.type == 1 && item.status == 1) {
					vipArr.push(item)
				}
				if (item.type == 2 && item.status == 1) {
					generalArr.push(item)
				}
				if (item.type == 3 && item.status == 1) {
					userSideArr.push(item)
				}
			})
			if (this.tableRowData.status == 0 && this.formData114.status == 0) {
				return this.$message.error('按钮已是禁用状态')
			}
			// 编辑的是 vip 客服 &&当前开启的客服列表数==1 && 并且点击的是禁用
			if (
				this.tableRowData.type == 1 &&
				vipArr.length == 1 &&
				this.formData114.status == 0
			) {
				return this.$message.error('VIP客服必须保留一个开启')
			}
			//  编辑的是 普通客服&&当前开启的客服列表数==1 && 并且点击的是禁用
			if (
				this.tableRowData.type == 2 &&
				generalArr.length == 1 &&
				this.formData114.status == 0
			) {
				return this.$message.error('普通客服必须保留一个开启')
			}
			//  编辑的是 C端客服&&当前开启的客服列表数==1 && 并且点击的是禁用
			if (
				this.tableRowData.type == 3 &&
				userSideArr.length == 1 &&
				this.formData114.status == 0
			) {
				return this.$message.error('C端客服必须保留一个开启')
			}
			let paramJson = {
				scbId: this.formData114.scbId,
				btName: this.formData114.btName,
				status: this.formData114.status,
				csGroupId: this.formData114.csGroupId,
			}
			if (this.formData114.btImageList[0].imageId) {
				paramJson.btImageUrl = this.formData114.btImageList[0]
				delete paramJson.btImageUrl.btImageUrl
				paramJson.btImageUrl = JSON.stringify(paramJson.btImageUrl)
			}
			let {
				data: { resultCode, resultMsg },
			} = await saveOrUpdateCs(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible113 = false
				this._findCsListByParam()
			}
		},
		_changeStatusCs: async function ({
			btImageUrl,
			btName,
			csGroupId,
			scbId,
			status,
		}) {
			let {
				data: { resultCode, resultMsg },
			} = await changeStatusCs({
				btImageUrl,
				btName,
				csGroupId,
				scbId,
				status: status == 1 ? 0 : 1,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this._findCsListByParam()
			}
			this.$forceUpdate()
		},
		_findCsListByParam: async function () {
			this.loading = true
			let {
				data: { resultCode, resultData },
			} = await findCsListByParam()
			this.loading = false
			if (resultCode == 0) {
				resultData.customerServiceBtList.map((item) => {
					item.btImageUrl = getBigImg(item.btImageUrl)
				})
				this.tableData111 = resultData.customerServiceBtList
			}
		},
	},
}
</script>
<style>
.service-bt-image {
	width: 80px;
	height: 80px;
}
</style>
