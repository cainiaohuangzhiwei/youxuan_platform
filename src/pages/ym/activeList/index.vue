<template>
	<div class="activeList">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData106"
				:items="formCfg106"
				:formAction="formAction106"
			>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns107"
				:data="tableData107"
			>
				<template slot="status" slot-scope="scope">
					<div>
						<el-tag :type="getTag(scope.row).type">{{
							getTag(scope.row).value
						}}</el-tag>
					</div>
				</template>
			</yx-table>
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
					<template slot="excelDrop">
						<div class="user-upload">
							<el-button
								class="down-btn"
								@click="handleDownExcel"
								type="primary"
								>下载模板</el-button
							>
							<el-upload
								ref="uploadExcel"
								:limit="1"
								accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
								:on-exceed="onExceed"
								:http-request="httpRequest"
							>
								<el-button slot="trigger" class="mr20" icon="el-icon-plus">
									上传文件
								</el-button>
							</el-upload>
							<!-- <el-button type="success">上传文件</el-button> -->
						</div>
					</template>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle111"
				:visible="dialogVisible111"
				:width="dialogWidth111"
				:bottomBtn="dialogBottomBtn111"
				@before-close="dialogVisible111 = false"
			>
				<yx-form
					ref="dialog112"
					labelWidth="120px"
					:data="formData112"
					:items="formCfg112"
					:formAction="formAction112"
					:rules="formRules112"
					:formDisabled="formDisabled112"
				>
					<template slot="actLimitMarkupRangeCheck">
						<div>
							<el-radio-group
								class="validity-type-box"
								v-model="formData112.range"
							>
								<el-radio class="validity-type-item" :label="0"
									>全场通用</el-radio
								>
								<el-radio class="validity-type-item" :label="1"
									>指定品牌<el-button
										class="radio-btn"
										type="text"
										size="medium"
										@click="groupDrop"
										>添加品牌</el-button
									></el-radio
								>
							</el-radio-group>
							<p>（选择使用范围，则活动时间内上架的品牌加价不生效）</p>
							<p>
								<span v-for="(item, index) in selectGroupList" :key="index"
									>{{ item.groupName
									}}{{ index == selectGroupList.length - 1 ? '' : ',' }}</span
								>
							</p>
						</div>
					</template>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle113"
				:visible="dialogVisible113"
				:width="dialogWidth113"
				:bottomBtn="dialogBottomBtn113"
				@before-close="dialogVisible113 = false"
			>
				<yx-form
					ref="dialog114"
					labelWidth="120px"
					:data="formData114"
					:items="formCfg114"
					:formAction="formAction114"
					:rules="formRules114"
					:formDisabled="formDisabled114"
				>
					<template slot="codeRewardList">
						<div>
							<el-button
								class="prefix-star"
								type="text"
								icon="el-icon-plus"
								@click="addCodeReward"
								>新增邀请码奖励</el-button
							>
							<div
								class="mutual-reward-list"
								v-for="(item, index) in totalCodeReward"
								:key="index"
							>
								<div class="code-item">
									销售额：<el-input
										class="input-item"
										type="number"
										v-model="item.startCodeReward"
									></el-input
									>-<el-input
										class="input-item"
										type="number"
										v-model="item.endCodeReward"
									></el-input
									>元，奖励邀请码<el-input
										class="input-item"
										type="number"
										onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
										v-model="item.sendCodeReward"
									></el-input
									>个
								</div>
								<div>
									<el-button
										type="danger"
										@click="totalCodeReward.splice(index, 1)"
										>删除</el-button
									>
								</div>
							</div>
						</div>
					</template>
					<template slot="organizationList">
						<div>
							<el-button type="text" icon="el-icon-plus" @click="storeDrop"
								>新增不奖励店主</el-button
							>
							<p>
								<span v-for="(item, index) in organizationList" :key="index"
									>{{ item.organizationName
									}}{{ index >= organizationList.length - 1 ? '' : ',' }}</span
								>
							</p>
						</div>
					</template>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle115"
				:visible="dialogVisible115"
				:width="dialogWidth115"
				:bottomBtn="dialogBottomBtn115"
				@before-close="dialogVisible115 = false"
			>
				<yx-form
					ref="dialog116"
					labelWidth="120px"
					:data="formData116"
					:items="formCfg116"
					:formDisabled="formDisabled114"
					:formAction="formAction116"
					:rules="formRules118"
				>
					<template slot="accountType">
						<div>
							<div class="code-item">
								<el-radio v-model="formData116.accountType" :label="1"
									>注册奖励优惠券</el-radio
								>
								<p>
									<el-button
										type="text"
										icon="el-icon-plus"
										@click="addShareCoupon('shareCouponList')"
										>添加优惠券</el-button
									>
								</p>
								<div
									class="code-item"
									v-for="(item, index) in shareCouponList"
									:key="index"
								>
									<el-autocomplete
										placeholder="请选择优惠券"
										v-model="item.couponName"
										:fetch-suggestions="querySearchAsync"
										@select="
											(row) => changeYxCouponId(row, 'shareCouponList', index)
										"
										class="input-with-select"
									>
										<el-button
											@click="
												openYxCouponDialog(item, 'shareCouponList', index)
											"
											slot="append"
											icon="el-icon-more"
										></el-button>
									</el-autocomplete>
									<el-button
										v-if="!formDisabled114"
										type="danger"
										@click="shareCouponList.splice(index, 1)"
										>删除</el-button
									>
									赠送数量：<el-input
										class="input-item"
										type="number"
										onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
										v-model="item.couponCount"
									></el-input>
								</div>
							</div>
							<div class="code-item">
								<el-radio v-model="formData116.accountType" :label="1"
									>邀请注册奖励优惠券</el-radio
								>
								<p>
									<el-button
										type="text"
										icon="el-icon-plus"
										@click="addShareCoupon('newCouponList')"
										>添加优惠券</el-button
									>
								</p>
								<div
									class="code-item"
									v-for="(item, index) in newCouponList"
									:key="index"
								>
									<el-autocomplete
										placeholder="请选择优惠券"
										v-model="item.couponName"
										:fetch-suggestions="querySearchAsync"
										@select="
											(row) => changeYxCouponId(row, 'newCouponList', index)
										"
										class="input-with-select"
									>
										<el-button
											@click="openYxCouponDialog(item, 'newCouponList', index)"
											slot="append"
											icon="el-icon-more"
										></el-button>
									</el-autocomplete>
									<el-button
										type="danger"
										@click="newCouponList.splice(index, 1)"
										>删除</el-button
									>
									赠送数量：<el-input
										class="input-item"
										type="number"
										onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
										v-model="item.sendCodeReward"
									></el-input>
								</div>
							</div>
						</div>
					</template>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle105"
				:visible.sync="dialogVisible105"
				:width="dialogWidth105"
				:bottomBtn="dialogBottomBtn105"
			>
				<yx-form
					:inline="true"
					:data="formData115"
					:items="formCfg115"
					:formAction="formAction115"
				>
				</yx-form>
				<yx-table
					:select="false"
					v-loading="loading104"
					:columns="tableColumns104"
					:pagination="page104"
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
				</yx-table>
			</Dialog>
			<Dialog
				:title="dialogTitle116"
				:visible="dialogVisible116"
				:width="dialogWidth116"
				:bottomBtn="dialogBottomBtn116"
				@before-close="dialogVisible116 = false"
			>
				<yx-form
					ref="dialog117"
					labelWidth="120px"
					:data="formData117"
					:items="formCfg117"
					:rules="formRules117"
				>
					<template slot="addMutualReward">
						<div>
							<el-button
								type="text"
								icon="el-icon-plus"
								@click="addMutualReward"
								>添加奖励范围</el-button
							>
							<div
								class="mutual-reward-list"
								v-for="(item, index) in mutualRewardList"
								:key="index"
							>
								<div>
									销售额：<el-input
										class="input-item"
										type="number"
										v-model="item.minSalesAmount"
									></el-input
									><el-input
										class="input-item"
										type="number"
										v-model="item.maxSalesAmount"
									></el-input>
								</div>
								<div>
									<p>
										上级店主奖励：店主达标销售额的总佣金*<el-input
											class="input-item"
											type="number"
											v-model="item.superiorBaseRate"
										></el-input>
									</p>
									<p>
										达标店主奖励：店主达标销售额的总佣金*<el-input
											class="input-item"
											type="number"
											v-model="item.baseRate"
										></el-input>
									</p>
								</div>
								<div>
									<el-button
										type="danger"
										@click="mutualRewardList.splice(index, 1)"
										>删除</el-button
									>
								</div>
							</div>
						</div>
					</template>
				</yx-form>
			</Dialog>
			<Dialog
				:title="dialogTitle125"
				:visible.sync="dialogVisible125"
				:width="dialogWidth125"
				:bottomBtn="dialogBottomBtn125"
			>
				<yx-form
					:inline="true"
					:data="formData125"
					:items="formCfg125"
					:formAction="formAction125"
				>
				</yx-form>
				<yx-table
					:select="false"
					v-loading="loading124"
					:columns="tableColumns124"
					:pagination="page124"
					:data="tableData124"
				>
				</yx-table>
			</Dialog>
			<Dialog
				:title="dialogTitle128"
				:visible.sync="dialogVisible128"
				:width="dialogWidth128"
				:bottomBtn="dialogBottomBtn128"
			>
				<yx-form
					:inline="true"
					:data="formData126"
					:items="formCfg126"
					:formAction="formAction126"
				>
				</yx-form>
				<yx-table
					v-loading="loading127"
					:columns="tableColumns127"
					:pagination="page127"
					:data="tableData127"
				>
					<template slot="yxCouponId" slot-scope="scope">
						<el-radio
							v-model="yxCouponId"
							:label="scope.row.yxCouponId"
							@change="changeYxCouponId(scope.row, yxKey, yxCouponIndex)"
							>选择
						</el-radio>
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
import moment from 'moment'
import {
	getActByCondition,
	updateActStatus,
	getActLimitMarkupDetail,
	saveActLimitMarkup,
	getActMentoringProgramDetail,
	saveActMentoringProgram,
	saveActInviteCode,
	saveActNew,
	getActNewDetail,
} from '@/api/yhtPlusCmsAct'
import { getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
import { downloadFile } from '@/utils/helper/common'
import { getGoodsGroupListByConditionForCMS } from '@/api/coupon'
import { getOrganizationListByCondition } from '@/api/yhtPlusCmsOrganization'
import { importActHatchingOrganizations } from '@/api/webImport'
import { addHatching } from '@/api/actHatching'
import { findCouponListByParam } from '@/api/coupon'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
	},
	props: [],
	data() {
		return {
			dialogTitle128: '选择优惠券',
			dialogWidth128: '800px',
			dialogVisible128: false,
			yxCouponId: '',
			yxKey: '',
			yxCouponIndex: null,
			dialogBottomBtn128: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible128 = false
					},
				},
			],
			formData126: {
				couponName: '',
			},
			formCfg126: [
				{
					type: 'input',
					title: '筛选',
					dataIndex: 'couponName',
					placeholder: '优惠券名称',
				},
			],
			formAction126: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						this._findCouponListByParam(true)
					},
				},
			],
			loading127: false,
			tableData127: [],
			tableColumns127: [
				{
					type: 'custom',
					dataIndex: 'yxCouponId',
				},
				{
					type: 'string',
					dataIndex: 'couponName',
					title: '优惠券名称',
				},
			],
			page127: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._findCouponListByParam()
				},
			},
			loading124: false,
			tableColumns124: [
				{
					type: 'string',
					dataIndex: 'phone',
					title: '手机号',
				},
				{
					type: 'string',
					dataIndex: 'organizationName',
					title: '店铺',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.setUserList(row)
							},
							customRender: (action, row) => {
								let flag = this.organizationList.some(
									(item) => item.organizationId === row.organizationId
								)
								action.title = flag ? '移除' : '添加'
								return action
							},
						},
					],
				},
			],
			tableData124: [],
			page124: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData124()
				},
			},
			formData125: {
				phone: '',
			},
			formCfg125: [
				{
					title: '筛选',
					type: 'input',
					dataIndex: 'phone',
				},
			],
			formAction125: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData124(true)
					},
				},
			],
			dialogTitle125: '选择店主',
			dialogVisible125: false,
			dialogWidth125: '800px',
			dialogBottomBtn125: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible125 = false
					},
				},
			],
			organizationList: [],
			totalCodeReward: [],
			mutualRewardList: [],
			dialogTitle116: '互助计划编辑',
			dialogVisible116: false,
			dialogWidth116: '800px',
			dialogBottomBtn116: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog117.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveHelpPlan()
								// this.dialogVisible105 = false
							}
						})
					},
				},
			],
			formData117: {
				actName: '',
				actStartTime: '',
				actEndTime: '',
				limitAmount: '',
				actRoleImageList: [],
				actImageList: [],
				state: 1,
				isShow: 1,
			},
			formRules117: {
				actStartTime: [
					{ required: true, message: '请选择活动开始时间', trigger: 'change' },
				],
				actEndTime: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请选择活动结束时间'))
							} else if (this.formData117.actStartTime > value) {
								callback(new Error('活动开始时间不能大于结束时间'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				limitAmount: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入最低销售额'))
							} else if (value <= 0) {
								callback(new Error('最低销售额不能小于等于0'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				actRoleImageList: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData117.actRoleImageList.length) {
								callback(new Error('请上传一张活动规则图片'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				actImageList: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData117.actImageList.length) {
								callback(new Error('请上传一张活动图片'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
			},
			formCfg117: [
				{
					title: '活动名称',
					type: 'input',
					dataIndex: 'actName',
					disabled: true,
				},
				{
					title: '活动时间',
					type: 'datetimerange',
					dataIndex: ['actStartTime', 'actEndTime'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					title: '达标销售额',
					type: 'inputNumber',
					dataIndex: 'limitAmount',
				},
				{
					type: 'custom',
					dataIndex: 'addMutualReward',
					unformItem: true,
				},
				{
					type: 'uploadImage',
					title: '活动规则',
					dataIndex: 'actRoleImageList',
					uploadAttributes: {
						limit: 9,
						imageName: 'actRoleUrl',
						httpRequest: (file) =>
							this.uploadImageRequest(file, 'actRoleImageList', 'actRoleUrl'),
					},
				},
				{
					type: 'uploadImage',
					title: '活动图片',
					dataIndex: 'actImageList',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'actImageUrl',
						httpRequest: (file) =>
							this.uploadImageRequest(file, 'actImageList', 'actImageUrl'),
					},
				},
				{
					type: 'radio',
					dataIndex: 'state',
					title: '活动状态',
					label: 'value',
					options: [
						{
							value: '开启',
							state: 1,
						},
						{
							value: '禁用',
							state: 2,
						},
					],
				},
				{
					type: 'radio',
					dataIndex: 'isShow',
					title: '小程序端入口',
					label: 'value',
					options: [
						{
							value: '开启',
							isShow: 1,
						},
						{
							value: '禁用',
							isShow: 0,
						},
					],
				},
			],
			selectGroupList: [],
			dialogTitle105: '选择分组',
			dialogWidth105: '800px',
			dialogVisible105: false,
			dialogBottomBtn105: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible105 = false
					},
				},
			],
			formData115: {
				groupNameKeyword: '',
				goodsGroupStateList: [1, 2],
				saleStartTime: moment().startOf('month').valueOf(),
				saleEndTime: moment().endOf('month').valueOf(),
			},
			formCfg115: [
				{
					type: 'input',
					title: '筛选',
					dataIndex: 'groupNameKeyword',
					placeholder: '分组名称/品牌名称',
				},
				{
					type: 'checkbox',
					dataIndex: 'goodsGroupStateList',
					title: '售卖状态',
					label: 'value',
					options: [
						{
							value: '未开始',
							goodsGroupStateList: 1,
						},
						{
							value: '进行中',
							goodsGroupStateList: 2,
						},
						{
							value: '已结束',
							goodsGroupStateList: 3,
						},
					],
				},
				{
					title: '添加时间',
					type: 'datetimerange',
					dataIndex: ['saleStartTime', 'saleEndTime'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
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
			],
			loading104: false,
			tableData104: [],
			curTime: new Date().getTime(),
			tableColumns104: [
				{
					type: 'string',
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
					this.getData104()
				},
			},
			loading: false,
			formData106: {
				activeKeyword: '',
			},
			formCfg106: [
				{
					type: 'input',
					title: '活动名称',
					dataIndex: 'activeKeyword',
					placeholder: '请输入活动名称',
				},
			],
			formAction106: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.getData107(true)
					},
				},
			],
			tableData107: [
				{
					demo: 'test',
				},
			],
			tableColumns107: [
				{
					type: 'string',
					dataIndex: 'actId',
					title: '活动Id',
				},
				{
					type: 'string',
					dataIndex: 'actName',
					title: '活动名称',
				},
				{
					type: 'custom',
					dataIndex: 'status',
					title: '活动状态',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '查看配置',
							auth: '',
							click: (row) => {
								if (row.actId == 6) {
									this.getActNewDetail(row, true)
								} else if (row.actId == 11) {
									this.dialogTitle111 = `${row.actName}查看`
									this.formDisabled112 = true
									this._getActLimitMarkupDetail(row, false)
									// _this.actLimitMarkupCheck(row)
								}
							},
							customRender: (action, row) => {
								let hide =
									(row.actId == 6 && row.actNew) ||
									(row.actId == 11 &&
										row.actLimitMarkup &&
										(row.actLimitMarkup.state == 1 ||
											row.actLimitMarkup.state == 2))
								action.hide = !hide
								return action
							},
							dialogId: 111,
						},
						{
							title: '禁用',
							auth: '',
							dialogId: '',
							click: (row) => {
								this._updateActStatus(row)
							},
							customRender: (action, row) => {
								let hide =
									(row.actId == 6 && row.actNew && row.actNew.status == 1) ||
									(row.actId == 10 &&
										row.actMentoringProgram &&
										row.actMentoringProgram.state == 1) ||
									(row.actId == 11 &&
										row.actLimitMarkup &&
										row.actLimitMarkup.state == 1) ||
									((row.actId == 13 || row.actId == 14 || row.actId == 15) &&
										row.status == 1) ||
									(row.actId == 17 && row.status == 1)
								action.hide = !hide
								return action
							},
						},
						{
							title: '开启',
							auth: '',
							dialogId: '',
							click: (row) => {
								this._updateActStatus(row)
							},
							customRender: (action, row) => {
								let hide =
									(row.actId == 6 && row.actNew && row.actNew.status == 2) ||
									(row.actId == 10 &&
										row.actMentoringProgram &&
										row.actMentoringProgram.state == 2) ||
									(row.actId == 11 &&
										row.actLimitMarkup &&
										row.actLimitMarkup.state == 2) ||
									((row.actId == 13 || row.actId == 14 || row.actId == 15) &&
										row.status != 1) ||
									(row.actId == 17 && row.status != 1)
								action.hide = !hide
								return action
							},
						},
						{
							title: '编辑',
							auth: '',
							dialogId: 115,
							click: (row) => {
								if (row.actId == 6) {
									this.getActNewDetail(row, false)
								} else if (row.actId == 7) {
									// _this.codeRewardEdit(row)
								} else if (row.actId == 10) {
									// 互助计划
									this._getActMentoringProgramDetail(row)
									// _this.helpPlanEdit(row)
								} else if (row.actId == 11) {
									// 获取限制加价活动详情
									// _this.actLimitMarkupEdit(row)
									this.dialogTitle111 = `${row.actName}编辑`
									this.formDisabled112 = false
									this._getActLimitMarkupDetail(row, true)
								}
							},
							customRender: (action, row) => {
								let hide = row.actId == 6 || row.actId == 10 || row.actId == 11
								action.hide = !hide
								return action
							},
						},
						{
							title: '新增活动配置',
							auth: '',
							dialogId: 113,
							click: (row) => {
								this.formData114 = {
									orderStartTime: '',
									orderEndTime: '',
									inviteCodeEffectiveTime: '',
									remark: '',
									actId: row.actId,
								}
								this.totalCodeReward = []
								this.organizationList = []
								this.dialogVisible113 = true
								this.$nextTick(() => {
									this.$refs.dialog114.$refs.YxForm.clearValidate()
								})
							},
							customRender: (action, row) => {
								let hide = row.actId == 7 && row.status == 1
								action.hide = !hide
								return action
							},
						},
						{
							title: '查看活动',
							auth: '',
							dialogId: '',
							click: ({ actId }) => {
								if (actId == 16) {
									this.$router.push({
										path: `/ym/shopkeeperHatch`,
									})
								} else if (actId == 7) {
									this.$router.push({
										path: `/ym/codeReward`,
									})
								}
							},
							customRender: (action, row) => {
								let hide = row.actId == 7 || row.actId == 16
								action.hide = !hide
								return action
							},
						},
						{
							title: '新增活动',
							auth: 'addHatching',
							dialogId: 109,
							click: () => {
								this.$nextTick(() => {
									this.$refs.dialog104.$refs.YxForm.clearValidate()
								})
								// this.activeRow = row
								this.dialogVisible109 = true
							},
							customRender: (action, row) => {
								let hide = row.actId == 16
								action.hide = !hide
								return action
							},
						},
					],
				},
			],
			page107: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData107()
				},
			},
			dialogTitle109: 'vip店主孵化计划活动配置',
			dialogWidth109: '600px',
			dialogVisible109: false,
			dialogBottomBtn109: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog110.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.configurationSave()
								// this.dialogVisible105 = false
							}
						})
					},
				},
			],
			formData110: {
				enteredBeginTime: '',
				enteredEndTime: '',
				actPosterImage: [],
				excelDrop: '',
			},
			formRules110: {
				enteredBeginTime: [
					{ required: true, message: '请选择开始时间', trigger: 'change' },
				],
				enteredEndTime: [
					{ required: true, message: '请选择结束时间', trigger: 'change' },
				],
				actPosterImage: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData110.actPosterImage.length) {
								callback(new Error('请上传活动海报'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				excelDrop: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.actHatchingOrganizationsList.length) {
								callback(new Error('该文件信息有误'))
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
					title: '报名时间',
					type: 'datetimerange',
					dataIndex: ['enteredBeginTime', 'enteredEndTime'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					type: 'uploadImage',
					title: '活动海报',
					dataIndex: 'actPosterImage',
					uploadAttributes: {
						limit: 1,
						isEdit: true,
						imageName: 'actPosterUrl',
						httpRequest: (file) => this.uploadImageHttpRequest(file),
					},
				},
				{
					title: '选择店主',
					type: 'custom',
					dataIndex: 'excelDrop',
				},
			],
			actHatchingOrganizationsList: [],
			formAction110: [],
			dialogTitle111: '限制加价活动编辑',
			dialogWidth111: '800px',
			dialogVisible111: false,
			dialogBottomBtn111: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						if (this.formDisabled112) {
							this.dialogVisible111 = false
							return
						}
						this.$refs.dialog112.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveActLimitMarkup()
								// this.dialogVisible105 = false
							}
						})
					},
				},
			],
			formData112: {
				actName: '',
				actStartTime: '',
				actEndTime: '',
				state: '',
				range: '',
			},
			formRules112: {
				state: [
					{ required: true, message: '请选择活动状态', trigger: 'change' },
				],
				actStartTime: [
					{ required: true, message: '请选择活动开始时间', trigger: 'change' },
				],
				actEndTime: [
					{ required: true, message: '请选择活动结束时间', trigger: 'change' },
				],
				actLimitMarkupRangeCheck: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData112.range.toString().length) {
								callback(new Error('请选择活动范围'))
							} else if (
								this.formData112.range == 1 &&
								this.selectGroupList.length > 1000
							) {
								callback(new Error('活动分组太多，请移除已结束的分组'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
			},
			formCfg112: [
				{
					title: '活动名称',
					type: 'input',
					dataIndex: 'actName',
					disabled: true,
				},
				{
					title: '活动时间',
					type: 'datetimerange',
					dataIndex: ['actStartTime', 'actEndTime'],
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
				{
					title: '活动状态',
					type: 'radio',
					dataIndex: 'state',
					placeholder: '请选择活动状态',
					label: 'value',
					options: [
						{
							value: '开启',
							state: 1,
						},
						{
							state: 2,
							value: '禁用',
						},
					],
				},
				{
					title: '活动范围',
					type: 'custom',
					dataIndex: 'actLimitMarkupRangeCheck',
				},
			],
			formAction112: [],
			formDisabled112: false,
			dialogTitle113: '奖励邀请码',
			dialogWidth113: '800px',
			dialogVisible113: false,
			dialogBottomBtn113: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						if (this.formDisabled114) {
							this.dialogVisible113 = false
							return
						}
						this.$refs.dialog114.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveCodeReward()
								// this.dialogVisible105 = false
							}
						})
					},
				},
			],
			formData114: {
				orderStartTime: '',
				orderEndTime: '',
				inviteCodeEffectiveTime: '',
				remark: '',
			},
			formRules114: {
				orderStartTime: [
					{ required: true, message: '请选择开始时间', trigger: 'change' },
				],
				orderEndTime: [
					{ required: true, message: '请选择结束时间', trigger: 'change' },
				],
				inviteCodeEffectiveTime: [
					{ required: true, message: '请选择邀请码有效期', trigger: 'change' },
				],
				remark: [
					{ required: true, message: '请输入邀请码备注', trigger: 'change' },
				],
			},
			formCfg114: [
				{
					title: '下单时间',
					type: 'datetimerange',
					dataIndex: ['orderStartTime', 'orderEndTime'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
				{
					title: '邀请码有效期',
					type: 'time',
					timeAttributes: {
						type: 'datetime',
					},
					dataIndex: 'inviteCodeEffectiveTime',
					placeholder: '请选择邀请码有效期',
				},
				{
					title: '邀请码备注',
					type: 'textarea',
					dataIndex: 'remark',
					placeholder: '请输入邀请码备注',
				},
				{
					type: 'custom',
					dataIndex: 'codeRewardList',
					unformItem: true,
				},
				{
					type: 'custom',
					dataIndex: 'organizationList',
					unformItem: true,
				},
			],
			formAction114: [],
			dialogTitle115: '新店主奖励编辑',
			dialogWidth115: '800px',
			dialogVisible115: false,
			dialogBottomBtn115: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						if (this.formDisabled114) {
							this.dialogVisible115 = false
							return
						}
						this.$refs.dialog116.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveInviteNewRewards()
							}
						})
						// this.dialogVisible115 = false
					},
				},
			],
			formData116: {
				actName: '',
				shareGold: '',
				limit: '',
				actNewExt: '',
				status: '',
				accountType: 1,
			},
			formRules118: {
				actNewExt: [
					{ required: true, message: '请输入活动描述', trigger: 'blur' },
				],
				status: [
					{ required: true, message: '请选择活动状态', trigger: 'change' },
				],
			},
			formCfg116: [
				{
					title: '活动名称',
					type: 'input',
					dataIndex: 'actName',
					placeholder: '请输入活动名称',
					disabled: true,
				},
				{
					type: 'custom',
					dataIndex: 'accountType',
					unformItem: true,
				},
				{
					title: '云米数',
					type: 'input',
					dataIndex: 'shareGold',
					placeholder: '请输入云米数',
				},
				{
					title: '每日邀请上限次数',
					type: 'input',
					dataIndex: 'limit',
				},
				{
					title: '活动描述',
					type: 'textarea',
					dataIndex: 'actNewExt',
					placeholder: '请输入活动描述',
				},
				{
					title: '活动状态',
					type: 'radio',
					dataIndex: 'status',
					placeholder: '请选择活动状态',
					label: 'value',
					options: [
						{
							value: '开启',
							status: 1,
						},
						{
							status: 2,
							value: '禁用',
						},
					],
				},
			],
			formAction116: [],
			shareCouponList: [],
			newCouponList: [],
			formDisabled114: false,
		}
	},

	created() {
		this.getData107(true)
	},

	methods: {
		getActNewDetail: async function (row, flag) {
			this.formDisabled114 = flag
			this.formData116 = {
				actName: flag ? row.actName : row.actName + '编辑',
				shareGold: '',
				limit: '',
				actNewExt: '',
				status: '',
				accountType: 1,
				actId: row.actId,
			}
			let {
				data: { resultCode, resultData },
			} = await getActNewDetail({
				actId: row.actId,
			})
			this.shareCouponList = []
			this.newCouponList = []
			if (resultCode == 0) {
				// this.shareCouponList =
				// 	(resultData.actNew && resultData.actNew.newCouponList) || []
				this.formData116.shareGold =
					(resultData.actNew && resultData.actNew.shareGold) || ''
				this.formData116.limit =
					(resultData.actNew && resultData.actNew.limit) || ''
				this.formData116.actNewExt =
					(resultData.actNew && resultData.actNew.actNewExt) || ''
				this.formData116.status =
					(resultData.actNew && resultData.actNew.status) || ''
				if (resultData.actNew && resultData.actNew.newCoupon) {
					let newCouponArr = resultData.actNew.newCoupon.split(',')
					let newCouponCount = []
					for (let i = 0; i < newCouponArr.length; i++) {
						newCouponCount.push(newCouponArr[i].split(':')[1])
					}
					resultData.actNew.newCouponList.map((item, index) => {
						let newCoupon = JSON.parse(JSON.stringify(item))
						newCoupon.couponCount = newCouponCount[index]
						this.shareCouponList.push(newCoupon)
					})
				}
				if (resultData.actNew && resultData.actNew.shareCoupon) {
					let shareCouponArr = resultData.actNew.shareCoupon.split(',')
					let shareCouponAmount = []
					for (let i = 0; i < shareCouponArr.length; i++) {
						shareCouponAmount.push(shareCouponArr[i].split(':')[1])
					}
					resultData.actNew.shareCouponList.map((item, index) => {
						let newCoupon = JSON.parse(JSON.stringify(item))
						newCoupon.couponCount = shareCouponAmount[index]
						this.newCouponList.push(newCoupon)
					})
				}
				this.dialogVisible115 = true
				this.$nextTick(() => {
					this.$refs.dialog116.$refs.YxForm.clearValidate()
				})
			}
		},
		saveInviteNewRewards: async function () {
			let newCoupon = ''
			if (this.shareCouponList.length) {
				for (let i = 0; i < this.shareCouponList.length; i++) {
					if (!this.shareCouponList[i].yxCouponId) {
						this.$message.error('请选择优惠券')
						return
					} else if (this.shareCouponList[i].couponCount <= 0) {
						this.$message.error('请输入赠送数量(不少于1)')
						return
					} else {
						newCoupon +=
							this.shareCouponList[i].yxCouponId +
							':' +
							this.shareCouponList[i].couponCount +
							','
					}
				}
				newCoupon = newCoupon.substr(0, newCoupon.length - 1)
			}
			let shareCoupon = ''
			if (this.newCouponList.length) {
				for (let i = 0; i < this.newCouponList.length; i++) {
					if (!this.newCouponList[i].yxCouponId) {
						this.$message.error('请选择优惠券')
						return
					} else if (this.newCouponList[i].couponCount <= 0) {
						this.$message.error('请输入赠送数量(不少于1)')
						return
					} else {
						shareCoupon +=
							this.newCouponList[i].yxCouponId +
							':' +
							this.newCouponList[i].couponCount +
							','
					}
				}
				shareCoupon = shareCoupon.substr(0, shareCoupon.length - 1)
			}
			let paramJson = {
				actId: this.formData116.actId,
				newCoupon: shareCoupon,
				shareCoupon: newCoupon,
				limit: this.formData116.limit,
				shareGold: this.formData116.shareGold,
				actNewExt: this.formData116.actNewExt,
				status: this.formData116.status,
			}
			let {
				data: { resultCode, resultMsg },
			} = await saveActNew(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible115 = false
				this.getData107()
			}
		},
		openYxCouponDialog(row, key, index) {
			this.yxCouponId = row.yxCouponId
			this.yxCouponIndex = index
			this.yxKey = key
			this.dialogVisible128 = true
			this.formData126.couponName = ''
			this._findCouponListByParam(true)
		},
		_findCouponListByParam: async function (flag) {
			this.loading127 = true
			let paramJson = this.findSearchParams127(flag)
			const {
				data: { resultCode, resultData },
			} = await findCouponListByParam(paramJson)
			if (resultCode == 0) {
				this.tableData127 = resultData.YxCouponList
				this.page127.count = resultData.count
			} else {
				this.tableData127 = []
				this.page127.count = 0
			}
			this.loading127 = false
		},
		findSearchParams127(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page127.currentPage = 1
			}
			const paramJson = Object.assign(this.formData126, {
				length: this.page127.length,
				userRank: 4,
				startIndex: (this.page127.currentPage - 1) * this.page127.length,
			})
			return paramJson
		},
		// 选择优惠券
		changeYxCouponId(row, key, index) {
			this[key][index] = JSON.parse(JSON.stringify(row))
		},
		// 新增优惠券
		addShareCoupon(key) {
			this[key].push({
				couponName: '',
				yxCouponId: '',
				couponCount: '',
			})
		},
		// 搜索优惠券
		querySearchAsync: async function (queryString = '', cb) {
			let {
				data: { resultCode, resultData },
			} = await findCouponListByParam({
				couponName: queryString,
				userRank: 4,
				startIndex: 0,
				length: 20,
			})
			if (resultCode == 0) {
				resultData.YxCouponList.map((item) => {
					item.value = item.couponName
				})
				cb(resultData.YxCouponList)
			}
		},
		addCodeReward() {
			this.totalCodeReward.push({
				startCodeReward: '',
				endCodeReward: '',
				sendCodeReward: '',
			})
		},
		saveCodeReward: async function () {
			if (!this.totalCodeReward.length) {
				this.$message.error('请新增邀请码奖励')
				return
			}
			let totalCodeReward = []
			// 提取排名格式 =>'num-num'
			for (let i = 0; i < this.totalCodeReward.length; i++) {
				if (i > 0 && this.totalCodeReward[i].startCodeReward <= 0) {
					this.$message.error('请输入大于0的销售额')
					return false
				}
				if (this.totalCodeReward[i].endCodeReward <= 0) {
					this.$message.error('请输入大于0的销售额')
					return false
				}
				if (
					this.totalCodeReward[i].startCodeReward >
					this.totalCodeReward[i].endCodeReward
				) {
					this.$message.error('每列销售额的第二个数要大于或等于第二个数!')
					return false
				}
				if (
					i > 0 &&
					this.totalCodeReward[i].startCodeReward <
						this.totalCodeReward[i - 1].endCodeReward
				) {
					this.$message.error('每行销售额的第一个数要大于上一行第二列数!')
					return false
				}
				totalCodeReward.push(
					this.totalCodeReward[i].startCodeReward +
						'-' +
						this.totalCodeReward[i].endCodeReward
				)
			}
			// 整合销售额范围和奖励邀请码个数格式 => 'num-num:num'
			let sendCodeRewardArr = this.totalCodeReward.map((item) => {
				return item.sendCodeReward
			})
			let sendCodeReward = ''
			for (let i = 0; i < sendCodeRewardArr.length; i++) {
				if (sendCodeRewardArr[i] <= 0 || sendCodeRewardArr[i] <= 0) {
					this.$message.error('请输入大于0的奖励邀请码数')
					return false
				} else {
					sendCodeReward +=
						totalCodeReward[i] + ':' + sendCodeRewardArr[i] + ','
				}
			}
			sendCodeReward = sendCodeReward.substr(0, sendCodeReward.length - 1)
			let noReward = ''
			if (this.organizationList.length) {
				let noRewardArr = this.organizationList.map((item) => {
					return item.organizationId
				})
				noReward = noRewardArr.join(',')
			}
			let paramJson = {
				actId: this.formData114.actId,
				orderStartTime: moment(this.formData114.orderStartTime).valueOf(),
				orderEndTime: moment(this.formData114.orderEndTime).valueOf(),
				inviteCodeEffectiveTime: moment(
					this.formData114.inviteCodeEffectiveTime
				).valueOf(),
				remark: this.formData114.remark,
				salesVolumeRange: sendCodeReward,
				noReward,
				state: 1,
			}
			let {
				data: { resultCode, resultMsg },
			} = await saveActInviteCode(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible113 = false
				this.getData107()
			}
		},
		saveHelpPlan: async function () {
			let paramJson = {
				actId: this.formData117.actId,
				actStartTime: moment(this.formData117.actStartTime).valueOf(),
				actEndTime: moment(this.formData117.actEndTime).valueOf(),
				limitAmount: this.formData117.limitAmount,
				state: this.formData117.state,
				isShow: this.formData117.isShow,
				actRoleImageList: [],
				actImage: {},
			}
			if (this.formData117.actMentoringProgramId) {
				paramJson.actMentoringProgramId = this.formData117.actMentoringProgramId
			}
			if (!this.mutualRewardList.length) {
				this.$message.error('至少添加一个奖励范围')
				return
			}
			let actMentoringProgramSaleList = []
			let flag = true
			for (let item of this.mutualRewardList) {
				let minSalesAmount = parseFloat(item.minSalesAmount || 0)
				let maxSalesAmount = parseFloat(item.maxSalesAmount || 0)
				let baseRate = parseFloat(item.baseRate || 0)
				let superiorBaseRate = parseFloat(item.superiorBaseRate || 0)
				if (minSalesAmount <= 0) {
					flag = false
					this.$message.error('请输入最小奖励范围')
					break
				}
				if (minSalesAmount < paramJson.limitAmount) {
					flag = false
					this.$message.error('最小奖励范围不能小于销售额')
					break
				}
				if (maxSalesAmount <= 0) {
					flag = false
					this.$message.error('请输入最大奖励范围')
					break
				}
				if (maxSalesAmount < paramJson.limitAmount) {
					flag = false
					this.$message.error('最大奖励范围不能小于销售额')
					break
				}
				if (baseRate <= 0) {
					flag = false
					this.$message.error('请输入店主达标销售额的总佣金比率')
					break
				}
				if (superiorBaseRate <= 0) {
					flag = false
					this.$message.error('请输入上级店主达标销售额的总佣金比率')
					break
				}
				if (minSalesAmount >= maxSalesAmount) {
					flag = false
					this.$message.error('最小奖励范围不能大于等于最大奖励范围')
					break
				}
				let actMentoringProgramSale = {
					minSalesAmount: item.minSalesAmount,
					maxSalesAmount: item.maxSalesAmount,
					baseRate: item.baseRate,
					superiorBaseRate: item.superiorBaseRate,
				}
				if (item.actMentoringProgramSalesId) {
					actMentoringProgramSale.actMentoringProgramSalesId =
						item.actMentoringProgramSalesId
				}
				actMentoringProgramSaleList.push(actMentoringProgramSale)
			}
			if (!flag) {
				return
			}
			paramJson.actMentoringProgramSaleList = actMentoringProgramSaleList
			this.formData117.actRoleImageList.map((item, index) => {
				let imageObject = JSON.parse(JSON.stringify(item))
				imageObject.sortOrder = index
				delete imageObject.actRoleUrl
				paramJson.actRoleImageList.push(imageObject)
			})
			this.formData117.actImageList.map((item, index) => {
				let imageObject = JSON.parse(JSON.stringify(item))
				imageObject.sortOrder = index
				delete imageObject.actImageUrl
				paramJson.actImage = imageObject
			})
			console.log(paramJson)
			let {
				data: { resultCode, resultMsg },
			} = await saveActMentoringProgram(paramJson)
			if (resultCode == 547) {
				this.$message.error('请按规定填写奖励范围')
			} else if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible116 = false
				this.getData107()
			}
		},
		async uploadImageRequest(params, listName, imageName) {
			//上传海报
			let formData = new FormData()
			if (listName == 'actRoleImageList') {
				formData.append('data', JSON.stringify({ imageType: 71 }))
			} else {
				formData.append('data', JSON.stringify({ imageType: 70 }))
			}
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				resultData.imageList[0][imageName] = getBigImg(
					resultData.imageList[0].imageUrl
				)
				if (listName == 'actRoleImageList') {
					this.formData117[listName].push(...resultData.imageList)
				} else {
					this.formData117[listName] = resultData.imageList
				}
			}
			this.$forceUpdate()
		},
		addMutualReward() {
			this.mutualRewardList.push({
				minSalesAmount: '',
				maxSalesAmount: '',
				superiorBaseRate: '',
				baseRate: '',
			})
		},
		_getActMentoringProgramDetail: async function ({ actId }) {
			// 获取互助计划详情
			let {
				data: { resultCode, resultData },
			} = await getActMentoringProgramDetail({ actId })
			if (resultCode == 0) {
				this.formData117.actId = resultData.act.actId || ''
				this.formData117.actName = resultData.act.actName || ''
				let actMentoringProgram = resultData.actMentoringProgram || {}
				this.formData117.actMentoringProgramId =
					actMentoringProgram.actMentoringProgramId
				this.formData117.actStartTime = actMentoringProgram.actStartTime
				this.formData117.actEndTime = actMentoringProgram.actEndTime
				this.formData117.limitAmount = actMentoringProgram.limitAmount
				this.formData117.state = actMentoringProgram.state
				this.formData117.isShow = actMentoringProgram.isShow
				let actRoleImagesArray = []
				if (actMentoringProgram.actRoleImages) {
					actRoleImagesArray = actMentoringProgram.actRoleImages.split(',')
				}
				actRoleImagesArray.map((item) => {
					this.formData117.actRoleImageList.push({
						imageUrl: getBigImg(item),
						actRoleUrl: getBigImg(item),
					})
				})
				this.formData117.actImageList.push({
					imageUrl: getBigImg(actMentoringProgram.actImageUrl),
					actImageUrl: getBigImg(actMentoringProgram.actImageUrl),
				})
				this.mutualRewardList = resultData.list || []
				this.dialogVisible116 = true
			}
		},
		// 新增vip店主孵化计划活动配置
		configurationSave: async function () {
			let paramJson = {
				enteredBeginTime: moment(this.formData110.enteredBeginTime).valueOf(),
				enteredEndTime: moment(this.formData110.enteredEndTime).valueOf(),
				organizationList: this.actHatchingOrganizationsList,
			}
			paramJson.posterUrl = this.formData110.actPosterImage[0]
			delete paramJson.posterUrl.actPosterUrl
			paramJson.posterUrl = JSON.stringify(paramJson.posterUrl)
			let {
				data: { resultCode, resultMsg },
			} = await addHatching(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible109 = false
				this.getData107()
			}
		},
		onExceed() {
			// 文件超出个数限制时的钩子
			this.$message.warning({
				message: `最多只能上传1个文件`,
			})
		},
		httpRequest: async function (file) {
			let formData = new FormData()
			formData.append('formId', '#excelForm')
			formData.append(
				'data',
				JSON.stringify({
					timeStamp: new Date() * 1,
					groupId: this.$store.state.user.userInfo.groupId || '',
				})
			)
			formData.append('excel', file.file)
			let {
				data: { resultCode, resultData },
			} = await importActHatchingOrganizations(formData)
			if (resultCode === 0) {
				this.actHatchingOrganizationsList =
					resultData.actHatchingOrganizationsList || []
			}
		},
		// 下载Excel模板
		handleDownExcel() {
			downloadFile(`/excel/platform/孵化计划店主名单.xlsx`)
		},
		async uploadImageHttpRequest(params) {
			//上传海报
			let formData = new FormData()
			formData.append('formId', '#portraitImageFrom')
			formData.append('data', JSON.stringify({ imageType: 26 }))
			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				resultData.imageList[0].actPosterUrl = getBigImg(
					resultData.imageList[0].imageUrl
				)
				this.formData110.actPosterImage = resultData.imageList
			}
			this.$forceUpdate()
		},
		// 保存限制加价活动
		saveActLimitMarkup: async function () {
			console.log(this.formData112)
			let paramJson = {
				actId: this.formData112.actId,
				actStartTime: moment(this.formData112.actStartTime).valueOf(),
				actEndTime: moment(this.formData112.actEndTime).valueOf(),
				range: this.formData112.range,
				state: this.formData112.state,
			}
			if (paramJson.range == 1) {
				paramJson.rangeExtList = this.selectGroupList.map((item) => {
					return item.goodsGroupId
				})
				paramJson.rangeExt = paramJson.rangeExtList.join(',')
			}
			if (this.formData112.actLimitMarkupId) {
				paramJson.actLimitMarkupId = this.formData112.actLimitMarkupId
			}
			let {
				data: { resultCode, resultMsg },
			} = await saveActLimitMarkup(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible111 = false
				this.getData107()
			}
		},
		// 获取限制加价活动详情
		_getActLimitMarkupDetail: async function (row) {
			this.formData112.actName = row.actName
			this.formData112.actId = row.actId
			this.formData112.range = 1
			this.selectGroupList = []
			if (row.actLimitMarkup) {
				let {
					data: { resultCode, resultData },
				} = await getActLimitMarkupDetail({
					actId: row.actId,
				})
				if (resultCode == 0) {
					this.selectGroupList = resultData.goodsGroupList || []
					this.formData112 = Object.assign(
						this.formData112,
						resultData.actLimitMarkup
					)
				}
			}
			this.dialogVisible111 = true
		},
		// 开启关闭活动
		_updateActStatus: async function (row) {
			let paramJson = {
				actId: row.actId,
			}
			if (row.actId == 6) {
				if (row.actNew.status == 1) {
					paramJson.status = 2
				} else if (row.actNew.status == 2) {
					paramJson.status = 1
				}
			} else if (row.actId == 10) {
				if (row.actMentoringProgram.state == 1) {
					paramJson.status = 2
				} else if (row.actMentoringProgram.state == 2) {
					paramJson.status = 1
				}
			} else if (row.actId == 11) {
				if (row.actLimitMarkup.state == 1) {
					paramJson.status = 2
				} else if (row.actLimitMarkup.state == 2) {
					paramJson.status = 1
				}
			} else if (
				row.actId == 12 ||
				row.actId == 13 ||
				row.actId == 14 ||
				row.actId == 15
			) {
				if (row.status == 1) {
					paramJson.status = 2
				} else {
					paramJson.status = 1
				}
			} else if (row.actId == 17) {
				this.$confirm(`确定${row.status == 1 ? '禁用' : '启用'}`, '提示', {
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							if (row.status == 1) {
								paramJson.status = 2
							} else {
								paramJson.status = 1
							}
							let {
								data: { resultCode, resultMsg },
							} = await updateActStatus(paramJson)
							if (resultCode == 0) {
								this.$message.success(resultMsg)
								this.getData107()
							}
						}
					},
				})
				return
			}
			let {
				data: { resultCode, resultMsg },
			} = await updateActStatus(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.getData107()
			}
		},
		// 设置标签
		getTag(row) {
			// red:  danger
			// green:  success
			// yellow:  warning
			// gray: info
			if (row.actId == 6) {
				if (row.actNew) {
					if (row.actNew.status == 0) {
						return {
							type: 'warning',
							value: '异常',
						}
					} else if (row.actNew.status == 1) {
						return {
							type: '',
							value: '启用',
						}
					} else if (row.actNew.status == 2) {
						return {
							type: 'danger',
							value: '禁用',
						}
					}
				} else {
					return {
						type: 'info',
						value: '关闭',
					}
				}
			} else if (row.actId == 7) {
				if (row.actInviteCode) {
					return {
						type: '',
						value: '进行中',
					}
				} else {
					return {
						type: 'info',
						value: '关闭',
					}
				}
			} else if (row.actId == 10) {
				if (row.actMentoringProgram) {
					if (row.actMentoringProgram.state == 0) {
						return {
							type: 'warning',
							value: '异常',
						}
					} else if (row.actMentoringProgram.state == 1) {
						return {
							type: '',
							value: '启用',
						}
					} else if (row.actMentoringProgram.state == 2) {
						return {
							type: 'danger',
							value: '禁用',
						}
					}
				} else {
					return {
						type: 'info',
						value: '关闭',
					}
				}
			} else if (row.actId == 11) {
				if (row.actLimitMarkup) {
					if (row.actLimitMarkup.state == 0) {
						return {
							type: 'warning',
							value: '异常',
						}
					} else if (row.actLimitMarkup.state == 1) {
						return {
							type: '',
							value: '启用',
						}
					} else if (row.actLimitMarkup.state == 2) {
						return {
							type: 'danger',
							value: '禁用',
						}
					}
				} else {
					return {
						type: 'info',
						value: '关闭',
					}
				}
			} else if (row.actId == 14 || row.actId == 15) {
				if (row.status == 1) {
					return {
						type: '',
						value: '启用',
					}
				} else if (row.status == 2) {
					return {
						type: 'danger',
						value: '禁用',
					}
				}
			} else if (row.actId == 16) {
				if (row.status == 1) {
					return {
						type: '',
						value: '进行中',
					}
				} else {
					return {
						type: 'danger',
						value: '禁用',
					}
				}
			} else if (row.actId == 17) {
				if (row.status == 1) {
					return {
						type: '',
						value: '启用',
					}
				} else if (row.status == 2) {
					return {
						type: 'danger',
						value: '禁用',
					}
				}
			} else {
				return {
					type: 'info',
					value: '其他',
				}
			}
		},
		storeDrop() {
			this.dialogVisible125 = true
			this.formData125.phone = ''
			this.getData124(true)
		},
		groupDrop() {
			this.dialogVisible105 = true
			this.formData115 = {
				groupNameKeyword: '',
				goodsGroupStateList: [1, 2],
				saleStartTime: moment().startOf('month').valueOf(),
				saleEndTime: moment().endOf('month').valueOf(),
			}
			this._getGoodsGroupListByConditionForCMS(true)
		},
		setUserList(row) {
			let newRow = JSON.parse(JSON.stringify(row))
			let flag = this.organizationList.some(
				(item) => item.organizationId === newRow.organizationId
			)
			if (!flag) {
				this.organizationList.push(newRow)
			} else {
				let index = this.organizationList.findIndex((item) => {
					return item.organizationId == newRow.organizationId
				})
				this.organizationList.splice(index, 1)
			}
		},
		findSearchParams124(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page124.currentPage = 1
			}
			const paramJson = Object.assign(this.formData125, {
				length: this.page124.length,
				startIndex: (this.page124.currentPage - 1) * this.page124.length,
			})
			return paramJson
		},
		async getData124(flag) {
			// 用户列表
			this.loading124 = true
			let paramJson = this.findSearchParams124(flag)
			let {
				data: { resultCode, resultData },
			} = await getOrganizationListByCondition(paramJson)
			this.loading124 = false
			if (resultCode == 0) {
				this.tableData104 = resultData.organizationList
				this.page124.count = resultData.organizationCount
				this.curTime = resultData.currentTime
			} else {
				this.page124.count = 0
				this.tableData104 = []
			}
		},
		setSelectGroupList(row) {
			// 添加/移除分组
			let ids = this.selectGroupList.map((item) => {
				return item.goodsGroupId
			})
			if (ids.indexOf(row.goodsGroupId) == -1) {
				this.selectGroupList.push(row)
			} else {
				this.selectGroupList.splice(ids.indexOf(row.goodsGroupId), 1)
			}
		},
		findUserParams(flag) {
			// 用户搜索条件
			let paramJson = Object.assign(this.formData115, {
				startIndex: 0,
				length: 1,
				goodsType: 1,
				gcategoryList: ['1'],
				organizationId: this.$store.state.user.userInfo.organizationId,
			})
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
		},
		async getData107() {
			this.loading = true
			let paramJson = this.formData106
			const {
				data: { resultCode, resultData },
			} = await getActByCondition(paramJson)
			if (resultCode == 0) {
				this.tableData107 = resultData.actList
				// this.page107.count = resultData.count
			} else {
				this.tableData107 = []
				// this.page107.count = 0
			}
			this.loading = false
		},
	},
}
</script>
<style scoped>
.radio-btn {
	margin-left: 10px;
}
.user-upload {
	display: flex;
}
.down-btn {
	margin-right: 20px;
	height: 34px;
}
.input-item {
	width: 100px;
	margin: 0 5px;
}
.mutual-reward-list {
	display: flex;
	align-items: center;
}
.prefix-star::before {
	content: '*';
	color: #ff6c60;
}
.code-item {
	margin: 10px 0;
}
</style>
