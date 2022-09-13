<template>
	<el-dialog
		width="850px"
		:title="`${dialogTitle}活动`"
		:close-on-click-modal="false"
		:visible.sync="localVisible"
		:before-close="closeForm"
		class="edit-dialog"
	>
		<el-form
			ref="form"
			:rules="rules"
			:model="form"
			label-width="110px"
			:disabled="isCheckDisabled"
		>
			<el-form-item label="活动标题" prop="actName">
				<el-input v-model="form.actName"></el-input>
			</el-form-item>
			<el-form-item label="活动类型" required>
				<el-radio-group
					v-model="form.costType"
					:disabled="isDisabled"
					@change="changecostType"
				>
					<el-radio :label="1">商家型活动（单一商家）</el-radio>
					<el-radio :label="2">平台型活动（可跨商家）</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item
				label="费用归属"
				class="inline-form-item"
				prop="supplierCostRatio"
			>
				商家承担
				<el-form-item>
					<el-input
						v-model.number="form.supplierCostRatio"
						:disabled="isDisabled || form.costType == 2"
						@input="changeRule"
						placeholder=""
						style="width: 70px"
					></el-input>
				</el-form-item>
				%，平台承担
				<el-form-item prop="platformCostRatio">
					<el-input
						disabled
						v-model="form.platformCostRatio"
						placeholder=""
						style="width: 70px"
					></el-input>
				</el-form-item>
				%
			</el-form-item>
			<el-form-item label="结算时间" prop="actSettleTime">
				<el-date-picker
					v-model="form.actSettleTime"
					type="datetime"
					placeholder="结算时间"
					:picker-options="{
						disabledDate: (time) => {
							return time.getTime() < Date.now() - 8.64e7
						},
					}"
					@change="
						() => {
							this.form.id || this.$refs.form.validateField('actSettleTime')
						}
					"
				>
				</el-date-picker>
			</el-form-item>
			<el-form-item label="活动时间" class="inline-form-item" required>
				<el-form-item prop="startTime">
					<el-date-picker
						v-model="form.startTime"
						type="datetime"
						:disabled="isDisabled"
						:picker-options="{
							disabledDate: (time) => {
								return time.getTime() < Date.now() - 8.64e7
							},
						}"
						@change="
							() => {
								this.form.id || this.$refs.form.validateField('endTime')
							}
						"
						placeholder="选择开始日期"
					>
					</el-date-picker>
				</el-form-item>
				-
				<el-form-item prop="endTime">
					<el-date-picker
						v-model="form.endTime"
						type="datetime"
						:picker-options="{
							disabledDate: (time) => {
								return time.getTime() < Date.now() - 8.64e7
							},
						}"
						@change="
							() => {
								this.form.id || this.$refs.form.validateField('startTime')
							}
						"
						placeholder="选择结束日期"
					>
					</el-date-picker>
				</el-form-item>
			</el-form-item>
			<el-form-item label="活动图片" prop="actPicUrl">
				<el-upload
					class="img-uploader"
					action="#"
					:show-file-list="false"
					:http-request="
						(params) => {
							this.uploadImageHttpRequest(params, 1)
						}
					"
				>
					<img v-if="form.actPicUrl" :src="form.actPicUrl" class="avatar" />
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
				<div class="img-uploader-r">
					<el-image
						v-if="form.actPicUrl"
						class="avatar-check-img"
						src="https://imagecos.yunhuotong.net/2022_05/22486bb0679c4007f63c979c01117762.jpg"
						:preview-src-list="[form.actPicUrl]"
					>
					</el-image>
				</div>
			</el-form-item>
			<el-form-item label="活动规则文案" prop="actRuleContent">
				<el-input
					type="textarea"
					placeholder="请输入内容"
					v-model="form.actRuleContent"
					maxlength="1000"
					:autosize="{ minRows: 2, maxRows: 4 }"
					show-word-limit
				>
				</el-input>
			</el-form-item>
			<el-form-item label="活动力度" prop="actIntensityDesc">
				<el-input v-model="form.actIntensityDesc"></el-input>
			</el-form-item>
			<div class="divider-line"></div>
			<el-form-item label="主会场跳转链接" prop="actMpLink">
				<el-input placeholder="请输入小程序链接" v-model="form.actMpLink">
				</el-input>
			</el-form-item>
			<el-form-item label="栏目推荐" prop="advSwitch">
				<el-switch v-model="form.advSwitch"></el-switch>
			</el-form-item>
			<el-form-item label="广告投放" prop="advPicUrl">
				<el-upload
					class="img-uploader"
					action="#"
					:show-file-list="false"
					:http-request="
						(params) => {
							this.uploadImageHttpRequest(params, 2)
						}
					"
				>
					<img v-if="form.advPicUrl" :src="form.advPicUrl" class="avatar" />
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
				<div class="img-uploader-r">
					<div v-if="form.advPicUrl" class="img-uploader-operation">
						<el-button class="clear-adv" type="text" @click="clearAdvPicUrl">
							删除
						</el-button>
						<el-image
							class="avatar-check-img"
							src="https://imagecos.yunhuotong.net/2022_05/22486bb0679c4007f63c979c01117762.jpg"
							:preview-src-list="[form.advPicUrl]"
						>
						</el-image>
					</div>
					<el-input
						placeholder="请输入跳转链接，为空则不跳转"
						v-model="form.advJumpLink"
					>
					</el-input>
				</div>
			</el-form-item>
			<div class="divider-line"></div>
			<el-form-item label="活动类型" required>
				<el-radio-group
					v-model="form.actType"
					:disabled="isDisabled"
					@change="changeActType"
				>
					<el-radio :label="1">阶梯型奖励活动</el-radio>
					<el-radio :label="2">每满型奖励活动</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="活动指标" required>
				<el-radio-group
					v-model="form.ruleBO.ruleCondType"
					:disabled="isDisabled"
					@change="changeRule"
				>
					<el-radio :label="1">实付金额</el-radio>
					<el-radio :label="2">有效商品数</el-radio>
					<el-radio :label="3">基础佣金</el-radio>
					<el-radio :label="4">卖货佣金</el-radio>
					<el-radio
						:label="5"
						:disabled="form.supplierCostRatio > 0 || supplierDisabled"
						>有效订单数</el-radio
					>
				</el-radio-group>
			</el-form-item>
			<div class="grey-block">
				<div v-if="form.ruleBO.ruleCondType != 5" class="rule-cond-box">
					<span class="rule-cond-label">{{
						ruleCondTypeMap[form.ruleBO.ruleCondType].ruleCondText
					}}</span>
					<span class="rule-cond-text">{{
						ruleCondTypeMap[form.ruleBO.ruleCondType].ruleCondTip
					}}</span>
				</div>
				<div class="valid-order-mt10" v-if="form.ruleBO.ruleCondType == 5">
					<el-form-item label="有效订单" prop="ruleBO.validOrderList" required>
						<el-checkbox-group
							v-model="form.ruleBO.validOrderList"
							class="valid-checkbox"
							@change="changeValidOrder"
						>
							<el-checkbox label="1" name="validOrder" :disabled="isDisabled"
								>订单类型&nbsp;
								<el-select
									:disabled="isDisabled"
									v-model="form.ruleBO.effectiveOrderType"
									placeholder="请选择"
									@change="changeValidOrderValue"
								>
									<el-option
										v-for="item in orderTypeList"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									>
									</el-option> </el-select
							></el-checkbox>
							<el-checkbox label="2" name="validOrder" :disabled="isDisabled"
								>单个订单实付大于等于<el-input
									:disabled="isDisabled"
									type="number"
									v-model.trim="form.ruleBO.effectiveOrderRealAmount"
									style="width: 80px; margin: 0 4px"
									@input="changeValidOrderValue"
								></el-input
								>元,(退货退款需除去对应金额后判断是否满足门槛)</el-checkbox
							>
						</el-checkbox-group>
						<el-checkbox
							v-if="form.ruleBO.validOrderList.indexOf('2') > -1"
							class="sub-checkbox"
							v-model="form.ruleBO.isEffectiveOrderHasMarkup"
							:disabled="isDisabled"
							>不含店主加价部分（即需要剔除加价部分后再计算订单实付）</el-checkbox
						>
					</el-form-item>
				</div>
				<!-- 阶梯数据 s -->
				<div class="rule-config" v-if="form.actType == 1">
					累计指标数据后满足阶梯门槛即获取对应奖励，奖励不叠加。最多设置5个阶梯
				</div>
				<div class="rule-config" v-if="form.actType == 2">
					累计指标数据后按奖励规则每满一次奖励一次
				</div>
				<div
					v-for="(config, index) in form.ruleBO.ruleLadderConfigList"
					:key="config.key"
				>
					<el-form-item
						class="inline-form-item"
						:label="form.actType == 2 ? '每满规则' : '阶梯' + numberMap[index]"
						:rules="{
							required: true,
							message: '',
							trigger: 'blur',
						}"
					>
						{{
							form.ruleBO.ruleCondType === 1
								? '实付'
								: form.ruleBO.ruleCondType === 2
								? '有效商品数'
								: form.ruleBO.ruleCondType === 3
								? '基础佣金'
								: form.ruleBO.ruleCondType === 4
								? '卖货佣金'
								: form.ruleBO.ruleCondType === 5
								? '有效订单数'
								: ''
						}}{{ form.actType == 2 ? '每' : '' }}满
						<el-form-item
							v-if="
								form.ruleBO.ruleCondType === 1 ||
								form.ruleBO.ruleCondType === 3 ||
								form.ruleBO.ruleCondType === 4
							"
							:prop="'ruleBO.ruleLadderConfigList.' + index + '.condition'"
							:rules="[
								{
									required: true,
									message:
										'请输入' +
										(form.ruleBO.ruleCondType === 1
											? '实付'
											: form.ruleBO.ruleCondType === 3
											? '基础佣金'
											: form.ruleBO.ruleCondType === 4
											? '卖货佣金'
											: '') +
										'金额',
									trigger: 'blur',
								},
								{
									message: '最多2位小数',
									pattern: /^\d*(\.?\d{0,2})$/,
									trigger: 'blur',
								},
							]"
						>
							<el-input
								v-model="config.condition"
								:disabled="isDisabled"
								style="width: 70px"
							></el-input>
						</el-form-item>
						<el-form-item
							v-if="
								form.ruleBO.ruleCondType === 2 || form.ruleBO.ruleCondType === 5
							"
							:prop="'ruleBO.ruleLadderConfigList.' + index + '.condition'"
							:disabled="isDisabled"
							:rules="{
								type: 'number',
								min: 0,
								required: true,
								message:
									'请输入' +
									(form.ruleBO.ruleCondType === 2
										? '有效商品'
										: form.ruleBO.ruleCondType === 5
										? '有效订单'
										: '') +
									'数',
								trigger: 'blur',
							}"
						>
							<el-input
								v-model.number="config.condition"
								:disabled="isDisabled"
								style="width: 70px"
							></el-input>
						</el-form-item>
						{{
							form.ruleBO.ruleCondType == 2
								? '件'
								: form.ruleBO.ruleCondType == 5
								? '单'
								: '元'
						}}，奖励
						<el-select
							v-model="config.rewardType"
							:disabled="isDisabled"
							placeholder="请选择"
							@change="changeRewardType(index)"
							style="width: 88px"
						>
							<el-option
								v-for="item in rewardTypeList"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
						<template v-if="config.rewardType == 0"
							><el-form-item
								:prop="'ruleBO.ruleLadderConfigList.' + index + '.amount'"
								:rules="[
									{
										required: true,
										message: '请输入奖励金额',
										trigger: 'blur',
									},
									{
										message: '大于0且最多2位小数',
										pattern: /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/,
										trigger: 'blur',
									},
								]"
							>
								<el-input
									v-model="config.amount"
									placeholder="奖励金额"
									:disabled="isDisabled"
									style="width: 132px"
								></el-input>
							</el-form-item>
							元</template
						>
						<template v-else>
							<el-form-item
								:prop="'ruleBO.ruleLadderConfigList.' + index + '.couponName'"
								:rules="[
									{
										required: true,
										message: '请选择优惠券',
										trigger: 'blur',
									},
								]"
							>
								<el-button
									class="select-coupon-btn"
									type="plain"
									@click="selectCoupon(index, config)"
									:disabled="isDisabled"
									>{{
										config.couponName ? config.couponName : '选择优惠券'
									}}</el-button
								>
							</el-form-item>
						</template>
						<template v-if="form.actType == 1">
							<el-button
								:disabled="isDisabled"
								type="text"
								@click.prevent="addRuleConfig(index)"
								style="margin-left: 20px"
							>
								新增阶梯
							</el-button>
							<el-button
								type="text"
								:disabled="isDisabled"
								@click.prevent="removeRuleConfig(index)"
							>
								删除
							</el-button>
						</template>
					</el-form-item>
				</div>
				<!-- 阶梯数据 e -->
				<template v-if="form.actType == 2">
					<el-form-item label="是否封顶" prop="ruleBO.isCapping" required>
						<el-radio-group
							v-model="form.ruleBO.isCapping"
							:disabled="isDisabled"
						>
							<el-radio :label="0">上不封顶</el-radio>
							<el-radio :label="1"
								>封顶
								<el-input
									type="number"
									v-model="form.ruleBO.cappingAmount"
									@focus="form.ruleBO.isCapping = 1"
									style="width: 70px"
									:disabled="isDisabled"
								></el-input
								>元/张</el-radio
							>
						</el-radio-group>
					</el-form-item>
				</template>
			</div>
			<el-form-item label="活动范围" prop="ruleBO.ruleCondType" required>
				<el-radio-group v-model="form.ruleBO.ruleTargetType">
					<el-radio :disabled="forbiddenChoose || supplierDisabled" :label="1"
						>全平台</el-radio
					>
					<el-radio :label="2" :disabled="form.ruleBO.ruleCondType == 5"
						>指定活动范围</el-radio
					>
					<!-- <el-radio
						:label="4"
						:disabled="form.ruleBO.ruleCondType == 5 || forbiddenChoose"
						>剔除指定商品</el-radio
					> -->
				</el-radio-group>
			</el-form-item>
			<div class="grey-block">
				<template v-if="form.ruleBO.ruleTargetType === 2">
					<el-form-item label="活动档期" prop="goodsGroupList">
						<el-button type="text" @click.prevent="showDialog113">
							添加档期
						</el-button>
						<div class="selected-list">
							<span
								v-for="goodsGroup in goodsGroupList"
								:key="goodsGroup.goodsGroupId"
							>
								{{ goodsGroup.groupName }}
							</span>
						</div>
					</el-form-item>
					<el-form-item label="活动商品" prop="goodsList">
						<el-button type="text" @click.prevent="handleCommodity">
							添加商品
						</el-button>
						<div class="selected-list">
							<span v-for="goods in goodsList" :key="goods.goodsId">
								{{ goods.goodsName }}
							</span>
						</div>
					</el-form-item>
				</template>
				<template
					v-if="
						form.ruleBO.ruleTargetType === 1 || form.ruleBO.ruleTargetType === 4
					"
				>
					<div class="rule-checkbox">
						<el-checkbox
							v-model="form.ruleBO.isEliminateBaseCommissionGe"
							:disabled="isDisabled"
							><span>剔除基础佣金大于等于</span
							><el-input
								type="number"
								v-model.trim="form.ruleBO.eliminateBaseCommissionGe"
								:disabled="isDisabled"
								@input="changeValidCommissionValue"
								style="width: 80px; margin: 0 4px"
							></el-input
							>元的商品</el-checkbox
						>
					</div>
				</template>
				<!-- <template
					v-if="
						form.ruleBO.ruleTargetType === 1 || form.ruleBO.ruleTargetType === 4
					"
				>
					<div class="rule-checkbox">
						<el-checkbox v-model="form.ruleBO.isCustomConditions"
							><span>佣金率大于</span
							><el-input
								type="number"
								disabled
								v-model.trim="form.ruleBO.customValue"
								style="width: 80px; margin: 0 4px"
							></el-input
							>%商品不参与</el-checkbox
						>
					</div>
				</template> -->
			</div>
			<el-form-item label="活动面向用户" prop="actCashRewardTagList">
				<el-select
					value-key="userTagId"
					v-model="form.actCashRewardTagList"
					clearable
					multiple
					filterable
					remote
					:remote-method="_getUserTagList"
					default-first-option
					placeholder="请选择分群"
					:disabled="isDisabled"
				>
					<el-option
						v-for="item in userTagList"
						:key="item.userTagId"
						:label="item.tagName"
						:value="item"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="活动报名" prop="qualificationSwitch">
				<el-switch
					v-model="form.qualificationSwitch"
					:disabled="isDisabled"
				></el-switch
				><span
					>&nbsp;&nbsp;注：没有报名的用户，不显示活动数据，不做奖励。按报名时间开始统计活动数据</span
				>
			</el-form-item>
			<template v-if="form.ruleBO.ruleCondType == 5 && form.actNotifySwitch">
				<el-form-item label="活动通知" prop="actNotifySwitch">
					<el-switch
						v-model="form.actNotifySwitch"
						:disabled="isDisabled"
					></el-switch
					><span
						>&nbsp;&nbsp;注：用于商品详情页弹窗通知参与活动（产生有效订单）的店主。</span
					>
				</el-form-item>
			</template>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">确定</el-button>
				<el-button @click="closeForm">取消</el-button>
			</el-form-item>
		</el-form>
		<Dialog
			:title="dialogTitle113"
			:visible.sync="dialogVisible113"
			:width="dialogWidth113"
			:bottomBtn="dialogBottomBtn113"
		>
			<yx-form
				:inline="true"
				:data="formData114"
				:items="formCfg114"
				:formAction="formAction114"
			>
			</yx-form
			><yx-table
				v-loading="loading115"
				:columns="tableColumns115"
				:pagination="page115"
				:data="tableData115"
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
		<add-commodity-dialog
			:visible.sync="dialogCommodityVisible"
			:commodityExt="commodityExt"
			:listData="listData"
			@saveCommodity="saveCommodity"
		></add-commodity-dialog>
		<CouponDialog
			:itemInfo="selCouponData"
			:visible.sync="isCouponDialog"
			@fatherMethodInit="handleSelectedCoupon"
		/>
	</el-dialog>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import Dialog from '@/components/Dialog'
import addCommodityDialog from './addCommodityDialog'
import CouponDialog from './CouponDialog'
import moment from 'moment'
import { uploadImgToCos } from '@/utils/upload'
import { getGoodsGroupListByConditionForCMS } from '@/api/goodsGroup'
import { getDetail, saveOrUpdate } from '@/api/marketing'
import { getUserTagList } from '@/api/platformUserGroupTag'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		YxForm,
		YxTable,
		Dialog,
		addCommodityDialog,
		CouponDialog,
	},

	data() {
		return {
			ruleCondTypeMap: {
				1: {
					ruleCondText: '实付金额',
					ruleCondTip: '活动期间，店铺产生的累计订单实付金额（含店主加价）。',
				},
				2: {
					ruleCondText: '有效商品数',
					ruleCondTip: '活动期间，店铺产生的有效活动商品数。',
				},
				3: {
					ruleCondText: '基础佣金',
					ruleCondTip: '活动期间，店铺产生的有效订单基础佣金总额。',
				},
				4: {
					ruleCondText: '卖货佣金',
					ruleCondTip: '活动期间，店铺产生的有效订单卖货佣金总额。',
				},
				5: {
					ruleCondText: '有效订单数',
					ruleCondTip: '活动期间，店铺产生的有效订单数。',
				},
			},
			curTime: new Date().getTime(),
			isDisabled: false,
			isCheckDisabled: false,
			curSettleTime: 0,
			editLoading: false,
			forbiddenChoose: false,
			dialogType: '',
			dialogTitle: '',
			supplierDisabled: true, //选择商家型活动禁用按钮
			form: {
				id: '',
				actName: '',
				supplierCostRatio: 0,
				platformCostRatio: 100,
				endTime: '',
				startTime: '',
				actType: 1,
				actSettleType: 1,
				actPicUrl: '',
				actRuleContent: '',
				actIntensityDesc: '',
				actMpLink: '',
				costType: 1,
				actSettleTime: '',
				ruleBO: {
					ruleCondType: 1, //活动指标条件类型 1.实付金额 2.有效商品数 3.基础佣金 4.卖货佣金
					ruleLadderConfigList: [
						{
							key: Symbol(), //阶梯顺序，依次递增
							condition: '', //条件数值，如满元or满件
							amount: 0, //奖励金额
							rewardType: 0, //奖励类型
							couponName: '', //奖励类型为1时 优惠券名称
							couponId: '', //奖励类型为1时 优惠券Id
						},
					],
					ruleTargetType: 2,
					isCapping: 0, //是否封顶 0.否 1.是
					cappingAmount: '', //封顶金额
					customConditions: 0, // 定制条件 0.无，1.佣金率大于20%商品不参与
					isCustomConditions: false, // 定制条件
					customValue: 20, // 佣金率
					validOrderList: [], // 有效订单
					effectiveOrderType: 0, // 有效订单类型
					effectiveOrderRealAmount: '', // 有效订单门槛
					effectiveOrderHasMarkup: 1, // 有效订单门槛 1.含加价 0.不含加价
					isEffectiveOrderHasMarkup: false, // 有效订单门槛 false.含加价 true.不含加价
					eliminateBaseCommissionGe: '', // 剔除指定商品 佣金金额
					isEliminateBaseCommissionGe: false,
				},
				goodsGroupList: undefined,
				goodsList: undefined,
				advSwitch: false, //栏目推荐
				advPicUrl: '', // 广告图片
				advJumpLink: '', // 广告跳转链接
				actCashRewardTagList: [], // 用户分群
				qualificationSwitch: false, // 活动报名
				actNotifySwitch: false, // 活动通知
			},
			orderTypeList: [
				{
					value: 0,
					label: '请选择',
				},
				{
					value: 1,
					label: '所有订单',
				},
				{
					value: 2,
					label: '自购订单',
				},
				{
					value: 3,
					label: '销售订单',
				},
			],
			rewardTypeList: [
				{
					value: 0,
					label: '现金',
				},
				{
					value: 1,
					label: '优惠券',
				},
			],
			numberMap: ['一', '二', '三', '四', '五'],
			rules: {
				actName: [
					{ required: true, message: '请输入活动名称', trigger: 'blur' },
					{ max: 20, message: '最长20个字符', trigger: 'blur' },
				],
				supplierCostRatio: [
					{ required: true, message: '请输入费用归属', trigger: 'blur' },
					{
						type: 'number',
						min: 0,
						max: 100,
						message: '费用归属范围应该设置0~100',
						trigger: 'blur',
					},
					{
						validator: (_, value, callback) => {
							if (value === 0) {
								if (this.form.costType == 1) {
									console.log('----', value)
									callback(new Error('商家承担必须大于0'))
								} else {
									callback()
								}
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				actSettleTime: [
					{ required: true, message: '结算时间不能为空', trigger: 'change' },
					{
						validator: (_, value, callback) => {
							if (!value) {
								callback(new Error('结算时间不能为空'))
							} else if (
								this.form.endTime &&
								moment(this.form.actSettleTime).valueOf() <
									moment(this.form.endTime).valueOf() + 8.64e7 * 25
							) {
								callback(new Error('结算时间不得小于活动结束时间25天'))
							} else if (
								this.form.endTime &&
								moment(this.form.actSettleTime).valueOf() >
									moment(this.form.endTime).valueOf() + 8.64e7 * 100
							) {
								callback(new Error('结算时间不得大于活动结束时间100天'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				startTime: [
					{
						required: true,
						validator: (_, value, callback) => {
							const now = new Date().getTime()
							if (!this.form.startTime) {
								callback(new Error('请选择活动开始时间'))
							} else if (!this.form.id && this.form.startTime < now) {
								callback(new Error('开始时间不能小于当前时间'))
							} else if (this.form.startTime >= this.form.endTime) {
								callback(new Error('开始时间不能大于结束时间'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				endTime: [
					{
						required: true,
						validator: (_, value, callback) => {
							// console.log('endTime', this.form.startTime >= this.form.endTime)
							if (this.dialogType == 3) {
								callback()
								return
							}
							const now = new Date().getTime()
							if (!this.form.endTime) {
								callback(new Error('请选择活动结束时间'))
							} else if (this.form.endTime < now) {
								callback(new Error('结束时间不能小于当前时间'))
							} else if (this.form.startTime >= this.form.endTime) {
								callback(new Error('结束时间不能小于开始时间'))
							} else if (
								this.curSettleTime &&
								this.curSettleTime <= this.form.endTime
							) {
								callback(new Error('结束时间不能大于结算时间'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				actPicUrl: [
					{ required: true, message: '请上传活动图片', trigger: 'change' },
				],
				actRuleContent: [
					{
						required: true,
						message: '请上输入活动规则文案',
						trigger: 'change',
					},
				],
				actIntensityDesc: [
					{ required: true, message: '请输入活动力度', trigger: 'blur' },
					{ max: 15, message: '最长15个字符', trigger: 'blur' },
				],
				goodsGroupList: {
					validator: (_, __, callback) => {
						if (
							(!this.goodsList || this.goodsList.length === 0) &&
							(!this.goodsGroupList || this.goodsGroupList.length === 0)
						) {
							callback(new Error('活动档期或活动商品两个选项至少一项不为空'))
						} else {
							callback()
						}
					},
				},
				'ruleBO.validOrderList': [
					{
						required: true,
						message: '请至少选择一个有效订单类型',
						trigger: 'change',
					},
				],
			},
			/** 选择会场 s **/
			goodsGroupList: [],
			page115: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData115()
				},
			},
			dialogTitle113: '选择档期',
			dialogWidth113: '60%',
			dialogVisible113: false,
			dialogBottomBtn113: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible113 = false
					},
				},
			],
			formData114: {
				groupNameKeyword: '',
				goodsType: 1,
			},
			formCfg114: [
				{
					type: 'input',
					title: '筛选',
					dataIndex: 'groupNameKeyword',
					placeholder: '品牌名称',
				},
				{
					type: 'select',
					title: '营销类型',
					dataIndex: 'goodsType',
					label: 'value',
					options: [
						{
							goodsType: 1,
							value: '品牌营销',
						},
						{
							goodsType: 2,
							value: '专享营销',
						},
					],
				},
			],
			formAction114: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						if (!this.loading115) this.getData115(true)
					},
					tableId: 115,
				},
			],
			tableData115: [],
			tableColumns115: [
				{
					type: 'string',
					dataIndex: 'groupName',
					title: '档期名称',
				},
				{
					title: '会场名称',
					type: 'string',
					dataIndex: 'brandName',
				},
				{
					title: '售卖时间',
					type: 'string',
					dataIndex: 'saleStartTime',
					customRender: (row) => {
						return (
							moment(row.saleStartTime).format('YYYY-MM-DD HH:mm:ss') +
							'-' +
							moment(row.saleEndTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					title: '售卖状态',
					type: 'custom',
					dataIndex: 'saleState',
				},
				{
					title: '商品数',
					type: 'string',
					dataIndex: 'goodsCount',
				},
				{
					title: '操作',
					type: 'action',
					fixed: 'right',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.updatedGoodsGroup(row)
							},
							customRender: (action, row) => {
								let remove = this.goodsGroupList.some(
									(e) => e.goodsGroupId === row.goodsGroupId
								)
								action.title = remove ? '移除' : '添加'
								// action.hide =
								// 	row.actDiscountId &&
								// 	this.formData112.actDiscountId != row.actDiscountId
								this.$forceUpdate()
								return action
							},
						},
					],
				},
			],
			loading115: false,
			/** 选择会场 e **/

			/** 选择商品 s **/
			goodsList: [],

			dialogCommodityVisible: false,
			commodityExt: [],
			listData: {},
			selectCommodityList: [],
			/** 选择商品 e **/
			//----------选择人群-------------
			userTagList: [],
			//----------选择人群-------------
			//----------选择优惠券-------------
			selCouponData: {},
			isCouponDialog: false,
			//----------选择优惠券-------------
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
		uploadHead() {
			// 上传文件请求头
			return {
				'X-AUTH-TOKEN': this.getSessionKey,
			}
		},
	},

	methods: {
		async detail(dialogType, row) {
			this.editLoading = true
			const titleMap = {
				1: '新建',
				2: '编辑',
				3: '查看',
			}
			this.dialogTitle = titleMap[dialogType] || ''
			this.dialogType = dialogType

			this.goodsGroupList = []
			this.goodsList = []

			this.curSettleTime = 0
			this.isCheckDisabled = false
			this.isDisabled = false
			this.dialogType == 3 && (this.isCheckDisabled = true)
			// 编辑
			if (dialogType == 2 || dialogType == 3) {
				let {
					data: { resultData },
				} = await getDetail({ actId: row.id })
				const curRow = resultData
				const transform = {}

				this.curSettleTime = curRow.actSettleTime
				this.curTime = new Date().getTime()
				// 是否禁用操作
				this.isDisabled = curRow.startTime && this.curTime >= curRow.startTime
				curRow.actCashRewardTagList = curRow.actCashRewardTagList || []

				Object.keys(this.form).forEach((key) => {
					transform[key] = curRow[key]
				})

				if (transform.actCashRewardTagList.length > 0) {
					this.userTagList = transform.actCashRewardTagList
				}

				if (curRow.platformCostRatio) {
					transform.platformCostRatio = Math.round(
						(curRow.platformCostRatio + Number.EPSILON) * 100
					)
				}
				if (curRow.supplierCostRatio) {
					transform.supplierCostRatio = Math.round(
						(curRow.supplierCostRatio + Number.EPSILON) * 100
					)
				}
				if (curRow.actSettleTime) {
					transform.actSettleTime = moment(curRow.actSettleTime)
				}
				transform.endTime = moment(curRow.endTime)
				transform.startTime = moment(curRow.startTime)
				transform.advSwitch = curRow.advSwitch == 1 ? true : false
				transform.qualificationSwitch =
					curRow.qualificationSwitch == 1 ? true : false
				transform.actNotifySwitch = curRow.actNotifySwitch == 1 ? true : false

				transform.ruleBO = curRow.ruleBO
				if (transform.ruleBO.ruleTargetType == 4) {
					transform.ruleBO.ruleTargetType = 1
				}
				transform.ruleBO.isEliminateBaseCommissionGe = false
				if (transform.ruleBO.eliminateBaseCommissionGe > 0) {
					transform.ruleBO.isEliminateBaseCommissionGe = true
				}
				transform.ruleBO.isCustomConditions = false
				if (transform.ruleBO.customConditions == 1) {
					transform.ruleBO.isCustomConditions = true
				}
				transform.ruleBO.validOrderList = []
				transform.ruleBO.isEffectiveOrderHasMarkup = false
				if (curRow.ruleBO.ruleCondType == 5) {
					if (curRow.ruleBO.effectiveOrderType) {
						transform.ruleBO.validOrderList.push('1')
					}
					if (curRow.ruleBO.effectiveOrderRealAmount) {
						transform.ruleBO.validOrderList.push('2')
						if (transform.ruleBO.effectiveOrderHasMarkup == 1) {
							transform.ruleBO.isEffectiveOrderHasMarkup = false
						} else {
							transform.ruleBO.isEffectiveOrderHasMarkup = true
						}
					}
				}

				transform.ruleBO.ruleLadderConfigList = curRow.ruleBO.ruleLadderConfigList.map(
					(config) => {
						config.rewardType = config.rewardType || 0
						return { ...config, key: Symbol() }
					}
				)
				// 活动商品列表
				this.goodsList = []
				// 活动档期列表
				this.goodsGroupList = []
				if (curRow.ruleBO.ruleTargetType === 2 && curRow.ruleBO.listTargetBO) {
					curRow.ruleBO.listTargetBO.forEach((target) => {
						switch (target.targetType) {
							case 2:
								this.goodsGroupList.push({
									goodsGroupId: target.targetId,
									groupName: target.targetName,
								})
								break
							case 3:
								this.goodsList.push({
									goodsId: target.targetId,
									goodsName: target.targetName,
									goodsSnapshotId: target.targetSnapshotId,
									goodsGroupId: target.goodsGroupId,
								})
								break
						}
					})
				}
				this.form = {
					...transform,
				}

				this.changeRule()
				console.log('goodsGroupList', this.goodsGroupList)
				console.log('goodsList', this.goodsList)
				console.log('form', this.form)
			}
			if (this.dialogType == 3) {
				this.$refs.form.resetFields()
			}
			this.editLoading = false
		},

		// 转换数据提交后台
		transformDataToSubmit(form) {
			// console.log('form------------', form)
			let transform = Object.assign({}, form)
			transform.platformCostRatio = form.platformCostRatio / 100
			transform.supplierCostRatio = form.supplierCostRatio / 100

			transform.startTime = moment(transform.startTime).valueOf()
			transform.endTime = moment(transform.endTime).valueOf()
			transform.actSettleTime = moment(transform.actSettleTime).valueOf()
			transform.advSwitch = transform.advSwitch ? 1 : 0
			transform.qualificationSwitch = transform.qualificationSwitch ? 1 : 0
			transform.actNotifySwitch = transform.actNotifySwitch ? 1 : 0
			const ruleBO = transform.ruleBO
			transform.ruleBO = {}

			if (ruleBO.id) {
				transform.ruleBO.id = ruleBO.id
			}

			// 阶梯奖励
			transform.ruleBO.ruleCondType = ruleBO.ruleCondType
			transform.ruleBO.ruleLadderConfigList = ruleBO.ruleLadderConfigList

			transform.ruleBO.isCapping = ruleBO.isCapping
			transform.ruleBO.cappingAmount = ruleBO.cappingAmount
			transform.ruleBO.customConditions = ruleBO.isCustomConditions ? 1 : 0
			transform.ruleBO.customValue = ruleBO.customValue
			if (!ruleBO.isEliminateBaseCommissionGe) {
				ruleBO.eliminateBaseCommissionGe = ''
			}
			transform.ruleBO.eliminateBaseCommissionGe =
				ruleBO.eliminateBaseCommissionGe
			transform.ruleBO.effectiveOrderType = ruleBO.effectiveOrderType
			transform.ruleBO.effectiveOrderRealAmount =
				ruleBO.effectiveOrderRealAmount
			transform.ruleBO.effectiveOrderHasMarkup = ruleBO.isEffectiveOrderHasMarkup
				? 0
				: 1

			transform.ruleBO.ruleTargetType = ruleBO.ruleTargetType
			// 活动会场or商品
			transform.ruleBO.listTargetBO = []
			if (ruleBO.ruleTargetType === 1) {
				transform.ruleBO.listTargetBO.push({
					targetType: 1,
				})
			} else if (ruleBO.ruleTargetType === 2) {
				// 活动商品列表
				this.goodsList.forEach((goods) => {
					transform.ruleBO.listTargetBO.push({
						targetId: goods.goodsId,
						targetName: goods.goodsName,
						targetSnapshotId: goods.goodsSnapshotId,
						goodsGroupId: goods.goodsGroupId || 0,
						targetType: 3,
					})
				})
				this.goodsGroupList.forEach((goodsGroup) => {
					transform.ruleBO.listTargetBO.push({
						targetId: goodsGroup.goodsGroupId,
						targetName: goodsGroup.groupName,
						targetType: 2,
					})
				})
			} else if (ruleBO.ruleTargetType === 4) {
				transform.ruleBO.listTargetBO.push({
					targetType: 4,
				})
			}
			transform.userName = this.$store.state.user.userInfo.clerkName || ''
			return transform
		},
		//保存
		onSubmit() {
			console.log('保存保存保存保存保存保存保存')

			this.$refs.form.validate(async (valid) => {
				console.log('this.form--------', valid, this.form)
				if (valid) {
					let flag = this.checkSubmitParams(this.form)
					if (flag) {
						return false
					}
					let paramsData = this.transformDataToSubmit(this.form)
					if (this.loading) return
					this.loading = true
					saveOrUpdate(paramsData).then(
						(res) => {
							this.loading = false
							const resultCode = res.data.resultCode
							if (resultCode == 0) {
								this.$message({
									message: '保存成功',
									type: 'success',
								})
								this.closeForm()
								this.localVisible = false
								this.$emit('fatherMethodInit')
							}
						},
						() => {
							this.loading = false
						}
					)
				}
			})
		},
		checkSubmitParams(form) {
			// '金额格式有误，必填且支持最多两位小数点'
			let reg = /^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
			if (form.actType == 2 && form.ruleBO.isCapping == 1) {
				if (
					form.ruleBO.cappingAmount <= 0 ||
					!reg.test(form.ruleBO.cappingAmount)
				) {
					this.$message.warning('请输入正确的封顶金额')
					return true
				}
			}
			if (form.ruleBO.ruleCondType == 5) {
				if (form.ruleBO.validOrderList.length == 0) {
					this.$message.warning('请选择有效订单圈定范围')
					return true
				}
				if (
					form.ruleBO.validOrderList.indexOf('1') > -1 &&
					!form.ruleBO.effectiveOrderType
				) {
					this.$message.warning('请选择有效订单类型')
					return true
				}
				if (
					form.ruleBO.validOrderList.indexOf('2') > -1 &&
					(form.ruleBO.effectiveOrderRealAmount <= 0 ||
						!reg.test(form.ruleBO.effectiveOrderRealAmount))
				) {
					this.$message.warning('请输入正确的有效订单实付金额门槛')
					return true
				}
			}
			if (
				form.ruleBO.ruleTargetType == 1 &&
				form.ruleBO.isEliminateBaseCommissionGe
			) {
				if (
					form.ruleBO.eliminateBaseCommissionGe <= 0 ||
					!reg.test(form.ruleBO.eliminateBaseCommissionGe)
				) {
					this.$message.warning('请输入正确的基础佣金金额')
					return true
				}
			}

			return false
		},
		closeForm() {
			this.localVisible = false
			this.forbiddenChoose = false
			this.supplierDisabled = true
			this.form = {
				id: '',
				actName: '',
				supplierCostRatio: 0,
				platformCostRatio: 100,
				endTime: '',
				startTime: '',
				actType: 1,
				actSettleType: 1,
				actPicUrl: '',
				actRuleContent: '',
				actIntensityDesc: '',
				actMpLink: '',
				costType: 1,
				actSettleTime: '',
				ruleBO: {
					ruleCondType: 1, //活动指标条件类型 1.实付金额 2.有效商品数 3.基础佣金 4.卖货佣金
					ruleLadderConfigList: [
						{
							key: Symbol(), //阶梯顺序，依次递增
							condition: '', //条件数值，如满元or满件
							amount: 0, //奖励金额
							rewardType: 0, //奖励类型
							couponName: '', //奖励类型为1时 优惠券名称
							couponId: '', //奖励类型为1时 优惠券Id
						},
					],
					ruleTargetType: 2,
					isCapping: 0,
					cappingAmount: '',
					customConditions: 0,
					isCustomConditions: false, // 定制条件
					customValue: 20, // 佣金率
					validOrderList: [], // 有效订单
					effectiveOrderType: 0, // 有效订单类型
					effectiveOrderRealAmount: '', // 有效订单门槛
					effectiveOrderHasMarkup: 1, // 有效订单门槛 1.含加价 0.不含加价
					isEffectiveOrderHasMarkup: false, // 有效订单门槛 false.含加价 true.不含加价
					eliminateBaseCommissionGe: '', // 剔除指定商品 佣金金额
					isEliminateBaseCommissionGe: false,
				},
				goodsGroupList: undefined,
				goodsList: undefined,
				advSwitch: false, //栏目推荐
				advPicUrl: '', // 广告图片
				advJumpLink: '', // 广告跳转链接
				actCashRewardTagList: [], // 用户分群
				qualificationSwitch: false, // 活动报名
				actNotifySwitch: false, // 活动通知
			}
			this.userTagList = []
			this.$refs.form.clearValidate()
		},
		/* 上传图片 s */
		uploadImageHttpRequest: async function (params, type) {
			const isType = /\.(jpg|jpeg|png|GIF|gif|JPG|PNG)$/.test(
				params.file.name.toLocaleLowerCase()
			)
			if (!isType) {
				return this.$message.warning('不支持的上传类型')
			}

			const result = await uploadImgToCos(params.file)
			if (type == 1) {
				this.form.actPicUrl = result.url
			} else if (type == 2) {
				this.form.advPicUrl = result.url
			}
		},
		// 删除图片
		clearAdvPicUrl() {
			this.form.advPicUrl = ''
		},
		addRuleConfig: function (index) {
			if (this.form.ruleBO.ruleLadderConfigList.length >= 5) {
				this.$message.warning({ message: '最高设置5个阶梯' })
				return
			}
			this.form.ruleBO.ruleLadderConfigList.splice(index + 1, 0, {
				key: Symbol(), //阶梯顺序，依次递增
				condition: '', //条件数值，如满元or满件
				amount: 0, //奖励金额
				rewardType: 0, //奖励类型
				couponName: '', //奖励类型为1时 优惠券名称
				couponId: '', //奖励类型为1时 优惠券Id
			})
		},
		removeRuleConfig: function (index) {
			if (this.form.ruleBO.ruleLadderConfigList.length <= 1) {
				this.$message.warning({ message: '最少设置1个阶梯' })
				return
			}
			this.form.ruleBO.ruleLadderConfigList.splice(index, 1)
		},
		changeRewardType(index) {
			let ruleLadderConfigItem = this.form.ruleBO.ruleLadderConfigList[index]
			if (ruleLadderConfigItem.rewardType == 0) {
				ruleLadderConfigItem.couponName = ''
				ruleLadderConfigItem.couponId = ''
			} else if (ruleLadderConfigItem.rewardType == 1) {
				ruleLadderConfigItem.amount = 0
			}
			if (ruleLadderConfigItem.rewardType == 1) {
				this.$refs.form.clearValidate(
					'ruleBO.ruleLadderConfigList.' + index + '.amount'
				)
			} else {
				this.$refs.form.clearValidate(
					'ruleBO.ruleLadderConfigList.' + index + '.couponName'
				)
			}
		},
		/* 上传图片 e */
		// 切换活动类型
		changeActType() {
			// 选择每满活动时，活动指标不能选择有效订单
			this.changeRule()

			this.form.ruleBO.ruleLadderConfigList = [
				{
					key: Symbol(), //阶梯顺序，依次递增
					condition: '', //条件数值，如满元or满件
					amount: 0, //奖励金额
					rewardType: 0, //奖励类型
					couponName: '', //奖励类型为1时 优惠券名称
					couponId: '', //奖励类型为1时 优惠券Id
				},
			]
		},
		// 切换费用类型
		changecostType(e) {
			if (e == 2) {
				this.form.supplierCostRatio = 0
				this.form.platformCostRatio = 100
				this.supplierDisabled = false
				this.form.ruleBO.ruleTargetType = 1
			} else if (e == 1) {
				this.supplierDisabled = true
				this.form.ruleBO.ruleTargetType = 2
				this.form.ruleBO.ruleCondType = 1
			}
		},
		// 切换活动指标-变更重置
		changeRule() {
			// 商家承担金额 大于0 不能选择全平台
			if (this.form.supplierCostRatio > 0) {
				if (
					this.form.ruleBO.ruleTargetType == 1 ||
					this.form.ruleBO.ruleTargetType == 4
				) {
					this.form.ruleBO.ruleTargetType = 2
				}
				if (this.form.ruleBO.ruleCondType == 5) {
					this.form.ruleBO.ruleCondType = 1
				}
				this.forbiddenChoose = true
			} else {
				this.forbiddenChoose = false
			}
			this.form.platformCostRatio = 100 - this.form.supplierCostRatio
			// 选择每满活动时，活动指标不能选择有效订单
			// if (this.form.actType == 2 && this.form.ruleBO.ruleCondType == 5) {
			// 	this.form.ruleBO.ruleCondType = 1
			// }
			// 选择有效订单数时，活动范围只能选择全平台
			if (
				this.form.ruleBO.ruleCondType == 5 &&
				this.form.ruleBO.ruleTargetType != 1
			) {
				this.form.ruleBO.ruleTargetType = 1
			}
			if (this.form.ruleBO.ruleCondType != 5) {
				this.form.actNotifySwitch = false
				this.form.ruleBO.ruleLadderConfigList.forEach((item) => {
					if (item.rewardType == 1) {
						// item.rewardType = 0
						item.amount = 0
					} else {
						item.couponName = ''
						item.couponId = ''
					}
				})
			}
			console.log('this.form', this.form)
			this.$refs.form.clearValidate()
			this.$refs.form.validateField('ruleBO.ruleCondType')
		},
		// 选择有效订单范围
		changeValidOrder() {
			console.log('this.form.ruleBO', this.form.ruleBO)
			let ruleBO = this.form.ruleBO
			if (ruleBO.validOrderList.indexOf('1') == -1) {
				ruleBO.effectiveOrderType = 0
			}
			if (ruleBO.validOrderList.indexOf('2') == -1) {
				ruleBO.effectiveOrderRealAmount = ''
				ruleBO.effectiveOrderHasMarkup = 1
				ruleBO.isEffectiveOrderHasMarkup = false
			}
		},
		changeValidOrderValue() {
			console.log('this.form.ruleBO', this.form.ruleBO)
			let ruleBO = this.form.ruleBO
			if (
				ruleBO.effectiveOrderType &&
				ruleBO.validOrderList.indexOf('1') == -1
			) {
				ruleBO.validOrderList.push('1')
			}
			if (
				ruleBO.effectiveOrderRealAmount &&
				ruleBO.validOrderList.indexOf('2') == -1
			) {
				ruleBO.validOrderList.push('2')
			}
		},
		changeValidCommissionValue() {
			let ruleBO = this.form.ruleBO
			if (
				ruleBO.eliminateBaseCommissionGe &&
				!ruleBO.isEliminateBaseCommissionGe
			) {
				ruleBO.isEliminateBaseCommissionGe = true
			}
		},
		/* 选择档期 e */
		showDialog113() {
			this.dialogVisible113 = true
			this.getData115(true)
		},
		findSearchParams115(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page115.currentPage = 1
			}
			const paramJson = Object.assign(this.formData114, {
				length: this.page115.length,
				goodsGroupStateList: ['1', '2'],
				gcategoryList: ['1'],
				isAct: 1,
				startIndex: (this.page115.currentPage - 1) * this.page115.length,
			})
			return paramJson
		},
		getData115: async function (flag) {
			this.loading115 = true
			let paramJson = this.findSearchParams115(flag)
			const {
				data: { resultCode, resultData },
			} = await getGoodsGroupListByConditionForCMS(paramJson)
			this.curTime = new Date().getTime()
			if (resultCode == 0) {
				this.tableData115 = resultData.goodsGroupList
				this.page115.count = resultData.goodsGroupCount
			} else {
				this.tableData115 = []
				this.page115.count = 0
			}
			this.loading115 = false
		},
		forceUpdate() {
			this.$forceUpdate()
		},
		updatedGoodsGroup(row) {
			let flag = this.goodsGroupList.some(
				(e) => e.goodsGroupId === row.goodsGroupId
			)
			if (!flag) {
				this.goodsGroupList.push(row)
			} else {
				let index = null
				for (let i = 0; i < this.goodsGroupList.length; i++) {
					if (row.goodsGroupId == this.goodsGroupList[i].goodsGroupId) {
						index = i
						break
					}
				}
				this.goodsGroupList.splice(index, 1)
			}
			this.$forceUpdate()
			this.$refs.form.validateField('goodsGroupList')
		},
		/* 选择档期 e */
		/* 选择商品 s */
		handleCommodity() {
			this.commodityExt = JSON.parse(JSON.stringify(this.goodsList))
			this.dialogCommodityVisible = true
		},
		saveCommodity(val, item) {
			this.listData = JSON.parse(JSON.stringify(item))
			this.goodsList = val
			this.$refs.form.validateField('goodsList')
		},
		/* 选择商品 e */
		/* 选择分群 s */
		async _getUserTagList(query) {
			if (query !== '') {
				const paramJson = {
					currentPage: 1,
					pageSize: 20,
					status: 1,
					keyword: query,
				}
				const {
					data: { resultCode, resultData },
				} = await getUserTagList(paramJson)

				if (resultCode == 0) {
					this.userTagList = resultData.records || []
					return
				}
			}
		},
		/* 选择分群 e */
		/* 选择优惠券 s */
		selectCoupon(index, config) {
			this.ruleLadderConfigIndex = index
			this.selCouponData = {
				couponName: config.couponName,
				yxCouponId: config.couponId,
			}
			this.isCouponDialog = true
		},
		handleSelectedCoupon(row) {
			let ruleBO = this.form.ruleBO
			ruleBO.ruleLadderConfigList[this.ruleLadderConfigIndex].couponId =
				row.yxCouponId
			ruleBO.ruleLadderConfigList[this.ruleLadderConfigIndex].couponName =
				row.couponName
			this.$refs.form.validateField(
				'ruleBO.ruleLadderConfigList.' +
					this.ruleLadderConfigIndex +
					'.couponName'
			)
		},
		/* 选择优惠券 e */
	},
}
</script>

<style lang="scss" scoped>
.img-uploader ::v-deep {
	display: inline-block;
	height: 80px;
	vertical-align: bottom;
	.el-upload {
		border: 1px dashed #d9d9d9 !important;
		border-radius: 6px !important;
		cursor: pointer !important;
		position: relative !important;
		overflow: hidden !important;
	}
	.el-upload:hover {
		border-color: #409eff !important;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 80px;
		height: 80px;
		line-height: 80px;
		text-align: center;
	}
	.avatar {
		width: 80px;
		height: 80px;
		display: block;
	}
}
.img-uploader-operation {
	display: flex;
	align-items: center;
	margin-bottom: 10px;
}
.clear-adv {
	margin-right: 20px;
	font-size: 14px;
}
.avatar-check-img {
	width: 70px;
	height: 30px;
}
.img-uploader-r {
	width: 380px;
	display: inline-block;
	vertical-align: bottom;
	margin-left: 10px;
}
.inline-form-item .el-form-item--small.el-form-item {
	margin-bottom: 0;
}
.inline-form-item ::v-deep .el-form-item__content {
	.el-form-item {
		display: inline-block;
	}
	.el-form-item__error {
		white-space: nowrap;
	}
}
.selected-list {
	line-height: 18px;
	font-size: 12px;
}
.selected-list span {
	&::after {
		content: ',';
	}
	&:last-child:after {
		content: none;
	}
}

.edit-dialog ::v-deep .el-dialog__body {
	max-height: 80vh;
}
.edit-dialog ::v-deep .el-dialog {
	margin-top: 8vh !important;
}
.valid-checkbox .el-checkbox {
	margin-bottom: 8px;
}

.divider-line {
	border-bottom: 1px dashed #999;
	margin-bottom: 18px;
}
.grey-block {
	background: #f4f4f4;
	padding: 10px 0 1px 0;
	margin-bottom: 10px;
	border-radius: 8px;
	margin-left: 110px;
}
.rule-cond-box {
	padding: 10px 0;
	margin: 0 18px 18px;
	border-bottom: 1px dashed #999;
}
.rule-cond-box .rule-cond-label {
	margin-right: 36px;
	font-weight: bold;
}
.rule-config {
	margin: 0 18px 10px;
	font-weight: bold;
}

.valid-order-mt10 {
	margin-top: 10px;
}
.select-coupon-btn {
	width: 150px;
	text-align: left;
	padding-left: 8px;
	overflow: hidden;
}
</style>
<style>
.rule-checkbox {
	padding-left: 20px;
	margin-bottom: 10px;
}
.sub-checkbox {
	padding-left: 20px;
}
</style>
