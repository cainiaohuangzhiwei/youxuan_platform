<template>
	<div>
		<el-dialog
			width="60%"
			:title="`${title}`"
			:visible.sync="localVisible"
			:before-close="resetForm"
			@open="open"
			:close-on-click-modal="false"
		>
			<yx-form
				ref="dialog"
				v-loading="loading"
				labelWidth="130px"
				:rules="funRules"
				:items="item"
				:data="formData"
				:formAction="formAction"
			>
				<!-- <template slot="platform">
					<div class="platform-box">
						<p>商家承担</p>
						<el-input
							class="platform-box-input"
							type="number"
							:disabled="disabledShow || underwayShow"
							v-model="formData.supplierRate"
							@input="businessExpensesProportionInput"
						></el-input>
						<p>%，平台承担</p>
						<el-input
							class="platform-box-input"
							type="number"
							disabled
							v-model="formData.platformRate"
						></el-input>
						<p>%</p>
					</div>
				</template> -->
				<template slot="startTime">
					<el-date-picker
						v-model="formData.startTimeActivity"
						type="datetime"
						:disabled="disabledShow || underwayShow"
						placeholder="选择开始日期时间"
						value-format="yyyy-MM-dd HH:mm:ss"
						format="yyyy-MM-dd HH:mm:ss"
						:picker-options="{
							disabledDate: (time) => {
								return time.getTime() < Date.now() - 8.64e7
							},
							selectableRange: startTimeRange,
						}"
					>
					</el-date-picker>
					<label>-</label>
					<el-date-picker
						v-model="formData.endTimeActivity"
						type="datetime"
						:disabled="disabledShow"
						placeholder="选择结束日期时间"
						value-format="yyyy-MM-dd HH:mm:ss"
						format="yyyy-MM-dd HH:mm:ss"
						:picker-options="{
							disabledDate: (time) => {
								return time.getTime() < Date.now() - 8.64e7
							},
							selectableRange: startTimeRange,
						}"
					>
					</el-date-picker>
				</template>
				<template slot="commodityAllocation">
					<div>
						<div>
							<el-button
								:disabled="disabledShow"
								@click="handleAdd"
								size="small"
								type="text"
								>添加商品</el-button
							>
							<div v-for="(item, index) in selectCommodityList" :key="index">
								<el-button
									type="text"
									:disabled="disabledShow || item.underwayShow"
									class="el-icon-close close-size"
									style="color: red"
									@click="thisSplice(index)"
								></el-button>

								<div class="back_p">
									<div
										v-if="dialogState == 2"
										class="state_show"
										:class="state_show(item)"
									></div>
									<span class="text_title"
										>{{ index + 1 + '.' + item.goodsName }}
									</span>
									<span class="ml20"
										>单买价：{{
											item.lowestSinglePrice == item.highestSinglePrice
												? item.lowestSinglePrice
												: item.lowestSinglePrice + '~' + item.highestSinglePrice
										}}
									</span>
									<span class="ml20"
										>成本价：{{
											item.lowestCostPrice == item.highestCostPrice
												? item.lowestCostPrice
												: item.lowestCostPrice + '~' + item.highestCostPrice
										}}
									</span>
									<div>
										<label class="ml20" style="color: #ff4949">*</label>
										<label>活动时间：</label>
										<el-date-picker
											v-model="item.startTime"
											type="datetime"
											:disabled="
												disabledShow || item.underwayShow || item.finishedShow
											"
											placeholder="选择开始日期时间"
											value-format="yyyy-MM-dd HH:mm:ss"
											format="yyyy-MM-dd HH:mm:ss"
											:picker-options="{
												disabledDate: (time) => {
													return time.getTime() < Date.now() - 8.64e7
												},
												selectableRange: startTimeRange,
											}"
										>
										</el-date-picker>
										<label>-</label>
										<el-date-picker
											v-model="item.endTime"
											type="datetime"
											:disabled="disabledShow || item.finishedShow"
											placeholder="选择结束日期时间"
											value-format="yyyy-MM-dd HH:mm:ss"
											format="yyyy-MM-dd HH:mm:ss"
											:picker-options="{
												disabledDate: (time) => {
													return time.getTime() < Date.now() - 8.64e7
												},
												selectableRange: startTimeRange,
											}"
										>
										</el-date-picker>
										<div class="dc">
											<!-- //成团人数 -->
											<label class="ml20" style="color: #ff4949">*</label>
											<label>成团人数：</label>
											<el-input-number
												class="w100 mb20"
												:disabled="
													disabledShow || item.underwayShow || item.finishedShow
												"
												v-model.trim="item.groupUserLimitCount"
												type="number"
												:max="20"
												:min="2"
											>
											</el-input-number>
										</div>
										<br />
										<div class="dc">
											<!-- 拼团价 -->
											<label class="ml20" style="color: #ff4949">*</label>
											<label>拼团价：</label>
											<el-input
												class="w100"
												:disabled="
													disabledShow || item.underwayShow || item.finishedShow
												"
												v-model.trim="item.groupPrice"
												onkeyup="this.value=this.value.match(/\d+\.?\d{0,2}/);this.dispatchEvent(new Event('input'))"
											>
											</el-input>
											<label class="pa_label"> 元</label>

											<!-- 团数上限 -->
											<label class="ml40" style="color: #ff4949">*</label>
											<label class="">团数上限：</label>
											<el-input
												class="w100"
												:disabled="disabledShow || item.finishedShow"
												oninput="value=value.replace(/[^\d]/g,'')"
												@input.native="onInput0_million"
												v-model.trim="item.groupLimitCount"
												type="number"
											>
											</el-input>
											<label class="pa_label"> 团</label>
											<!-- 成团奖励 -->
											<!-- <label class="ml40">成团奖励：</label>
											<el-input
												class="w100"
												:disabled="
													disabledShow || item.underwayShow || item.finishedShow
												"
												@input.native="onInput0_award"
												oninput="value=value.replace(/[^\d]/g,'')"
												v-model.trim="item.rewardAmount"
												type="number"
											>
											</el-input>
											<label class="pa_label"> 分/团</label> -->
											<!-- 提前预热 -->
											<label style="margin-left: 60px">提前预热：</label>
											<el-input
												v-model.trim="item.preheatDuration"
												class="w100"
												oninput="value=value.replace(/[^\d]/g,'')"
												:disabled="
													disabledShow || item.underwayShow || item.finishedShow
												"
												type="number"
												@input.native="onInput0_2880"
												max="2880"
												min="0"
											>
											</el-input
											><label class="pa_label">分钟</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</template>
			</yx-form>
			<add-commodity-dialog
				:visible.sync="dialogCommodityVisible"
				:commodityExt="commodityExt"
				:listData="listData"
				@saveCommodity="saveCommodity"
			></add-commodity-dialog>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import { uploadImageList } from '@/api/image'
import { addCreate, editCreate } from '@/api/groupbuying'

import { getBigImg } from '@/utils/imageTool'
import addCommodityDialog from './addCommodityDialog'

import moment from 'moment'

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
		echo: {
			type: Object,
			default: () => ({}),
		},
		dialogState: {
			type: Number,
			default: null,
		},
	},

	components: {
		YxForm,
		addCommodityDialog,
	},

	data() {
		return {
			formData: {
				activityBenifitPoint: '', //活动利益点
				activityName: '', //活动名称
				activityRemark: '', //活动描述
				startTimeActivity: '', //活动开始时间
				endTimeActivity: '', //活动结束时间
				supplierRate: '', //商家承担费率
				platformRate: '', //平台承担费率
				activityImageUrl: [],
			},
			repetition: false,
			verifyActivityGoodsList: [],
			disabledShow: false,
			underwayShow: false,
			dialogCommodityVisible: false,
			listData: {},
			selectCommodityList: [],
			imageDialog: false,
			couponIds: [],
			fileToUpload: '',
			item: [
				{
					type: 'input',
					title: '活动名称',
					maxlength: 50,
					dataIndex: 'activityName',
				},
				{
					type: 'custom',
					title: '活动计划时间',
					dataIndex: 'startTime',
				},
				// {
				// 	type: 'custom',
				// 	title: '费用归属',
				// 	dataIndex: 'platform',
				// },
				// {
				// 	title: '活动图片',
				// 	type: 'custom',
				// 	dataIndex: 'uploading',
				// },
				{
					type: 'uploadImage',
					title: '活动图片',
					dataIndex: 'activityImageUrl',
					uploadAttributes: {
						limit: 1,
						imageName: 'imageUrl',
						accept: 'image/jpeg, image/jpg, image/png',
						beforeAvatarUpload: (file) => this.beforeAvatarUpload(file),
						httpRequest: (file) => this._uploadImageHttpRequest(file),
					},
				},
				{
					type: 'input',
					title: '活动利益点',
					maxlength: 6,
					dataIndex: 'activityBenifitPoint',
				},
				{
					type: 'textarea',
					dataIndex: 'activityRemark',
					title: '活动描述',
					maxlength: 500,
				},
				{
					type: 'custom',
					dataIndex: 'commodityAllocation',
					title: '活动商品配置',
					// disabled: true,
				},
			],
			loading: false,
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						// 规则校验通过
						this.$refs.dialog.$refs.YxForm.validate((valid) => {
							if (valid) {
								this._updatActive()
							}
						})
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
				activityName: [
					{ required: true, message: '请填写活动名称!', trigger: 'blur' },
				],
				commodityAllocation: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (
								this.selectCommodityList &&
								!this.selectCommodityList.length
							) {
								callback(new Error('请选择商品'))
							}
							callback()
						},
						trigger: ['blur', 'change'],
					},
				],
				startTime: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData.startTimeActivity) {
								callback(new Error('请选择活动开始时间!'))
							} else if (!this.formData.endTimeActivity) {
								callback(new Error('请选择活动结束时间!'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				// platform: [
				// 	{
				// 		required: true,
				// 		validator: (rule, value, callback) => {
				// 			if (!this.formData.supplierRate) {
				// 				callback(new Error('请输入商家承担!'))
				// 			} else if (
				// 				!new RegExp(/^(?:0|[1-9][0-9]?|100)$/).test(
				// 					this.formData.supplierRate
				// 				)
				// 			) {
				// 				callback(new Error('请输入正确的商家承担比例!'))
				// 			} else {
				// 				callback()
				// 			}
				// 		},
				// 		trigger: 'blur',
				// 	},
				// ],
				activityImageUrl: {
					required: true,
					message: '请上传图片!',
					trigger: 'blur',
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
		state_show() {
			return function (item) {
				if (item.finishedShow) {
					return 'finished'
				} else if (item.underwayShow) {
					return 'onSale'
				} else {
					return 'preSale'
				}
			}
		},
	},
	methods: {
		detail(echo) {
			this.formData = {
				activityBenifitPoint: echo.activityBenifitPoint, //活动利益点
				activityName: echo.activityName, //活动名称
				activityRemark: echo.activityRemark, //活动描述
				supplierRate: echo.supplierRate, //商家承担费率
				platformRate: echo.platformRate, //平台承担费率
				startTimeActivity: moment(echo.startTime).format('yyyy-MM-DD HH:mm:ss'), //活动时间
				endTimeActivity: moment(echo.endTime).format('yyyy-MM-DD HH:mm:ss'), //活动时间
				activityImageUrl: [
					{ imageUrl: getBigImg(echo.imageUrl), imageUrlTemp: echo.imageUrl },
				],
			}
			this.selectCommodityList = echo.activityGoodsList
			this.selectCommodityList.forEach((item) => {
				item.startTime = moment(item.startTime).format('yyyy-MM-DD HH:mm:ss')
				item.endTime = moment(item.endTime).format('yyyy-MM-DD HH:mm:ss')
				item.highestCostPrice = item.priceRange.highestCostPrice
				item.highestSinglePrice = item.priceRange.highestSinglePrice
				item.lowestCostPrice = item.priceRange.lowestCostPrice
				item.lowestSinglePrice = item.priceRange.lowestSinglePrice
			})
			this.verifyActivityGoodsList = JSON.parse(
				JSON.stringify(echo.activityGoodsList)
			)
			if (this.dialogState == 3) {
				this.item.forEach((item) => {
					item.disabled = true
				})
				this.disabledShow = true
				this.formAction[0].hide = true
				this.formAction[1].hide = true
			} else {
				this.item.forEach((item) => {
					item.disabled = false
				})
				this.disabledShow = false
				this.formAction[0].hide = false
				this.formAction[1].hide = false
			}
			if (this.dialogState == 2 && this.row.activityStatusDesc == '进行中') {
				this.item[0].disabled = true
				this.verifyActivityGoodsList.forEach((item) => {
					let date = Date.parse(new Date())
					if (Number(date) > Number(moment(item.startTime).valueOf())) {
						item.underwayShow = true
					}
					if (Number(date) > Number(moment(item.endTime).valueOf())) {
						item.finishedShow = true
					}
				})
			} else {
				this.underwayShow = false
			}
			this.selectCommodityList = JSON.parse(
				JSON.stringify(this.verifyActivityGoodsList)
			)
		},
		// onInput0_award(e) {
		// 	this.$message.closeAll()
		// 	e.target.value = e.target.value.replace(/\D/g, '')
		// 	if (e.target.value < 0 || e.target.value >= 100000) {
		// 		this.$message.warning('只能输入正确的整数且最大可输入十万')
		// 		return (e.target.value = 100000)
		// 	}
		// },
		onInput0_million(e) {
			this.$message.closeAll()
			e.target.value = e.target.value.replace(/\D/g, '')
			if (e.target.value < 0 || e.target.value > 1000000) {
				this.$message.warning('只能输入正确的整数且最大可输入一百万')
				return (e.target.value = 1000000)
			}
		},
		//校验框
		onInput0_2880(e) {
			this.$message.closeAll()
			e.target.value = e.target.value.replace(/\D/g, '')
			if (e.target.value < 0 || e.target.value > 2880) {
				this.$message.warning('只能输入正确的整数且最大可输入2880，即2天')
				return (e.target.value = 2880)
			}
		},
		// 删除商品
		thisSplice(index) {
			let _this = this
			//对比回显数据和新添加数据相同，进行中，商品活动开始时间大于活动开始时间不可删除
			if (
				_this.verifyActivityGoodsList[index] &&
				_this.verifyActivityGoodsList[index].goodsId ===
					_this.selectCommodityList[index].goodsId &&
				_this.row.activityStatusDesc == '进行中'
			) {
				if (
					this.formData.startTimeActivity >=
					_this.verifyActivityGoodsList[index].startTime
				) {
					this.$message.error('活动进行中,商品不可删除!')
					return false
				} else {
					_this.$confirm('确定删除当前商品？', '提示', {
						type: 'warning',
						async callback(action) {
							if (action === 'confirm') {
								_this.selectCommodityList.splice(index, 1)
							}
						},
					})
				}
			} else {
				_this.$confirm('确定删除当前商品？', '提示', {
					type: 'warning',
					async callback(action) {
						if (action === 'confirm') {
							_this.selectCommodityList.splice(index, 1)
						}
					},
				})
			}
		},
		//校验图片
		beforeAvatarUpload(params) {
			const isLt2M = params.size / 1024 / 1024 < 5
			if (!isLt2M) {
				this.$message.error('上传文件大于5M,请重新选择!')
				return false
			} else {
				return params
			}
		},
		// 上传图标图片
		_uploadImageHttpRequest: async function (params) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#addMaterial', imageType: 80 })
			)
			const isLt2M = params.file.size / 1024 / 1024 < 5
			if (!isLt2M) {
				this.$message.error('上传文件大于5M,请重新选择!')
				return
			}
			formData.append('file', params.file)
			const res = await uploadImageList(formData)
			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				this.formData.activityImageUrl.push({
					imageUrl: getBigImg(res.data.resultData.imageList[0].imageUrl),
					imageUrlTemp: res.data.resultData.imageList[0].imageUrl,
				})
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		//监听商家承担比例
		businessExpensesProportionInput(businessExpensesProportionInput) {
			let n = /^(?:0|[1-9][0-9]?|100)$/
			let re = new RegExp(n)
			if (!re.test(businessExpensesProportionInput)) {
				this.$message.warning('请输入正确的商家承担比例')
				this.formData.platformRate = 0
				return false
			}
			this.formData.platformRate = 100 - businessExpensesProportionInput
		},
		saveCommodity(val, item) {
			this.listData = JSON.parse(JSON.stringify(item))
			this.selectCommodityList = val
		},
		handleAdd() {
			this.commodityExt = JSON.parse(JSON.stringify(this.selectCommodityList))
			this.dialogCommodityVisible = true
		},
		//保存
		async _updatActive() {
			if (this.repetition) {
				return
			}
			let activityGoodsList = []
			try {
				this.selectCommodityList.forEach((item) => {
					let dateS = Date.parse(new Date())
					if (!item.startTime) {
						throw new Error('请选择商品活动开始时间!')
					}
					if (!item.endTime) {
						throw new Error('请选择商品活动结束时间!')
					}
					if (!Number(item.groupUserLimitCount)) {
						throw new Error('成团人数输入有误!')
					}
					if (!Number(item.groupLimitCount)) {
						throw new Error('团数上限输入有误!')
					}
					if (!Number(item.groupPrice)) {
						throw new Error('拼团价输入有误!')
					}
					if (Number(item.groupPrice) > Number(item.lowestSinglePrice)) {
						throw new Error('拼团价必须低于等于最低销售价!')
					}
					if (
						Number(moment(item.startTime).valueOf()) <
						Number(moment(this.formData.startTimeActivity).valueOf())
					) {
						throw new Error('商品开始的时间必须大于等于活动的开始时间!')
					}
					if (
						Number(moment(dateS).valueOf()) >
						Number(moment(this.formData.endTimeActivity).valueOf())
					) {
						throw new Error('活动时间必须大于当前时间!')
					}
					if (
						Number(dateS) > Number(moment(item.endTime).valueOf()) &&
						!item.finishedShow
					) {
						if (
							Number(moment(dateS).valueOf()) >
							Number(moment(item.endTime).valueOf())
						) {
							throw new Error('商品活动最晚结束的时间必须大于当前时间!')
						}
					}
					if (
						Number(moment(item.endTime).valueOf()) >
						Number(moment(this.formData.endTimeActivity).valueOf())
					) {
						throw new Error('商品活动最晚结束的时间必须小于等于活动的结束时间!')
					}
					if (Number(item.rewardAmount) > 100000) {
						item.rewardAmount = 100000
					}
					if (!item.rewardAmount) {
						item.rewardAmount = 0
					}
					if (Number(item.groupLimitCount) > 1000000) {
						item.groupLimitCount = 1000000
					}
					if (Number(item.preheatDuration) > 2880) {
						item.preheatDuration = 2880
					}
					//添加商品的传参
					activityGoodsList.push({
						startTime: moment(item.startTime).valueOf(),
						endTime: moment(item.endTime).valueOf(),
						goodsId: item.goodsId,
						groupLimitCount: Number(item.groupLimitCount),
						groupPrice: Number(item.groupPrice),
						groupUserLimitCount: Number(item.groupUserLimitCount),
						preheatDuration: Number(item.preheatDuration || 0),
						rewardAmount: Number(item.rewardAmount),
					})
				})
			} catch (e) {
				this.$message.error(e.message)
				return
			}
			let underway = this.row.activityStatusDesc == '进行中'
			if (underway && this.formData.activityName != this.echo.activityName) {
				this.$message.error('活动进行中，活动名称不可更改!')
				return
			}
			if (underway && this.formData.supplierRate != this.echo.supplierRate) {
				this.$message.error('活动进行中，费用归属不可更改!')
				return
			}
			if (
				underway &&
				moment(this.formData.startTimeActivity).valueOf() != this.echo.startTime
			) {
				this.$message.error('活动进行中，活动开始时间不可更改!')
				return
			}
			try {
				let date = Date.parse(new Date())
				//回显数据
				this.verifyActivityGoodsList.forEach((item) => {
					//传参数据
					activityGoodsList.forEach((v) => {
						console.log('--对比修改项---', item, v)
						if (
							Number(moment(v.startTime).valueOf()) <
							Number(moment(this.formData.startTimeActivity).valueOf())
						) {
							console.log(
								'商品活动开始时间,活动开始时间',
								Number(moment(item.startTime).valueOf()),
								Number(moment(this.formData.startTimeActivity).valueOf())
							)

							throw new Error('商品活动开始时间不可小于活动开始时间!')
						}
						if (item.goodsId == v.goodsId) {
							if (underway && moment(item.startTime).valueOf() != v.startTime) {
								if (Number(date) > Number(moment(item.startTime).valueOf())) {
									throw new Error(
										'商品活动进行中，商品配置中的活动开始时间不可更改!'
									)
								}
							}
							if (
								underway &&
								Number(item.groupUserLimitCount) !=
									Number(v.groupUserLimitCount)
							) {
								throw new Error('活动进行中，商品配置中的成团人数不可更改!')
							}
							if (underway && Number(item.groupPrice) != Number(v.groupPrice)) {
								throw new Error('活动进行中，商品配置中的拼团价不可更改!')
							}
							if (!Number(v.groupLimitCount)) {
								throw new Error('团数上限输入有误!')
							}
							if (
								underway &&
								Number(item.groupLimitCount) > Number(v.groupLimitCount)
							) {
								throw new Error(
									'活动进行中，商品配置中的团数上限不可小于当前团数上限的数值!'
								)
							}
							if (
								underway &&
								Number(item.rewardAmount) != Number(v.rewardAmount)
							) {
								throw new Error('活动进行中，商品配置中的成团奖励不可更改!')
							}
						}
					})
				})
			} catch (e) {
				this.$message.error(e.message)
				return
			}
			const paramJson = this.formData
			paramJson.startTime = moment(this.formData.startTimeActivity).valueOf()
			paramJson.endTime = moment(this.formData.endTimeActivity).valueOf()
			paramJson.activityGoodsList = activityGoodsList
			paramJson.imageUrl = this.formData.activityImageUrl[0].imageUrlTemp

			if (this.dialogState == 2) {
				paramJson.activityId = this.row.activityId
			}
			this.loading = true
			let URL = this.dialogState == 1 ? addCreate : editCreate
			console.log('paramJsonparamJson:', paramJson)
			// return
			let {
				data: { resultCode },
			} = await URL(paramJson)
			if (resultCode == 0) {
				this.resetForm()
				this.$emit('initTable')
				this.$message.success('成功')
				this.repetition = true
			}

			this.loading = false
		},

		resetForm() {
			this.localVisible = false
		},

		open() {
			this.repetition = false
			this.$refs.form && this.$refs.form.$refs.YxForm.resetFields()
			this.loading = false
			this.item.forEach((item) => {
				item.disabled = false
			})
			this.verifyActivityGoodsList = []
			this.dialogCommodityVisible = false
			this.listData = {}
			this.selectCommodityList = []
			this.imageDialog = false
			this.disabledShow = false
			this.underwayShow = false
			this.couponIds = []
			this.fileToUpload = ''
			this.formData = {
				activityBenifitPoint: '', //活动利益点
				activityName: '', //活动名称
				activityRemark: '', //活动描述
				supplierRate: '', //商家承担费率
				platformRate: '', //平台承担费率
				startTimeActivity: '', //活动开始时间
				endTimeActivity: '', //活动结束时间
				activityImageUrl: [],
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.platform-box {
	display: flex;
	margin-top: -14px;
	align-items: center;
	.platform-box-input {
		width: 100px;
	}
}
.back_p {
	background-color: rgba(242, 242, 242, 1);
	padding: 20px;
	margin-bottom: 20px;
}
.text_title {
	font-family: 'STYuanti-SC-Bold', 'Yuanti SC Bold', 'Yuanti SC', sans-serif;
	font-weight: 700;
	font-size: 14px;
}
.ml20 {
	margin-left: 20px;
}
.ml40 {
	margin-left: 40px;
}
.w100 {
	width: 100px;
}
.pa_label {
	position: absolute;
}
.close-size {
	float: right;
	width: 50px;
}
.dc {
	display: contents;
}
.finished {
	background: #d9001b;
}
.preSale {
	background: #b0b0b0;
}
.onSale {
	background: #70b603;
}
.finished:after {
	content: '已结束';
}
.preSale:after {
	content: '未开始';
}
.onSale:after {
	content: '进行中';
}
.state_show {
	width: 38px;
	font-size: 6px;
	color: #ffffff;
	padding: 0;
	border-radius: 4px;
	height: 20px;
	line-height: 22px;
	text-align: center;
}
</style>
