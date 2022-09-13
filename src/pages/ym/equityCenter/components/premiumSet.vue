<template>
	<div class="demo">
		<basicContainer>
			<div class="goods-group-btn-box">
				<el-button type="success" @click="premiumSetBtn">保费设置</el-button>
			</div>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns101"
				:data="tableData101"
			></yx-table>
			<Dialog
				:title="dialogTitle126"
				:visible.sync="dialogVisible126"
				:width="dialogWidth126"
				:bottomBtn="dialogBottomBtn126"
			>
				<yx-form labelWidth="120px" :data="formData126" :items="formCfg126">
					<template slot="defaultCount">
						<div>
							购买
							<el-input
								class="validity-day"
								type="number"
								onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
								v-model="formData126.defaultCount"
							></el-input
							>单，<el-input
								class="validity-day"
								type="number"
								v-model="formData126.defaultYuan"
							></el-input
							>元
						</div>
					</template>
					<template slot="intervalListItems">
						<div>
							<el-button @click="addInterval" icon="el-icon-plus" type="text"
								>添加规则</el-button
							>
							<div>
								<p v-for="(item, index) in intervalList" :key="index">
									售后率<el-input
										class="validity-day"
										disabled
										v-model="item.startValue"
									></el-input
									>-<el-input
										class="validity-day"
										disabled
										v-model="item.endValue"
									></el-input
									>,<el-input
										class="validity-day"
										disabled
										v-model="item.equityAmount"
									></el-input
									>元
									<el-button
										type="danger"
										@click="intervalList.splice(index, 1)"
										>删除</el-button
									>
								</p>
							</div>
						</div>
					</template>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle127"
				:visible.sync="dialogVisible127"
				:width="dialogWidth127"
				:bottomBtn="dialogBottomBtn127"
			>
				<yx-form
					ref="dialog127"
					:rules="formRules127"
					labelWidth="120px"
					:data="formData127"
					:items="formCfg127"
				>
					<template slot="interval">
						<div>
							<el-input
								class="validity-day"
								type="number"
								onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
								v-model="formData127.endValue"
							></el-input
							>%
						</div>
					</template>
					<template slot="premiumCost">
						<div>
							<el-input
								class="validity-day"
								type="number"
								v-model="formData127.equityAmount"
							></el-input
							>元
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
import { equityConfigList, equityConfig } from '@/api/yhtPlusCmsEquityConfig'
import Dialog from '@/components/Dialog'
import YxForm from '@wg-vue-materials/yx-form'

export default {
	components: {
		BasicContainer,
		YxTable,
		YxForm,
		Dialog,
	},
	props: [],
	data() {
		return {
			intervalList: [],
			formData127: {
				endValue: '',
				equityAmount: '',
			},
			formRules127: {
				interval: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (
								!this.formData127.endValue ||
								parseInt(this.formData127.endValue) > 100
							) {
								callback(new Error('增加售后率为1-100的数字'))
							} else if (
								this.intervalList.length &&
								parseInt(
									this.intervalList[this.intervalList.length - 1].endValue
								) >= parseInt(this.formData127.endValue)
							) {
								callback(new Error('不能小于之前的售后率'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				premiumCost: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (
								!this.formData127.equityAmount ||
								this.formData127.equityAmount <= 0
							) {
								callback(new Error('保费大于0'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
			},
			formCfg127: [
				{
					title: '售后率',
					type: 'custom',
					dataIndex: 'interval',
				},
				{
					title: '保费',
					type: 'custom',
					dataIndex: 'premiumCost',
				},
			],
			formData126: {
				defaultCount: '',
				defaultYuan: '',
			},
			formCfg126: [
				{
					title: '默认值',
					type: 'custom',
					dataIndex: 'defaultCount',
				},
				{
					type: 'custom',
					dataIndex: 'intervalListItems',
					unformItem: true,
				},
			],
			dialogTitle127: '新增规则',
			dialogWidth127: '600px',
			dialogVisible127: false,
			dialogBottomBtn127: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog127.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveInterval()
							}
						})
					},
				},
			],
			dialogTitle126: '保费设置',
			dialogWidth126: '600px',
			dialogVisible126: false,
			dialogBottomBtn126: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.savePremium()
					},
				},
			],
			loading: false,
			tableData101: [],
			tableColumns101: [
				{
					type: 'string',
					dataIndex: 'ruleValue',
					title: '客户群',
					customRender: ({ ruleValue }) => {
						return ruleValue ? '规则' + ruleValue : '默认值'
					},
				},
				{
					type: 'string',
					dataIndex: 'itemType',
					title: '订单售后率区间',
					customRender: ({ startValue, endValue, orderNum, itemType }) => {
						if (itemType == 2) {
							return startValue + '% - ' + endValue + '%'
						} else {
							return !orderNum && orderNum != 0
								? '-'
								: '订单数出' + orderNum + '单内'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'equityAmount',
					title: '保费',
					customRender: ({ equityAmount }) => {
						return !equityAmount && equityAmount != 0
							? '-'
							: '¥' + equityAmount.toFixed(2)
					},
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
		}
	},

	methods: {
		premiumSetBtn() {
			this.formData126 = {
				defaultCount: '',
				defaultYuan: '',
			}
			this.intervalList = []
			this.dialogVisible126 = true
		},
		savePremium: async function () {
			let defaultCount = this.formData126.defaultCount
			let defaultYuan = this.formData126.defaultYuan
			//订单数从1-100
			if (defaultCount && !(defaultCount * 1 <= 100 && defaultCount * 1 >= 1)) {
				return this.$message.error('订单数为1-100数字')
			}
			//保费大于0
			if (defaultYuan && defaultYuan * 1 <= 0) {
				return this.$message.error('保费大于0')
			}
			if (
				!this.intervalList.length ||
				this.intervalList[this.intervalList.length - 1].endValue != 100
			) {
				return this.$message.error('请完整填写规则')
			}
			let defaultPremium = { itemType: 1, ruleValue: 0 } //默认的保费
			let equityConfigNewList = [] //保存规则
			// 默认规则，需要全写才全传,不全传空
			if (defaultCount && defaultYuan) {
				defaultPremium.orderNum = defaultCount
				defaultPremium.equityAmount = defaultYuan
			} else {
				defaultPremium.orderNum = ''
				defaultPremium.equityAmount = ''
			}
			equityConfigNewList.push(defaultPremium)
			this.intervalList.map((item, index) => {
				let rluePremium = { itemType: 2 } //规则的保费
				rluePremium.ruleValue = index + 1
				rluePremium.startValue = item.startValue
				rluePremium.endValue = item.endValue
				rluePremium.equityAmount = item.equityAmount
				equityConfigNewList.push(rluePremium)
			})
			let {
				data: { resultCode },
			} = await equityConfig({ equityConfigList: equityConfigNewList })
			if (resultCode == 0) {
				this.init()
				this.dialogVisible126 = false
			}
		},
		saveInterval() {
			let Obj = JSON.parse(JSON.stringify(this.formData127))
			let perInterVal = 0
			if (this.intervalList.length) {
				Obj.startValue =
					this.intervalList[this.intervalList.length - 1].endValue
				perInterVal = this.intervalList[this.intervalList.length - 1].endValue
			} else {
				Obj.startValue = 0
			}
			if (Obj.equityAmount < (perInterVal + Obj.endValue) / 25) {
				this.$confirm(
					'保费金额设置低于盈亏平衡点，存在亏损风险。确认要提交吗？',
					'提示',
					{
						type: 'warning',
						callback: async (action) => {
							if (action === 'confirm') {
								this.intervalList.push(Obj)
								this.dialogVisible127 = false
							}
						},
					}
				)
			} else {
				this.intervalList.push(Obj)
				this.dialogVisible127 = false
			}
		},
		addInterval() {
			this.formData127 = {
				endValue: '',
				equityAmount: '',
			}
			this.dialogVisible127 = true
		},
		async init() {
			this.loading = true
			let {
				data: { resultCode, resultData },
			} = await equityConfigList()
			this.loading = false
			if (resultCode == 0) {
				this.tableData101 = resultData.equityConfigList
			} else {
				this.tableData101 = []
			}
		},
	},
}
</script>
<style scoped>
.validity-day {
	width: 100px;
	margin: 0 10px;
}
.goods-group-btn-box {
	margin-bottom: 20px;
}
</style>
