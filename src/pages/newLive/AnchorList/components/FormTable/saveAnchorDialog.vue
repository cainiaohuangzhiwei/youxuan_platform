<template>
	<div>
		<mcn-dialog
			:dialogVisible.sync="dialogMcnVisible"
			:selectedMcn.sync="selectedMcn"
		/>
		<yx-dialog
			width="500px"
			:title="title"
			:visible.sync="visible"
			@before-close="resetForm"
		>
			<yx-form
				ref="form"
				labelWidth="95px"
				:data="dialogData"
				:rules="rules"
				:items.sync="dialogCfg"
				:formAction="dialogAction"
			>
				<template slot="copyType" slot-scope="scope">
					<el-radio-group v-model="scope.data.copyType">
						<el-radio :label="10">普通主播</el-radio>
						<el-radio :label="11">优选主播</el-radio>
					</el-radio-group>
				</template>
				<template slot="mcnId" slot-scope="scope">
					<div class="row_flex">
						<el-input v-model="scope.data.mcnName" disabled />
						<el-button type="primary" @click="cutMcn(true)">选择机构</el-button>
					</div>
				</template>
			</yx-form>
		</yx-dialog>
	</div>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import mcnDialog from './mcnDialog'
import { uploadImageList } from '@/api/image'
import { getSmallImg } from '@/utils/imageTool'
import { addAnchor, editUser } from '@/api/yhtPlusCmsLiveUserAction'
export default {
	components: {
		YxDialog,
		YxForm,
		mcnDialog,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			selectedMcn: {},
			dialogMcnVisible: false, // 选择机构弹框开关
			visible: false,
			title: '新建主播',
			dialogData: {
				// 新增编辑参数
				userName: '', //主播名字
				idcard: '', // 主播身份证
				phoneMob: '', // 主播手机
				mcnId: '', // 关联机构id
				mcnName: '', // 机构名称
				nickname: '', //主播昵称
				copyType: '', //主播类型
				portraitUrlJson: [], // 主播头像
			},
			rules: {
				// 新增编辑规则
				userName: [
					{
						required: true,
						message: '请输入主播身份证真实姓名',
						trigger: 'blur',
					},
					{
						validator: (rule, value, callback) => {
							if (!/^[\u4E00-\u9FA5]{1,6}$/.test(value)) {
								callback(new Error('主播姓名只能为中文'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				idcard: [
					{ required: true, message: '请输入主播身份证', trigger: 'blur' },
				],
				mcnId: [{ required: true, message: '请选择机构', trigger: 'blur' }],
				phoneMob: [
					{ required: true, message: '请输入主播手机', trigger: 'blur' },
					{
						validator: (rule, value, callback) => {
							if (!/^1[3456789]\d{9}$/.test(value)) {
								callback(new Error('手机格式有误'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				nickname: [
					{ required: true, message: '请输入主播昵称', trigger: 'blur' },
				],
				copyType: [
					{ required: true, message: '请选择主播类型', trigger: 'blur' },
				],
			},
			dialogAction: [
				// 新增编辑按钮
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.saveAnchor()
					},
				},
			],
			dialogCfg: [
				// 添加编辑配置项
				{
					type: 'input',
					dataIndex: 'userName',
					title: '主播名字',
					placeholder: '请输入主播身份证真实姓名',
				},
				{
					type: 'input',
					dataIndex: 'idcard',
					title: '主播身份证',
				},
				{
					type: 'inputNumber',
					dataIndex: 'phoneMob',
					title: '主播手机',
					maxlength: 11,
				},
				{
					type: 'custom',
					dataIndex: 'mcnId',
					title: '关联机构',
				},
				{
					type: 'input',
					dataIndex: 'nickname',
					title: '主播昵称',
					maxlength: 10,
				},
				{
					type: 'custom',
					title: '主播类型',
					dataIndex: 'copyType',
				},
				{
					type: 'uploadImage',
					title: '主播头像',
					dataIndex: 'portraitUrlJson',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'portraitUrlJson',
						httpRequest: (file) => this.uploadImageHttpRequest(file),
					},
				},
			],
		}
	},
	methods: {
		details(row) {
			this.dialogData.userName = row.anchorName || '' //主播名字
			this.dialogData.idcard = row.idCard || '' // 主播身份证
			this.dialogData.phoneMob = row.phoneMobile || '' // 主播手机
			this.dialogData.mcnId = row.mcnId || '' // 关联机构id
			this.dialogData.mcnName = row.mcnName || '' // 机构名称
			this.dialogData.nickname = row.nickName || '' //主播昵称
			this.dialogData.copyType = row.type == 0 ? 10 : 11 //主播昵称
			this.dialogData.portraitUrlJson = [] //主播昵称
			this.dialogData.anchorId = row.anchorId || '' //主播昵称
			this.title = row && row.anchorId ? '编辑主播' : '新增主播'
			this.selectedMcn = {
				mcnId: (row && row.mcnId) || '', // 关联机构id
				mcnName: (row && row.mcnName) || '', // 机构名称
			}
			if (row && row.portraitUrl) {
				this.dialogData.portraitUrlJson = [
					{
						portraitUrlJson: getSmallImg(row.portraitUrl),
					},
				]
			}
		},
		saveAnchor: async function () {
			// 保存编辑
			let paramJson = Object.assign({}, this.dialogData)
			if (
				paramJson.portraitUrlJson.length &&
				paramJson.portraitUrlJson[0].imageId
			) {
				paramJson.portraitUrlJson = JSON.stringify(paramJson.portraitUrlJson[0])
			} else {
				delete paramJson.portraitUrlJson
			}
			paramJson.type = this.dialogData.copyType == 10 ? 0 : 1
			if (paramJson.anchorId) {
				this._editUser(paramJson)
			} else {
				this._addAnchor(paramJson)
			}
		},
		async _addAnchor(paramJson) {
			// 新增主播
			let {
				data: { resultCode, resultMsg },
			} = await addAnchor(paramJson)
			if (resultCode == 0) {
				this.$message({
					message: resultMsg,
					type: 'success',
				})
				this.$emit('updateList')
				this.resetForm()
			}
		},
		async _editUser(paramJson) {
			// 编辑主播
			let {
				data: { resultCode, resultMsg },
			} = await editUser(paramJson)

			if (resultCode == 0) {
				this.$message({
					message: resultMsg,
					type: 'success',
				})
				this.$emit('updateList')
				this.resetForm()
			}
		},
		resetForm() {
			this.visible = false
			this.$refs.form.$refs.YxForm.resetFields()
		},
		async uploadImageHttpRequest(params) {
			//上传海报
			let formData = new FormData()

			formData.append(
				'data',
				JSON.stringify({ formId: '#anchorImageFrom', imageType: 81 })
			)
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			console.log(resultCode, resultData)
			if (resultCode == 0) {
				this.dialogData.portraitUrlJson = resultData.imageList
				this.dialogData.portraitUrlJson[0].portraitUrlJson = getSmallImg(
					resultData.imageList[0].imageUrl
				)
			}
		},
		cutMcn(flag) {
			// 选择机构弹框
			this.dialogMcnVisible = flag
		},
	},
	watch: {
		selectedMcn() {
			this.dialogData.mcnId = this.selectedMcn.mcnId
			this.dialogData.mcnName = this.selectedMcn.mcnName
		},
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},
}
</script>

<style lang="scss">
.row_flex {
	display: flex;
	align-items: center;
}
</style>
