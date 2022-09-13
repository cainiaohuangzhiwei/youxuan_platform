<template>
	<el-dialog
		width="550px"
		v-loading="loading"
		:title="ruleForm.actSaleRewardId ? '编辑活动' : '新增活动'"
		:close-on-click-modal="false"
		:visible.sync="localVisible"
		:before-close="resetForm"
		@open="open"
	>
		<el-form
			ref="ruleForm"
			label-width="106px"
			label-position="left"
			:rules="rules"
			:model="ruleForm"
		>
			<el-form-item label="活动名称" prop="activityName">
				<el-input
					v-model="ruleForm.activityName"
					placeholder="请输入活动名称"
				/>
			</el-form-item>
			<el-form-item label="活动类型" prop="activityType">
				<el-radio-group :disabled="isHandle" v-model="ruleForm.activityType">
					<el-radio label="1">连续型奖励</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="活动时间" prop="time">
				<el-date-picker
					class="date-width"
					v-model="ruleForm.time"
					:disabled="isHandle"
					type="datetimerange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					value-format="timestamp"
					:default-time="['00:00:00', '23:59:59']"
				/>
			</el-form-item>
			<el-form-item label="奖励截止时间" prop="deadline">
				<el-date-picker
					class="date-width"
					type="datetime"
					v-model="ruleForm.deadline"
					:disabled="isHandle"
					placeholder="选择日期时间"
					value-format="timestamp"
				/>
			</el-form-item>
			<div
				class="award"
				v-for="(item, index) in ruleForm.rewardRuleList"
				:key="index"
			>
				<h4 class="award__title">
					设置奖励范围及奖励内容—子活动{{ index + 1 }}
				</h4>
				<el-form-item
					label="完成指标"
					:prop="`rewardRuleList.${index}.finishType`"
					:rules="rules.rewardRuleList.finishType"
				>
					<el-select
						class="wg-width"
						v-model="item.finishType"
						:disabled="isHandle"
						placeholder="请选择完成指标"
					>
						<el-option
							v-for="item in finishTypeOption"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item
					label="参与范围"
					:prop="`rewardRuleList.${index}.targetType`"
					:rules="rules.rewardRuleList.targetType"
				>
					<el-select
						class="award__scope"
						v-model="item.targetType"
						:disabled="isHandle"
						placeholder="请选择参与范围"
					>
						<el-option
							v-for="item in targeTypeOption"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
					<el-button
						v-if="!isHandle && item.targetType == 1"
						type="text"
						@click="addGoods(index)"
						>添加商品</el-button
					>
					<span
						v-if="
							item.targetDataList.filter((item) => item.targetType === 1)
								.length > 0 && item.targetType == 1
						"
						>（已选
						{{
							item.targetDataList.filter((item) => item.targetType === 1).length
						}}
						件商品）</span
					>
					<el-button
						v-if="!isHandle && item.targetType == 3"
						type="text"
						@click="addBrand(index)"
						>添加品牌</el-button
					>
					<span
						v-if="
							item.targetDataList.filter((item) => item.targetType === 3)
								.length > 0 && item.targetType == 3
						"
						>（已选
						{{
							item.targetDataList.filter((item) => item.targetType === 3).length
						}}
						个品牌）</span
					>
				</el-form-item>
				<el-form-item
					label="奖励区间"
					:prop="`rewardRuleList.${index}.start`"
					:rules="rules.rewardRuleList.start"
				>
					<div>
						<el-input
							class="award__input"
							v-model="item.start"
							:disabled="true"
							@input="
								() => {
									awardIndex = index
								}
							"
							placeholder="奖励开始区间"
							onkeyup="value=value.replace(/[^\d]/g,'')"
						/>
						~
						<el-input
							class="award__input wg-mr10"
							v-model="item.end"
							:disabled="isHandle"
							placeholder="奖励结束区间"
							onkeyup="value=value.replace(/[^\d]/g,'')"
						/>
					</div>
				</el-form-item>
				<el-form-item
					label="奖励内容"
					:prop="`rewardRuleList.${index}.rewardTypes`"
					:rules="rules.rewardRuleList.rewardTypes"
				>
					<el-checkbox-group
						v-model="item.rewardTypes"
						:disabled="isHandle"
						@change="
							() => {
								awardContentIndex = index
							}
						"
					>
						<div>
							<el-checkbox label="1" name="fixedAmount">固定金额</el-checkbox>
							<el-input
								class="award__input wg-ml10"
								v-model="item.fixedAmount"
								:disabled="isHandle"
								@keyup.native="value = provingFixedAmount(index, 'fixedAmount')"
							/>
							<span class="award__price">元</span>
						</div>
						<div>
							<el-checkbox label="2" name="commissionFactor"
								>佣金系数</el-checkbox
							>
							<el-input
								class="award__input wg-ml10"
								v-model="item.commissionFactor"
								:disabled="isHandle"
								@keyup.native="
									value = provingFixedAmount(index, 'commissionFactor')
								"
							/>
						</div>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item
					class="award__btn"
					v-if="ruleForm.activityState == '未开始' || !ruleForm.activityState"
				>
					<el-button type="primary" icon="el-icon-plus" @click="newActivity"
						>新增子活动</el-button
					>
					<el-button
						type="danger"
						icon="el-icon-delete"
						v-if="index !== 0"
						@click="delActivity(index)"
						>删除</el-button
					>
				</el-form-item>
			</div>
			<el-form-item>
				<el-button type="primary" @click="submitForm">确定</el-button>
				<el-button @click="resetForm">取消</el-button>
			</el-form-item>
		</el-form>

		<GoodsDialog
			ref="goodsList"
			:visible.sync="goodsDialog"
			@handleGoods="handleGoods"
		/>
		<BrandDialog
			:visible.sync="brandDialog"
			:brandDialogFirstopen.sync="brandDialogFirstopen"
			:brandActRewardRuleTargetList="brandActRewardRuleTargetList"
			@handleBrand="handleBrand"
			:brandIndex="goodsIndex"
		/>
	</el-dialog>
</template>

<script>
import {
	createActSaleReward,
	editActSaleReward,
	viewActSaleReward,
} from '@/api/userRewardSystem'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		GoodsDialog: () => import('./GoodsDialog'),
		BrandDialog: () => import('./BrandDialog'),
	},

	data() {
		return {
			awardIndex: '',
			awardContentIndex: '',
			loading: false,
			goodsDialog: false,
			brandDialog: false,
			brandDialogFirstopen: true,
			goodsIndex: '',
			finishTypeOption: this.$store.state.app.constant.FINISH_TYPE,
			targeTypeOption: this.$store.state.app.constant.TARGE_TYPE,
			goods: {
				goodsList: [],
				supplierList: [],
				supplierBOList: [],
			},
			brandActRewardRuleTargetList: [],
			ruleForm: {
				activityState: '',
				activityName: '',
				activityType: '1',
				time: '',
				startTime: '',
				endTime: '',
				deadline: '',
				actSaleRewardId: '',
				rewardRuleList: [
					{
						finishType: 1,
						targetType: 1,
						start: 1,
						end: '',
						rewardTypes: [],
						fixedAmount: '',
						commissionFactor: '',
						targetDataList: [],
						supplierName: [],
						supplierIds: [],
					},
				],
			},
			ruleFormTemp: {},
			rules: {
				activityName: [
					{ required: true, message: '请输入活动名称', trigger: 'blur' },
				],
				time: [
					{ required: true, message: '请选择活动参与时间', trigger: 'change' },
				],
				deadline: [
					{ required: true, message: '请选择奖励截止时间', trigger: 'change' },
				],
				rewardRuleList: {
					finishType: [
						{ required: true, message: '请选择完成指标', trigger: 'change' },
					],
					targetType: [
						{ required: true, message: '请选择参与范围', trigger: 'change' },
					],
				},
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
		isHandle() {
			return (
				(this.ruleForm.activityState &&
					this.ruleForm.activityState != '未开始') ||
				false
			)
		},
	},

	methods: {
		async _viewActSaleReward(row) {
			this.loading = true
			const params = {
				withTargetDetail: true,
				actSaleRewardId: row.actSaleRewardId,
			}
			const {
				data: { resultCode, resultData },
			} = await viewActSaleReward(params)

			if (resultCode == 0) {
				let targetDataList = []
				const tempRewardRuleList = []
				resultData.time = [resultData.startTime, resultData.endTime]
				const rewardRuleList = resultData.rewardRuleList
				this.goods = rewardRuleList
				this.ruleFormTemp = resultData

				for (let i = 0; i < rewardRuleList.length; i++) {
					const item = rewardRuleList[i].actRewardRuleTargetList
					const rewardDetailListBOList =
						rewardRuleList[i].rewardDetailListBOList

					for (let j = 0; j < item.length; j++) {
						if (item[j].targetId && item[j].targetType == 1) {
							// targetDataList.push(item[j].targetId)
							targetDataList.push({
								targetType: 1,
								targetId: item[j].targetId,
								supplierId: item[j].supplierId,
							})
						} else if (item[j].targetId && item[j].targetType == 3) {
							// targetDataList.push(item[j].targetId)
							targetDataList.push({
								targetType: 3,
								targetId: item[j].targetId,
								supplierId: item[j].supplierId,
							})
						}
					}
					if (rewardDetailListBOList[0].rewardTypes == 1) {
						rewardDetailListBOList[0].rewardTypes = ['1']
					} else if (rewardDetailListBOList[0].rewardTypes == 2) {
						rewardDetailListBOList[0].rewardTypes = ['2']
					} else if (
						rewardDetailListBOList[0].rewardTypes == '1,2' ||
						rewardDetailListBOList[0].rewardTypes == '2,1'
					) {
						rewardDetailListBOList[0].rewardTypes = ['1', '2']
					}
					tempRewardRuleList.push({
						finishType: rewardRuleList[i].finishType,
						targetType: rewardRuleList[i].targetType,
						targetDataList: targetDataList,
						start: rewardDetailListBOList[0].start,
						end: rewardDetailListBOList[0].end,
						rewardTypes: rewardDetailListBOList[0].rewardTypes,
						fixedAmount:
							rewardDetailListBOList[0].fixedAmount == 0
								? ''
								: rewardDetailListBOList[0].fixedAmount,
						commissionFactor:
							rewardDetailListBOList[0].commissionFactor == 0
								? ''
								: rewardDetailListBOList[0].commissionFactor,
					})
					targetDataList = []
				}
				this.ruleForm = {
					activityState: row.activityState,
					activityName: resultData.activityName,
					activityType: resultData.activityType.toString(),
					time: resultData.time,
					deadline: resultData.deadline,
					actSaleRewardId: resultData.actSaleRewardId,
					rewardRuleList: tempRewardRuleList,
				}
			}
			this.loading = false
		},

		async _createActSaleReward(params) {
			this.loading = true
			const {
				data: { resultCode, resultMsg },
			} = await createActSaleReward(params)

			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.resetForm()
				this.$emit('fatherMethodOne')
			}
			this.loading = false
		},

		async _editActSaleReward(params) {
			this.loading = true
			params.actSaleRewardId = this.ruleForm.actSaleRewardId
			const {
				data: { resultCode, resultMsg },
			} = await editActSaleReward(params)

			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.resetForm()
				this.$emit('fatherMethodOne')
			}
			this.loading = false
		},

		newActivity() {
			this.ruleForm.rewardRuleList.push({
				finishType: 1,
				targetType: 1,
				start: 1,
				end: '',
				rewardTypes: [],
				fixedAmount: '',
				commissionFactor: '',
				targetDataList: [],
				supplierName: [],
				supplierIds: [],
			})
		},

		handleParams(params) {
			const tempRewardRuleList = []
			for (let i = 0; i < params.rewardRuleList.length; i++) {
				tempRewardRuleList.push({
					finishType: params.rewardRuleList[i].finishType,
					targetType: params.rewardRuleList[i].targetType,
					targetDataList: params.rewardRuleList[i].targetDataList,
					rewardRuleDetailList: [
						{
							start: params.rewardRuleList[i].start,
							end: params.rewardRuleList[i].end,
							rewardTypes: params.rewardRuleList[i].rewardTypes,
							fixedAmount: params.rewardRuleList[i].fixedAmount,
							commissionFactor: params.rewardRuleList[i].commissionFactor,
						},
					],
				})
			}
			const paramsData = {
				actRewardType: 1,
				activityName: params.activityName,
				activityType: params.activityType,
				deadline: params.deadline,
				startTime: params.time[0],
				endTime: params.time[1],
				rewardRuleList: tempRewardRuleList,
			}
			return paramsData
		},

		submitForm() {
			this.$refs['ruleForm'].validate((valid) => {
				if (valid) {
					const curveTime = Date.parse(new Date())
					const params = JSON.parse(JSON.stringify(this.ruleForm))

					if (this.ruleForm.activityState != '进行中') {
						if (params.time[0] < curveTime) {
							return this.$message.warning('开始时间不能小于当前时间')
						}
						if (params.time[1] > params.deadline) {
							return this.$message.warning('奖励截止时间不能小于活动结束时间')
						}
					}

					const goodsIds = []
					for (let i = 0; i < params.rewardRuleList.length; i++) {
						const itemSection = params.rewardRuleList[i]
						if (itemSection.start == 0 || itemSection.end == 0) {
							return this.$message.warning('奖励区间不能为0')
						}
						if (!itemSection.start || !itemSection.end) {
							return this.$message.warning('请输入奖励区间')
						}
						if (itemSection.targetDataList.length == 0) {
							return this.$message.warning('请添加商品或品牌')
						}
						for (let j = 0; j < itemSection.targetDataList.length; j++) {
							goodsIds.push(itemSection.targetDataList[j])
						}
					}
					if (this.checkRepeat(goodsIds, 1)) {
						return this.$message.warning('相同商品不能参加多个子活动')
					}
					if (this.checkRepeat(goodsIds, 3)) {
						return this.$message.warning('相同品牌不能参加多个子活动')
					}

					for (let i = 0; i < params.rewardRuleList.length; i++) {
						const item = params.rewardRuleList[i]
						if (item.rewardTypes.length == 0) {
							return this.$message.warning('请选择奖励内容')
						}

						if (item.rewardTypes.length == 2) {
							if (!item.fixedAmount && !item.commissionFactor) {
								return this.$message.warning('奖励内容不能为空')
							}
							if (item.fixedAmount == 0) {
								item.fixedAmount = ''
							}
							if (item.commissionFactor == 0) {
								item.commissionFactor = ''
							}
						}

						if (item.rewardTypes.length == 1) {
							if (item.rewardTypes.includes('1')) {
								if (!item.fixedAmount) {
									return this.$message.warning('请输入固定金额')
								} else if (item.fixedAmount == 0) {
									return this.$message.warning(
										'固定金额需大于0，最多到小数点1位'
									)
								}
							}
							if (item.rewardTypes.includes('2')) {
								if (!item.commissionFactor) {
									return this.$message.warning('请输入佣金系数')
								} else if (item.commissionFactor == 0) {
									return this.$message.warning(
										'佣金系数需大于0，最多到小数点1位'
									)
								}
							}
						}
						if (item.rewardTypes.length == 1) {
							if (item.rewardTypes.includes('1') && item.commissionFactor) {
								item.commissionFactor = ''
							}
							if (item.rewardTypes.includes('2') && item.fixedAmount) {
								item.fixedAmount = ''
							}
						}

						if (item.rewardTypes.length == 2) {
							if (!item.fixedAmount && item.commissionFactor) {
								item.rewardTypes = ['2']
							} else if (!item.commissionFactor && item.fixedAmount) {
								item.rewardTypes = ['1']
							}
							if (item.fixedAmount == 0) {
								item.fixedAmount = ''
							} else if (item.commissionFactor == 0) {
								item.commissionFactor = ''
							}
						}
						item.rewardTypes = item.rewardTypes.sort().toString()
					}
					const paramsData = this.handleParams(params)

					if (!this.ruleForm.actSaleRewardId) {
						this._createActSaleReward(paramsData)
					} else {
						this._editActSaleReward(paramsData)
					}
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		checkRepeat(goodsIds, type) {
			let checkRepeat = []
			checkRepeat = goodsIds.filter((item) => {
				return item.targetType == type
			})
			checkRepeat = checkRepeat.sort((a, b) => {
				return a.targetId - b.targetId
			})
			for (let i = 0; i < checkRepeat.length; i++) {
				if (
					checkRepeat[i + 1] &&
					checkRepeat[i].targetId == checkRepeat[i + 1].targetId &&
					checkRepeat[i].supplierId == checkRepeat[i + 1].supplierId
				) {
					return true
				}
			}
			return false
		},

		delActivity(index) {
			this.ruleForm.rewardRuleList.splice(index, 1)
		},

		resetForm() {
			this.localVisible = false
			setTimeout(() => {
				this.goodsIndex = ''
				this.ruleForm.activityState = ''
				this.ruleForm.actSaleRewardId = ''
				this.ruleForm.rewardRuleList = [
					{
						finishType: 1,
						targetType: 1,
						start: 1,
						end: '',
						rewardTypes: [],
						fixedAmount: '',
						commissionFactor: '',
						targetDataList: [],
						supplierName: [],
						supplierIds: [],
					},
				]
				this.$refs['ruleForm'].resetFields()
			}, 200)
		},
		open() {
			this.brandDialogFirstopen = true
		},
		handleGoods(data) {
			this.ruleForm.rewardRuleList[
				this.goodsIndex
			].targetDataList = data.goodsId.map((item) => {
				return {
					targetType: 1,
					targetId: item.goodsId,
					supplierId: item.supplierId,
				}
			})
			this.ruleForm.rewardRuleList[this.goodsIndex].supplierName =
				data.supplierName
			this.ruleForm.rewardRuleList[this.goodsIndex].supplierIds =
				data.supplierIds
		},
		handleBrand(data) {
			this.ruleForm.rewardRuleList[this.goodsIndex].targetDataList = data.map(
				(item) => {
					return {
						targetType: 3,
						targetId: item.targetId,
						supplierId: item.supplierId,
					}
				}
			)
		},

		provingFixedAmount(e, value) {
			// 先把非数字的都替换掉，除了数字和.
			this.ruleForm.rewardRuleList[e][value] = this.ruleForm.rewardRuleList[e][
				value
			].replace(/[^\d.]/g, '')
			// 必须保证第一个为数字而不是.
			this.ruleForm.rewardRuleList[e][value] = this.ruleForm.rewardRuleList[e][
				value
			].replace(/^\./g, '')
			// 保证只有出现一个.而没有多个.
			this.ruleForm.rewardRuleList[e][value] = this.ruleForm.rewardRuleList[e][
				value
			].replace(/\.{2,}/g, '')
			// 保证.只出现一次，而不能出现两次以上
			this.ruleForm.rewardRuleList[e][value] = this.ruleForm.rewardRuleList[e][
				value
			]
				.replace('.', '$#$')
				.replace(/\./g, '')
				.replace('$#$', '.')
			let index = -1
			for (let i in this.ruleForm.rewardRuleList[e][value]) {
				if (this.ruleForm.rewardRuleList[e][value][i] === '.') {
					index = i
				}
				if (index !== -1) {
					if (i - index > 2) {
						this.ruleForm.rewardRuleList[e][
							value
						] = this.ruleForm.rewardRuleList[e][value].substring(
							0,
							this.ruleForm.rewardRuleList[e][value].length - 1
						)
					}
				}
			}
		},

		addGoods(index) {
			this.goodsDialog = true
			const type = !this.ruleForm.actSaleRewardId ? 1 : 2
			this.$nextTick(() => {
				this.$refs.goodsList.details(
					type,
					type == 2 && this.goods[index]
						? this.goods[index].supplierBOList
						: [],
					this.ruleForm.rewardRuleList[index].targetDataList,
					this.ruleForm.rewardRuleList[index].supplierName,
					this.ruleForm.rewardRuleList[index].supplierIds
				)
			})
			this.goodsIndex = index
		},
		addBrand(index) {
			if (this.ruleForm.actSaleRewardId) {
				this.brandActRewardRuleTargetList = this.ruleFormTemp.rewardRuleList[
					index
				]
			} else {
				this.brandActRewardRuleTargetList = {}
			}
			this.goodsIndex = index
			this.brandDialog = true
		},
	},
}
</script>

<style lang="scss" scoped>
.award {
	padding: 0 10px;
	border-radius: 6px;
	border: 1px solid #ccc;
	margin-bottom: 15px;

	&__title {
		font-size: 18px;
	}

	&__scope {
		width: 160px;
		margin-right: 20px;
	}

	&__input {
		width: 110px;
	}

	&__price {
		font-size: 14px;
		margin-left: 10px;
	}

	&__btn {
		display: flex;
		justify-content: flex-end;
	}
}

.date-width {
	width: 100%;
}
</style>
