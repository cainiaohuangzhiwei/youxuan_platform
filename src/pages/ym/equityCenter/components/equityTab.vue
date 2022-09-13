<template>
	<div class="equityTab">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData107"
				:items="formCfg107"
				:formAction="formAction107"
			>
			</yx-form>
			<div class="goods-group-btn-box">
				<el-button type="success" @click="addEquity">新建权益</el-button>
			</div>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns108"
				:pagination="page108"
				:data="tableData108"
			></yx-table>
			<Dialog
				:title="dialogTitle109"
				:visible="dialogVisible109"
				:width="dialogWidth109"
				:bottomBtn="dialogBottomBtn109"
				@before-close="dialogVisible109 = false"
			>
				<yx-form
					ref="dialog110"
					labelWidth="120px"
					:data="formData110"
					:items="formCfg110"
					:formAction="formAction110"
					:rules="formRules110"
				>
					<template slot="validityType">
						<el-radio-group
							class="validity-type-box"
							v-model="formData110.validityType"
						>
							<el-radio class="validity-type-item" :label="1">
								<el-date-picker
									v-model="formData110.startTime"
									type="datetime"
									:picker-options="startOptions"
									style="width: 160px"
									placeholder="开始时间"
									default-time="00:00:00"
								>
								</el-date-picker>
								-
								<el-date-picker
									v-model="formData110.endTime"
									type="datetime"
									style="width: 160px"
									:picker-options="pickerOptions"
									placeholder="结束时间"
									default-time="23:59:59"
								>
								</el-date-picker>
							</el-radio>
							<el-radio :label="2">
								自领取起<el-input
									class="validity-day"
									type="number"
									onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
									v-model="formData110.validityDay"
								></el-input
								>有效
							</el-radio>
						</el-radio-group>
					</template>
					<template slot="grantScope">
						<div>
							<el-radio-group v-model="formData110.grantScope">
								<el-radio :label="1">全场通用</el-radio>
								<el-radio :label="2"
									>指定档期
									<el-button @click="groupDrop" type="text"
										>添加档期</el-button
									></el-radio
								>
							</el-radio-group>
							<p>
								<template v-if="selectGroupList.length > 50">
									<el-button @click="showGroupName" type="text" size="medium"
										>展示更多</el-button
									>&ensp;
									<span
										v-for="(item, index) in isShowGroupName
											? selectGroupList
											: selectGroupList.slice(0, 50)"
										:key="index"
										>{{ item.groupName
										}}{{ index == selectGroupList.length - 1 ? '' : ',' }}</span
									>
								</template>
								<template v-else>
									<span v-for="(item, index) in selectGroupList" :key="index"
										>{{ item.groupName
										}}{{ index == selectGroupList.length - 1 ? '' : ',' }}</span
									>
								</template>
							</p>
						</div>
					</template>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle105"
				:visible.sync="dialogVisible105"
				:width="dialogWidth105"
				:bottomBtn="dialogBottomBtn105"
				class="goods-group-list"
			>
				<yx-form
					:inline="true"
					:data="formData115"
					:items="formCfg115"
					:formAction="formAction115"
				>
					<template #groupNames>
						<!-- 自动切割文字变数组输入组件 S -->
						<SplittedInput
							:value.sync="formData115.groupNames"
							placeholder="输入档期名称搜索，批量搜索请换行或用英文逗号隔开"
						/>
						<!-- 自动切割文字变数组输入组件 E -->
					</template>
					<template #goodsGroupIdList>
						<!-- 自动切割文字变数组输入组件 S -->
						<SplittedInput
							v-if="dialogVisible105"
							:value.sync="formData115.goodsGroupIdList"
							placeholder="输入档期ID搜索，批量搜索请换行或用英文逗号隔开"
						/>
						<!-- 自动切割文字变数组输入组件 E -->
					</template>
				</yx-form>
				<yx-table
					:select="true"
					:selectionChange="selectionChange"
					v-loading="loading104"
					:columns="tableColumns104"
					:pagination="page104"
					:rowClassName="tableRowClassName"
					:data="tableData104"
				>
					<template slot="saleState" slot-scope="scope">
						<div>
							<el-tag type="danger" v-if="curTime < scope.row.saleStartTime"
								>未开始</el-tag
							>
							<el-tag type="info" v-if="curTime > scope.row.saleEndTime"
								>已结束</el-tag
							>
							<el-tag
								v-if="
									curTime >= scope.row.saleStartTime &&
									curTime <= scope.row.saleEndTime
								"
								>进行中</el-tag
							>
						</div>
					</template>
					<template slot="groupName" slot-scope="scope">
						<div style="white-space: pre-wrap">{{ scope.row.groupName }}</div>
					</template>
				</yx-table>
			</Dialog>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import { getEquity, addEquity, editEquity } from '@/api/yhtPlusCmsEquity'
import { getGoodsGroupListByConditionForCMS } from '@/api/coupon'
import moment from 'moment'
import SplittedInput from '@/components/SplittedInput'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
		SplittedInput,
	},
	props: [],
	data() {
		return {
			loading104: false,
			startOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7
				},
			},
			pickerOptions: {
				disabledDate: (time) => {
					return time.getTime() < this.formData110.startTime
				},
			},
			selectGroupList: [],
			multipleSelectList: [],
			dialogTitle105: '选择档期',
			dialogWidth105: '800px',
			dialogVisible105: false,
			dialogBottomBtn105: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.formData115 = {
							groupNames: [],
							goodsType: '1',
							goodsGroupIdList: [],
							goodsGroupStateList: ['1', '2'],
						}
						this.dialogVisible105 = false
					},
				},
			],
			formData115: {
				groupNames: [],
				goodsType: '1',
				goodsGroupIdList: [],
				goodsGroupStateList: ['1', '2'],
			},
			formCfg115: [
				{
					type: 'custom',
					title: '筛选',
					dataIndex: 'groupNames',
				},
				{
					type: 'custom',
					title: '批量品牌ID查询',
					dataIndex: 'goodsGroupIdList',
				},
				{
					type: 'select',
					title: '档期类型',
					dataIndex: 'goodsType',
					label: 'value',
					options: [
						{
							goodsType: '1',
							value: '品牌营销',
						},
						{
							goodsType: '2',
							value: '专享营销',
						},
					],
				},
				{
					type: 'checkbox',
					title: '售卖状态',
					dataIndex: 'goodsGroupStateList',
					label: 'value',
					options: [
						{
							goodsGroupStateList: '1',
							value: '未开始',
						},
						{
							goodsGroupStateList: '2',
							value: '进行中',
						},
					],
					change: () => {
						this._getGoodsGroupListByConditionForCMS(true)
					},
				},
			],
			formAction115: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._getGoodsGroupListByConditionForCMS(true)
					},
				},
				{
					title: '批量添加',
					type: 'text',
					click: () => {
						this._addList()
					},
				},
				{
					title: '批量移除',
					type: 'text',
					click: () => {
						this._removeList()
					},
				},
			],
			tableData104: [],
			curTime: new Date().getTime(),
			tableColumns104: [
				{
					type: 'string',
					dataIndex: 'goodsGroupId',
					title: '档期ID',
				},
				{
					type: 'custom',
					dataIndex: 'groupName',
					title: '分组名称',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '品牌名称',
				},
				{
					title: '渠道',
					type: 'newMap',
					dataIndex: 'sourceType',
					options: [
						['1', 'AKC'],
						['2', 'HYK'],
						['3', 'BBC'],
						['4', 'WPC'],
						['5', '京东联盟'],
						['6', '海外购'],
						['7', '砍单活动'],
						['8', '奥买家'],
						['9', '自有品牌'],
						['10', '商家'],
						['11', '购拉拉'],
						['12', '超链'],
						['13', '自有品牌-海外'],
					],
				},
				{
					type: 'string',
					dataIndex: 'saleStartTime',
					title: '售卖时间',
					customRender: (row) => {
						return (
							moment(row.saleStartTime).format('YYYY-MM-DD HH:mm:ss') +
							'-' +
							moment(row.saleEndTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					type: 'custom',
					dataIndex: 'saleState',
					title: '售卖状态',
				},
				{
					type: 'string',
					dataIndex: 'goodsCount',
					title: '商品数',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.setSelectGroupList(row)
							},
							customRender: (action, row) => {
								let flag = this.selectGroupList.some(
									(item) => item.goodsGroupId === row.goodsGroupId
								)
								action.title = flag ? '移除' : '添加'
								return action
							},
						},
					],
				},
			],
			page104: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getGoodsGroupListByConditionForCMS()
				},
			},
			loading: false,
			formData107: {
				equityId: '',
				equityName: '',
				equityState: 1,
				startTime: '',
				endTime: '',
			},
			formCfg107: [
				{
					type: 'input',
					title: '权益卡ID',
					dataIndex: 'equityId',
					placeholder: '请输入权益卡ID',
				},
				{
					type: 'input',
					title: '权益卡名称',
					dataIndex: 'equityName',
					placeholder: '请输入权益卡名称',
				},
				{
					type: 'select',
					title: '权益卡状态',
					dataIndex: 'equityState',
					placeholder: '请输入权益卡状态',
					label: 'value',
					options: [
						{
							equityState: 0,
							value: '全部',
						},
						{
							equityState: 1,
							value: '未失效',
						},
						{
							equityState: 2,
							value: '已失效',
						},
					],
				},
				{
					type: 'datetimerange',
					title: '有效时间',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
			],
			formAction107: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.init(true)
					},
					tableId: 108,
				},
			],
			tableData108: [],
			tableColumns108: [
				{
					type: 'string',
					dataIndex: 'equityId',
					title: '权益ID',
				},
				{
					type: 'string',
					dataIndex: 'equityName',
					title: '权益名称',
				},
				{
					type: 'newMap',
					dataIndex: 'equityType',
					title: '权益类型',
					options: [['1', '运费保障卡']],
				},
				{
					type: 'string',
					dataIndex: 'validityType',
					title: '有效时间',
					customRender: ({ validityType, startTime, endTime, validityDay }) => {
						if (validityType == 1) {
							return (
								moment(startTime).format('YYYY-MM-DD HH:mm:ss') +
								'-' +
								moment(endTime).format('YYYY-MM-DD HH:mm:ss')
							)
						} else if (validityType == 2) {
							return '自领取起' + validityDay + '天内有效'
						} else {
							return '-'
						}
					},
				},
				{
					type: 'newMap',
					dataIndex: 'grantScope',
					title: '适用范围',
					options: [
						['1', '全场通用'],
						['2', '指定分组'],
					],
				},
				{
					type: 'newMap',
					dataIndex: 'usingMethod',
					title: '使用方式',
					options: [
						['1', '自用、转赠'],
						['2', '自用'],
					],
				},
				{
					type: 'newMap',
					dataIndex: 'equityState',
					title: '权益卡状态',
					options: [
						['1', '未失效'],
						['2', '已失效'],
					],
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '查看',
							auth: '',
							click: ({ equityId }) => {
								this.$router.push({
									path: `/ym/equityDetail/${equityId}`,
								})
							},
						},
						{
							title: '编辑',
							auth: '',
							dialogId: 109,
							click: (row) => {
								this.formData110 = JSON.parse(JSON.stringify(row))
								this.isShowGroupName = false
								this.selectGroupList = this.selectGroupList =
									this.formData110.equityGroup ||
									this.formData110.equityGroupList ||
									[]
								this.dialogTitle109 = '编辑权益'
								this.dialogVisible109 = true
								this.groupingComparisonList = row.equityGroupList
								this.delGoodsGroupIdList = []
							},
							customRender: (action, row) => {
								let flag =
									(row.equityId == 1 || row.editState == 0) &&
									row.equityId != 34
								action.hide = flag
								return action
							},
						},
					],
				},
			],
			delGoodsGroupIdList: [],
			groupingComparisonList: [],
			page108: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			dialogTitle109: '新建权益',
			dialogWidth109: '800px',
			dialogVisible109: false,
			dialogBottomBtn109: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog110.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveEquity()
							}
						})
						// this.dialogVisible109 = false
					},
				},
			],
			formData110: {
				equityType: '',
				equityName: '',
				validityType: '',
				startTime: '',
				endTime: '',
				validityDay: '',
				grantScope: '',
				usingMethod: 1,
			},
			formRules110: {
				equityType: [
					{ required: true, message: '请选择权益类型', trigger: 'change' },
				],
				equityName: [
					{ required: true, message: '请输入权益卡名称', trigger: 'blur' },
				],
				validityType: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData110.validityType) {
								callback(new Error('请选择有效时间'))
							} else if (
								this.formData110.validityType == 1 &&
								(!this.formData110.startTime || !this.formData110.endTime)
							) {
								callback(new Error('请完整填写开始时间和有效时间'))
							} else if (
								this.formData110.validityType == 2 &&
								!this.formData110.validityDay
							) {
								callback(new Error('请填写领取有效天数'))
							} else if (
								this.formData110.validityType == 2 &&
								this.formData110.validityDay <= 0
							) {
								callback(new Error('领取有效天数不能小于等于0'))
							} else if (
								this.formData110.validityType == 2 &&
								this.formData110.validityDay > 365
							) {
								callback(new Error('领取有效天数最大值不能大于365'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				grantScope: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData110.grantScope) {
								callback(new Error('请选择使用范围'))
							} else if (
								this.formData110.grantScope == 2 &&
								!this.selectGroupList.length
							) {
								callback(new Error('指定分组不能为空'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
			},
			formCfg110: [
				{
					type: 'radio',
					title: '权益类型',
					dataIndex: 'equityType',
					label: 'value',
					options: [
						{
							value: '运费保障卡',
							equityType: 1,
						},
					],
				},
				{
					type: 'input',
					title: '权益卡名称',
					dataIndex: 'equityName',
					placeholder: '请输入权益卡名称',
				},
				{
					title: '有效时间',
					type: 'custom',
					dataIndex: 'validityType',
				},
				{
					title: '使用范围',
					type: 'custom',
					dataIndex: 'grantScope',
				},
				{
					title: '使用方式',
					type: 'radio',
					dataIndex: 'usingMethod',
					label: 'value',
					options: [
						{
							value: '自用、转赠',
							usingMethod: 1,
						},
						{
							usingMethod: 2,
							value: '自用',
						},
					],
				},
			],
			formAction110: [],
			isShowGroupName: false,
		}
	},

	methods: {
		addEquity() {
			this.formData110 = {
				equityType: '',
				equityName: '',
				validityType: '',
				startTime: '',
				endTime: '',
				validityDay: '',
				grantScope: '',
				usingMethod: 1,
			}
			this.selectGroupList = []
			this.multipleSelectList = []
			this.isShowGroupName = false
			this.dialogTitle109 = '新建权益'
			this.$nextTick(() => {
				this.$refs.dialog110.$refs.YxForm.clearValidate()
			})
			this.dialogVisible109 = true
		},
		saveEquity: async function () {
			let paramJson = {
				equityType: this.formData110.equityType, //权益卡类型
				equityName: this.formData110.equityName, //权益卡名称
				validityType: this.formData110.validityType, //有效时间
				startTime:
					(this.formData110.validityType == 1 &&
						moment(this.formData110.startTime).valueOf()) ||
					'', //开始时间
				endTime:
					(this.formData110.validityType == 1 &&
						moment(this.formData110.endTime).valueOf()) ||
					'', //结束时间
				validityDay:
					(this.formData110.validityType == 2 &&
						this.formData110.validityDay) ||
					'', //领取有效天数
				grantScope: this.formData110.grantScope, //使用范围
				usingMethod: this.formData110.usingMethod, //使用方式
				goodsGroupIdList: [],
			}
			if (this.selectGroupList.length) {
				if (this.formData110.equityId) {
					// 添加项
					const add = this.selectGroupList.map((item) => {
						return item.goodsGroupId
					})
					//原始项
					let arr1 = []
					if (this.groupingComparisonList) {
						arr1 = this.groupingComparisonList.map((item) => {
							return item.goodsGroupId
						})
					}
					const _arr2 = add.filter((item2) => !arr1.includes(item2))
					paramJson.addGoodsGroupIdList = _arr2
					// 移除项
					let arr3 = this.uniqueArr(Object.assign([], this.delGoodsGroupIdList))
					paramJson.delGoodsGroupIdList = []
					arr3.forEach((item) => {
						arr1.forEach((it) => {
							console.log('====', item, it)
							if (item == it) {
								paramJson.delGoodsGroupIdList.push(item)
							}
						})
					})
					const add_remove_history = paramJson.delGoodsGroupIdList.filter(
						(item2) => !add.includes(item2)
					)
					paramJson.delGoodsGroupIdList = add_remove_history
					console.log('移除:', paramJson.delGoodsGroupIdList)
					console.log('添加:', paramJson.addGoodsGroupIdList)
				} else {
					paramJson.goodsGroupIdList = this.selectGroupList.map((item) => {
						return item.goodsGroupId
					})
				}
			}
			// return
			let res = null
			let falg = false
			if (this.formData110.equityId) {
				paramJson.equityId = this.formData110.equityId
				res = await editEquity(paramJson)
			} else {
				res = await addEquity(paramJson)
				falg = true
			}
			let {
				data: { resultCode, resultMsg },
			} = res
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible109 = false
				this.init(falg)
			}
			console.log(paramJson)
		},
		//去重
		uniqueArr(array) {
			const obj = {}
			return array.filter((item) => {
				// 防止key重复
				const newItem = item + JSON.stringify(item)
				// eslint-disable-next-line no-prototype-builtins
				return obj.hasOwnProperty(newItem) ? false : (obj[newItem] = true)
			})
		},
		setSelectGroupList(row) {
			// 添加/移除用户
			let ids = this.selectGroupList.map((item) => {
				return item.goodsGroupId
			})
			if (ids.indexOf(row.goodsGroupId) == -1) {
				if (row.afterSale == 1) {
					return this.$message.warning('该档期不是7天无理由退货档期')
				}
				this.selectGroupList.push(row)
			} else {
				this.delGoodsGroupIdList.push(row.goodsGroupId)
				this.selectGroupList.splice(ids.indexOf(row.goodsGroupId), 1)
			}
		},
		groupDrop() {
			this.dialogVisible105 = true
			this.$nextTick(() => {
				this.formData110.grantScope = 2
				this.formData115.groupNames = []
				this.formData115.goodsGroupIdList = []
				// this.tableData104 = []
				// this.page104.count = 0
				this._getGoodsGroupListByConditionForCMS(true)
			})
		},
		tableRowClassName({ row }) {
			if (row.afterSale == 1) {
				return 'ffc94b-row'
			}
			return ''
		},
		findUserParams(flag) {
			// 用户搜索条件
			let paramJson = Object.assign(this.formData115, {
				startIndex: 0,
				length: 1,
				gcategoryList: ['1'],
				organizationId: this.$store.state.user.userInfo.organizationId,
			})
			console.log(this.formData115, 'this.formData115')
			// 每页的加载数据长度
			paramJson.length = this.page104.length
			// 当前页的条数开始
			if (flag) {
				this.page104.currentPage = 1
			}
			paramJson.startIndex =
				(this.page104.currentPage - 1) * this.page104.length
			return paramJson
		},
		async _getGoodsGroupListByConditionForCMS(flag) {
			// 用户列表
			this.loading104 = true
			let paramJson = this.findUserParams(flag)
			let {
				data: { resultCode, resultData },
			} = await getGoodsGroupListByConditionForCMS(paramJson)
			this.loading104 = false
			if (resultCode == 0) {
				this.tableData104 = resultData.goodsGroupList
				this.page104.count = resultData.goodsGroupCount
				this.curTime = resultData.currentTime
			} else {
				this.page104.count = 0
				this.tableData104 = []
			}
			this.$nextTick(() => {
				this.$forceUpdate()
			})
		},
		async init(flag) {
			this.loading = true
			let paramJson = this.findSearchParams108(flag)
			const {
				data: { resultCode, resultData },
			} = await getEquity(paramJson)
			if (resultCode == 0) {
				this.tableData108 = resultData.equityList
				this.page108.count = resultData.count
			} else {
				this.tableData108 = []
				this.page108.count = 0
			}
			this.loading = false
		},
		findSearchParams108(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page108.currentPage = 1
			}
			const paramJson = Object.assign(this.formData107, {
				length: this.page108.length,
				startIndex: (this.page108.currentPage - 1) * this.page108.length,
			})
			return paramJson
		},
		// 批量选择订单时整合数组
		selectionChange(list) {
			this.multipleSelectList = list
		},
		// 批量添加选中列表
		_addList() {
			if (!this.multipleSelectList.length) {
				return this.$message.warning('请选择档期')
			}
			let multipleSelectList = this.multipleSelectList.filter(
				(row) => row.afterSale != 1
			)
			const selectGroupList = [...this.selectGroupList, ...multipleSelectList]
			let obj = {}
			this.selectGroupList = selectGroupList.reduce((cur, next) => {
				obj[next.goodsGroupId]
					? ''
					: (obj[next.goodsGroupId] = true && cur.push(next))
				return cur
			}, [])
			this.$message.success('已添加')
		},
		// 批量移除选中列表
		_removeList() {
			if (!this.multipleSelectList.length) {
				return this.$message.warning('请选择档期')
			}
			let ids = this.multipleSelectList.map((item) => {
				return item.goodsGroupId
			})
			this.selectGroupList = this.selectGroupList.filter(
				(row) => ids.indexOf(row.goodsGroupId) == -1
			)
			this.delGoodsGroupIdList = this.delGoodsGroupIdList.filter(
				(row) => ids.indexOf(row.goodsGroupId) == -1
			)
			ids.forEach((item) => {
				this.delGoodsGroupIdList.push(item)
			})
			this.$message.success('已移除')
		},
		// 展示更多档期名称
		showGroupName() {
			this.isShowGroupName = true
		},
	},
}
</script>
<style lang="scss">
.goods-group-list {
	.el-table__body tr.ffc94b-row {
		background-color: #ffc94b;
		& > td.el-table__cell {
			background-color: #ffc94b;
		}
		&:hover > td.el-table__cell {
			background-color: #ffc94b;
		}
	}
}
</style>
<style scoped>
.validity-type-box {
	display: flex;
	flex-direction: column;
}
.validity-type-item {
	margin-bottom: 20px;
}
.validity-day {
	width: 100px;
	margin: 0 10px;
}
.goods-group-btn-box {
	margin-bottom: 20px;
}
</style>
