<template>
	<div>
		<el-dialog
			width="600px"
			:title="`${title}`"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="open"
		>
			<yx-form
				ref="form"
				v-loading="loading"
				labelWidth="140px"
				:items="item"
				:rules="funRules"
				:data="formData"
				:formAction="formAction"
			>
				<template slot="prizeId">
					<div>
						<div>
							<el-button @click="openPrizeDialog" size="small" type="text"
								>选择奖品</el-button
							>
							<div>
								<span>{{ selectPrize.prizeName }}</span>
							</div>
						</div>
					</div>
				</template>
			</yx-form>
		</el-dialog>
		<prize-dialog
			:itemInfo="prizeRow"
			:visible.sync="dialogPrizeVisible"
			@fatherMethodInit="fatherMethodInit"
		/>
	</div>
</template>

<script>
import { addLottery } from '@/api/lotteryTools'
import YxForm from '@wg-vue-materials/yx-form'
import moment from 'moment'
import prizeDialog from '../components/prizeDialog'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '',
		},
		row: {
			type: Object,
			default: () => ({}),
		},
		dialogState: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		YxForm,
		prizeDialog,
	},

	data() {
		return {
			selectCoupon: {},
			dialogPrizeVisible: false,
			prizeRow: [],
			selectPrize: {},
			formData: {
				lotteryActivityName: '',
				useTime: '',
				prizeId: '',
			},
			couponIds: [],
			fileToUpload: '',
			item: [
				{
					dataIndex: 'lotteryActivityName',
					title: '活动名称',
					placeholder: '请输入活动名称',
				},
				{
					type: 'time',
					title: '活动时间',
					dataIndex: 'useTime',
					timeAttributes: {
						type: 'datetimerange',
					},
				},
				{
					type: 'custom',
					title: '关联奖品',
					dataIndex: 'prizeId',
				},
			],
			loading: false,
			formsDialog: false,
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this._add()
					},
				},
				{
					title: '取消',
					type: 'default',
					cancel: true,
					click: () => {
						this.localVisible = false
					},
				},
			],
			funRules: {
				lotteryActivityName: [
					{
						required: true,
						message: '请输入活动名称!',
						trigger: 'blur',
					},
					{
						validator: (rule, value, callback) => {
							if (value.length > 10) {
								callback(new Error('活动名称不能超过10个字符'))
							} else {
								callback()
							}
						},
					},
				],
				useTime: [
					{
						required: true,
						message: '请选择活动时间!',
						trigger: 'blur',
					},
				],
				prizeId: [
					{
						required: true,
						message: '请选择关联奖品!',
						trigger: 'blur',
					},
				],
			},
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
		//保存
		async _add() {
			let paramsData = {
				startTime: moment(this.formData.useTime[0]).valueOf(),
				endTime: moment(this.formData.useTime[1]).valueOf(),
				lotteryActivityName: this.formData.lotteryActivityName,
				prizeSettingDTOList: [
					{
						prizeSettingId: this.selectPrize.prizeSettingId,
						probability: 100,
					},
				],
			}

			this.loading = true
			const res = await addLottery(paramsData)
			const resultCode = res.data.resultCode
			if (resultCode == 0) {
				this.$message({
					message: '操作成功',
					type: 'success',
				})
				this.localVisible = false
				this.$emit('initTable')
			}
			this.loading = false
		},
		resetForm() {
			this.localVisible = false
			this.formData.prizeId = ''
			this.formData.useTime = ''
			this.formData.lotteryActivityName = ''
			this.selectPrize = {}
			this.$refs.form.$refs.YxForm.resetFields()
		},

		async open() {
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			this.loading = false
			this.formData.prizeId = ''
			this.formData.useTime = ''
			this.formData.lotteryActivityName = ''
			this.selectPrize = {}
		},
		handleVerify(e) {
			console.log('e', e)
		},
		openPrizeDialog() {
			// 切换选择奖品弹框
			this.prizeRow = JSON.parse(JSON.stringify(this.selectPrize))
			this.dialogPrizeVisible = true
		},
		fatherMethodInit(val) {
			this.selectPrize = JSON.parse(JSON.stringify(val))
			this.formData.prizeId = this.selectPrize.prizeSettingId
		},
	},
}
</script>

<style lang="scss" scoped></style>
