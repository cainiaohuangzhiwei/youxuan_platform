<template>
	<div>
		<el-dialog
			width="800px"
			v-loading="showLoading"
			title="派发优惠券"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<yx-form
				ref="form"
				:inline="false"
				:items="item"
				:data="formData"
				:rules="formRules"
				labelWidth="120px"
				:formAction="formAction"
			>
				<template #couponName>
					<div>{{ formData.couponName }}</div>
				</template>
				<template #count>
					<el-input
						style="width: 80px; margin-left: 10px; margin-right: 10px"
						v-model="formData.count"
					></el-input
					>张
				</template>
				<template #excelCon>
					<div>表格表头第一列为用户Id，第二列为用户名称</div>
				</template>
				<template #selectRate>
					<el-radio
						v-model="formData.selectRate"
						label="1"
						v-if="
							distributeCouponsRow.userRank == 0 ||
							distributeCouponsRow.userRank == 1
						"
						><el-button type="text" @click="handleShopkeeper()"
							>选择店主</el-button
						></el-radio
					>
					<el-radio
						v-model="formData.selectRate"
						label="2"
						v-if="
							distributeCouponsRow.userRank == 0 ||
							distributeCouponsRow.userRank == 2
						"
						><el-button type="text" @click="handleUser()"
							>选择用户</el-button
						></el-radio
					>
					<div class="rateTip">
						<el-radio v-model="formData.selectRate" label="3"
							><el-upload
								ref="uploadUer"
								class="upBox"
								accept=".xls,.xlsx"
								:show-file-list="true"
								:file-list="fileList"
								limit="1"
								:http-request="handleUploadExcel"
							>
								<el-button type="text" @click="handleExcel()"
									>+导入Excel表</el-button
								>
							</el-upload></el-radio
						>
					</div>

					<div v-if="formData.selectRate == 1">
						<span v-for="(item, index) in selectGroupList" :key="index"
							>{{ item.organizationName
							}}{{ selectGroupList.length - 1 != index ? '、' : '' }}</span
						>
					</div>
					<div v-if="formData.selectRate == 2">
						<span v-for="(item, index) in selectGroupList1" :key="index"
							>{{ item.weixinUserName
							}}{{ selectGroupList1.length - 1 != index ? '、' : '' }}</span
						>
					</div>
					<!-- <div v-if="formData.selectRate == 3">
						<span v-for="(item, index) in selectGroupList2" :key="index"
							>{{ item.weixinUserName
							}}{{ selectGroupList2.length - 1 != index ? '、' : '' }}</span
						>
					</div> -->
				</template>
				<template #handOutReason>
					<el-select
						v-model="formData.handOutReason"
						placeholder="请选择派发原因"
					>
						<el-option label="业务需求" value="2"></el-option>
						<el-option label="系统故障导致" value="1"></el-option>
					</el-select>
				</template>
				<template #remark>
					<el-input
						type="textarea"
						v-model="formData.remark"
						maxlength="200"
						show-word-limit
						:autosize="{ minRows: 3, maxRows: 5 }"
					></el-input>
				</template>
			</yx-form>
		</el-dialog>
		<choose-theowner-dialog
			:visible.sync="dialogChooseVisible"
			:rangeExt="rangeExt"
			@saveBrand="saveBrand"
		></choose-theowner-dialog>
		<select-user-dialog
			:visible.sync="dialogChooseVisible1"
			:rangeExt="rangeExt1"
			@saveBrand="saveBrand"
		></select-user-dialog>
		<el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
			<div style="margin-bottom: 20px">
				<div style="color: red; font-size: 20px">派发优惠成功</div>
				<div>以下用户ID不符合派发</div>
			</div>
			<span
				style="color: #ff0000; font-size: 18px"
				v-for="(item, index) in noList"
				:key="index"
				>{{ item }}{{ noList.length - 1 != index ? '、' : '' }}</span
			>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogVisible = false"
					>确 定</el-button
				>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { impostCouponExcel, distributeCouponManualForAudit } from '@/api/coupon'
import chooseTheownerDialog from './chooseTheownerDialog'
import selectUserDialog from './selectUserDialog'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		distributeCouponsRow: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
		chooseTheownerDialog,
		selectUserDialog,
	},

	data() {
		return {
			files: '',
			fileList: [],
			showLoading: false,
			rangeExt: [],
			rangeExt1: [],
			selectGroupList: [],
			selectGroupList1: [],
			// selectGroupList2: [],
			dialogChooseVisible: false,
			dialogChooseVisible1: false,
			dialogVisible: false,
			noList: [],
			item: [
				{
					title: '优惠券名称',
					type: 'custom',
					dataIndex: 'couponName',
				},
				{
					title: '派发数量',
					type: 'custom',
					dataIndex: 'count',
				},
				{
					title: 'Excel内容',
					type: 'custom',
					dataIndex: 'excelCon',
				},
				{
					title: '派发对象',
					type: 'custom',
					dataIndex: 'selectRate',
				},
				{
					type: 'custom',
					dataIndex: 'handOutReason',
					title: '派发原因',
				},
				{
					type: 'custom',
					dataIndex: 'remark',
					title: '备注',
				},
			],
			formData: {
				couponName: '',
				count: '',
				selectRate: '',
				rate1: '',
				rate2: '',
				handOutReason: '',
				remark: '',
			},
			formRules: {
				count: [
					{
						required: true,
						validator: (rule, value, callback) => {
							const pattern = /^[1-9]\d*$/
							if (!value) {
								callback(new Error('请填写派发数量'))
							}
							if (!pattern.test(value)) {
								callback(new Error('请输入正确的格式'))
							}
							callback()
						},
						trigger: ['blur', 'change'],
					},
				],
				selectRate: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请选择派发对象'))
							}
							if (value == 1) {
								if (this.selectGroupList && !this.selectGroupList.length) {
									callback(new Error('请选择店主'))
								}
							} else if (value == 2) {
								if (this.selectGroupList1 && !this.selectGroupList1.length) {
									callback(new Error('请选择用户'))
								}
							} else if (value == 3) {
								if (!this.files) {
									callback(new Error('请选择用户'))
								}
							}
							callback()
						},
						trigger: ['blur', 'change'],
					},
				],
				handOutReason: [
					{
						required: true,
						message: '请选择派发原因',
						trigger: ['blur', 'change'],
					},
				],
			},
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
		}
	},
	watch: {
		localVisible(val) {
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			this.formData.count = ''
			this.formData.handOutReason = ''
			this.formData.remark = ''
			this.rangeExt = []
			this.rangeExt1 = []
			this.selectGroupList = []
			this.selectGroupList1 = []
			this.files = ''
			this.fileList = []
			// this.selectGroupList2 = []
			if (val) {
				this.formData.couponName = this.distributeCouponsRow.couponName
			}
		},
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
		handleShopkeeper() {
			this.formData.selectRate = '1'
			this.rangeExt = JSON.parse(JSON.stringify(this.selectGroupList))
			this.dialogChooseVisible = true
		},
		handleUser() {
			this.formData.selectRate = '2'
			this.rangeExt1 = JSON.parse(JSON.stringify(this.selectGroupList1))
			this.dialogChooseVisible1 = true
		},
		saveBrand(val, index) {
			if (index == 2) {
				this.selectGroupList1 = JSON.parse(JSON.stringify(val))
			} else {
				this.selectGroupList = JSON.parse(JSON.stringify(val))
			}
		},
		handleExcel() {
			this.formData.selectRate = '3'
		},
		async _impostCouponExcel() {
			console.log(this.fileList, 'aafdfdfd')
			let { file } = this.files
			const formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({
					timeStamp: new Date().getTime(),
					groupId: 2,
					yxCouponId: this.distributeCouponsRow.yxCouponId,
					count: this.formData.count,
					handOutReason: this.formData.handOutReason,
					remark: this.formData.remark || '',
				})
			)
			formData.append('formId', '#excelForm')
			formData.append('fileToUpload', file)
			this.showLoading = true
			const {
				data: { resultCode, resultData },
			} = await impostCouponExcel(formData)
			this.showLoading = false
			if (resultCode == 0) {
				this.noList = []
				let noUserId = resultData.noUserId || []
				let errUserId = resultData.errUserId || []
				this.noList = [...noUserId, ...errUserId]
				if (this.noList && this.noList.length > 0) {
					this.dialogVisible = true
				} else {
					this.$message.success('派发成功')
					this.localVisible = false
				}
				this.$emit('Refresh', true)
			}
		},
		async handleUploadExcel(file) {
			console.log(file.file, 'aaaaaa')
			this.files = file
			// // 导入EXCEL文件
			// const formData = new FormData()
			// formData.append(
			// 	'data',
			// 	JSON.stringify({ timeStamp: new Date().getTime(), groupId: 2 })
			// )
			// formData.append('formId', '#excelForm')
			// formData.append('fileToUpload', file.file)
			// this.showLoading = true
			// const {
			// 	data: { resultCode, resultData },
			// } = await impostCouponExcel(formData)
			// this.showLoading = false
			// if (resultCode == 0) {
			// 	if (resultData.userInfoList) {
			// 		this.selectGroupList2 = resultData.userInfoList
			// 	} else {
			// 		this.$message.error('导入列表有误')
			// 	}
			// }
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			// this.$refs.form.$refs.YxForm.resetFields()
		},
		async submitForm() {
			if (this.formData.selectRate == 3) {
				return this._impostCouponExcel()
			}
			let params = {
				yxCouponId: this.distributeCouponsRow.yxCouponId,
				count: this.formData.count,
				handOutReason: this.formData.handOutReason,
			}
			if (this.formData.remark) {
				params.remark = this.formData.remark
			}
			if (this.formData.selectRate == 1) {
				params.userIdList = this.selectGroupList.map((item) => {
					return item.userId
				})
			} else if (this.formData.selectRate == 2) {
				params.userIdList = this.selectGroupList1.map((item) => {
					return item.userId
				})
			}
			let {
				data: { resultCode, resultData },
			} = await distributeCouponManualForAudit(params)
			if (resultCode == 0) {
				this.noList = []
				let noUserId = resultData.noUserId || []
				let errUserId = resultData.errUserId || []
				this.noList = [...noUserId, ...errUserId]
				if (this.noList && this.noList.length > 0) {
					this.dialogVisible = true
				} else {
					this.$message.success('派发成功')
					this.localVisible = false
				}
				this.$emit('Refresh', true)
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.upBox {
	display: inline-block;
}
.rateTip .el-radio:last-child {
	display: flex;
}
.rateTip .el-radio__input.is-checked .el-radio__inner {
	margin-top: 10px !important;
}
</style>
<style>
.rateTip .el-radio__inner {
	margin-top: 8px !important;
}
</style>
