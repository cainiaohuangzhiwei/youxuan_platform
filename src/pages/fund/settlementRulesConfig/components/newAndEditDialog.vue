<template>
	<div>
		<el-dialog
			width="750px"
			:title="title"
			append-to-body
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="init"
		>
			<div v-loading="checkLoading">
				<div v-if="itemInfo && itemInfo.supplierId" class="check-list">
					<h3>商家名称：{{ itemInfo.supplierName }}</h3>
					<h4>现行结算规则：</h4>
					<p v-for="(item, index) in merchantSettleRuleItemList" :key="index">
						{{ index === 0 ? '规则一：' : '规则二：'
						}}{{ substrIt(item.ruleOrderState) }}；{{
							item.ruleDays
						}}天；结算比例{{ item.ruleSettleProportion }}%
					</p>
				</div>
				<yx-form
					labelWidth="120px"
					ref="form"
					:inline="false"
					:items="item"
					:data="searchData"
					:rules="funRules"
					:formAction="funAction"
				>
					<template #supplierName>
						<el-input
							v-model="searchData.supplierName"
							placeholder="请选择商家"
							value-key="supplierName"
							label="supplierName"
							@focus="selectSupplier"
							clearable
							@clear="
								() => {
									searchData.supplierName = ''
									searchData.supplierId = ''
								}
							"
						>
							<el-button
								slot="append"
								icon="el-icon-more"
								@click="formsDialog = true"
							></el-button>
						</el-input>
					</template>
					<template #rules>
						<div class="rules-list" v-if="searchData.number">
							<div
								class="rules-box"
								v-if="searchData.number === 1 || searchData.number === 2"
							>
								<div class="rules-title">规则一：</div>
								<span class="rules-item">
									状态
									<el-select
										v-model="ruleOne.type"
										placeholder="请选择"
										style="width: 160px"
										@change="typeChange"
									>
										<el-option
											v-for="item in stutas"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
								</span>
								<span class="rules-item">
									<el-select
										v-model="ruleOne.day"
										placeholder="请选择"
										style="width: 90px"
										@change="dayChange"
									>
										<el-option
											v-for="item in days"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
									天
								</span>

								<span class="rules-item">
									<div v-if="searchData.number === 1">结算比例：100%</div>
									<div v-else>
										结算比例：<el-select
											v-model="ruleOne.persent"
											placeholder="请选择"
											style="width: 90px"
										>
											<el-option
												v-for="item in persent"
												:key="item.value"
												:label="item.label"
												:value="item.value"
											>
											</el-option>
										</el-select>
									</div>
								</span>
							</div>
							<div class="rules-box" v-if="searchData.number === 2">
								<div class="rules-title">规则二：</div>
								<span class="rules-item">
									状态
									<el-select
										v-model="ruleTwo.type"
										placeholder="请选择"
										style="width: 160px"
										@change="typeTwoChange"
									>
										<el-option
											v-for="(item, index) in stutas"
											:key="item.value"
											:label="item.label"
											:value="item.value"
											:disabled="ruleOne.type > index + 1 || !ruleOne.type"
										>
										</el-option>
									</el-select>
								</span>
								<span class="rules-item">
									<el-select
										v-model="ruleTwo.day"
										placeholder="请选择"
										style="width: 90px"
									>
										<el-option
											v-for="(item, index) in days"
											:key="item.value"
											:label="item.label"
											:value="item.value"
											:disabled="
												!ruleOne.type ||
												!ruleOne.day ||
												(ruleOne.type === ruleTwo.type && ruleOne.day > index)
											"
										>
										</el-option>
									</el-select>
									天
								</span>

								<span class="rules-item">
									<div>结算比例：剩余结算</div>
								</span>
							</div>
						</div>
						<div v-else>请选择账期数量后，再配置结算规则</div>
					</template>
				</yx-form>

				<!-- 商家/商家列表 -->
				<supply-dialog
					:itemInfo="supplyRow"
					:visible.sync="formsDialog"
					@fatherMethodInit="
						(row) => {
							searchData.supplierName = row.supplierName
							searchData.supplierId = row.supplierId
							this.$refs.form.$refs.YxForm.clearValidate('supplierName')
						}
					"
				/>
				<!-- 确认按钮 -->
				<el-dialog
					width="250"
					title=""
					:visible.sync="showSubmit"
					@close="resetTimer"
					append-to-body
				>
					<div v-if="showSubmit">
						<div v-if="itemInfo && itemInfo.supplierName">
							更改后的结算规则将对{{
								moment(moment().endOf('day').valueOf() + 1).format('yyyy-MM-DD')
							}}
							00:00:00（即明天）开始产生的订单生效，请再次确认“{{
								itemInfo.supplierName
							}}”修改的结算规则如下：
						</div>
						<div v-else>
							结算规则不可随意更改，首次配置后将立刻对该商家接下来产生的订单生效。请再次确认“{{
								searchData.supplierName
							}}”结算规则如下：
						</div>
						<div class="rules-submit-item">
							规则一： {{ substrIt(ruleOne.type) }}；{{
								ruleOne.day
							}}天；结算：{{ searchData.number === 1 ? 100 : ruleOne.persent }}%
						</div>
						<div class="rules-submit-item" v-if="searchData.number === 2">
							规则二： {{ substrIt(ruleTwo.type) }}；{{
								ruleTwo.day
							}}天；结算：{{ 100 - ruleOne.persent }}%
						</div>
					</div>

					<div slot="footer" class="dialog-footer">
						<el-button @click="showSubmit = false">取 消</el-button>
						<el-button
							v-loading="btnLoading"
							:disabled="!submitTurn || btnLoading"
							type="primary"
							@click="submitForm"
							>确 定
							<span v-if="!submitTurn">{{ submitTime }}s</span></el-button
						>
					</div>
				</el-dialog>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import SupplyDialog from '@/components/SupplyDialog'
import moment from 'moment'
import {
	merchantSettleRuleAdd,
	merchantSettleRuleEdit,
	merchantSettleRuleView,
} from '@/api/orderSettle'
import { getConstantValueByKey } from '@/utils/helper/common'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		itemInfo: {
			type: Object,
			default: () => ({}),
		},
	},

	components: {
		YxForm,
		SupplyDialog,
	},

	data() {
		return {
			moment,
			title: '规则配置',
			merchantSettleRuleItemList: [],
			checkLoading: false,
			btnLoading: false,
			showSubmit: false,
			submitTurn: false,
			// submitTimer: null,
			submitTime: 3,
			formsDialog: false,
			//规则状态
			stutas: this.$store.state.app.constant.RULE_ORDER_STATE,
			//规则天
			days: [],
			//结算比例
			persent: [],
			ruleOne: {
				type: '',
				day: '',
				persent: '',
			},
			ruleTwo: {
				type: '',
				day: '',
				persent: '',
			},
			item: [
				{
					type: 'custom',
					title: '商家名称',
					hide: false,
					dataIndex: 'supplierName',
				},
				{
					type: 'select',
					title: '账期数量配置',
					dataIndex: 'number',
					placeholder: '请选择账期数量',
					options: [
						{
							number: 1,
							value: 1,
						},
						{
							number: 2,
							value: 2,
						},
					],
					change: (e) => {
						//选择配置数量为1时。清空2
						if (e === 1) {
							this.ruleTwo = {
								type: '',
								day: '',
								persent: '',
							}
						}
					},
				},

				{
					type: 'custom',
					title: '',
					dataIndex: 'rules',
				},
			],
			funRules: {
				supplierName: [
					{ required: true, message: '请选择商家!', trigger: 'blur' },
				],
				number: [
					{ required: true, message: '请选择账期数量!', trigger: 'blur' },
				],
			},
			searchData: {
				supplierName: '',
				supplierAccountNumberId: '',
				number: '',
			},
			tableColumns: [
				{
					width: 200,
					type: 'custom',
					dataIndex: 'supplierAccountNumberId',
				},
				{
					dataIndex: 'supplierName',
					title: '商家',
				},
			],

			funAction: [
				{
					title: '取消',
					type: 'cancel',
					cancel: true,
					click: () => {
						this.resetForm()
					},
				},
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.confirmFun()
					},
				},
			],
		}
	},
	created() {
		let days = []
		let persent = []
		for (let i = 1; i < 100; i++) {
			if (i <= 31) {
				//获取1--20天
				days.push({
					value: i,
					label: JSON.stringify(i),
				})
			}
			//获取1--99%
			persent.push({
				value: i,
				label: i + '%',
			})
		}
		this.days = days
		this.persent = persent
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
		init() {
			if (this.itemInfo.supplierId) {
				this.title = '规则更改'
				this.item[0].hide = true
				this.item[1].title = '账期数量调整'
				this.getCheckMsg()
			}
		},
		substrIt(label) {
			let newLabel = getConstantValueByKey(
				this.$store.state.app.constant.RULE_ORDER_STATE,
				label,
				'-',
				'value',
				'label'
			)
			return newLabel.substr(3, newLabel.length)
		},
		async getCheckMsg() {
			this.checkLoading = true // 查看银行信息加载
			let {
				data: {
					resultCode,
					resultData: { merchantSettleRuleItemList = [] },
				},
			} = await merchantSettleRuleView({
				merchantSettleRuleId: this.itemInfo.merchantSettleRuleId,
			})
			this.checkLoading = false
			if (resultCode == 0) {
				this.merchantSettleRuleItemList = merchantSettleRuleItemList
			}
		},
		typeChange(e) {
			// 如果规则一状态发生改变，状态二选择的等级高于重新选择的状态一，重置状态二
			if (this.ruleTwo.type < e) {
				this.ruleTwo.type = ''
			}
		},
		typeTwoChange() {
			if (
				this.ruleTwo.day <= this.ruleOne.day &&
				this.ruleOne.type === this.ruleTwo.type
			) {
				this.ruleTwo.day = ''
			}
		},
		dayChange(e) {
			if (this.ruleTwo.day <= e && this.ruleOne.type === this.ruleTwo.type) {
				this.ruleTwo.day = ''
			}
		},
		selectSupplier(e) {
			e.target.blur()
			this.formsDialog = true
		},
		// 关闭弹窗
		resetForm() {
			//重置
			this.localVisible = false
			this.showSubmit = false
			this.$refs.form.$refs.YxForm.clearValidate()
			this.ruleOne = {
				type: '',
				day: '',
				persent: '',
			}
			this.ruleTwo = {
				type: '',
				day: '',
				persent: '',
			}
			this.title = '规则配置'
			this.item[0].hide = false
			this.item[1].title = '账期数量配置'
			this.merchantSettleRuleItemList = []
			this.searchData = {
				supplierName: '',
				supplierAccountNumberId: '',
				number: '',
			}
		},
		confirmFun() {
			if (this.searchData.number === 1) {
				if (!this.ruleOne.type) {
					this.$message.warning('请选择规则一状态！')
					return
				}
				if (!this.ruleOne.day) {
					this.$message.warning('请选择规则一天数！')
					return
				}
			}
			if (this.searchData.number === 2) {
				if (!this.ruleOne.type) {
					this.$message.warning('请选择规则一状态！')
					return
				}
				if (!this.ruleOne.day) {
					this.$message.warning('请选择规则一天数！')
					return
				}
				if (!this.ruleOne.persent) {
					this.$message.warning('请选择规则一结算比例！')
					return
				}
				if (!this.ruleTwo.type) {
					this.$message.warning('请选择规则二状态！')
					return
				}
				if (!this.ruleTwo.day) {
					this.$message.warning('请选择规则二天数！')
					return
				}
			}
			this.showSubmit = true
			this.submitTurn = true
			// 防止死循环
			// if (this.submitTimer) clearInterval(this.submitTimer)
			// this.submitTimer = setInterval(() => {
			// 	if (this.submitTime > 0) {
			// 		this.submitTime--
			// 	} else {
			// 		this.submitTurn = true
			// 		clearInterval(this.submitTimer) // 清除定时器
			// 		this.submitTimer = null
			// 		this.submitTime = 3
			// 	}
			// }, 1000)
		},
		resetTimer() {
			// if (this.submitTimer) clearInterval(this.submitTimer)
			this.submitTurn = false
			// this.submitTimer = null
			this.submitTime = 3
		},
		// 确定
		async submitForm() {
			this.btnLoading = true
			let merchantRuleList = []
			if (this.searchData.number === 1) {
				merchantRuleList = [
					{
						ruleType: 1,
						ruleOrderState: this.ruleOne.type,
						ruleDays: this.ruleOne.day,
						ruleSettleProportion: 100,
					},
				]
			} else if (this.searchData.number === 2) {
				merchantRuleList = [
					{
						ruleType: 1,
						ruleOrderState: this.ruleOne.type,
						ruleDays: this.ruleOne.day,
						ruleSettleProportion: this.ruleOne.persent,
					},
					{
						ruleType: 2,
						ruleOrderState: this.ruleTwo.type,
						ruleDays: this.ruleTwo.day,
						ruleSettleProportion: 100 - this.ruleOne.persent,
					},
				]
			}
			if (this.itemInfo.supplierId) {
				let {
					data: { resultCode },
				} = await merchantSettleRuleEdit({
					supplierId: this.itemInfo.supplierId,
					merchantRuleList: merchantRuleList,
				})
				this.btnLoading = false
				if (resultCode == 0) {
					this.$message.success('编辑成功')
					this.$emit('fatherMethodInit')
					this.resetForm()
				} else {
					this.resetForm()
				}
			} else {
				let {
					data: { resultCode },
				} = await merchantSettleRuleAdd({
					supplierId: this.searchData.supplierId,
					merchantRuleList: merchantRuleList,
				})
				this.btnLoading = false
				if (resultCode == 0) {
					this.$message.success('新增成功')
					this.$emit('fatherMethodInit')
					this.resetForm()
				} else {
					this.resetForm()
				}
			}
		},
	},
	destroyed() {
		// if (this.submitTimer) clearInterval(this.submitTimer)
	},
}
</script>

<style lang="scss" scoped>
.btn {
	text-align: right;
}
.rules-list {
	position: relative;
	.rules-title {
		position: absolute;
		left: -80px;
	}
	.rules-box {
		margin-bottom: 15px;
	}
	.rules-item {
		display: inline-block;
		margin-right: 20px;
	}
}
.rules-submit-item {
	margin-top: 10px;
}
.check-list {
	position: relative;
	top: -30px;
	h3 {
		font-weight: normal;
		font-size: 15px;
		margin: 5px 0;
		color: #333;
	}
	h4 {
		font-size: 14px;
		margin: 12px 0 5px;
		color: #333;
	}
}
</style>
