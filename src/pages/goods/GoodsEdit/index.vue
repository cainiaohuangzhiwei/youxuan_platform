<!-- 编辑商品 -->
<template>
	<basicContainer>
		<!-----S-- 基本信息 ------S--->
		<!-- <el-button type="primary" class="el-icon-right" @click="oldSystem"
			>老系统</el-button
		> -->
		<h3 class="mb20">基本信息</h3>
		<yx-form
			labelWidth="80px"
			:data="formInline"
			:items="formInCfg"
			:rules="rules"
			:formAction="formAction"
		>
			<template #unit>
				<el-select class="w390" :disabled="forbidden" v-model="formInline.unit">
					<el-option
						v-for="item in unitList"
						:label="item.unitName"
						:value="item.unitName"
						:key="item.unitId"
					></el-option>
				</el-select>
			</template>
			<template #goodsCategoryId>
				<!-- :disabled="forbidden" -->
				<el-cascader
					:disabled="true"
					:value="oldGoodsCategoryId"
					:options="goodsCategoryList"
					@change="handleChange"
					clearable
					:props="{
						children: 'goodsCategoryChildList',
						label: 'goodsCategoryName',
						value: 'goodsCategoryId',
					}"
					ref="cascader"
					placeholder="请选择类目名称"
				></el-cascader>
			</template>
			<template #riseBatch>
				一个订单限购：
				<el-input
					:disabled="forbidden"
					style="width: 200px"
					v-model="formInline.riseBatch"
				></el-input>
				件 （填入数字为0时表示不限制）
			</template>
		</yx-form>
		<div>
			<el-button type="text" @click="newLabels">新增标签</el-button>
			<el-tag
				v-for="tag in tags"
				:key="tag.tagName"
				closable
				:type="tag.groupTagId"
				:disable-transitions="false"
				@close="handleClose(tag)"
				size="100"
			>
				{{ tag.tagName }}
			</el-tag>
		</div>
		<!-----E-- 基本信息  ------E--->
		<!-----S-- 附加信息  ------S--->
		<div class="mt20">
			<h3 class="mb20">附加信息</h3>
			<span class="sellingPoints"> 商品卖点：</span>
			<el-input
				style="width: 50%"
				type="textarea"
				:rows="5"
				placeholder=""
				v-model="formInline.sellingPoint"
			>
			</el-input>
			<br />
			排序值：<el-input
				class="sortAss"
				v-model="formInline.sortOrder"
				@input="sortOrdeChange"
			></el-input>
			<el-tooltip
				class="item"
				effect="dark"
				content="数值越大，在订货系统中排序会越前面（最大只能填写255）"
				placement="top-start"
			>
				<span class="ml10"
					><img src="@/assets/image/circle-question.png" alt=""
				/></span>
			</el-tooltip>
		</div>
		<!-----E-- 附加信息  ------E--->
		<!-----S-- 商品属性 ------S--->
		<div class="mt20 category-list">
			<h3 class="mb20">商品属性</h3>
			<div
				v-for="item in categoryList"
				:key="item.goodsCategoryAttributeId"
				class="each-list clearfix"
			>
				<span
					class="typeface_nature mb20"
					:class="{
						mt10: item.multipleType == 0,
						requiredType: item.requiredType == 1,
					}"
					>{{ item.attributeAnotherName }}：</span
				>
				<div v-if="item.multipleType == 0" class="mb20">
					<template prop="whetherSuit">
						<el-select placeholder="请选择" v-model="item.checked" clearable>
							<el-option
								v-for="_item in item.goodsCategoryAttributeItems"
								:key="_item.goodsBasicsAttributeItemId"
								:label="_item.attributeItemValue"
								:value="_item.goodsBasicsAttributeItemId"
							>
							</el-option>
						</el-select>
					</template>
				</div>
				<div v-else-if="item.multipleType == 1" class="mb20">
					<el-checkbox-group v-model="item.checked">
						<el-checkbox
							v-for="_item in item.goodsCategoryAttributeItems"
							:label="_item.goodsBasicsAttributeItemId"
							:key="_item.goodsBasicsAttributeItemId"
						>
							{{ _item.attributeItemValue }}
						</el-checkbox>
					</el-checkbox-group>
				</div>
			</div>
		</div>
		<!-----E-- 商品属性 ------E--->
		<!-----S-- 商品图片 ------S--->
		<!-----E-- 商品图片 ------E--->
		<!-- 规格信息S -->
		<div>
			<h3 class="mb20">规格信息</h3>
			<div>
				<!-- <el-button type="text" icon="el-icon-plus" @click="addGoodsSpec"
					>新增规格</el-button
				> -->
				<el-table
					class="mb20"
					border
					:data="goodsSpecList"
					tooltip-effect="dark"
				>
					<el-table-column
						prop="specOne"
						label="颜色"
						header-align="center"
						align="center"
					>
						<template slot-scope="scope">
							<div @click="cellClick(scope.row, 'specOne')">
								<div
									v-if="!scope.row.inputObjetIsShow.specOne"
									class="gg_text_h"
								>
									{{ checkData(scope.row.specOne, '请输入') }}
								</div>
								<el-input
									:disabled="forbidden"
									v-if="scope.row.inputObjetIsShow.specOne"
									placeholder="请输入"
									v-focus
									@blur="inputBlur($event, scope.row, 'specOne')"
									v-model="scope.row.specOne"
								></el-input>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						prop="specTwo"
						label="尺码"
						header-align="center"
						align="center"
					>
						<template slot-scope="scope">
							<div @click="cellClick(scope.row, 'specTwo')">
								<div
									v-if="!scope.row.inputObjetIsShow.specTwo"
									class="gg_text_h"
								>
									{{ checkData(scope.row.specTwo, '请输入') }}
								</div>
								<el-input
									:disabled="forbidden"
									v-if="scope.row.inputObjetIsShow.specTwo"
									placeholder="请输入"
									v-focus
									@blur="inputBlur($event, scope.row, 'specTwo')"
									v-model="scope.row.specTwo"
								></el-input>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						prop="barCode"
						label="条形码"
						header-align="center"
						align="center"
					>
						<template slot-scope="scope">
							<div @click="cellClick(scope.row, 'barCode')">
								<div
									v-if="!scope.row.inputObjetIsShow.barCode"
									class="gg_text_h"
								>
									{{ checkData(scope.row.barCode, '请输入') }}
								</div>
								<el-input
									:disabled="forbidden"
									v-if="scope.row.inputObjetIsShow.barCode"
									placeholder="请输入"
									v-focus
									@blur="inputBlur($event, scope.row, 'barCode')"
									v-model="scope.row.barCode"
								></el-input>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="结算价" header-align="center" align="center">
						<template #header>
							<div>
								<span>结算价</span>
								<el-tooltip
									class="item"
									effect="dark"
									content="商品完成销售后，平台与商家的结算价格。"
									placement="top"
								>
									<i
										class="el-icon-question"
										style="color: #409eff; margin-left: 5px"
									></i>
								</el-tooltip>
							</div>
							<!-- <el-input
								:disabled="true"
								v-model="costPricePL"
								size="mini"
								type="number"
								@change="costPricePLChange"
								placeholder="批量修改结算价"
							/> -->
						</template>
						<template slot-scope="scope">
							<div @click="cellClick(scope.row, 'costPrice')">
								<div
									v-if="!scope.row.inputObjetIsShow.costPrice"
									class="gg_text_h"
								>
									{{ checkData(scope.row.costPrice, '请输入') }}
								</div>
								<el-input
									:disabled="true"
									v-if="scope.row.inputObjetIsShow.costPrice"
									placeholder="请输入"
									v-focus
									@blur="inputBlur($event, scope.row, 'costPrice')"
									v-model="scope.row.costPrice"
									type="number"
								></el-input>
							</div>
						</template>
					</el-table-column>

					<el-table-column label="供货价" header-align="center" align="center">
						<template #header>
							<div>
								<span>供货价</span>
								<el-tooltip
									class="item"
									effect="dark"
									content="商品展示给平台店主的供货价格。"
									placement="top"
								>
									<i
										class="el-icon-question"
										style="color: #409eff; margin-left: 5px"
									></i>
								</el-tooltip>
							</div>
							<!-- <el-input
								:disabled="true"
								v-model="supplyPricePL"
								size="mini"
								type="number"
								@change="supplyPricePLChange"
								placeholder="批量修改供货价"
							/> -->
						</template>
						<template slot-scope="scope">
							<div @click="cellClick(scope.row, 'supplyPrice')">
								<div
									v-if="!scope.row.inputObjetIsShow.supplyPrice"
									class="gg_text_h"
								>
									{{ checkData(scope.row.supplyPrice, '请输入') }}
								</div>
								<el-input
									:disabled="true"
									v-if="scope.row.inputObjetIsShow.supplyPrice"
									placeholder="请输入"
									v-focus
									@blur="inputBlur($event, scope.row, 'supplyPrice')"
									v-model="scope.row.supplyPrice"
									type="number"
								></el-input>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						label="商家建议销售价"
						header-align="center"
						align="center"
					>
						<template #header>
							<div>
								<span>商家建议销售价</span>
								<el-tooltip
									class="item"
									effect="dark"
									content="商家提供的最低建议销售价。"
									placement="top"
								>
									<i
										class="el-icon-question"
										style="color: #409eff; margin-left: 5px"
									></i>
								</el-tooltip>
							</div>
							<!-- <el-input
								:disabled="true"
								v-model="supplierPricePL"
								size="mini"
								type="number"
								@change="supplierPriceChange"
								placeholder="批量修改商家建议销售价"
							/> -->
						</template>
						<template slot-scope="scope">
							<div @click="cellClick(scope.row, 'supplierPrice')">
								<div
									v-if="!scope.row.inputObjetIsShow.supplierPrice"
									class="gg_text_h"
								>
									{{ checkData(scope.row.supplierPrice, '请输入') }}
								</div>
								<el-input
									:disabled="true"
									v-if="scope.row.inputObjetIsShow.supplierPrice"
									placeholder="请输入"
									v-focus
									@blur="inputBlur($event, scope.row, 'supplierPrice')"
									v-model="scope.row.supplierPrice"
									type="number"
								></el-input>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						label="建议零售价"
						header-align="center"
						align="center"
					>
						<template #header>
							<div>
								<span>建议零售价</span>
								<el-tooltip
									class="item"
									effect="dark"
									content="商品在平台正常销售的价格，以此价格进行销售最具性价比。"
									placement="top"
								>
									<i
										class="el-icon-question"
										style="color: #409eff; margin-left: 5px"
									></i>
								</el-tooltip>
							</div>
							<!-- <el-input
								:disabled="true"
								v-model="lowestPricePL"
								size="mini"
								type="number"
								@change="lowestPriceChange"
								placeholder="批量修改建议零售价"
							/> -->
						</template>
						<template slot-scope="scope">
							<div @click="cellClick(scope.row, 'lowestPrice')">
								<div
									v-if="!scope.row.inputObjetIsShow.lowestPrice"
									class="gg_text_h"
								>
									{{ checkData(scope.row.lowestPrice, '请输入') }}
								</div>
								<el-input
									:disabled="true"
									v-if="scope.row.inputObjetIsShow.lowestPrice"
									placeholder="请输入"
									v-focus
									@blur="inputBlur($event, scope.row, 'lowestPrice')"
									v-model="scope.row.lowestPrice"
									type="number"
								></el-input>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="外网价" header-align="center" align="center">
						<template #header>
							<!-- <div>外网价</div> -->
							<div>
								<span>外网价</span>
								<el-tooltip
									class="item"
									effect="dark"
									content="商品在云货优选平台以外的其他主流线上渠道实际销售价格。"
									placement="top"
								>
									<i
										class="el-icon-question"
										style="color: #409eff; margin-left: 5px"
									></i>
								</el-tooltip>
							</div>
							<!-- <el-input
								:disabled="true"
								v-model="highestPricePL"
								size="mini"
								type="number"
								@change="highestPricePLChange"
								placeholder="批量修改外网价"
							/> -->
						</template>
						<template slot-scope="scope">
							<div @click="cellClick(scope.row, 'highestPrice')">
								<div
									v-if="!scope.row.inputObjetIsShow.highestPrice"
									class="gg_text_h"
								>
									{{ checkData(scope.row.highestPrice, '请输入') }}
								</div>
								<el-input
									:disabled="true"
									v-if="scope.row.inputObjetIsShow.highestPrice"
									placeholder="请输入"
									v-focus
									@blur="inputBlur($event, scope.row, 'highestPrice')"
									v-model="scope.row.highestPrice"
									type="number"
								></el-input>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="市场价" header-align="center" align="center">
						<template #header>
							<!-- <div>市场价</div> -->
							<div>
								<span>市场价</span>
								<el-tooltip class="item" effect="dark" placement="top">
									<div slot="content">
										<p>
											1.划线价必须有依据，可以是吊牌价或品牌官网售价等价格；
										</p>
										<p>
											2.请商家务必妥善保存划线价定价依据以备查。抽检时如无法提供的，将被平台或政府处罚；
										</p>
										<p>
											3.平台鼓励商家在商品详情页对“划线价”的含义及定价依据进行准确说明。
										</p>
									</div>
									<i
										class="el-icon-question"
										style="color: #409eff; margin-left: 5px"
									></i>
								</el-tooltip>
							</div>
							<!-- <el-input
								:disabled="true"
								v-model="marketPricePL"
								size="mini"
								type="number"
								@change="marketPricePLChange"
								placeholder="批量修改市场价"
							/> -->
						</template>
						<template slot-scope="scope">
							<div @click="cellClick(scope.row, 'marketPrice')">
								<div
									v-if="!scope.row.inputObjetIsShow.marketPrice"
									class="gg_text_h"
								>
									{{ checkData(scope.row.marketPrice, '请输入') }}
								</div>
								<el-input
									:disabled="true"
									v-if="scope.row.inputObjetIsShow.marketPrice"
									placeholder="请输入"
									v-focus
									@blur="inputBlur($event, scope.row, 'marketPrice')"
									v-model="scope.row.marketPrice"
									type="number"
								></el-input>
							</div>
						</template>
					</el-table-column>
					<!-- <el-table-column
						label="操作"
						header-align="center"
						align="center"
						width="80"
					>
						<template slot-scope="scope">
							<el-button
								:disabled="forbidden"
								type="text"
								size="small"
								@click="deleteGoodsSpecListRow(scope.$index, scope.row)"
								>删除</el-button
							>
						</template>
					</el-table-column> -->
				</el-table>
			</div>
		</div>
		<!-- 规格信息E -->
		<!-- 详细信息S -->
		<div>
			<h3 class="mb20">详细信息</h3>
			<div>
				<UE
					ref="um"
					:defaultMsg="information"
					:name="'ue' + messagePlanId"
				></UE>
			</div>
		</div>
		<!-- 详细信息E -->
		<div class="save_button">
			<el-button type="primary" @click="submitForm('filtrateForm', 'save')"
				>保存</el-button
			>
			<el-button @click="goBack">取消</el-button>
		</div>
		<!-- 售后服务 -->
		<div>
			<h3 class="mb20">售后服务</h3>
			<p>{{ categorySevenReason }}</p>
			<el-checkbox-group
				v-model="sevenDaysChecked"
				@change="handleSevenDaysWithoutReason"
				:min="0"
				:max="1"
			>
				<el-checkbox :label="2">该商品支持【七天无理由】服务</el-checkbox>
				<el-checkbox :label="1">该商品不支持【七天无理由】服务</el-checkbox>
			</el-checkbox-group>
		</div>
		<div class="bottom"></div>
		<Dialog
			title="新增标签"
			:visible="newLabelsLogding"
			width="50%"
			:bottomBtn="newLabelsBottomBtn"
			@before-close="newLabelsLogding = false"
		>
			<el-checkbox-group v-model="groupTagIdList" size="100">
				<el-checkbox-button
					v-for="item in groupTagList"
					:key="item"
					:label="item"
					>{{ item.tagName }}</el-checkbox-button
				>
			</el-checkbox-group>
		</Dialog>
		<!-- 售后服务弹框 -->
		<!-- 强制不支持七天无理由 -->
		<el-dialog
			title="设置七天无理由"
			:visible.sync="goodsSevenDialogVisible"
			width="30%"
			:before-close="handleCloseGoodsSeven"
		>
			<span>此商品所属类目为强制不支持七天无理由服务，是否确认勾选此服务</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleCloseGoodsSeven">取 消</el-button>
				<el-button type="primary" @click="handleGoodsSeven">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 强制支持七天无理由 -->
		<el-dialog
			title="设置七天无理由"
			:visible.sync="categorySevenDialogVisible"
			width="30%"
			:before-close="handleCloseCategorySeven"
		>
			<span
				>此商品所属类目为强制支持七天无理由服务，是否确认取消勾选此服务</span
			>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleCloseCategorySeven">取 消</el-button>
				<el-button type="primary" @click="handleCategorySeven">确 定</el-button>
			</span>
		</el-dialog>
	</basicContainer>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import { getGoodsConfiguration } from '@/api/systemConfiguration'
import { queryNotSelfBrandSupplierAccountIds } from '@/api/brandRecord'
import {
	getGoodsDetailByOrganizationSpecIdPlus,
	updateGroupGoodsByGoodsIdPlus,
} from '@/api/yhtPlusWebGoods'
import {
	getGoodsAttributeInfo,
	listCategoryAttributeInfoByCategoryId,
	getGroupTagListByType,
} from '@/api/yhtPlusCmsGoodsCategoryAttribute'
import Dialog from '@/components/Dialog'
import { getBigImg } from '@/utils/imageTool'
import { goodsCategoryTree } from '@/api/grossMargins'
import { uploadImageList } from '@/api/image'
import { getSmallImg } from '@/utils/imageTool'
import { isNull } from '@/utils/helper/common'
import UE from '@/components/RichText'
import { mapGetters } from 'vuex'
export default {
	// name: 'GoodsEdit',
	components: {
		YxForm,
		BasicContainer,
		UE,
		Dialog,
	},
	data() {
		return {
			goodsSpecId: '',
			shelfState: '',
			goodsId: '',
			tags: [], //确认标签
			groupTagIdList: [], //新增标签
			groupTagList: [],
			newLabelsLogding: false,
			newLabelsBottomBtn: [
				{
					title: '取 消',
					type: '',
					click: () => {
						this.newLabelsLogding = false
					},
				},
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.auditNewLabels()
					},
				},
			],
			getSmallImg: getSmallImg,
			test: '',
			categoryList: [], //属性列表
			goodsCategoryListNew: [],
			selectedOptions3: [],
			deleteImageList: [], // 删除图片列表
			formInline: {
				goodsName: '', //商品名称
				goodsNumber: '', //商品货号
				brandName: '', //会场名称
				brandId: '', //会场Id
				unit: '', //计量单位
				goodsCategoryId: '', //类目id
				goodsCategoryName: '', //类目名称
				sellingPoint: '', //商品卖点
				riseBatch: '0', //单订单限制
				sortOrder: '', //排序值
				isLimitMarkup: 0, //限制加价
				coverImage: [],
			}, // 商品信息
			goodsCategoryList: [], //商品类目
			supplierAccountNumberId: '',
			forbidden: false,
			formInCfg: [
				{
					type: 'input',
					title: '商品名称',
					dataIndex: 'goodsName',
					placeholder: '请输入商品名称',
				},
				{
					type: 'input',
					title: '商品货号',
					disabled: true,
					dataIndex: 'goodsNumber',
					placeholder: '请输入商品货号',
				},
				{
					type: 'input',
					title: '会场名称',
					dataIndex: 'brandName',
					placeholder: '请输入会场名称',
					disabled: true,
				},
				{
					type: 'custom',
					title: '计量单位',
					dataIndex: 'unit',
				},
				{
					type: 'custom',
					title: '商品类目',
					dataIndex: 'goodsCategoryId',
				},
				{
					type: 'select',
					dataIndex: 'isLimitMarkup',
					title: '限制加价',
					label: 'value',
					options: [
						{
							isLimitMarkup: 0,
							value: '否',
						},
						{
							isLimitMarkup: 1,
							value: '是',
						},
					],
				},
				{
					type: 'custom',
					title: '单订单限制',
					dataIndex: 'riseBatch',
				},
				{
					type: 'uploadImageDraggable',
					title: '商品图片',
					dataIndex: 'coverImage',
					deleteImage: (item) => {
						this.deleteImageList.push(item)
					},
					uploadAttributes: {
						limit: 20,
						imageName: 'imageUrlTemp',
						httpRequest: (file) => this._uploadImageHttpRequest(file),
					},
				},
			],
			imageList: [], // 图片列表
			uploadImageList: uploadImageList, // 上传图片地址
			unitList: [], //计量单位
			deleteImgList: [], // 删除的图片列表
			goodsSpecList: [], // 规格列表
			newGoodsSpecList: [],
			information: '', // 富文本内容
			messagePlanId: '',
			marketPricePL: '',
			highestPricePL: '',
			costPricePL: '',
			supplyPricePL: '',
			supplierPricePL: '',
			lowestPricePL: '',
			// 表单验证
			rules: {
				isLimitMarkup: [
					{
						required: true,
						message: '是否限制加价',
						trigger: 'blur',
					},
				],
				goodsName: [
					{
						required: true,
						message: '请填写商品名称',
						trigger: 'blur',
					},
				],
				goodsNumber: [
					{
						required: true,
						message: '请填写商品货号',
						trigger: 'blur',
					},
				],
				brandId: [
					{
						required: true,
						message: '请填写会场名称',
						trigger: 'blur',
					},
				],
				riseBatch: [
					{
						required: true,
						message: '请填写订单限购数',
						trigger: 'blur',
					},
				],
				unit: [
					{
						required: true,
						message: '请选择计量单位',
						trigger: 'change',
					},
				],
				goodsCategoryId: [
					{
						required: true,
						message: '请选择商品类目',
						trigger: 'change',
					},
				],
				value: [
					{
						required: true,
						message: '请选择是否支持七天无理由',
						trigger: 'change',
					},
				],
			},
			// 判断货号是否存在
			goodsNumberIsChange: {
				goodsNumber: '',
				sameGoodsNumber: false,
			},
			//运费相关
			freightList: [],
			expressTemplateId: 0,
			oldGoodsCategoryId: [],
			// 售后服务
			sevenDaysChecked: [],
			goodsSevenDialogVisible: false,
			categorySevenDialogVisible: false,
			goodsSevenDaysConfig: {},
			categorySevenDaysConfig: {},
			sevenDaysWithoutReasonConfigType: 0,
		}
	},
	computed: {
		...mapGetters(['getUserId', 'getSessionKey', 'getUserInfo']),
		uploadHead() {
			// 上传文件请求头
			return {
				'X-AUTH-TOKEN': this.getSessionKey,
			}
		},
		categorySevenReason: function () {
			if (this.categorySevenDaysConfig.configType == 3) {
				return '该商品所属类目配置七天无理由信息'
			} else if (this.categorySevenDaysConfig.configType == 1) {
				return '该商品所属类目默认不支持七天无理由'
			} else if (this.categorySevenDaysConfig.configType == 2) {
				return '该商品所属类目默认支持七天无理由'
			} else {
				return '该商品所属类目没有配置七天无理由信息'
			}
		},
	},
	created: function () {
		this.goodsSpecId = this.$route.params.goodsSpecId || ''
		this.shelfState = this.$route.params.shelfState || ''
		this.goodsId = this.$route.params.goodsId || ''
		// 为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
		document.body.ondrop = function (event) {
			event.preventDefault()
			event.stopPropagation()
		}
		this.callGoodsConfiguration()
		this.getInfo()
		// this.getGoodsCategoryList() // 获取商品类目
	},
	methods: {
		oldSystem() {
			window.open(
				`/yhtplus/web/goodsEdit.html?goodsSpecId=${this.goodsSpecId}&shelfState=${this.shelfState}&goodsId=${this.goodsId}`
			)
		},
		queryNotSelfBrandSupplierAccountIds: async function () {
			let {
				data: { resultCode = 0, resultData = [] },
			} = await queryNotSelfBrandSupplierAccountIds({})
			if (resultCode == 0) {
				//供应商账号id,只要判断有包含的，就是非自有品牌
				if (resultData.length > 0) {
					resultData.map((item) => {
						if (item == this.supplierAccountNumberId) {
							this.forbidden = true
							this.formInCfg[5].disabled = true
						}
					})
				}
				console.log('是否匹配到非自有品牌:', this.forbidden)
			}
		},
		// 获取级联id
		regroupCascaderData(
			id, //要寻找的唯一值
			data, // 列表总数据
			key = 'goodsCategoryId', //列表总数据 的key
			val = 'goodsCategoryId', //列表总数据 的value
			list = 'goodsCategoryChildList' //列表总数据 下属关系的key
		) {
			let _allObj = {}
			const _allArr = []
			// eslint-disable-next-line no-shadow
			const setData = function (data) {
				let Obj
				for (const item of data) {
					Obj = {
						[key]: item[key],
						[val]: item[val],
					}
					if (item[val] == id) {
						Obj['isOk'] = true //如果条件符合，接下来就不会再判断
						return Obj
					} else if (item[list] && item[list].length) {
						Obj[list] = setData(item[list])
						if (Obj[list] && Obj[list]['isOk']) {
							Obj['isOk'] = true
							return Obj
						}
					} else {
						Obj = null
					}
				}
				return Obj
			}
			// eslint-disable-next-line no-shadow
			const getObjData = function (data) {
				// 递归向数组中填充数据
				_allArr.push(data[val])
				if (data[list]) {
					getObjData(data[list])
				}
			}
			_allObj = setData(data)
			getObjData(_allObj)
			return {
				Obj: _allObj,
				arr: _allArr,
			}
		},
		getGoodsCategoryList: async function (goodsCategoryId = '') {
			let {
				data: { resultCode = 0, resultData = [] },
			} = await goodsCategoryTree()
			if (resultCode == 0) {
				this.goodsCategoryList = this.mapAll(resultData.goodsCategoryList)
				if (goodsCategoryId) {
					const arr = this.regroupCascaderData(
						goodsCategoryId,
						this.goodsCategoryList
					)
					this.oldGoodsCategoryId = arr['arr']
				}
			}
		},
		//数据过滤，三级后去掉子级，可以选中
		mapAll(options) {
			return options.map((item) => {
				//最高三级，清除第三级后面的数组，组件就可以选中
				if (item.goodsCategoryLevel === 3) {
					item.goodsCategoryChildList = null
				}
				if (
					item.goodsCategoryChildList &&
					item.goodsCategoryChildList.length > 0
				) {
					this.mapAll(item.goodsCategoryChildList)
				}
				return item
			})
		},
		goBack() {
			this.$router.push({
				path: `/goods/GoodsList`,
			})
		},
		// 上传图标图片
		_uploadImageHttpRequest: async function (params) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#addMaterial', imageType: 1 }) //商品图片类型为1
			)
			formData.append('file', params.file)
			const res = await uploadImageList(formData)
			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				res.data.resultData.imageList[0].imageUrlTemp = getBigImg(
					res.data.resultData.imageList[0].imageUrl
				)
				this.formInline.coverImage.push(res.data.resultData.imageList[0])
				this.imageList.push(res.data.resultData.imageList[0])
				// this.$forceUpdate()
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
		//删除标签
		handleClose(tag) {
			this.tags.splice(this.tags.indexOf(tag), 1)
		},
		//确定标签
		auditNewLabels() {
			this.tags = this.groupTagIdList
			this.newLabelsLogding = false
		},
		//新增标签
		async newLabels() {
			this.newLabelsLogding = true
			let {
				data: { resultCode, resultData },
			} = await getGroupTagListByType({
				type: 1,
			})
			if (resultCode === 0) {
				let groupTagList = resultData.groupTagList.map((item) => {
					return {
						groupTagId: item.groupTagId,
						tagName: item.tagName,
					}
				})
				this.groupTagList = groupTagList
			}
		},
		/**
		 *  校验数据 返回空字符
		 */
		checkData(data, hint) {
			if (isNull(data)) {
				return hint || '暂无数据'
			}
			return data
		},
		isMoney(str) {
			let regu = '^[0-9]+[//.]{0,1}[0-9]{0,5}$'
			let re = new RegExp(regu)
			if (re.test(str)) {
				return true
			} else {
				return false
			}
		},
		// 获取商品属性
		async _getGoodsAttributeInfo() {
			let paramJson = {
				goodsId: this.goodsId,
			}
			let {
				data: { resultCode, resultData },
			} = await getGoodsAttributeInfo(paramJson)
			if (resultCode == 0) {
				resultData.forEach((item) => {
					this.categoryList.forEach((_item) => {
						if (item.goodsBasicsAttributeId === _item.goodsBasicsAttributeId) {
							if (_item.multipleType === 0) {
								_item.checked =
									item.goodsAttributeItems[0]?.goodsBasicsAttributeItemId
							} else if (_item.multipleType === 1) {
								_item.checked = item.goodsAttributeItems.map((v) => {
									return v.goodsBasicsAttributeItemId
								})
							}
						}
					})
				})
			}
		},
		async _listCategoryAttributeInfoByCategoryId() {
			let paramJson = {
				goodsCategoryId: this.selectedOptions3[
					this.selectedOptions3.length - 1
				],
			}

			let {
				data: { resultCode, resultData },
			} = await listCategoryAttributeInfoByCategoryId(paramJson)
			if (resultCode == 0) {
				this.categoryList = resultData.map((item) => {
					return {
						...item,
						checked: [],
					}
				})
				this._getGoodsAttributeInfo()
			}
		},
		handleChange(e) {
			this.formInline.goodsCategoryId = e[e.length - 1]
		},
		callGoodsConfiguration: async function () {
			/** 获取选择项列表 **/
			let {
				data: { resultCode, resultData },
			} = await getGoodsConfiguration({})
			if (resultCode == 0) {
				this.unitList = resultData.unitList
			}
		},

		getInfo: async function () {
			/** 获取商品详情 **/
			let paramJson = {
				// goodsId: this.goodsId,
				goodsSpecId: this.goodsSpecId,
				shelfState: this.shelfState,
				goodsId: this.goodsId,
			}
			let {
				data: { resultCode, resultData },
			} = await getGoodsDetailByOrganizationSpecIdPlus(paramJson)
			if (resultCode == 0) {
				this.categorySevenDaysConfig = resultData.categorySevenDaysConfig || {}
				if (resultData?.goodsSevenDaysConfig?.configType) {
					this.sevenDaysChecked.push(resultData.goodsSevenDaysConfig.configType)
				}
				this.newGoodsSpecList = JSON.parse(
					JSON.stringify(resultData.goodsSpecList)
				) //深拷贝与新规格作对比
				let formInline = {
					goodsName: resultData.goodsSimple.goodsName,
					unit: resultData.goodsSimple.unit,
					brandName: resultData.goodsSimple.brandName,
					brandId: resultData.goodsSimple.brandId,
					sellingPoint: resultData.goodsSimple.sellingPoint,
					sortOrder: resultData.goodsSimple.sortOrder,
					goodsNumber: resultData.goodsSimple.goodsNumber,
					riseBatch: resultData.goodsSimple.riseBatch,
					isLimitMarkup: resultData.goodsSimple.isLimitMarkup,
					goodsCategoryId: resultData.goodsSimple.goodsCategoryId,
					coverImage: [],
				}
				this.tags = resultData.groupTagList ? resultData.groupTagList : []
				this.supplierAccountNumberId =
					resultData.goodsSimple.supplierAccountNumberId
				if (this.supplierAccountNumberId) {
					this.queryNotSelfBrandSupplierAccountIds()
				}
				this.formInline.goodsCategoryName =
					resultData.goodsSimple.goodsCategoryName
				if (
					resultData.goodsSimple.goodsCategoryChildNodes &&
					resultData.goodsSimple.goodsCategoryChildNodes.length > 0
				) {
					this.selectedOptions3 = resultData.goodsSimple.goodsCategoryChildNodes.map(
						(item) => {
							return item.goodsCategoryId
						}
					)
				}
				//图片
				resultData.imageList.map((item) => {
					let imageObj = Object.assign({}, item)
					imageObj.imageUrlTemp = getBigImg(imageObj.imageUrl)
					formInline.coverImage.push(imageObj)
				})
				resultData.imageList.map((item) => {
					this.imageList.push(item)
				})
				this.formInline = formInline
				this.information = resultData.goodsSimple.information
				console.log(
					resultData.goodsSpecList,
					'resultData.goodsSpecList',
					resultData
				)
				this.goodsSpecList = resultData.goodsSpecList.map((item) => {
					item.inputObjetIsShow = {
						specOne: false,
						specTwo: false,
						barCode: false,
						supplyPrice: false,
						supplierPrice: false,
						lowestPrice: false,
						marketPrice: false,
						highestPrice: false,
						costPrice: false,
					}
					return item
				})
				//运费模板id
				if (
					resultData.expressTemplate &&
					resultData.expressTemplate.templateId
				) {
					this.expressTemplateId = resultData.expressTemplate.templateId
				} else {
					this.expressTemplateId = 0
				}

				//获取商品属性
				this._listCategoryAttributeInfoByCategoryId()
				this.getGoodsCategoryList(resultData.goodsSimple.goodsCategoryId) // 获取商品类目
			} else {
				this.getGoodsCategoryList() // 获取商品类目
				this.formInline = {}
				this.imageList = []
				this.goodsSpecList = []
			}
		},
		uploadFileData() {
			/** 上传图片参数 **/
			let paramJson = {
				formId: '#addImageFrom_goods',
				userId: this.getUserId,
				sessionKey: this.getSessionKey,
				imageType: 1,
			}
			return {
				data: JSON.stringify(paramJson),
			}
		},
		handleExceed() {
			/** 文件超出回调 **/
			this.$message.warning({
				message: '最多只能上传20张图片',
			})
		},
		inputBlur(e, row, str) {
			/** 规格列表输入框失去焦点事件 **/
			if (row[str] !== '') {
				row.inputObjetIsShow[str] = false
			}
		},
		cellClick(row, str) {
			/** 规格列表点击事件 **/
			row.inputObjetIsShow[str] = true
			console.log('规格列表点击事件', row.inputObjetIsShow[str])
		},
		deleteGoodsSpecListRow($index) {
			/** 删除规格 **/
			let self = this
			if (this.goodsSpecList.length < 2) {
				this.$message.error({
					message: '至少拥有一个商品规格',
				})
				return
			}
			this.$confirm('确定删除该记录', '提示', {
				type: 'warning',
				callback: function (action) {
					if (action === 'confirm') {
						self.$delete(self.goodsSpecList, $index)
					}
				},
			})
		},
		addGoodsSpec() {
			/** 新增规格 **/
			let goodsSpecListObj = {
				specOne: '',
				specTwo: '',
				barCode: '',
				supplyPrice: '',
				supplierPrice: '',
				lowestPrice: '',
				marketPrice: '',
				highestPrice: '',
				costPrice: '',
				inputObjetIsShow: {
					specOne: true,
					specTwo: true,
					barCode: true,
					supplierPrice: true,
					lowestPrice: true,
					supplyPrice: true,
					marketPrice: true,
					highestPrice: true,
					costPrice: true,
				},
			}
			this.$set(this.goodsSpecList, this.goodsSpecList.length, goodsSpecListObj)
		},
		submitForm() {
			/** 点击保存商品编辑 **/
			this.checkSubmitParam((paramJson) => {
				if (Array.isArray(paramJson.goodsCategoryId)) {
					paramJson.goodsCategoryId = paramJson.goodsCategoryId.pop()
				}
				// else {
				// 	paramJson.goodsCategoryId = paramJson.goodsCategoryId
				// }
				// paramJson.goodsCategoryId = this.selectedOptions3[
				// 	this.selectedOptions3.length - 1
				// ]
				//运费模板编辑
				if (this.expressTemplateId != 0) {
					paramJson.expressTemplateId = this.expressTemplateId
				}
				this.uploadGoodsDetails(paramJson)
			})
			// else {
			// 	this.$message.error({
			// 		message: '请填写完整必填项',
			// 	})
			// }
		},
		uploadGoodsDetails: async function (paramJson) {
			console.log('富文本', this.information)
			console.log('基本信息', this.formInline)
			console.log('商品属性', this.categoryList)
			console.log('商品图片', this.imageList)
			console.log('规格信息', this.goodsSpecList)
			/** 保存商品 **/
			let goodsAttributeInfoList = []
			let requiredIds = [] //必填列表
			this.categoryList.forEach((item) => {
				let json = {}
				if (item.multipleType === 0) {
					if (item.checked) {
						json.goodsBasicsAttributeId = item.goodsBasicsAttributeId
						json.goodsBasicsAttributeItemIds = [item.checked]
						goodsAttributeInfoList.push(json)
					}
				} else if (item.multipleType === 1) {
					if (item.checked && item.checked.length > 0) {
						json.goodsBasicsAttributeId = item.goodsBasicsAttributeId
						json.goodsBasicsAttributeItemIds = item.checked
						goodsAttributeInfoList.push(json)
					}
					if (item.requiredType == 1) {
						requiredIds.push(item)
					}
				}
			})
			paramJson.goodsAttributeInfoList = goodsAttributeInfoList
			// 校验必填的商品属性是否已经存在
			requiredIds = JSON.parse(JSON.stringify(requiredIds))
			// 用数据去重的方式找出没有选上的值
			for (let i = 0; i < goodsAttributeInfoList.length; i++) {
				for (let j = 0; j < requiredIds.length; j++) {
					if (
						requiredIds[j].goodsBasicsAttributeId ==
						goodsAttributeInfoList[i].goodsBasicsAttributeId
					) {
						requiredIds.splice(j, 1)
						j = j - 1
					}
				}
			}
			if (requiredIds && requiredIds.length > 0) {
				let tips = []
				requiredIds.forEach((item) => {
					tips.push(item.attributeAnotherName)
				})
				this.$message.error({
					message: `请选择商品属性中必选项：${tips.join('、')}`,
				})
				return
			}
			//库存预警 已剔除 给默认值
			paramJson.warehouseSpecList = []
			paramJson.vip = 0
			paramJson.returnable = 1
			paramJson.recommended = 10
			paramJson.goodsAttributeList = []
			paramJson.shelfState = 2
			paramJson.markList = []
			let newGoodsSpecListPush = []
			paramJson.isChange = 0
			//isChange:没有修改规格数据，0.没有,1.有修改颜色.尺码.条形码,2 修改其他或者有新增规格
			//与原来的商品数组匹配做判断
			for (let i = 0; i < this.goodsSpecList.length; i++) {
				let goodsObject = this.newGoodsSpecList[i] || {}
				//  log('旧：'+JSON.stringify(goodsObject))
				//  log('新：'+JSON.stringify(goodsSpecList[i]))
				//相同下标的，全部数据都没有修改，规格的新增||删除||编辑,flag为true
				// .有修改颜色.尺码.条形码,
				if (
					goodsObject.goodsSpecId &&
					goodsObject.specOne == this.goodsSpecList[i].specOne &&
					goodsObject.specTwo == this.goodsSpecList[i].specTwo &&
					goodsObject.barCode == this.goodsSpecList[i].barCode
				) {
					console.log('木有改变颜色.尺码.条形码')
				} else {
					paramJson.isChange = 1
				}
				// 修改其他或者有新增规格
				if (
					goodsObject.costPrice == this.goodsSpecList[i].costPrice &&
					goodsObject.supplyPrice == this.goodsSpecList[i].supplyPrice &&
					goodsObject.supplierPrice == this.goodsSpecList[i].supplierPrice &&
					goodsObject.lowestPrice == this.goodsSpecList[i].lowestPrice &&
					goodsObject.highestPrice == this.goodsSpecList[i].highestPrice &&
					goodsObject.marketPrice == this.goodsSpecList[i].marketPrice &&
					this.newGoodsSpecList.length == this.goodsSpecList.length
				) {
					console.log('木有改变规格')
				} else {
					paramJson.isChange = 2
				}
				newGoodsSpecListPush.push(this.goodsSpecList[i])
			}
			// paramJson.goodsSpecList = newGoodsSpecListPush
			//暂时入参
			paramJson.isNext = true
			paramJson.goodsId = this.goodsId
			// paramJson.imageList = this.imageList
			if (this.sevenDaysChecked.length > 0) {
				paramJson.sevenDaysWithoutReasonConfigType = this.sevenDaysChecked[0]
			}
			delete paramJson.coverImage
			console.log('paramJson:', paramJson)
			let {
				data: { resultCode },
			} = await updateGroupGoodsByGoodsIdPlus(paramJson)
			if (resultCode === 0) {
				this.$message.success('保存成功')
				this.$router.push({
					path: `/goods/GoodsDetail/${this.goodsId}/${this.goodsSpecId}`,
				})
			}
		},
		checkSubmitParam(fn) {
			/** 检查提交内容 **/
			let paramJson = Object.assign({}, this.formInline)
			// 检查商品规格
			if (this.goodsSpecList.length < 1) {
				this.$message.error({
					message: '至少存在一个商品规格',
				})
				return
			}
			let gList = JSON.parse(JSON.stringify(this.goodsSpecList))
			let goodsSpecList = gList.map((item) => {
				delete item.inputObjetIsShow
				return item
			})
			// 校验规格数据
			if (this.checkGoodsSpecList(goodsSpecList)) {
				return
			}
			// 校验图片数据
			// if (this.imageList.length === 0) {
			//   this.$message.error({
			//     message: '至少上传一张商品图片'
			//   })
			//   return
			// }
			let tagsList = this.tags.map((item) => {
				return item.groupTagId
			})

			paramJson.groupTagIdList = tagsList
			// paramJson.markList =
			paramJson.informationImageList = this.$refs.um.getInformationImageList()
			paramJson.goodsSpecList = goodsSpecList
			paramJson.information = this.$refs.um.getInformation()
			paramJson.goodsId = this.goodsId
			// let imageList = this.imageList.map((item, index) => {
			// 	item.sortOrder = index
			// 	return item
			// })
			let imageList = this.formInline.coverImage.map((item, index) => {
				item.sortOrder = index
				return item
			})

			paramJson.deleteImageList = this.deleteImageList
			paramJson.imageList = imageList
			fn(paramJson)
		},
		checkGoodsSpecList(list) {
			/** 校验规格列表数据 **/
			let flag = false
			let message = ''
			for (let goodsSpecJson of list) {
				if (isNull(goodsSpecJson.specOne)) {
					message = '请填写颜色'
					flag = true
					break
				}
				if (isNull(goodsSpecJson.barCode)) {
					message = '请填写条形码'
					flag = true
					break
				}
				if (isNull(goodsSpecJson.costPrice)) {
					message = '请填写结算价'
					flag = true
					break
				} else if (goodsSpecJson.costPrice <= 0) {
					message = '结算价不能小于等于0'
					flag = true
					break
				} else if (!this.isMoney(goodsSpecJson.costPrice)) {
					message = '输入的结算价不正确'
					flag = true
					break
				}
				if (isNull(goodsSpecJson.highestPrice)) {
					message = '请填写外网价'
					flag = true
					break
				} else if (goodsSpecJson.highestPrice <= 0) {
					message = '结算价不能小于等于0'
					flag = true
					break
				} else if (!this.isMoney(goodsSpecJson.highestPrice)) {
					message = '输入的外网价不正确'
					flag = true
					break
				}
				if (isNull(goodsSpecJson.marketPrice)) {
					message = '请填写市场价'
					flag = true
					break
				} else if (goodsSpecJson.marketPrice <= 0) {
					message = '结算价不能小于等于0'
					flag = true
					break
				} else if (
					Number(goodsSpecJson.marketPrice) < Number(goodsSpecJson.highestPrice)
				) {
					message = '市场价不能小于外网价'
					flag = true
					break
				} else if (!this.isMoney(goodsSpecJson.marketPrice)) {
					message = '输入的市场价不正确'
					flag = true
					break
				}
			}
			if (flag) {
				this.$message.error({
					message: message,
				})
			}
			return flag
		},
		marketPricePLChange(value) {
			/** 批量修改市场价 **/
			this.goodsSpecList.map((item) => {
				item.marketPrice = value
			})
		},
		highestPricePLChange(value) {
			/** 批量修改外网价 **/
			this.goodsSpecList.map((item) => {
				item.highestPrice = value
			})
		},
		costPricePLChange(value) {
			/** 批量修改结算价 **/
			this.goodsSpecList.map((item) => {
				item.costPrice = value
			})
		},
		supplyPricePLChange(value) {
			/** 批量修改供货价 **/
			this.goodsSpecList.map((item) => {
				item.supplyPrice = value
			})
		},
		lowestPriceChange(value) {
			/** 批量修改最低零售价 **/
			this.goodsSpecList.map((item) => {
				item.lowestPrice = value
			})
		},
		supplierPriceChange(value) {
			/** 批量修改最低零售价 **/
			this.goodsSpecList.map((item) => {
				item.supplierPrice = value
			})
		},
		// 检查排序值
		sortOrdeChange(value) {
			if (!value || value < 0 || value > 255 || !Number(value)) {
				this.$message.error({
					message: '请输入1到255的数值',
					duration: 2000,
				})
				this.$set(this.formInline, 'sortOrder', '')
			}
		},
		// 取消七天无理由
		handleCloseGoodsSeven() {
			this.sevenDaysChecked = []
			this.goodsSevenDialogVisible = false
		},
		handleCloseCategorySeven() {
			this.sevenDaysChecked = []
			this.categorySevenDialogVisible = false
		},
		// 添加七天无路由
		handleSevenDaysWithoutReason() {
			// 商品支持
			if (this.sevenDaysChecked[0] == 2) {
				// 类目强制不支持七天无理由
				if (this.categorySevenDaysConfig.configType === 1) {
					this.goodsSevenDialogVisible = true
				}
				//商品不支持
			} else if (this.sevenDaysChecked[0] == 1) {
				// 商品强制不支持七天无理由
				if (this.categorySevenDaysConfig.configType === 2) {
					this.categorySevenDialogVisible = true
				}
			}
		},
		// 商品支持七天无理由
		handleGoodsSeven() {
			this.sevenDaysWithoutReasonConfigType = 1
			this.goodsSevenDialogVisible = false
		},
		// 商品不支持七天无理由
		handleCategorySeven() {
			this.sevenDaysWithoutReasonConfigType = 2
			this.categorySevenDialogVisible = false
		},
	},
	directives: {
		// 注册一个局部的自定义指令 v-focus
		focus: {
			// 指令的定义
			inserted: function (el) {
				// 聚焦元素
				el.querySelector('input').focus()
			},
		},
	},
}
</script>

<style lang="scss" scoped>
.mb20 {
	margin-bottom: 20px;
}
.sortAss {
	width: 200px;
	margin-top: 20px;
	margin-left: 13px;
}
.sellingPoints {
	position: relative;
	top: -45px;
}
.typeface_nature {
	position: relative;
	float: left;
	margin-left: 50px;
	width: auto;
	&.requiredType {
		&::after {
			content: '*';
			position: absolute;
			left: -10px;
			top: 4px;
			font-size: 14px;
			color: brown;
		}
	}
}
.upload_img {
	cursor: pointer;
	width: 120px;
	height: 120px;
	background: #ddd;
	float: left;
	margin: 5px;
	margin-top: 15px;
	text-align: center;
	line-height: 20px;
	padding-top: 35px;
	border: 1px solid #ccc;
}

.save_button {
	position: fixed;
	bottom: 0;
	left: 280px;
	right: 0;
	padding: 20px 0px 20px 50px;
	background-color: #ccc;
	opacity: 0.8;
	z-index: 120;
}

.gg_text_h {
	line-height: 40px;
}
.category-list {
	clear: both;
	width: 100%;
}
.clearfix:after {
	content: '.';
	display: block;
	clear: both;
	visibility: hidden;
	height: 0;
	font-size: 0;
}
.each-list {
	display: flex;
}
.goods_img {
	width: 60px;
	height: 60px;
	margin-right: 10px;
	line-height: 155px;
}
.wrap {
	position: relative;

	&__val {
		position: absolute;
		left: 15px;
		top: 0;
		color: #606266;
		z-index: 9999999999999;
	}
}
.message .row {
	display: flex;
	align-items: center;
	width: 300px;
	// margin-top: -30px;
	.width {
		width: 100%;
	}
}
.bottom {
	margin-bottom: 70px;
}
</style>
