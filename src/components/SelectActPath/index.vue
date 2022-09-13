<template>
	<el-dialog
		width="800px"
		title="选择页面"
		append-to-body
		:close-on-click-modal="false"
		:visible.sync="localVisible"
		:before-close="resetForm"
	>
		<YxForm
			ref="form"
			:inline="true"
			:items="item"
			:data="formData"
			:formAction="formAction"
		/>

		<YxTable
			v-loading="loading"
			:columns="tableColumns"
			:pagination="page"
			:data="tableData"
		>
			<template slot="actFileId" slot-scope="scope">
				<el-radio
					v-model="rowData.fileId"
					:label="scope.row.fileId"
					@change="changeAnchor(scope.row)"
					>选择</el-radio
				>
			</template>
		</YxTable>

		<div class="wg-text-right" v-if="page.count > 0">
			<el-button type="primary" @click="submitForm">确定</el-button>
		</div>
	</el-dialog>
</template>

<script>
import { getActServerPagesList } from '@/api/act-server'
import _ from 'lodash'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		defaultValue: {
			type: String,
			default: '',
		},
	},

	watch: {
		visible() {
			if (this.visible) {
				this.init(true, (actPagesBOList) => {
					// 回显操作
					this.handleDefaultChecked(actPagesBOList)
				})
			}
		},
	},

	components: {
		YxForm: () => import('@wg-vue-materials/yx-form'),
		YxTable: () => import('@wg-vue-materials/yx-table'),
	},

	data() {
		return {
			actID: '',
			item: [
				{
					title: '页面名称',
					dataIndex: 'searchKey',
					placeholder: '请输入页面名称',
				},
			],
			formData: {
				searchKey: '',
			},
			rowData: {},
			loading: false,
			tableData: [],
			tableColumns: [
				{
					width: 80,
					type: 'custom',
					dataIndex: 'actFileId',
				},
				{
					width: 150,
					title: '页面ID',
					dataIndex: 'fileId',
				},
				{
					title: '页面名称',
					dataIndex: 'title',
				},
				{
					title: '类型',
					dataIndex: 'startTime',
					customRender: (row) => {
						const now = Date.now()
						const st = row.startTime
						const et = row.endTime
						const text =
							(now < st && '未开始') ||
							(now >= st && now <= et && '进行中') ||
							'已结束'
						console.log(text, 'text')
						return text
					},
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			formAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init(true)
					},
				},
			],
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

	methods: {
		details(livePlanId) {
			this.rowData.livePlanId = parseInt(livePlanId.toString())
			this.init(true)
		},

		changeAnchor(row) {
			this.rowData = Object.assign({}, row)
		},

		findSearchParams(flag) {
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = Object.assign(this.formData, {
				pageSize: this.page.length,
				pageNum: this.page.currentPage,
			})

			return paramJson
		},

		handleDefaultChecked(actPagesBOList = []) {
			const fileId = this.defaultValue
			if (fileId) {
				const rowData = actPagesBOList?.find((i) => i.fileId === fileId)
				if (rowData) {
					this.rowData = _.cloneDeep(rowData)
				}
			}
		},

		async init(flag, cb) {
			const params = this.findSearchParams(flag)
			params.actAppsId = 1

			// 测试环境使用328
			if (
				process.env.NODE_ENV === 'development' ||
				location.hostname.includes('fors-ali-pressure')
			) {
				params.actAppsId = 328
			}

			this.loading = true
			const {
				data: { resultCode, resultData = [] },
			} = await getActServerPagesList(params)
			if (resultCode == 0) {
				this.tableData = resultData.actPagesBOList
				this.page.count = resultData.total
				cb && cb(resultData.actPagesBOList)
			} else {
				this.page.total = 0
				this.tableData = []
			}
			this.loading = false
		},

		resetForm() {
			this.localVisible = false
			this.rowData = {}
			this.$refs.form.$refs.YxForm.resetFields()
		},

		submitForm() {
			if (!this.rowData.actPagesId) {
				return this.$message.warning('请选择页面')
			}
			this.$emit('handleChangeSelectActPath', this.rowData)
			this.resetForm()
		},
	},
}
</script>

<style lang="scss" scoped></style>
