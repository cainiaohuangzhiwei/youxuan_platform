<template>
	<div class="baseTemplate">
		<basicContainer>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumnsNotice"
				:data="tableDataNotice"
			></yx-table>
			<Dialog
				:title="getDialogTitle"
				:visible="dialogVisible101"
				:width="dialogWidth101"
				:bottomBtn="dialogBottomBtn101"
				@before-close="dialogVisible101 = false"
			>
				<yx-form
					label-position="right"
					label-width="90px"
					:rules="funRules"
					:data="formData102"
					:items="formCfg102"
					:formAction="formAction102"
				>
				</yx-form>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import YxForm from '@wg-vue-materials/yx-form'
import moment from 'moment'
import {
	getNoticeManagementList,
	updateNoticeManagement,
} from '@/api/noticeManage'

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
			loading: false,
			tableDataNotice: [],
			tableColumnsNotice: [
				{
					type: 'newMap',
					dataIndex: 'noticeType',
					title: '公告类型',
					options: [
						['1', '发货公告'],
						['2', '售后公告'],
					],
				},
				{
					type: 'string',
					dataIndex: 'noticeContent',
					title: '公告内容',
					customRender: (row) => {
						if (row && row.noticeContent) {
							if (row.noticeContent.length > 20) {
								return row.noticeContent.substring(20, 0) + '...'
							}
						}
						return row.noticeContent || ''
					},
				},
				{
					type: 'string',
					dataIndex: 'validStartTime',
					title: '有效时间',
					customRender: (row) => {
						return (
							moment(row.validStartTime).format('YYYY-MM-DD HH:mm:ss') +
							' - ' +
							moment(row.validEndTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					type: 'newMap',
					dataIndex: 'state',
					title: '状态',
					options: [
						['1', '启用'],
						['0', '禁用'],
					],
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '编辑',
							auth: 'updateNoticeManagement',
							dialogId: 101,
							click: (row) => {
								this.formData102 = Object.assign(
									{ ...row },
									{
										showTime: [
											row.validStartTime || new Date().getTime(),
											row.validEndTime || new Date().getTime(),
										],
										applyPage: row?.applyPage.split(',').map(Number) || [],
									}
								)
								// 判断弹框的公告类型
								if (row.noticeType == 1) {
									// 发货公告
									this.formCfg102[1].options = [
										{
											applyPage: 1,
											value: '商品详情页',
										},
										{
											applyPage: 2,
											value: '确认订单页',
										},
										{
											applyPage: 3,
											value: '物流详情页',
										},
									]
								} else if (row.noticeType == 2) {
									// 售后公告
									this.formCfg102[1].options = [
										{
											applyPage: 4,
											value: '售后列表页',
										},
									]
								}
								this.dialogVisible101 = true
							},
						},
					],
				},
			],
			dialogTitle101: '',
			dialogWidth101: '60%',
			dialogVisible101: false,
			dialogBottomBtn101: [],
			funRules: {
				noticeContent: [
					{ required: true, message: '请填写相关信息!', trigger: 'blur' },
				],
				showTime: [
					{ required: true, message: '请输入有效时间!', trigger: 'blur' },
				],
				validStartTime: [
					{ required: true, message: '请输入开始时间!', trigger: 'blur' },
				],
				validEndTime: [
					{ required: true, message: '请输入结束时间!', trigger: 'blur' },
				],
				applyPage: [
					{
						type: 'array',
						required: true,
						message: '请至少选择应用页面!',
						trigger: 'change',
					},
				],
				state: [{ required: true, message: '请选择状态!', trigger: 'change' }],
			},
			formData102: {},
			formCfg102: [
				// {
				// 	type: 'select',
				// 	title: '公告类型',
				// 	dataIndex: 'noticeType',
				// 	placeholder: '请输入商家名称',
				// 	label: 'value',
				// 	options: [
				// 		{
				// 			noticeType: '1',
				// 			value: '发货公告',
				// 		},
				// 	],
				// },
				{
					title: '公告内容',
					type: 'textarea',
					maxlength: '200',
					dataIndex: 'noticeContent',
					placeholder: '请输入公告内容',
				},
				{
					title: '应用页面',
					type: 'checkbox',
					dataIndex: 'applyPage',
					placeholder: '请选择应用页面',
					label: 'value',
					options: [
						{
							applyPage: 1,
							value: '商品详情页',
						},
						{
							applyPage: 2,
							value: '确认订单页',
						},
						{
							applyPage: 3,
							value: '物流详情页',
						},
					],
				},
				{
					title: '有效时间',
					type: 'time',
					dataIndex: 'showTime',
					timeAttributes: {
						type: 'datetimerange',
					},
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					title: '状态',
					type: 'radio',
					dataIndex: 'state',
					placeholder: '请选择状态',
					label: 'value',
					options: [
						{
							state: 1,
							value: '启用',
						},
						{
							state: 0,
							value: '禁用',
						},
					],
				},
			],
			formAction102: [
				{
					title: '保存',
					type: 'primary',
					click: (e) => {
						this.updateNotice(e)
					},
				},
			],
		}
	},
	computed: {
		getDialogTitle: {
			get() {
				switch (this.formData102?.noticeType) {
					case 1:
						return '发货公告'
					case 2:
						return '售后公告'

					default:
						return '编辑公告'
				}
			},
		},
	},

	created() {
		this.getNoticeList()
	},

	methods: {
		setDialogTitle() {
			switch (this.formData102?.noticeType) {
				case 1:
					return '发货公告'

				default:
					return '编辑公告'
			}
		},
		async updateNotice(e) {
			let custom = e
				? {
						uid: e.currentTarget.__vue__._uid,
				  }
				: {}
			this.formData102 = Object.assign(this.formData102, {
				noticeContent: this.formData102.noticeContent,
				validStartTime: new Date(this.formData102.showTime[0]).getTime(),
				validEndTime: new Date(this.formData102.showTime[1]).getTime(),
			})
			if (this.formData102?.noticeType && this.formData102.noticeType == 1) {
				this.formData102.noticeContent = this.formData102.noticeContent.replace(
					/\n/g,
					''
				)
			}
			let {
				data: { resultCode, resultMsg },
			} = await updateNoticeManagement(this.formData102, custom)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible101 = false
				this.getNoticeList()
			}
		},
		async getNoticeList() {
			this.loading = true
			let {
				data: {
					resultCode,
					resultData: { noticeManagementList },
				},
			} = await getNoticeManagementList()
			if (resultCode == 0) {
				this.loading = false
				this.tableDataNotice = noticeManagementList
			}
		},
	},
}
</script>
