<template>
	<div class="activeList">
		<basicContainer>
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
					<template slot="container">
						<div>
							<UE
								ref="um"
								:defaultMsg="information"
								:name="'ue' + timeOut"
								:isImageList="true"
								imageType="32"
								imageUrl="/weeget-infinite-backend-gateway/yhtplus/image/uploadImageList.action?action=uploadimage"
							></UE>
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
import {
	getDirectMaterialList,
	updateDirectMaterialById,
} from '@/api/directMaterial'
import UE from '@/components/RichText'

export default {
	components: {
		BasicContainer,
		YxTable,
		Dialog,
		YxForm,
		UE,
	},
	props: [],
	data() {
		let validatePass = (rule, value, callback) => {
			let val = this.$refs.um.editor.getContent()
			// let valText = val.replace(/<[^>]+>/g, '')
			if (!val.trim()) {
				callback(new Error('请输入消息内容'))
			} else {
				callback()
			}
		}
		return {
			loading: false,
			timeOut: new Date().getTime(),
			information: '',
			tableData101: [],
			tableColumns101: [
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
							title: '编辑',
							click: (row) => {
								this.information = row.pageContent || 'default'
								setTimeout(() => {
									this.$refs.um.editor.setContent(row.pageContent)
								}, 1)
								this.formData103 = Object.assign({}, row)
								this.dialogVisible102 = true
								this.$forceUpdate()
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
			dialogWidth102: '900px',
			dialogVisible102: false,
			dialogBottomBtn102: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog103.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveMaterial()
								// this.dialogVisible102 = false
							}
						})
					},
				},
			],
			formData103: {
				remark: '',
				directMaterialName: '',
				pageTitle: '',
				container: '',
				skipUrl: '',
			},
			formRules103: {
				directMaterialName: [
					{ required: true, message: '请输入指引名称', trigger: 'blur' },
				],
				pageTitle: [
					{ required: true, message: '请输入页面标题', trigger: 'blur' },
				],
				content: [{ required: true, validator: validatePass, trigger: 'blur' }],
				skipUrl: [
					{ required: true, message: '请输入跳转路径', trigger: 'blur' },
				],
			},
			formCfg103: [
				{
					type: 'input',
					title: '备注',
					dataIndex: 'remark',
					placeholder: '请输入备注',
					disabled: true,
				},
				{
					type: 'input',
					title: '指引名称',
					dataIndex: 'directMaterialName',
					placeholder: '请输入指引名称',
				},
				{
					title: '页面标题',
					type: 'input',
					dataIndex: 'pageTitle',
					placeholder: '请输入页面标题',
				},
				{
					title: '页面内容',
					type: 'custom',
					dataIndex: 'container',
				},
				{
					type: 'input',
					title: '跳转路径',
					dataIndex: 'skipUrl',
					placeholder: '请输入跳转路径',
				},
			],
			formAction103: [],
		}
	},

	methods: {
		async saveMaterial() {
			let paramJson = {
				directMaterialId: this.formData103.directMaterialId,
				directMaterialName: this.formData103.directMaterialName,
				pageTitle: this.formData103.pageTitle,
				skipUrl: this.formData103.skipUrl,
				pageContent: this.$refs.um.editor.getContent(),
				richImageList: this.$refs.um.getInformationImageList(),
			}
			let {
				data: { resultCode, resultMsg },
			} = await updateDirectMaterialById(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.init(true)
				this.dialogVisible102 = false
			}
		},
		async init(flag) {
			this.loading = true
			let paramJson = this.findSearchParams101(flag)
			const {
				data: { resultCode, resultData },
			} = await getDirectMaterialList(paramJson)
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
