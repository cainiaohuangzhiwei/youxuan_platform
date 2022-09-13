<template>
	<div>
		<el-dialog
			width="800px"
			title="确认更改售后单类型？"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<div style="margin-bottom: 16px">
				确认更改后，该售后单：售后类型将变为“仅退款”；
			</div>
			<yx-form
				ref="form"
				:inline="false"
				:items="item"
				:data="formData"
				:rules="formRules"
				labelWidth="100px"
				:formAction="formAction"
			>
				<template #deliverIndex>
					<div>
						<el-select
							v-model="formData.deliverIndex"
							placeholder="请选择是否收到货"
							@change="handleChage"
						>
							<el-option
								v-for="item in deliverArray"
								:key="item.type"
								:label="item.label"
								:value="item.type"
							>
							</el-option>
						</el-select>
					</div>
				</template>
				<template #reasonIndex>
					<div>
						<el-select
							v-model="formData.reasonIndex"
							placeholder="请选择售后原因"
						>
							<el-option
								v-for="item in reasonListOp"
								:key="item.label"
								:label="item.label"
								:value="item.label"
							>
							</el-option>
						</el-select>
					</div>
				</template>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
import { modifyAfterTypeInfo, modifyAfterType } from '@/api/afterSales'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		changeSaleRow: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
	},

	data() {
		return {
			afterSalesId: '',
			reasonListOp: [],
			deliverArray: [
				{
					label: '已收到',
					type: '1',
				},
				{
					label: '未收到',
					type: '2',
				},
			],
			reasonIndex: '',
			//仅退款-已收货-售后原因
			reasonList1: [
				{
					label: '少件/漏发',
					type: 0,
				},
				{
					label: '商品破损',
					type: 1,
				},
			],
			//仅退款-未收货-售后原因
			reasonList2: [
				{
					label: '个人原因/不喜欢拒收',
					type: 0,
				},
				{
					label: '签收异常/物流异常/停滞',
					type: 1,
				},
				{
					label: '未收到货(显示签收)',
					type: 2,
				},
				{
					label: '长时间未发货',
					type: 3,
				},
				{
					label: '拒收(破损/包裹变形等)',
					type: 4,
				},
				{
					label: '不想要了，错拍',
					type: 5,
				},
			],
			input: '',
			item: [
				{
					type: 'custom',
					title: '是否收到货',
					dataIndex: 'deliverIndex',
				},
				{
					title: '售后原因',
					type: 'custom',
					dataIndex: 'reasonIndex',
				},
				{
					type: 'uploadImage',
					title: '图片',
					dataIndex: 'activityPosterImage',
					uploadAttributes: {
						limit: 5,
						// isEdit: true,
						imageName: 'activityPosterImage',
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'activityPosterImage'),
					},
				},
			],
			formData: {
				deliverIndex: '',
				activityPosterImage: [],
				reasonIndex: '',
			},
			formRules: {
				deliverIndex: [
					{
						required: true,
						message: '请选择是否收到货!',
						trigger: ['blur', 'change'],
					},
				],
				activityPosterImage: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData.activityPosterImage.length) {
								callback(new Error('请上传图片!'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				reasonIndex: [
					{
						required: true,
						message: '请选择售后原因!',
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
			this.formData.deliverIndex = ''
			this.formData.reasonIndex = ''
			this.formData.activityPosterImage = []
			if (val) {
				this.modifyAfterTypeInfo(this.changeSaleRow)
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
		handleChage(val) {
			this.formData.reasonIndex = ''
			if (val == 1) {
				this.reasonListOp = this.reasonList1
			} else {
				this.reasonListOp = this.reasonList2
			}
		},
		async modifyAfterTypeInfo(row) {
			let {
				data: { resultCode = 0, resultData = [] },
			} = await modifyAfterTypeInfo({
				afterSalesId: row.afterSalesId,
			})
			if (resultCode == 0) {
				this.afterSalesId = resultData.afterSalesId
				this.formData.deliverIndex = resultData.acceptGoods.toString()
				if (this.formData.deliverIndex == 1) {
					this.reasonListOp = this.reasonList1
				} else {
					this.reasonListOp = this.reasonList2
				}
				//图片
				if (resultData.afterSalesImageList) {
					this.formData.activityPosterImage =
						resultData.afterSalesImageList.map((v) => {
							return {
								activityPosterImage: getBigImg(v.imageUrl),
								imageUrl: v.imageUrl,
							}
						})
				}
			}
			console.log(resultCode, resultData, 'adfasdfasfsdff')
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
		async uploadImageHttpRequest(params, name) {
			//上传海报
			let formData = new FormData()
			formData.append('formId', '#addActivityPoster')
			formData.append('data', JSON.stringify({ imageType: 39 }))
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				resultData.imageList[0][name] = getBigImg(
					resultData.imageList[0].imageUrl
				)
				this.formData[name].push(...resultData.imageList)
			}
		},
		async submitForm() {
			let params = {
				afterSalesId: this.afterSalesId,
				acceptGoods: this.formData.deliverIndex,
				afterReason: this.formData.reasonIndex,
			}
			params.imageList = this.formData.activityPosterImage.map((item) => {
				return { imageUrl: item.imageUrl }
			})
			let {
				data: { resultCode },
			} = await modifyAfterType(params)
			if (resultCode == 0) {
				this.$message.success('更改成功')
				this.$emit('Refresh', true)
				this.localVisible = false
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>
