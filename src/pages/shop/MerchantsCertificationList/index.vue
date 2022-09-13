<template>
	<div class="xcxImgList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData181"
				:items="formCfg181"
				:formAction="formAction181"
			>
			</yx-form>
			<yx-table
				v-loading="loading"
				:select="false"
				:columns="tableColumns182"
				:pagination="page182"
				:data="tableData182"
			>
			</yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import {
	getAccAccountIndividualRelationListFors,
	getRealTimeIndividualInfo,
	updateDisableRelation,
} from '@/api/taxAdministration'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	props: [],
	data() {
		return {
			loading: false,
			formData181: {
				accountId: '', // 店主id
				coreCompanyMerchantId: '', // 商户id
				enableStatus: '', // 禁用状态
				registeredStatus: '', // 注册状态
			},
			formCfg181: [
				{
					type: 'inputNumber',
					title: '店主ID',
					dataIndex: 'accountId',
					placeholder: '请输入店主ID',
				},
				{
					type: 'input',
					title: '商户ID',
					dataIndex: 'coreCompanyMerchantId',
					placeholder: '请输入商户ID',
				},
				{
					title: '注册状态',
					type: 'selectMap',
					dataIndex: 'registeredStatus',
					options: {
						全部: '',
						未提交: 0,
						申请中: 1,
						正常: 2,
						待审核: 3,
						中心企业驳回: 4,
						运营端驳回: 5,
						注销: 6,
						注册中: 7,
					},
				},
				{
					title: '启用状态',
					type: 'selectMap',
					dataIndex: 'enableStatus',
					options: {
						全部: '',
						禁用: 0,
						启用: 1,
					},
				},
			],
			formAction181: [
				{
					title: '重置',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getAccAccountIndividualRelationListFors(true)
					},
				},
			],
			tableData182: [],
			tableColumns182: [
				{
					type: 'string',
					dataIndex: 'accountId',
					title: '店主ID',
				},
				{
					type: 'string',
					dataIndex: 'coreCompanyMerchantId',
					title: '商户ID',
				},
				{
					type: 'string',
					dataIndex: 'name',
					title: '姓名',
				},

				{
					type: 'string',
					dataIndex: 'applyTime',
					title: '申请时间',
					customRender: (row) => {
						return row.applyTime
							? moment(row.applyTime).format('YYYY-MM-DD HH:mm:ss')
							: '-'
					},
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '驳回原因',
				},
				{
					type: 'action',
					title: '营业执照正本',
					width: '120',
					actions: [
						{
							title: '下载',
							click: (row) => {
								this.downloadUrlFile(row.licenseUrl)
							},
							customRender: (action, row) => {
								action.hide = !row.licenseUrl ? true : false
								return action
							},
						},
					],
				},
				{
					type: 'action',
					title: '营业执照副本',
					width: '120',
					actions: [
						{
							title: '下载',
							click: (row) => {
								this.downloadUrlFile(row.licenseCopyUrl)
							},
							customRender: (action, row) => {
								action.hide = !row.licenseCopyUrl ? true : false
								return action
							},
						},
					],
				},
				{
					type: 'newMap',
					dataIndex: 'registeredStatus',
					title: '注册状态',
					options: [
						['0', '未提交'],
						['1', '申请中'],
						['2', '正常'],
						['3', '待审核'],
						['4', '中心企业驳回'],
						['5', '运营端驳回'],
						['6', '注销'],
						['7', '注册中'],
					],
				},
				{
					type: 'newMap',
					dataIndex: 'enableStatus',
					title: '启用状态',
					options: [
						['0', '禁用'],
						['1', '启用'],
					],
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '查询状态',
							auth: 'getRealTimeIndividualInfo',
							click: (row) => {
								this._getRealTimeIndividualInfo(row.coreCompanyMerchantId)
							},
						},
						{
							title: '禁用',
							auth: 'accAccountIndividualRelationDisableRelation',
							customRender: (action, row) => {
								action.hide = row.enableStatus == '1' ? false : true
								return action
							},
							click: (row) => {
								let _this = this
								_this.$confirm('确定禁用？', '提示', {
									type: 'warning',
									async callback(action) {
										if (action === 'confirm') {
											_this._updateDisableRelation(
												row.accountIndividualRelationId
											)
										}
									},
								})
							},
						},
					],
				},
			],
			page182: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getAccAccountIndividualRelationListFors()
				},
			},
		}
	},

	created() {
		this._getAccAccountIndividualRelationListFors()
	},

	methods: {
		/**
		 * 获取页面文件名
		 * @param url 文件url
		 */
		downloadUrlFile(url) {
			window.open(url)
		},
		_updateDisableRelation: async function (id) {
			// 禁用个体工商户
			const {
				data: { resultCode },
			} = await updateDisableRelation({
				accountIndividualRelationId: id,
			})
			if (resultCode == 0) {
				this.$message.success(`禁用成功`)
				this._getAccAccountIndividualRelationListFors()
			}
		},
		_getRealTimeIndividualInfo: async function (coreCompanyMerchantId) {
			// 查看信息
			const {
				data: { resultCode, resultData },
			} = await getRealTimeIndividualInfo({
				coreCompanyMerchantId: coreCompanyMerchantId,
			})
			if (resultCode == 0) {
				this.$message.success(
					`个体工商户注册状态：${resultData.registeredStatus}`
				)
			}
		},
		_getAccAccountIndividualRelationListFors: async function (flag) {
			// 获取列表信息
			this.loading = true
			let paramJson = this.findSearchParams182(flag)
			const {
				data: { resultCode, resultData },
			} = await getAccAccountIndividualRelationListFors(paramJson)
			if (resultCode == 0) {
				this.tableData182 = resultData.list
				this.page182.count = resultData.count
			}
			this.loading = false
		},
		findSearchParams182(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page182.currentPage = 1
			}
			const paramJson = Object.assign(this.formData181, {
				length: this.page182.length,
				startIndex: (this.page182.currentPage - 1) * this.page182.length,
			})
			return paramJson
		},
	},
}
</script>
