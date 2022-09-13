<template>
	<div class="goodsGroup">
		<basicContainer>
			<div class="goods-group-btn-box">
				<el-button type="primary" @click="addGoodsGroup">添加档期</el-button>
				<el-button @click="_removeGoodsRedis" type="primary"
					>同步到小程序</el-button
				>
				<el-button
					@click="_handleGoodsGroupListRedis"
					v-auth="'handleGoodsGroupListRedis'"
					type="primary"
					>批量刷新缓存</el-button
				>
				<el-button
					v-auth="'updateGoodsGroupByGoodsGroupId'"
					@click="createPicture"
					type="primary"
					>批量生成封面</el-button
				>
				<el-button
					v-auth="'GoodsGroupForsExporter'"
					@click="downloadSchedule"
					type="primary"
					>下载档期信息</el-button
				>
				<el-button
					v-auth="'importGoodsGroupSortOrder'"
					@click="importExcel"
					type="primary"
					>导入档期排序</el-button
				>
				<el-button
					v-auth="'updateGoodsGroupImportRecord'"
					@click="handleScheduling"
					type="primary"
					>导入记录查询</el-button
				>
			</div>
			<yx-form
				:inline="true"
				:data="formData187"
				:items="formCfg187"
				:formAction="formAction187"
			>
			</yx-form>
			<div class="xcx__goods_group__list">
				<yx-table
					v-loading="loading"
					:select="true"
					rowKey="goodsGroupId"
					:selectionChange="selectionChange"
					:columns="tableColumns188"
					:pagination="page188"
					:rowClassName="tableRowClassName"
					:data="tableData188"
				>
					<template slot="goodsGroupId" slot-scope="scope">
						<el-button
							type="text"
							v-clipboard:copy="scope.row.goodsGroupId + ''"
							v-clipboard:success="onCopy"
							v-clipboard:error="onError"
							>{{ scope.row.goodsGroupId }}</el-button
						>
					</template>
					<template slot="groupName" slot-scope="scope">
						<div>
							<span> {{ scope.row.groupName }}</span>
							<el-tag
								class="group-name-tag"
								v-if="scope.row.isFreeShipping == 2"
								type="warning"
								>免邮</el-tag
							>
							<el-tag
								class="group-name-tag"
								v-if="scope.row.isMainPush == 1"
								type="warning"
								>优选</el-tag
							>
							<el-tag
								class="group-name-tag"
								v-if="scope.row.isMaJorPush == 1"
								type="warning"
								>主推</el-tag
							>
						</div>
					</template>
					<template slot="tag" slot-scope="scope">
						<div>
							<el-tag
								v-for="(tag, index) in tagList(scope.row.tag)"
								class="group-name-tag"
								type="warning"
								:key="index"
							>
								{{ tag }}</el-tag
							>
						</div>
					</template>
					<template slot="brandName" slot-scope="scope">
						<div>
							<template v-if="scope.row.lastDeliverTime">
								<div>
									<p
										:class="
											currentTime > scope.row.lastDeliverTime
												? 'group-row-bg-red'
												: ''
										"
									>
										{{ scope.row.brandName }}
									</p>
								</div>
							</template>
							<template v-else>
								<div v-html="brandName(scope.row.brandName)"></div>
							</template>
						</div>
					</template>
					<template slot="saleState" slot-scope="scope">
						<el-tag effect="dark" :type="saleState(scope.row).type">{{
							saleState(scope.row).label
						}}</el-tag>
					</template>
					<template slot="isHotStyle" slot-scope="scope">
						<div>
							<el-button
								@click="_createWordCommand(scope.row, scope.index)"
								v-if="
									!scope.row.excellentWordCommand &&
									currentTime >= scope.row.saleStartTime &&
									currentTime <= scope.row.saleEndTime
								"
								plain
								>会场详情页口令</el-button
							>
							<p v-else>
								{{
									scope.row.excellentWordCommand
										? scope.row.excellentWordCommand
										: '-'
								}}
							</p>
						</div>
					</template>
				</yx-table>
			</div>
			<Dialog
				:title="dialogTitle194"
				:visible.sync="dialogVisible194"
				:width="dialogWidth194"
				customClass="operate-goods-dialog"
				@before-close="closeVisible194"
			>
				<div>
					<yx-form
						:inline="true"
						:data="formData195"
						:items="formCfg195"
						:formAction="formAction195"
					>
						<template slot="keyword">
							<div>
								<el-input
									type="textarea"
									:rows="2"
									placeholder="请输入货号,货号与货号之间使用英文逗号隔开或者换行"
									v-model="formData195.keyword"
								></el-input>
							</div>
						</template>
					</yx-form>
					<p class="notGoodsNumber" v-if="notGoodsNumber.length">
						以下货号搜索找不到对应商品：
						<span
							v-for="(item, index) in notGoodsNumber"
							:key="index"
							style="color: #ff0000"
							>{{ item
							}}{{ index == notGoodsNumber.length - 1 ? '' : ',' }}</span
						>
					</p>
					<div class="goods-group-btn-box">
						<el-button @click="batchAdd" type="primary">批量添加</el-button>
						<el-button @click="batchRemove" type="primary">批量移除</el-button>
					</div>
					<yx-table
						ref="operateGoodsTable"
						v-loading="loading196"
						:select="true"
						rowKey="goodsId"
						:selectionChange="selectionGoods"
						:columns="tableColumns196"
						:pagination="page196"
						:data="tableData196"
						:height="500"
					>
						<template slot="goodsInfo" slot-scope="scope">
							<div class="goods-info-box">
								<el-image
									class="c_image"
									fit="cover"
									:src="getBigImg(scope.row.imageUrl)"
									:preview-src-list="[getBigImg(scope.row.imageUrl)]"
								>
									<div slot="error" class="image-slot">
										<i class="el-icon-picture-outline"></i>
									</div>
								</el-image>
								<div v-if="getGoodsDetailByOrganizationSpecId">
									<router-link
										class="goods-info-right"
										:to="`/goods/GoodsDetail/${scope.row.goodsId}/${scope.row.goodsSpecId}`"
									>
										<el-button type="text"
											>货号：{{ scope.row.goodsNumber }}</el-button
										>
										<p class="goodsName">
											{{ scope.row.goodsName }}
										</p>
									</router-link>
								</div>
								<div class="goods-info-right" v-else>
									<p>货号：{{ scope.row.goodsNumber }}</p>
									<p class="goodsName">{{ scope.row.goodsName }}</p>
								</div>
							</div>
						</template>
						<template slot="supplyPrice" slot-scope="scope">
							<div>
								<p
									v-if="scope.row.lowestPrice - scope.row.supplyPrice <= 0"
									class="group-row-bg-red"
								>
									￥{{ numberFormat(scope.row.supplyPrice, 2) }}
								</p>
								<p v-else>￥{{ numberFormat(scope.row.supplyPrice, 2) }}</p>
							</div>
						</template>
						<template slot="lowestPrice" slot-scope="scope">
							<div>
								<p
									v-if="scope.row.highestPrice - scope.row.lowestPrice <= 0"
									class="group-row-bg-red"
								>
									￥{{ numberFormat(scope.row.lowestPrice, 2) }}~{{
										numberFormat(scope.row.highestPrice, 2)
									}}
								</p>
								<p v-else>
									￥{{ numberFormat(scope.row.lowestPrice, 2) }}~{{
										numberFormat(scope.row.highestPrice, 2)
									}}
								</p>
							</div>
						</template>
					</yx-table>
				</div>
			</Dialog>
			<Dialog
				:title="dialogTitle198"
				:visible.sync="dialogVisible198"
				:width="dialogWidth198"
				:bottomBtn="dialogBottomBtn189"
			>
				<yx-form
					v-loading="loading189"
					ref="dialog189"
					labelWidth="120px"
					:data="formData189"
					:items="formCfg189"
					:rules="formRules189"
				>
					<template slot="brandName">
						<el-autocomplete
							:disabled="disabledBrand"
							placeholder="请选择会场"
							v-model="formData189.brandName"
							:fetch-suggestions="querySearchAsync"
							@select="changeBrandId"
							class="goods-group-input-with-select"
						>
							<el-button
								@click="openBrandDialog"
								slot="append"
								icon="el-icon-more"
							></el-button>
						</el-autocomplete>
					</template>
					<template slot="sortOrderTip">
						<div>数字越大，排序越前（最大值不超过15位数）</div>
					</template>
					<template slot="isPreSale">
						<div>
							<el-radio-group v-model="formData189.isPreSale">
								<el-radio :label="1"> 是</el-radio>
								<el-radio :label="2"> 否</el-radio>
							</el-radio-group>
							<div v-if="formData189.isPreSale == 1" style="display: flex">
								<el-date-picker
									v-model="formData189.preSaleStartTime"
									type="datetime"
									placeholder="开始时间"
								>
								</el-date-picker>
								<span class="presale-timer">至</span>
								<el-date-picker
									v-model="formData189.preSaleEndTime"
									type="datetime"
									placeholder="结束时间"
								>
								</el-date-picker>
							</div>
						</div>
					</template>
					<template slot="isMainPush">
						<el-radio-group v-model="formData189.isMainPush">
							<el-radio :label="1"> 是</el-radio>
							<el-radio :label="0"> 否</el-radio>
						</el-radio-group>
						<span style="margin-left: 10px"
							>选择之后，用户选择根据系统优选，会默认出现该分组</span
						>
					</template>
					<template slot="isLimitMarkup">
						<el-radio-group v-model="formData189.isLimitMarkup">
							<el-radio :label="1"> 是</el-radio>
							<el-radio :label="0"> 否</el-radio>
						</el-radio-group>
						<span style="margin-left: 10px"
							>选择之后，该分组在小程序端不可进行加价</span
						>
					</template>
					<template slot="selectAd">
						<el-select
							v-model="formData189.selectAd"
							placeholder="请选择"
							@change="selectChange"
							@focus="handleAddress"
							clearable
							@clear="clearSelectAd"
						>
							<el-option
								v-for="item in addressList"
								:key="item.afterSalesAddressId"
								:label="item.title"
								:value="item.afterSalesAddressId"
							>
							</el-option>
						</el-select>
					</template>
					<template slot="expectDeliveryTime">
						<div class="limit-buy-count-box">
							下单后<el-input
								class="expect-delivery-time"
								type="number"
								onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
								v-model.number="formData189.expectDeliveryStartTime"
							></el-input
							>-<el-input
								class="expect-delivery-time"
								type="number"
								onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
								v-model.number="formData189.expectDeliveryEndTime"
							></el-input
							>小时
						</div>
					</template>
					<template slot="limitBuyCount">
						<div>
							<div class="limit-buy-count-box">
								<el-input
									class="limit-buy-count-input"
									v-model="formData189.limitUserBuyCount"
									type="number"
								></el-input>
								<span>件/消费者</span>
								<el-input
									v-model="formData189.limitOrgBuyCount"
									type="number"
									class="limit-buy-count-input"
								></el-input>
								<span>件/店主</span>
							</div>
							<p>填写为0则不限制</p>
						</div>
					</template>
					<template slot="tagTip">
						<div>不同标签之间用英文,分隔，如(夏日美妆,新手教程)</div>
					</template>
					<template slot="campaignTag">
						<el-select
							ref="mySelect"
							v-model="formData189.campaignTag"
							placeholder="请选择"
						>
							<el-option
								v-for="item in campaignsList"
								:key="item.campaignTag"
								:label="item.campaignText"
								:value="item.campaignTag"
							>
							</el-option>
						</el-select>
					</template>
					<template slot="selectXcxTitle">
						<div>
							<el-button size="medium" @click="showHomePageTitle" type="text"
								>选择小程序首页标题</el-button
							>
							<p>
								<span
									v-for="(item, index) in formData189.homePageTitleOfApplets"
									:key="index"
									>{{ item.titleName
									}}{{
										index == formData189.homePageTitleOfApplets.length - 1
											? ''
											: ','
									}}</span
								>
							</p>
						</div>
					</template>
					<template slot="noDeliveryArea">
						<div>
							<el-button size="medium" @click="noDeliveryArea" type="text"
								>选择不发货地区</el-button
							>
							<el-button
								size="medium"
								@click="openInputNoDeliveryArea"
								type="text"
								>粘贴不发货地区</el-button
							>
							<el-button size="medium" type="text" @click="copynotDeleveryData"
								>复制不发货地区</el-button
							>
							<p>{{ noDeliverAreaName }}</p>
						</div>
					</template>
					<template slot="isShowBrandIntroduce">
						<div>
							<el-switch
								v-model="formData189.isShowBrandIntroduce"
								active-text="小程序端能看到该档期下品牌介绍"
							>
							</el-switch>
						</div>
					</template>
					<template slot="changeImg">
						<p class="change-img">
							<span>（最多可添加9张)</span
							><el-button
								v-if="formData189.goodsGroupId"
								@click="_exchangeImageByGoodsGroupId"
								size="medium"
								type="text"
								>换图片</el-button
							>
						</p>
					</template>
					<template slot="createGoodsImg">
						<div>
							<div>
								<el-button type="primary" @click="createGoodsImg"
									>生成封面</el-button
								>
							</div>
							<el-image
								z-index="10000"
								v-if="formData189.compositeImage"
								class="composite-image"
								fit="cover"
								:src="getBigImg(formData189.compositeImage)"
								:preview-src-list="[getBigImg(formData189.compositeImage)]"
							>
								<div slot="error" class="image-slot">
									<i class="el-icon-picture-outline"></i>
								</div>
							</el-image>
						</div>
					</template>
					<template slot="brandIdentity">
						<el-radio-group v-model="formData189.brandIdentity">
							<el-radio :label="0">无</el-radio>
							<el-radio :label="1">大牌入驻</el-radio>
						</el-radio-group>
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
					<template slot="brandId" slot-scope="scope">
						<el-radio
							v-model="formData189.brandId"
							:label="scope.row.brandId"
							@change="changeBrandId(scope.row)"
							>选择
						</el-radio>
					</template>
				</yx-table>
			</Dialog>
			<Dialog
				:title="dialogTitle126"
				:visible.sync="dialogVisible126"
				:width="dialogWidth126"
				:bottomBtn="dialogBottomBtn126"
			>
				<yx-table
					v-loading="loading128"
					:columns="tableColumns128"
					:pagination="page128"
					:data="tableData128"
				>
				</yx-table>
			</Dialog>
			<Dialog
				:title="dialogTitle127"
				:visible.sync="dialogVisible127"
				:width="dialogWidth127"
				:bottomBtn="dialogBottomBtn127"
			>
				<div class="area-box">
					<el-tree
						v-if="dialogVisible127"
						v-loading="loadingTree"
						ref="tree"
						:props="areaProps"
						:data="areaList"
						show-checkbox
						:expand-on-click-node="false"
						:check-on-click-node="true"
						node-key="areaId"
						@check-change="handleCheckChange"
						:default-expanded-keys="defaultAreaKeys"
					>
						<span class="custom-tree-node" slot-scope="{ node, data }">
							<span>{{ node.label }}，{{ data.areaCode }}</span>
						</span>
					</el-tree>
				</div>
			</Dialog>
			<Dialog
				title="预览二维码"
				:visible.sync="dialogVisible119"
				width="360px"
				:bottomBtn="dialogBottomBtn119"
			>
				<div class="code-box">
					<el-image
						z-index="10000"
						class="c_image"
						fit="cover"
						:src="codeImagePath"
						:preview-src-list="[codeImagePath]"
					>
						<div slot="error" class="image-slot">
							<i class="el-icon-picture-outline"></i>
						</div>
					</el-image>
					<p class="groupName">{{ groupName }}</p>
				</div>
			</Dialog>
			<Dialog
				:title="dialogTitle128"
				:visible.sync="dialogVisible128"
				:width="dialogWidth128"
				:bottomBtn="dialogBottomBtn128"
			>
				<el-button
					class="shop-main-btn"
					@click="addShopMainGroup"
					type="primary"
					>新增</el-button
				>
				<yx-table :columns="tableColumns136" :data="tableData136">
					<template slot="shopMainGroup" slot-scope="scope">
						<div>
							<el-select v-model="scope.row.userTagId" placeholder="请选择">
								<el-option
									v-for="item in shopMainGroupList"
									:key="item.userTagId"
									:label="item.tagName"
									:value="item.userTagId"
								>
								</el-option>
							</el-select>
						</div>
					</template>
					<template slot="sortOrder" slot-scope="scope">
						<div v-if="!scope.row.edit">
							{{ scope.row.sortOrder }}
						</div>
						<el-input
							type="number"
							placeholder="请输入新的值"
							onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8"
							v-model.number="scope.row.sortOrder"
							@blur="scope.row.edit = false"
							@change="scope.row.edit = false"
							maxlength="15"
							v-else
						></el-input>
					</template>
				</yx-table>
				<p>说明：排序值输入数字，数字越大越靠前，最大不超过15字</p>
			</Dialog>
		</basicContainer>
		<picture-text-dialog
			:visible.sync="pictureTextDialog"
			:pictureTextRow="pictureTextRow"
			@Refresh="Refresh"
		></picture-text-dialog>
		<Dialog
			:title="dialogTitle188"
			:visible.sync="dialogVisible188"
			:width="dialogWidth188"
		>
			<yx-form
				ref="dialog194"
				labelWidth="100px"
				:data="formData188"
				:items="formCfg188"
			>
			</yx-form>
		</Dialog>
		<Dialog
			:title="填入不发货地区"
			:visible.sync="inputNoDeliveryAreaVisible"
			:width="400"
		>
			<yx-form
				ref="dialog195"
				labelWidth="100px"
				:data="inputNoDeliveryAreaFormData"
				:items="inputNoDeliveryAreaFormCfg"
				:formAction="inputNoDeliveryAreaFormAction"
			>
			</yx-form>
		</Dialog>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import {
	getGoodsGroupListByConditionForCMS,
	createWordCommand,
	deleteGoodsGroupByGoodsGroupId,
	createGoodsGroupComPositePicture,
	updateGoodsGroupByGoodsGroupId,
	addGoodsGroupByOrganizationId,
	getGoodsGroupNotdeliverAreaList,
	exchangeImageByGoodsGroupId,
	importGoodsGroupSortOrder,
	exportByCondition,
} from '@/api/goodsGroup'
import {
	getYouxuanGoodsNumberList,
	removeGoodsRedis,
} from '@/api/yhtPlusWebGoods'
import { yxGoodsList } from '@/api/goodsList'
import { handleGoodsGroupListRedis } from '@/api/redis'
import { getCodeImage } from '@/api/weiXinUser'
import { getBigImg, imgCosServerPath } from '@/utils/imageTool'
import { checkFunctionCode } from '@/utils/auth'
import {
	numberFormat,
	isNull,
	scrollEven,
	// downloadFile,
	copyText,
} from '@/utils/helper/common'
import { getSensitiveWordFilteringList } from '@/api/systemConfiguration'
import { homePageTitleOfAppletList } from '@/api/yhtPlusCmsHomePageTitleOfApplet'
import { getAreaList } from '@/api/area'
import { uploadImageList } from '@/api/image'
import { syncCoupon } from '@/api/coupon'
import {
	addGoodsListByGoodsGroupId,
	deleteGoodsListByGoodsGroupId,
} from '@/api/adminGoods'
import { getBrandList } from '@/api/brand'
import {
	getListByGoodsGroupId,
	goodsGroupUserTagRelation,
	getTagsByBizType,
} from '@/api/questionNaire'
import { afterSalesAddressList } from '@/api/afterSales'
import Dialog from '@/components/Dialog'
import PictureTextDialog from './PictureTextDialog'
import moment from 'moment'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
		Dialog,
		PictureTextDialog,
	},
	props: {
		sensitiveWordMap: {
			type: Object,
			default: () => ({}),
		},
		campaignsList: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			formData188: {
				findBrandInfoByBrandName: [],
			},
			formCfg188: [
				{
					type: 'upload',
					title: '上传Excel',
					dataIndex: 'findBrandInfoByBrandName',
					uploadAttributes: {
						autoUpload: false,
						imageName: 'findBrandInfoByBrandName',
						action: this.uploadImageList,
						fileList: [],
						onChange: (item, files) => {
							this.formCfg188[0].uploadAttributes.fileList = []
							this.formCfg188[0].uploadAttributes.fileList.push(files)
						},
						httpRequest: (file) => this.uploadImageHttpRequest188(file),
					},
				},
			],
			dialogTitle188: '导入档期排序',
			dialogWidth188: '500px',
			dialogVisible188: false,
			pictureTextRow: {},
			pictureTextDialog: false,
			dialogVisible119: false,
			codeImagePath: '',
			groupName: '',
			dialogBottomBtn119: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible119 = false
					},
				},
			],
			isShow: false,
			numberFormat,
			getBigImg,
			listByGoodsGroupId: checkFunctionCode('listByGoodsGroupId'),
			getGoodsDetailByOrganizationSpecId: checkFunctionCode(
				'getGoodsDetailByOrganizationSpecId'
			),
			areaList: [],
			areaProps: {
				label: 'areaName',
				children: 'childAreaList',
			},
			dialogTitle127: '选择不发货地区',
			dialogWidth127: '800px',
			dialogVisible127: false,
			dialogBottomBtn127: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible127 = false
					},
				},
			],
			dialogTitle126: '选择小程序首页标题',
			dialogVisible126: false,
			dialogWidth126: '800px',
			dialogBottomBtn126: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible126 = false
					},
				},
			],
			loading128: false,
			tableColumns128: [
				{
					type: 'string',
					dataIndex: 'titleName',
					title: '标题名',
				},
				{
					type: 'string',
					dataIndex: 'subheading',
					title: '副标题名',
				},
				{
					type: 'action',
					title: '操作',
					width: '120',
					fixed: 'right',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.selectXcxTitle(row)
							},
							customRender: (action, row) => {
								let flag = this.formData189.homePageTitleOfApplets.some(
									(item) =>
										item.homePageTitleOfAppletId === row.homePageTitleOfAppletId
								)
								action.title = flag ? '移除' : '添加'
								return action
							},
						},
					],
				},
			],
			page128: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._homePageTitleOfAppletList()
				},
			},
			tableData128: [],
			shopMainGroupList: [],
			tableColumns136: [
				{
					type: 'custom',
					title: '店主群',
					dataIndex: 'shopMainGroup',
				},
				{
					type: 'custom',
					title: '排序值',
					dataIndex: 'sortOrder',
				},
				{
					type: 'action',
					title: '操作',
					width: 100,
					hide: false,
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.$set(row, 'edit', true)
							},
						},
						{
							title: '删除',
							popconfirm: true,
							popconfirmTitle: '是否删除该分群排序设置',
							confirm: (row, e, i) => {
								this.deleteShopMainGroup(row, e, i)
							},
						},
					],
				},
			],
			tableData136: [],
			dialogTitle128: '店主分群排序设置',
			dialogVisible128: false,
			dialogWidth128: '800px',
			dialogBottomBtn128: [
				{
					title: '保存',
					type: 'primary',
					click: () => {
						this._goodsGroupUserTagRelation()
					},
				},
			],
			dialogTitle125: '选择会场',
			dialogWidth125: '800px',
			dialogVisible125: false,
			dialogBottomBtn125: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.dialogVisible125 = false
					},
				},
			],
			formData126: {
				keyword: '',
				selectionTag: 2,
			},
			formCfg126: [
				{
					type: 'input',
					title: '筛选',
					dataIndex: 'keyword',
					placeholder: '会场名称',
					enter: () => {
						this._getBrandList(true)
					},
				},
			],
			formAction126: [
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						this._getBrandList(true)
					},
				},
			],
			loading127: false,
			tableData127: [],
			tableColumns127: [
				{
					type: 'custom',
					dataIndex: 'brandId',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场',
				},
			],
			page127: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._getBrandList()
				},
			},
			formData189: {
				groupName: '',
				brandName: '',
				brandId: '',
				sortOrder: '',
				isPreSale: 2,
				preSaleStartTime: '',
				preSaleEndTime: '',
				isMaJorPush: 0,
				isMainPush: 1,
				isLimitMarkup: 0,
				isFreeShipping: 2,
				isIdentity: 0,
				afterSale: 1,
				groupGenre: ['isInSell'],
				showTime: '',
				saleStartTime: '',
				saleEndTime: '',
				// description: '',
				suspensionNotice: '',
				limitUserBuyCount: 30,
				limitOrgBuyCount: 30,
				tag: '',
				homePageTitleOfApplets: [],
				isShowBrandIntroduce: true,
				goodsImageList: [],
				goodsGroupNotdeliverAreas: [],
				// lastDeliverTime: '',
				modelType: 0,
				clippedTag: 0, // 是否剪标
				expectDeliveryStartTime: 24, // 预计发货最小时间
				expectDeliveryEndTime: 48, // 预计发货最大时间
				campaignTag: 0, // 促销类型
				ascription: 1, // 档期归属
				brandIdentity: 0, // 大牌入驻
				selectAd: '', //商家地址
			},
			loading189: false,
			formRules189: {
				modelType: [
					{
						required: true,
						message: '请选择销售模式',
						trigger: 'change',
					},
				],
				groupName: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入分组名称'))
							} else if (value.indexOf(',') > -1) {
								callback(new Error('分组名称不能有,字符'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				brandName: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData189.brandId) {
								callback(new Error('请选择会场'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				sortOrder: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入排序值'))
							} else if (!/(^[1-9]\d*$)/.test(value)) {
								callback(new Error('请输入整数'))
							} else if (value.length > 15) {
								callback(new Error('不能大于15位'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				// groupGenre: [
				// 	{
				// 		required: true,
				// 		validator: (rule, value, callback) => {
				// 			if (!this.formData189.groupGenre.length) {
				// 				callback(new Error('请选择选择显示列表'))
				// 			} else {
				// 				callback()
				// 			}
				// 		},
				// 		trigger: 'change',
				// 	},
				// ],
				saleStartTime: [
					{
						required: true,
						message: '请选择售卖时间开始时间',
						trigger: 'change',
					},
				],
				showTime: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData189.showTime) {
								callback(new Error('请选择售卖时间!'))
							} else if (
								this.formData189.showTime &&
								this.formData189.showTime[1] < this.formData189.showTime[0]
							) {
								callback(new Error('结束时间必须大于开始时间!'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
				// lastDeliverTime: [
				// 	{
				// 		// required: true,
				// 		validator: (rule, value, callback) => {
				// 			if (
				// 				value &&
				// 				value <= new Date().getTime() &&
				// 				!this.formData189.goodsGroupId
				// 			) {
				// 				callback(new Error('最晚发货时间必须大于当前时间!'))
				// 			} else if (value && value < this.formData189.saleEndTime) {
				// 				callback(new Error('最晚发货时间必须大于结束时间!'))
				// 			} else {
				// 				callback()
				// 			}
				// 		},
				// 		trigger: 'change',
				// 	},
				// ],
				// description: [
				// 	{
				// 		required: true,
				// 		validator: (rule, value, callback) => {
				// 			if (!value || isNull(value)) {
				// 				callback(new Error('请输入内容'))
				// 			} else if (this.sensitiveWordMap['档期文案']) {
				// 				let flag = false
				// 				this.sensitiveWordMap['档期文案'].map((item) => {
				// 					if (value.indexOf(item) > -1) {
				// 						callback(
				// 							new Error(
				// 								`【档期文案】内出现敏感词【${item}】，请修改后再保存`
				// 							)
				// 						)
				// 						flag = true
				// 						return false
				// 					}
				// 				})
				// 				if (!flag) {
				// 					callback()
				// 				}
				// 			} else {
				// 				callback()
				// 			}
				// 		},
				// 		trigger: 'blur',
				// 	},
				// ],
				suspensionNotice: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!value || isNull(value)) {
								callback(new Error('请输入公告'))
							} else if (this.sensitiveWordMap['档期公告']) {
								let flag = false
								this.sensitiveWordMap['档期公告'].map((item) => {
									if (value.indexOf(item) > -1) {
										callback(
											new Error(
												`【档期公告】内出现敏感词【${item}】，请修改后再保存`
											)
										)
										flag = true
										return false
									}
								})
								if (!flag) {
									callback()
								}
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				expectDeliveryTime: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (
								!/^[1-9]\d{0,3}?$/.test(
									this.formData189.expectDeliveryStartTime
								) ||
								!/^[1-9]\d{0,3}?$/.test(this.formData189.expectDeliveryEndTime)
							) {
								callback(new Error('请输入正整数，上限9999'))
							} else if (
								this.formData189.expectDeliveryEndTime <
								this.formData189.expectDeliveryStartTime
							) {
								callback(new Error('预计发货时间最大值 ≥ 最小值'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				limitBuyCount: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (
								this.formData189.limitUserBuyCount.toString() == '' ||
								this.formData189.limitOrgBuyCount.toString() == ''
							) {
								callback(new Error('请填写购买数量限制'))
							} else if (
								this.formData189.limitUserBuyCount < 0 ||
								this.formData189.limitOrgBuyCount < 0
							) {
								callback(new Error('购买数量限制不能为负数'))
							} else if (
								!this.isNumber(this.formData189.limitUserBuyCount) ||
								!this.isNumber(this.formData189.limitOrgBuyCount)
							) {
								callback(new Error('购买数量限制必须为正整数'))
							} else {
								callback()
							}
						},
						trigger: 'blur',
					},
				],
				ascription: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (!this.formData189.ascription) {
								callback(new Error('请选择档期归属'))
							} else {
								callback()
							}
						},
						trigger: 'change',
					},
				],
			},
			formCfg189: [
				{
					type: 'input',
					title: '档期名称',
					dataIndex: 'groupName',
				},
				{
					type: 'custom',
					title: '选择会场',
					dataIndex: 'brandName',
				},
				{
					type: 'inputNumber',
					title: '排序值',
					dataIndex: 'sortOrder',
					maxlength: 15,
					change: (sortOrder) => {
						if (sortOrder.toString().length > 15) {
							this.$set(this.formData189, 'sortOrder', sortOrder.slice(0, 15))
						}
					},
				},
				{
					type: 'custom',
					title: '',
					dataIndex: 'sortOrderTip',
				},
				{
					type: 'custom',
					title: '是否预售',
					dataIndex: 'isPreSale',
				},
				{
					type: 'radio',
					title: '是否主推',
					dataIndex: 'isMaJorPush',
					label: 'value',
					options: [
						{
							isMaJorPush: 1,
							value: '是',
						},
						{
							isMaJorPush: 0,
							value: '否',
						},
					],
				},
				{
					type: 'custom',
					title: '是否优选',
					dataIndex: 'isMainPush',
				},
				{
					type: 'custom',
					title: '是否限制加价',
					dataIndex: 'isLimitMarkup',
				},
				// {
				// 	type: 'radio',
				// 	title: '是否免邮',
				// 	dataIndex: 'isFreeShipping',
				// 	label: 'value',
				// 	options: [
				// 		{
				// 			isFreeShipping: 2,
				// 			value: '是',
				// 		},
				// 		{
				// 			isFreeShipping: 1,
				// 			disabled: true,
				// 			value: '否',
				// 		},
				// 	],
				// },
				{
					type: 'radio',
					title: '是否需要身份证',
					dataIndex: 'isIdentity',
					label: 'value',
					options: [
						{
							isIdentity: 1,
							value: '是',
						},
						{
							isIdentity: 0,
							value: '否',
						},
					],
				},
				{
					type: 'radio',
					title: '售后保障',
					dataIndex: 'afterSale',
					label: 'value',
					options: [
						{
							afterSale: 1,
							value: '售后宽松化',
						},
						{
							afterSale: 0,
							value: '7天无理由退货',
						},
					],
				},
				{
					type: 'custom',
					title: '选择仓库地址',
					dataIndex: 'selectAd',
				},
				{
					type: 'radio',
					title: '是否剪标',
					dataIndex: 'clippedTag',
					label: 'value',
					options: [
						{
							clippedTag: 1,
							value: '是',
						},
						{
							clippedTag: 0,
							value: '否',
						},
					],
				},
				// {
				// 	type: 'checkbox',
				// 	title: '选择显示列表',
				// 	dataIndex: 'groupGenre',
				// 	label: 'value',
				// 	options: [
				// 		{
				// 			groupGenre: 'isInSell',
				// 			value: '销售中',
				// 		},
				// 		{
				// 			groupGenre: 'isHotStyle',
				// 			value: '爆款',
				// 		},
				// 	],
				// 	change: () => {
				// 		this.$forceUpdate()
				// 	},
				// },
				{
					type: 'time',
					title: '售卖时间',
					dataIndex: 'showTime',
					timeAttributes: {
						type: 'datetimerange',
					},
				},
				// {
				// 	type: 'datetimerange',
				// 	title: '售卖时间',
				// 	dataIndex: ['saleStartTime', 'saleEndTime'],
				// 	placeholder: ['请选择开始时间', '请选择结束时间'],
				// },
				{
					type: 'custom',
					title: '预计发货时间',
					dataIndex: 'expectDeliveryTime',
				},
				// {
				// 	type: 'textarea',
				// 	title: '文案',
				// 	autosize: {
				// 		minRows: 5,
				// 		maxRows: 9,
				// 	},
				// 	dataIndex: 'description',
				// },
				{
					type: 'textarea',
					title: '公告',
					dataIndex: 'suspensionNotice',
					maxlength: 400,
					autosize: {
						minRows: 5,
						maxRows: 9,
					},
				},
				{
					type: 'custom',
					title: '购买数量限制',
					dataIndex: 'limitBuyCount',
				},
				{
					type: 'custom',
					title: '品牌标识',
					dataIndex: 'brandIdentity',
				},
				{
					type: 'input',
					title: '标签',
					dataIndex: 'tag',
				},
				{
					type: 'custom',
					title: '',
					dataIndex: 'tagTip',
				},
				{
					type: 'radio',
					title: '销售模式',
					dataIndex: 'modelType',
					label: 'value',
					options: [
						{
							modelType: 0,
							value: '普通档期',
						},
						{
							modelType: 1,
							value: '云货超市',
						},
					],
				},
				{
					type: 'custom',
					title: '促销类型',
					dataIndex: 'campaignTag',
					// label: 'campaignText',
					// options: [],
				},
				// {
				// 	type: 'select',
				// 	title: '促销类型',
				// 	dataIndex: 'campaignTag',
				// 	label: 'campaignText',
				// 	options: [],
				// },
				{
					type: 'radio',
					title: '档期归属',
					dataIndex: 'ascription',
					label: 'value',
					options: [
						{
							ascription: 1,
							value: '广州',
						},
						{
							ascription: 2,
							value: '杭州',
						},
						{
							ascription: 3,
							value: 'C2M',
						},
					],
				},
				{
					type: 'custom',
					title: '小程序首页标题',
					dataIndex: 'selectXcxTitle',
				},
				{
					type: 'custom',
					title: '不发货地区',
					dataIndex: 'noDeliveryArea',
				},
				{
					type: 'custom',
					title: '显示品牌介绍',
					dataIndex: 'isShowBrandIntroduce',
				},
				{
					type: 'custom',
					unformItem: true,
					dataIndex: 'changeImg',
				},
				{
					type: 'uploadImageDraggable',
					title: '设置图片',
					dataIndex: 'goodsImageList',
					uploadAttributes: {
						limit: 9,
						isChange: true,
						change: (item) => {
							this.selectedImage(item)
						},
						imageName: 'goodsImageUrl',
						httpRequest: (file) => this.uploadImageHttpRequest(file),
					},
				},
				{
					type: 'custom',
					title: '会场封面',
					// hide: true,
					dataIndex: 'createGoodsImg',
				},
			],
			dialogBottomBtn189: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.$refs.dialog189.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this.saveAddGoodsGroup(this.formData189)
							}
						})
					},
				},
			],
			dialogTitle198: '添加分组',
			dialogVisible198: false,
			dialogWidth198: '650px',
			loading196: false,
			selectedItem: {},
			tableData196: [],
			page196: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._yxGoodsList()
				},
			},
			notGoodsNumber: [],
			isRefreshIndex: false,
			tableColumns196: [
				{
					type: 'custom',
					dataIndex: 'goodsInfo',
					title: '商品',
					width: '300',
				},
				{
					type: 'string',
					dataIndex: 'brandName',
					title: '会场',
				},
				{
					type: 'string',
					dataIndex: 'goodsAllCategoryName',
					title: '分类',
				},
				{
					type: 'custom',
					dataIndex: 'supplyPrice',
					title: '供货价',
				},
				{
					type: 'custom',
					dataIndex: 'lowestPrice',
					title: '建议零售价',
				},
				{
					type: 'amount',
					dataIndex: 'marketPrice',
					title: '市场价',
				},
				{
					type: 'date',
					dataIndex: 'shelvesTime',
					title: '上架时间',
				},
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					actions: [
						{
							title: '移除',
							auth: '',
							click: (row) => {
								this.isRefreshIndex = true
								this.batchRemoveGoodsToGroup([row])
							},
							customRender: (action, row) => {
								let remove = false
								if (this.selectedItem.goodsGroupId == row.goodsGroupId) {
									remove = true
								}

								if (!remove) {
									action.hide = true
								} else {
									action.hide = false
								}
								return action
							},
						},
						{
							title: '添加',
							auth: '',
							click: (row) => {
								this.isRefreshIndex = true
								this.batchAddGoodsToGroup([row])
							},
							customRender: (action, row) => {
								let remove = false
								if (this.selectedItem.goodsGroupId == row.goodsGroupId) {
									remove = true
								}
								if ((row.goodsGroupId > 0 && !remove) || remove) {
									action.hide = true
								} else {
									action.hide = false
								}
								return action
							},
						},
					],
				},
			],
			dialogTitle194: '添加商品',
			dialogVisible194: false,
			dialogWidth194: '80%',
			formData195: {
				keyword: '',
				goodsName: '',
				isSales: '',
			},
			formCfg195: [
				{
					type: 'custom',
					dataIndex: 'keyword',
				},
				{
					type: 'input',
					dataIndex: 'goodsName',
					title: '',
					placeholder: '商品名称',
				},
				{
					type: 'select',
					dataIndex: 'isSales',
					title: '状态',
					label: 'value',
					options: [
						{
							isSales: '',
							value: '全部',
						},
						{
							isSales: 2,
							value: '待售',
						},
						{
							isSales: 1,
							value: '在售',
						},
					],
				},
			],
			formAction195: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._yxGoodsList(true)
					},
					tableId: 102,
				},
			],
			tableRowClassName({ row }) {
				if (row.imageList.length < 9 || !row.compositeImage) {
					return 'ffc94b-row'
				}
				return ''
			},
			selectedList: [],
			currentTime: null,
			formData187: {
				groupNameKeyword: '',
				gcategoryList: [],
				goodsGroupStateList: [1, 2],
				sortField: 0,
				channelType: 0,
				startTime: '',
				endTime: '',
				isShopKeeperGrouping: '',
			},
			formCfg187: [
				{
					type: 'input',
					dataIndex: 'groupNameKeyword',
					title: '关键字',
					placeholder: '档期名称/会场名称',
					enter: () => {
						this.init(true)
					},
				},
				// {
				// 	type: 'checkbox',
				// 	dataIndex: 'gcategoryList',
				// 	title: '销售/爆款',
				// 	label: 'value',
				// 	options: [
				// 		{
				// 			value: '销售',
				// 			gcategoryList: 1,
				// 		},
				// 		{
				// 			value: '爆款',
				// 			gcategoryList: 3,
				// 		},
				// 	],
				// },
				{
					type: 'checkbox',
					dataIndex: 'goodsGroupStateList',
					title: '售卖状态',
					label: 'value',
					options: [
						{
							goodsGroupStateList: 1,
							value: '未开始',
						},
						{
							goodsGroupStateList: 2,
							value: '进行中',
						},
						{
							goodsGroupStateList: 3,
							value: '已结束',
						},
					],
				},
				{
					type: 'select',
					dataIndex: 'sortField',
					title: '排序',
					label: 'value',
					change: () => {
						this.init(true)
					},
					options: [
						{
							sortField: 0,
							value: '默认',
						},
						{
							sortField: 1,
							value: '排序值 ↓',
						},
						{
							sortField: 2,
							value: '排序值 ↑',
						},
					],
				},
				{
					type: 'select',
					dataIndex: 'channelType',
					title: '渠道',
					label: 'value',
					change: () => {
						this.init(true)
					},
					options: [
						{
							channelType: 0,
							value: '全部',
						},
						{
							channelType: 4,
							value: 'WPC',
						},
						{
							channelType: 9,
							value: '自有品牌',
						},
						{
							channelType: 10,
							value: '商家',
						},
						{
							channelType: 1,
							value: 'AKC',
						},
					],
				},
				{
					type: 'select',
					dataIndex: 'isShopKeeperGrouping',
					title: '是否设置店主分群',
					label: 'value',
					change: () => {
						this.init(true)
					},
					options: [
						{
							isShopKeeperGrouping: '',
							value: '全部',
						},
						{
							isShopKeeperGrouping: 1,
							value: '是',
						},
						{
							isShopKeeperGrouping: 0,
							value: '否',
						},
					],
				},
				{
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					title: '售卖时间',
					placeholder: ['请输入开始时间', '请输入结束时间'],
				},
			],
			formAction187: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this.init(true)
					},
				},
			],
			tableData188: [],
			tableColumns188: [
				{
					type: 'custom',
					dataIndex: 'goodsGroupId',
					title: '档期ID',
				},
				{
					type: 'custom',
					dataIndex: 'groupName',
					title: '档期名称',
					width: 200,
				},
				{
					type: 'custom',
					dataIndex: 'tag',
					title: '档期标签',
					width: 120,
				},
				{
					type: 'custom',
					dataIndex: 'brandName',
					title: '会场名称',
					width: 90,
				},
				{
					type: 'string',
					dataIndex: 'sourceType',
					title: '渠道',
					customRender: (row) => {
						return this.sourceTypeMap(row.sourceType)
					},
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '添加时间',
				},
				{
					type: 'string',
					dataIndex: 'sortOrder',
					title: '排序值',
				},
				{
					type: 'string',
					dataIndex: 'preSaleStartTime',
					title: '预售显示时间',
					customRender: (row) => {
						if (row.isPreSale == 2) {
							return '无-无'
						}
						return (
							moment(row.preSaleStartTime).format('YYYY-MM-DD HH:mm:ss') +
							'-' +
							moment(row.preSaleEndTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
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
				// {
				// 	type: 'string',
				// 	dataIndex: 'groupType',
				// 	title: '销售/爆款',
				// 	width: 90,
				// 	customRender: (row) => {
				// 		let t = '【'
				// 		if (row.isInSell == 1) {
				// 			t += '销售中'
				// 		}
				// 		if (row.isHotStyle == 1) {
				// 			t += ' 爆款'
				// 		}
				// 		t += '】'
				// 		return t
				// 	},
				// },
				{
					type: 'string',
					dataIndex: 'goodsCount',
					title: '商品数',
				},
				{
					type: 'custom',
					dataIndex: 'saleState',
					title: '售卖状态',
				},
				{
					type: 'string',
					dataIndex: 'modelType',
					title: '销售模式',
					width: 90,
					customRender: (row) => {
						if (row.modelType == 0) {
							return '普通档期'
						}
						if (row.modelType == 1) {
							return '云货超市'
						}
					},
				},
				{
					type: 'string',
					dataIndex: 'campaignTag',
					title: '促销类型',
					width: 90,
					customRender: ({ campaignTag }) => {
						let campaignText = ''
						this.campaignsList.forEach((item) => {
							if (item.campaignTag == campaignTag) {
								campaignText = item.campaignText
							}
						})
						return campaignText
					},
				},
				{
					type: 'string',
					dataIndex: 'ascription',
					title: '档期归属',
					width: 90,
					customRender: ({ ascription }) => {
						return ascription == 1
							? '广州'
							: ascription == 2
							? '杭州'
							: ascription == 3
							? 'C2M'
							: '无选择'
					},
				},
				// {
				// 	type: 'custom',
				// 	dataIndex: 'isHotStyle',
				// 	title: '生成优口令',
				// 	width: 140,
				// },
				{
					type: 'action',
					title: '操作',
					fixed: 'right',
					width: 200,
					actions: [
						{
							title: '编辑',
							auth: 'updateGoodsGroupByGoodsGroupId',
							click: (row) => {
								this.editBrandInfo(row)
								// this.dialogVisible191 = true
							},
						},
						{
							title: '添加商品',
							auth: 'updateGoodsGroupByGoodsGroupId',
							click: (row) => {
								this.selectedItem = Object.assign({}, row)
								this.formData195 = {
									keyword: '',
									goodsName: '',
									isSales: '',
								}
								this.notGoodsNumber = []
								this._yxGoodsList(true)
								this.dialogVisible194 = true
								// 对 Table 进行重新布局
								this.$nextTick(() => {
									this.$refs.operateGoodsTable.$refs.YxTable.doLayout()
								})
							},
						},
						{
							title: '查看商品',
							click: ({ goodsGroupId, brandId, groupName, goodsCount }) => {
								if (goodsCount == 0) {
									return this.$message.error('商品数量为0！')
								}
								this.$router.push({
									path: `goodsGroupDetails/${goodsGroupId}/${brandId}/${encodeURIComponent(
										groupName
									)}`,
								})
							},
						},
						{
							title: '查看公告',
							click: (row) => {
								this.$alert(row.suspensionNotice, '分组公告', {
									confirmButtonText: '确定',
								})
							},
						},
						// {
						// 	title: '删除',
						// 	auth: 'deleteGoodsGroupByGoodsGroupId',
						// 	popconfirm: true,
						// 	popconfirmTitle: '确认要删除该分组吗',
						// 	confirmButtonText: '确认',
						// 	cancelButtonText: '取消',
						// 	confirmButtonType: 'primary',
						// 	cancelButtonType: 'text',
						// 	confirm: (row) => {
						// 		this._deleteGoodsGroupByGoodsGroupId(row)
						// 	},
						// },
						{
							title: '刷新缓存',
							auth: 'handleGoodsGroupListRedis',
							popconfirm: true,
							popconfirmTitle: '是否刷新缓存',
							confirmButtonText: '确认',
							cancelButtonText: '取消',
							confirmButtonType: 'primary',
							cancelButtonType: 'text',
							confirm: (row) => {
								this._handleGoodsGroupListRedis(row)
							},
							customRender: (action) => {
								action.hide = this.$store.state.user.userInfo.groupId != 2
								return action
							},
						},
						{
							title: '生成小程序码',
							click: (row) => {
								this._getCodeImage(row)
							},
							customRender: (action, row) => {
								action.hide = this.currentTime > row.saleEndTime
								return action
							},
						},
						{
							title: '店主分群排序设置',
							auth: 'listByGoodsGroupId',
							click: ({ goodsGroupId }) => {
								this._getTagsByBizType()
								this._getListByGoodsGroupId(goodsGroupId)
							},
							customRender: (action, row) => {
								action.hide = this.currentTime > row.saleEndTime
								return action
							},
						},
						{
							title: '同步AKC优惠券',
							click: (row) => {
								this.synchronizeAKCCoupons(row)
							},
							customRender: (action, row) => {
								action.hide = row.sourceType != 1
								return action
							},
						},
						{
							title: '复制小程序链接',
							click: (row) => {
								this.$copyText(
									'/pages/InPurchasing/detail?goodsGroupId=' + row.goodsGroupId
								).then(() => {
									this.$message.success('复制成功')
								})
							},
						},
					],
				},
			],
			page188: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
			loading: false,
			// sensitiveWordMap: {},
			selectionGoodsList: [],
			loadingTree: false,
			noDeliverAreaName: '',
			oldBrandId: '',
			defaultAreaKeys: [],
			goodsLmageList: [],
			disabledBrand: false,
			goodsGroupId: '',
			oldTableData136: [],

			inputNoDeliveryAreaVisible: false,
			inputNoDeliveryAreaFormData: {
				inputNoDeliveryAreaText: '',
			},
			inputNoDeliveryAreaFormCfg: [
				{
					type: 'textarea',
					dataIndex: 'inputNoDeliveryAreaText',
					title: '解析数据',
					placeholder: '输入复制出来的不发货地区数据',
				},
			],
			inputNoDeliveryAreaFormAction: [
				{
					title: '确定',
					type: 'primary',
					click: async () => {
						try {
							const {
								goodsGroupNotdeliverAreas,
								noDeliverAreaName,
							} = JSON.parse(
								this.inputNoDeliveryAreaFormData.inputNoDeliveryAreaText || '{}'
							)
							this.formData189.goodsGroupNotdeliverAreas = goodsGroupNotdeliverAreas
							this.noDeliverAreaName = noDeliverAreaName
							this.inputNoDeliveryAreaVisible = false
							this.noDeliveryArea()
						} catch (error) {
							this.$message.warning('解析失败')
						}
					},
				},
			],
			addressList: [], //商家地址列表数据
		}
	},

	created() {
		this.init(true)
		// this._getTagsByBizType()
		// this._getSensitiveWordFilteringList()
	},
	mounted() {
		scrollEven((direct, removeScroll, event) => {
			this.removeHandleScroll = removeScroll
			this.handleScroll(direct, event)
		})
	},
	destroyed() {
		// 监听滚动
		this.removeHandleScroll()
	},
	methods: {
		handleScheduling() {
			this.$router.push({ name: 'scheduling' })
		},
		importExcel() {
			this.dialogVisible188 = true
			this.formCfg188[0].uploadAttributes.fileList = []
		},
		async uploadImageHttpRequest188(params) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({
					timeStamp: new Date().getTime(),
					groupId: 2,
					userId: this.$store.state.user.userInfo.userId,
					clerkId: this.$store.state.user.userInfo.clerkId,
				})
			)
			formData.append('formId', '#excelForm')
			formData.append('file', params.file)
			const {
				data: { resultCode, resultMsg },
			} = await importGoodsGroupSortOrder(formData)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible188 = false
				this.init(true)
			}
		},
		async downloadSchedule() {
			let paramJson = this.findSearchParams188()
			if (paramJson.goodsGroupStateList.length) {
				paramJson.goodsGroupStateList = paramJson.goodsGroupStateList.filter(
					(item) => {
						return item != 3
					}
				)
			}
			let {
				data: { resultCode, resultData },
			} = await exportByCondition(paramJson)
			if (resultCode == 0) {
				if (resultData.remoteFilePath) {
					resultData.remoteFilePath = resultData.remoteFilePath.replace(
						'/data/yhtplusFile/',
						''
					)
					const elt = document.createElement('a')
					elt.setAttribute('href', imgCosServerPath + resultData.remoteFilePath)
					elt.setAttribute('download', 'file.xlsx')
					elt.style.display = 'none'
					document.body.appendChild(elt)
					elt.click()
					document.body.removeChild(elt)
					// window.open(imgCosServerPath + resultData.remoteFilePath)
				}
			}
			// downloadFile(data, '售后仲裁单列表.xlsx')
		},
		async synchronizeAKCCoupons(row) {
			let {
				data: { resultCode, resultData },
			} = await syncCoupon({
				brandId: row.brandId,
				goodsGroupId: row.goodsGroupId,
			})
			if (resultCode == 0) {
				this.$message.success(resultData)
				this.init()
			}
		},
		async _goodsGroupUserTagRelation() {
			let dtoList = []
			let flag = false
			let numFlag = false
			this.tableData136.forEach((item) => {
				let nitem = {
					goodsGroupId: this.goodsGroupId,
					isDelete: 0,
					sortOrder: item.sortOrder,
					userTagId: item.userTagId,
				}
				if (item.id) {
					nitem.id = item.id
				}
				if (!flag) {
					flag = dtoList.some((old) => item.userTagId == old.userTagId)
				}
				if (!numFlag) {
					numFlag =
						!/(^[1-9]\d*$)/.test(item.sortOrder) ||
						item.sortOrder.toString().length > 15
				}
				dtoList.push(nitem)
			})
			if (flag) {
				return this.$message.warning('分群不可重复')
			}
			if (numFlag) {
				return this.$message.warning('排序值输入错误')
			}
			let delList = []
			this.oldTableData136.forEach((item) => {
				let flag1 = dtoList.some((old) => item.id == old.id)
				if (!flag1) {
					delList.push({
						...item,
						isDelete: 1,
					})
				}
			})
			let {
				data: { resultCode },
			} = await goodsGroupUserTagRelation({ dtoList: [...dtoList, ...delList] })
			if (resultCode == 0) {
				this.dialogVisible128 = false
			}
		},
		async _getTagsByBizType() {
			let {
				data: { resultData, resultCode },
			} = await getTagsByBizType({ bizType: 1 })
			if (resultCode == 0) {
				this.shopMainGroupList = resultData
			}
		},
		async _getListByGoodsGroupId(goodsGroupId) {
			let {
				data: { resultCode, resultData },
			} = await getListByGoodsGroupId({ goodsGroupId })
			if (resultCode == 0) {
				this.tableData136 = resultData
				this.oldTableData136 = [...resultData]
				this.goodsGroupId = goodsGroupId
				this.dialogVisible128 = true
			}
		},
		deleteShopMainGroup(row, e, i) {
			this.tableData136.splice(i, 1)
		},
		addShopMainGroup() {
			this.tableData136.push({
				userTagId: '',
				sortOrder: '',
				edit: true,
			})
		},
		removeHandleScroll() {},
		handleScroll(direct, event) {
			if (!event.target.className.includes('el-select-dropdown__item')) {
				if (this.$refs.mySelect) {
					this.$refs.mySelect.blur()
				}
			}
		},
		handleEdit(row) {
			this.pictureTextRow = row
			this.pictureTextDialog = true
		},
		closeVisible194() {
			this.dialogVisible194 = false
			if (this.isRefreshIndex) {
				this.isRefreshIndex = false
				this.init()
			}
		},
		// 预览二维码
		async _getCodeImage(row) {
			let {
				data: { resultCode, resultData },
			} = await getCodeImage({
				page: 'pages/InPurchasing/detail',
				scene: `g=${row.goodsGroupId}`,
			})
			this.groupName = row.groupName
			if (resultCode == 0) {
				let codeImagePath = resultData.codeImagePath.replace(
					'/data/yhtplusFile/',
					''
				)
				this.codeImagePath = getBigImg(codeImagePath) || ''
				this.dialogVisible119 = true
			}
		},
		// 换图片
		async _exchangeImageByGoodsGroupId() {
			this.loading189 = true
			let {
				data: { resultCode, resultData, resultMsg },
			} = await exchangeImageByGoodsGroupId({
				goodsGroupId: this.formData189.goodsGroupId,
			})
			this.loading189 = false
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				console.log(resultData, resultMsg)
				let imageList = resultData.imageList || []
				if (imageList.length) {
					imageList.map((item) => {
						item.goodsImageUrl = getBigImg(item.imageUrl)
					})
				}
				this.formData189.goodsImageList = imageList
				this.init()
			}
		},
		selectedImage(item) {
			let index = this.goodsLmageList.findIndex((image) => {
				return image.imageId == item.imageId
			})
			if (index == -1) {
				this.goodsLmageList.push(item)
			} else {
				this.goodsLmageList.splice(index, 1)
			}
			this.$forceUpdate()
		},
		createGoodsImg: async function () {
			if (this.goodsLmageList.length != 3) {
				return this.$message.error('请选择3张图片')
			}
			let paramJson = {
				brandId: this.formData189.brandId,
				productOne: {},
				productTwo: {},
				productThree: {},
			}
			this.goodsLmageList.map((item, index) => {
				let imageObject = Object.assign({}, item)
				delete imageObject.goodsImageUrl
				if (index == 0) {
					paramJson.productOne = item
				} else if (index == 1) {
					paramJson.productTwo = item
				} else if (index == 2) {
					paramJson.productThree = item
				}
			})
			let {
				data: { resultCode, resultData, resultMsg },
			} = await createGoodsGroupComPositePicture(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.formData189.compositeImage = resultData
				this.$forceUpdate()
			}
		},
		addGoodsGroup() {
			this.loading189 = false
			this.disabledBrand = false
			this.goodsLmageList = []
			this.defaultAreaKeys = []
			this.addressList = []
			this.formData189 = {
				groupName: '',
				brandName: '',
				brandId: '',
				sortOrder: '',
				isPreSale: 2,
				preSaleStartTime: '',
				preSaleEndTime: '',
				isMaJorPush: 0,
				isMainPush: 1,
				isLimitMarkup: 0,
				isFreeShipping: 2,
				isIdentity: 0,
				afterSale: 1,
				groupGenre: ['isInSell'],
				showTime: '',
				saleStartTime: '',
				saleEndTime: '',
				// description: '',
				suspensionNotice: '',
				limitUserBuyCount: 30,
				limitOrgBuyCount: 30,
				tag: '',
				homePageTitleOfApplets: [],
				isShowBrandIntroduce: true,
				goodsImageList: [],
				goodsGroupNotdeliverAreas: [],
				// lastDeliverTime: '',
				modelType: 0,
				clippedTag: 0, //是否剪标
				expectDeliveryStartTime: 24, // 预计发货最小时间
				expectDeliveryEndTime: 48, // 预计发货最大时间
				campaignTag: 0, // 促销类型
				ascription: 1, // 档期归属
				brandIdentity: 0,
				selectAd: '',
			}
			this.formCfg189.map((cfg) => {
				if (cfg.type == 'uploadImage') {
					cfg.uploadAttributes.isChange = false
				} else if (cfg.dataIndex == 'createGoodsImg') {
					cfg.hide = true
				}
				if (cfg.type == 'datetimerange' && cfg.title == '售卖时间') {
					cfg.disabled = false
				}
			})
			this.$nextTick(() => {
				this.$refs.dialog189.$refs.YxForm.clearValidate()
			})
			this.noDeliverAreaName = ''
			this.dialogTitle198 = '添加分组'
			this.dialogVisible198 = true
		},
		_getGoodsGroupNotdeliverAreaList: async function ({
			goodsGroupId,
			noDeliverAreaName,
		}) {
			this.formData189.goodsGroupNotdeliverAreas = []
			this.defaultAreaKeys = []
			if (noDeliverAreaName) {
				let {
					data: { resultCode, resultData },
				} = await getGoodsGroupNotdeliverAreaList({ goodsGroupId })
				if (resultCode == 0) {
					resultData.list.map((item) => {
						if (item && item.threeAreaId) {
							this.defaultAreaKeys.push(item.threeAreaId)
						}
					})
					this.formData189.goodsGroupNotdeliverAreas = resultData.list
				}
			}
		},
		editBrandInfo(row) {
			this.afterSalesAddressList(row)
			this.goodsLmageList = []
			this.disabledBrand = false

			let presentTime = new Date().getTime()
			if (presentTime >= row.saleStartTime && presentTime <= row.saleEndTime) {
				this.disabledBrand = true
			}
			if (presentTime > row.saleEndTime) {
				this.disabledBrand = true
			}
			this.formCfg189.map((cfg) => {
				if (cfg.type == 'uploadImage') {
					cfg.uploadAttributes.isChange = true
				} else if (cfg.dataIndex == 'createGoodsImg') {
					cfg.hide = false
				}
				if (cfg.type == 'datetimerange' && cfg.title == '售卖时间') {
					cfg.disabled = presentTime > row.saleEndTime
				}
			})
			this.oldBrandId = row.brandId
			this.noDeliverAreaName = row.noDeliverAreaName
			// this.formData189 = Object.assign({}, this.formData189, row)
			this.formData189 = Object.assign(
				{
					showTime: [row.saleStartTime, row.saleEndTime],
				},
				//获取原始的data值
				this.$options.data().formData189,
				row
			)
			this._getGoodsGroupNotdeliverAreaList(row)
			this.formData189.groupGenre = []
			if (this.formData189.isInSell == 1) {
				this.formData189.groupGenre.push('isInSell')
			}
			if (this.formData189.isHotStyle == 1) {
				this.formData189.groupGenre.push('isHotStyle')
			}
			// this.formData189.isPreSale =
			// 	this.formData189.isPreSale == 1 ? true : false
			// this.formData189.isMaJorPush =
			// 	this.formData189.isMaJorPush == 1 ? true : false
			// this.formData189.isMainPush =
			// 	this.formData189.isMainPush == 1 ? true : false
			// this.formData189.isLimitMarkup =
			// 	this.formData189.isLimitMarkup == 1 ? true : false
			this.formData189.isShowBrandIntroduce =
				this.formData189.isShowBrandIntroduce == 1 ? true : false
			this.formData189.goodsImageList = []
			this.formData189.imageList.map((item) => {
				let imageObj = Object.assign(
					{
						goodsImageUrl: getBigImg(item.imageUrl),
						checked: false,
					},
					item
				)
				this.formData189.goodsImageList.push(imageObj)
			})
			if (this.formData189.preSaleStartTime == 0) {
				this.formData189.preSaleStartTime = ''
				this.formData189.preSaleEndTime = ''
			}
			if (!this.formData189.compositeImage) {
				this.formData189.compositeImage = ''
			}
			if (!this.formData189.homePageTitleOfApplets) {
				this.$set(this.formData189, 'homePageTitleOfApplets', [])
			}
			this.loading189 = false
			this.$nextTick(() => {
				this.$refs.dialog189.$refs.YxForm.clearValidate()
			})
			this.formData189.showTime = [row.saleStartTime, row.saleEndTime]
			this.dialogTitle198 = '编辑分组'
			this.dialogVisible198 = true
		},
		saveAddGoodsGroup: async function () {
			let paramJson = {
				groupName: this.formData189.groupName,
				saleStartTime: moment(this.formData189.showTime[0]).valueOf(),
				saleEndTime: moment(this.formData189.showTime[1]).valueOf(),
				// lastDeliverTime: moment(this.formData189.lastDeliverTime).valueOf(),
				limitUserBuyCount: this.formData189.limitUserBuyCount,
				limitOrgBuyCount: this.formData189.limitOrgBuyCount,
				isPreSale: this.formData189.isPreSale, // 是否预售。1：是。 2：否
				isMajorPush: this.formData189.isMaJorPush, // 是否主推。1：是。 0：否
				isMaJorPush: this.formData189.isMaJorPush, // 是否主推。1：是。 0：否
				isMainPush: this.formData189.isMainPush, // 是否优选。1：是。 0：否
				isLimitMarkup: this.formData189.isLimitMarkup, // 是否限制加价。1：是。 0：否
				isIdentity: this.formData189.isIdentity, // 是否需要身份证。1：是。 0：否
				afterSale: this.formData189.afterSale, //售后保障。1：售后宽松化。 0：无理由退货
				isShowBrandIntroduce: this.formData189.isShowBrandIntroduce ? 1 : 0, // 是否显示会场介绍。1：是。 0：否
				isFreeShipping: this.formData189.isFreeShipping, // 是否包邮。2：是。 1：否
				isInSell: this.formData189.groupGenre.indexOf('isInSell') != -1 ? 1 : 0, // 是否销售中。1：是。 0：否
				isHotStyle:
					this.formData189.groupGenre.indexOf('isHotStyle') != -1 ? 1 : 0, // 是否爆款。1：是。 0：否
				goodsType: 1,
				brandId: this.formData189.brandId,
				// description: this.formData189.description,
				suspensionNotice: this.formData189.suspensionNotice,
				tag: this.formData189.tag,
				sortOrder: this.formData189.sortOrder,
				modelType: this.formData189.modelType,
				clippedTag: this.formData189.clippedTag,
				expectDeliveryStartTime: this.formData189.expectDeliveryStartTime,
				expectDeliveryEndTime: this.formData189.expectDeliveryEndTime,
				campaignTag: this.formData189.campaignTag,
				ascription: this.formData189.ascription,
				brandIdentity: this.formData189.brandIdentity, // 大牌入驻
				afterSalesAddressId: this.formData189.selectAd, //商家地址id
			}
			if (paramJson.isPreSale == 1) {
				if (
					!this.formData189.preSaleStartTime ||
					!this.formData189.preSaleEndTime
				) {
					return this.$message.error('请选择预售时间')
				} else if (
					this.formData189.preSaleEndTime < this.formData189.preSaleStartTime
				) {
					return this.$message.error('预售开始时间必须小于结束时间')
				}
				paramJson.preSaleStartTime = moment(
					this.formData189.preSaleStartTime
				).valueOf()
				paramJson.preSaleEndTime = moment(
					this.formData189.preSaleEndTime
				).valueOf()
			}
			paramJson.noDeliverAreaIds = []
			this.formData189.goodsGroupNotdeliverAreas.forEach((item) => {
				if (item && item.areaId) {
					paramJson.noDeliverAreaIds.push(item.areaId)
				}
			})
			paramJson.noDeliverAreaIds = paramJson.noDeliverAreaIds.join(',')
			if (
				this.formData189.goodsGroupId &&
				this.formData189.goodsGroupNotdeliverAreas.length
			) {
				paramJson.isNotdeliverAreas = 1
			}
			paramJson.noDeliverAreaIds = ''
			paramJson.goodsGroupNotdeliverAreas = []
			this.formData189.goodsGroupNotdeliverAreas.forEach((item) => {
				let newArea = JSON.parse(JSON.stringify(item))
				newArea.childAreaList = []
				if (newArea.oneAreaId) {
					paramJson.goodsGroupNotdeliverAreas.push(newArea)
				}
			})
			paramJson.noDeliverAreaName = this.noDeliverAreaName
			paramJson.imageList = []
			if (this.formData189.goodsImageList.length) {
				this.formData189.goodsImageList.map((item, index) => {
					let imageObject = Object.assign({}, item)
					imageObject.sortOrder = index
					delete imageObject.goodsImageUrl
					paramJson.imageList.push(imageObject)
				})
			}
			let homePageTitleOfAppletIds = []
			if (
				this.formData189.homePageTitleOfApplets &&
				this.formData189.homePageTitleOfApplets.length
			) {
				homePageTitleOfAppletIds = this.formData189.homePageTitleOfApplets.map(
					(item) => {
						return item.homePageTitleOfAppletId
					}
				)
			}
			paramJson.homePageTitleOfAppletIds = homePageTitleOfAppletIds.join(',')
			if (this.loading189) {
				return
			}
			this.loading189 = true
			let res = null
			let flag = false
			if (this.formData189.goodsGroupId) {
				paramJson.goodsGroupId = this.formData189.goodsGroupId
				paramJson.compositeImage = this.formData189.compositeImage || ''
				if (
					this.formData189.goodsCount > 0 &&
					paramJson.brandId != this.oldBrandId
				) {
					return this.$message.error('编辑会场请先移除分组内的全部商品')
				}
				res = await updateGoodsGroupByGoodsGroupId(paramJson)
			} else {
				flag = true
				res = await addGoodsGroupByOrganizationId(paramJson)
			}
			this.loading189 = false
			let {
				data: { resultCode, resultMsg },
			} = res
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible198 = false
				this.init(flag)
			}
		},
		isNumber(s) {
			const regu = '^[0-9]+$'
			let re = new RegExp(regu)
			if (re.test(s)) {
				return true
			} else {
				return false
			}
		},
		_getAreaList: async function () {
			this.loadingTree = true
			let {
				data: { resultCode, resultData },
			} = await getAreaList()
			this.loadingTree = false
			if (resultCode == 0) {
				resultData.areaTree[0].childAreaList.map((area1) => {
					if (area1.childAreaList) {
						area1.childAreaList.map((area2) => {
							if (area2.childAreaList) {
								area2.childAreaList.map((area3) => {
									area3.oneAreaId = area2.parentId
									area3.twoAreaId = area3.parentId
									area3.threeAreaId = area3.areaId
								})
							} else {
								area2.oneAreaId = area2.parentId
								area2.twoAreaId = area2.parentId
								area2.threeAreaId = area2.areaId
							}
						})
					} else {
						area1.oneAreaId = area1.parentId
						area1.twoAreaId = area1.parentId
						area1.threeAreaId = area1.areaId
					}
				})
				this.$nextTick(() => {
					this.areaList = resultData.areaTree[0].childAreaList
					if (this.formData189.goodsGroupNotdeliverAreas.length) {
						let list = this.formData189.goodsGroupNotdeliverAreas.map(
							(item) => {
								if (item && item.threeAreaId) {
									return item.threeAreaId
								}
							}
						)
						this.$refs.tree.setCheckedKeys(list)
					}
				})
			}
		},
		async uploadImageHttpRequest(params) {
			//上传海报
			let formData = new FormData()
			formData.append('formId', '#addImageFrom_goods')
			formData.append('data', JSON.stringify({ imageType: 28 }))

			formData.append('file', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				resultData.imageList[0].goodsImageUrl = getBigImg(
					resultData.imageList[0].imageUrl
				)
				this.formData189.goodsImageList.push(...resultData.imageList)
			}
			this.$forceUpdate()
		},
		handleCheckChange() {
			let list = this.$refs.tree.getCheckedNodes()
			this.formData189.goodsGroupNotdeliverAreas = []

			let noDeliverAreaNameStr = ''
			let areaCountLevel2 = 0
			let areaCountLevel3 = 0
			let areaCountLevel4 = 0
			list.forEach((item) => {
				let data = {}
				if (item.level == 1) {
					areaCountLevel2 = item.childAreaCount
					if (!noDeliverAreaNameStr) {
						noDeliverAreaNameStr += item.areaName
					} else {
						noDeliverAreaNameStr += ',' + item.areaName
					}
				} else if (item.level == 2) {
					areaCountLevel3 = item.childAreaCount
					if (areaCountLevel2 != 0) {
						areaCountLevel2--
						return true
					} else {
						data.oneAreaId = item.areaId
						data.twoAreaId = item.parentId
						data.threeAreaId = item.areaId
						this.formData189.goodsGroupNotdeliverAreas.push(data)
						if (!noDeliverAreaNameStr) {
							noDeliverAreaNameStr += item.areaName
						} else {
							noDeliverAreaNameStr += ',' + item.areaName
						}
					}
				} else if (item.level == 3) {
					areaCountLevel4 = item.childAreaCount
					if (areaCountLevel3 != 0) {
						areaCountLevel3--
						return true
					} else {
						data.oneAreaId = item.areaId
						data.twoAreaId = item.parentId
						data.threeAreaId = item.areaId
						this.formData189.goodsGroupNotdeliverAreas.push(data)
						if (!noDeliverAreaNameStr) {
							noDeliverAreaNameStr += item.areaName
						} else {
							noDeliverAreaNameStr += ',' + item.areaName
						}
					}
				} else if (item.level == 4) {
					data.oneAreaId = item.oneAreaId
					data.twoAreaId = item.parentId
					data.threeAreaId = item.areaId
					this.formData189.goodsGroupNotdeliverAreas.push(data)
					if (areaCountLevel4 != 0) {
						areaCountLevel4--
						return true
					} else {
						if (!noDeliverAreaNameStr) {
							noDeliverAreaNameStr += item.areaName
						} else {
							noDeliverAreaNameStr += ',' + item.areaName
						}
					}
				}
			})
			this.noDeliverAreaName = noDeliverAreaNameStr
		},
		noDeliveryArea() {
			this.dialogVisible127 = true
			if (!this.areaList.length) {
				this._getAreaList()
			} else {
				this.$nextTick(() => {
					this.$refs.tree.setCheckedKeys([])
					if (this.formData189.goodsGroupNotdeliverAreas.length) {
						let list = []
						this.formData189.goodsGroupNotdeliverAreas.forEach((item) => {
							if (item && item.threeAreaId) {
								list.push(item.threeAreaId)
							}
						})
						this.$refs.tree.setCheckedKeys(list)
					}
				})
			}
		},
		showHomePageTitle() {
			this.dialogVisible126 = true
			this._homePageTitleOfAppletList(true)
		},
		selectXcxTitle(row) {
			let flag = this.formData189.homePageTitleOfApplets.some(
				(item) => item.homePageTitleOfAppletId === row.homePageTitleOfAppletId
			)
			if (!flag) {
				this.formData189.homePageTitleOfApplets.push(row)
			} else {
				let index = this.formData189.homePageTitleOfApplets.findIndex(
					(item) => {
						return item.homePageTitleOfAppletId == row.homePageTitleOfAppletId
					}
				)
				this.formData189.homePageTitleOfApplets.splice(index, 1)
			}
			this.$forceUpdate()
		},
		_homePageTitleOfAppletList: async function (flag) {
			this.loading128 = true
			let paramJson = this.findSearchParams128(flag)
			const {
				data: { resultCode, resultData },
			} = await homePageTitleOfAppletList(paramJson)
			if (resultCode == 0) {
				this.tableData128 = resultData.homePageTitleOfAppletArrayList
				this.page128.count = resultData.count
			} else {
				this.tableData128 = []
				this.page128.count = 0
			}
			this.loading128 = false
		},
		findSearchParams128(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page128.currentPage = 1
			}
			const paramJson = Object.assign(
				{},
				{
					length: this.page128.length,
					titleState: 1,
					startIndex: (this.page128.currentPage - 1) * this.page128.length,
				}
			)
			return paramJson
		},
		_getBrandList: async function (flag) {
			this.loading127 = true
			let paramJson = this.findSearchParams127(flag)
			const {
				data: { resultCode, resultData },
			} = await getBrandList(paramJson)
			if (resultCode == 0) {
				this.tableData127 = resultData.brandList
				this.page127.count = resultData.brandCount
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
				startIndex: (this.page127.currentPage - 1) * this.page127.length,
			})
			return paramJson
		},
		openBrandDialog() {
			if (this.disabledBrand) {
				return
			}
			this.formData126.keyword = ''
			this._getBrandList(true)
			this.dialogVisible125 = true
		},
		changeBrandId(row) {
			this.formData189.brandId = row.brandId
			this.formData189.brandName = row.brandName
			this.formData189.selectAd = ''
			this.addressList = []
			this.afterSalesAddressList(row)
		},
		querySearchAsync: async function (queryString = '', cb) {
			console.log(queryString)
			let {
				data: { resultCode, resultData },
			} = await getBrandList({
				keyword: queryString,
				startIndex: 0,
				selectionTag: 2,
				length: 20,
			})
			if (resultCode == 0) {
				resultData.brandList.map((item) => {
					item.value = item.brandName
				})
				cb(resultData.brandList)
			}
		},
		_getSensitiveWordFilteringList: async function () {
			let {
				data: { resultCode, resultData },
			} = await getSensitiveWordFilteringList()
			if (resultCode == 0) {
				resultData.list.map((item) => {
					if (item.filterWord) {
						this.sensitiveWordMap[item.detection] = item.filterWord.split(',')
					}
				})
			}
		},
		selectionGoods(list) {
			this.selectionGoodsList = list
		},
		batchRemove() {
			if (!this.selectionGoodsList.length) {
				return this.$message.error('请选择可移除的商品')
			}
			this.isRefreshIndex = true
			this.batchRemoveGoodsToGroup(this.selectionGoodsList)
		},
		batchAdd() {
			let selectionGoodsList = this.selectionGoodsList.filter((item) => {
				return !item.goodsGroupId
			})
			if (!selectionGoodsList.length) {
				return this.$message.error('请选择可添加的商品')
			}
			this.isRefreshIndex = true
			this.batchAddGoodsToGroup(selectionGoodsList)
		},
		batchRemoveGoodsToGroup: async function (goodsList) {
			let goodsInfo = goodsList.map((item) => {
				return {
					goodsId: item.goodsId, //商品ID
					goodsName: item.goodsName, //商品名称
					goodsNumber: item.goodsNumber, //商品编号
					imageUrl: item.imageUrl, //图片地址
					goodsGroupId: item.goodsGroupId > 0 ? item.goodsGroupId : '', //分组ID
					groupName: item.goodsGroupId > 0 ? item.groupName : '', //分组名称
				}
			})

			let {
				data: { resultCode, resultMsg },
			} = await deleteGoodsListByGoodsGroupId({
				goodsInfo,
				operateType: 1,
				sourceType: 1,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this._yxGoodsList()
			}
		},
		batchAddGoodsToGroup: async function (goodsList) {
			let flag = false
			let goodsIdList = []
			goodsList.forEach((item) => {
				if (this.sensitiveWordMap['商品名称']) {
					this.sensitiveWordMap['商品名称'].map((w) => {
						if (item.goodsName.indexOf(w) > -1) {
							this.$message.error(
								`【商品名称】内出现敏感词【${w}】，请在商品列表修改后再次添加商品`
							)
							flag = true
							return false
						}
					})
					if (item.costPrice <= 0) {
						this.$message.error(
							item.goodsName + '商品结算价格有误，请检查修改后再次添加商品'
						)
						flag = true
						return false
					}
					if (item.supplyPrice <= 0) {
						this.$message.error(
							item.goodsName + '商品供货价格有误，请检查修改后再次添加商品'
						)
						flag = true
						return false
					}
					if (item.lowestPrice <= 0) {
						this.$message.error(
							item.goodsName + '商品销售价格有误，请检查修改后再次添加商品'
						)
						flag = true
						return false
					}
					// 建议零售价lowestPrice -供货价supplyPrice * 0.5> 供货价supplyPrice-costPrice结算价
					if (
						(item.lowestPrice - item.supplyPrice) * 0.5 >
						item.supplyPrice - item.costPrice
					) {
						this.$message.error(
							item.goodsName + '价格有误，请检查修改后再次添加商品'
						)
						flag = true
						return false
					}
				}
				goodsIdList.push(item.goodsId)
			})
			if (flag) {
				return
			}
			let tag = 0
			if (
				this.selectedItem.groupName == '精选' &&
				this.selectedItem.goodsType == 5
			) {
				//1：抢购专区，2：精选专区
				tag = 2
			} else {
				tag = 1
			}
			let {
				data: { resultCode, resultMsg },
			} = await addGoodsListByGoodsGroupId({
				goodsGroupId: this.selectedItem.goodsGroupId,
				goodsIdList,
				tag,
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this._yxGoodsList()
			}
		},
		_getYouxuanGoodsNumberList: async function () {
			this.notGoodsNumber = []
			let paramJson = Object.assign(this.formData195, {
				length: this.page196.length,
				viewType: 3,
				shelfState: 2, //获取上架商品
				sortField: 1,
				groupShelfState: 0,
				brandIdList: [this.selectedItem.brandId],
				startIndex: 0,
			})
			paramJson = JSON.parse(JSON.stringify(paramJson))
			paramJson.keyword = paramJson.keyword.replace(/\n/g, ',')
			paramJson.keyword = paramJson.keyword.replace(/\s*/g, '') //商品货号
			const {
				data: { resultCode, resultData },
			} = await getYouxuanGoodsNumberList(paramJson)
			if (resultCode == 0) {
				this.notGoodsNumber = resultData.notGoodsNumber
			}
		},
		_yxGoodsList: async function (flag) {
			this.loading196 = true
			let paramJson = this.findSearchParams195(flag)
			this.notGoodsNumber = []
			if (paramJson.keyword && flag) {
				this._getYouxuanGoodsNumberList()
			}
			paramJson = JSON.parse(JSON.stringify(paramJson))
			paramJson.keyword = paramJson.keyword.replace(/\n/g, ',')
			paramJson.keyword = paramJson.keyword.replace(/\s*/g, '') //商品货号
			if (paramJson.keyword) {
				paramJson.goodsNumberList = paramJson.keyword.split(',')
			}
			delete paramJson.keyword
			const {
				data: { resultCode, resultData },
			} = await yxGoodsList(paramJson)
			if (resultCode == 0) {
				this.tableData196 = resultData.resultData || []
				this.page196.count = resultData.total
			} else {
				this.page196.count = 0
				this.tableData196 = []
			}
			this.loading196 = false
		},
		findSearchParams195(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page196.currentPage = 1
			}
			const paramJson = Object.assign(this.formData195, {
				length: this.page196.length,
				viewType: 3,
				shelfState: 2, //获取上架商品
				sortField: 1,
				groupShelfState: 0,
				brandIdList: [this.selectedItem.brandId],
				startIndex: (this.page196.currentPage - 1) * this.page196.length,
				pageNum: this.page196.currentPage,
				pageSize: this.page196.length,
			})
			return paramJson
		},
		_removeGoodsRedis: async function () {
			let {
				data: { resultCode, resultMsg },
			} = await removeGoodsRedis()
			if (resultCode == 0) {
				this.$message.success(resultMsg)
			}
		},
		createPicture() {
			if (!this.selectedList.length) {
				return this.$message.warning('请勾选要生成的分组')
			}
			this._createGoodsGroupComPositePicture(this.selectedList, () => {
				this.$message.success('批量生成完成')
				this.init(true)
			})
		},
		// 批量生成封面
		_createGoodsGroupComPositePicture: async function (arr, callback) {
			if (arr.length == 0) {
				return typeof callback == 'function' && callback()
			}
			let goodsInfo = arr[0]
			if (goodsInfo.imageList && goodsInfo.imageList.length >= 3) {
				let paramJsonImages = {
					brandId: goodsInfo.brandId,
					productOne: goodsInfo.imageList[0],
					productTwo: goodsInfo.imageList[1],
					productThree: goodsInfo.imageList[2],
				}
				let {
					data: { resultCode, resultData },
				} = await createGoodsGroupComPositePicture(paramJsonImages)
				if (resultCode == 0) {
					goodsInfo.compositeImage = resultData
					let update = await updateGoodsGroupByGoodsGroupId(goodsInfo)
					if (update.data.resultCode == 0) {
						arr.splice(0, 1)
						this._createGoodsGroupComPositePicture(arr, callback)
					}
				}
			} else {
				arr.splice(0, 1)
				this._createGoodsGroupComPositePicture(arr, callback)
			}
		},
		// 勾选回调
		selectionChange(list) {
			this.selectedList = list
		},
		// 删除分组
		_deleteGoodsGroupByGoodsGroupId: async function ({ goodsGroupId }) {
			let {
				data: { resultCode, resultMsg },
			} = await deleteGoodsGroupByGoodsGroupId({
				goodsGroupId, //分组id
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.init(true)
			}
		},
		// 刷新缓存
		_handleGoodsGroupListRedis: async function ({ goodsGroupId }) {
			// 批量刷新缓存
			if (!goodsGroupId) {
				if (!this.selectedList.length) {
					return this.$message.warning('请勾选要刷新的分组')
				}
				let goodsGroupList = this.selectedList.map((item) => {
					return item.goodsGroupId
				})
				goodsGroupList = goodsGroupList.join(',')
				this.$confirm('是否刷新缓存？', '提示', {
					type: 'warning',
					callback: async (action) => {
						if (action === 'confirm') {
							let {
								data: { resultCode, resultMsg },
							} = await handleGoodsGroupListRedis({
								goodsGroupList, //分组id
							})
							if (resultCode == 0) {
								this.$message.success(resultMsg)
							}
						}
					},
				})
				return
			}
			let {
				data: { resultCode, resultMsg },
			} = await handleGoodsGroupListRedis({
				goodsGroupId, //分组id
			})
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.init()
			}
		},
		// 获取优口令
		_createWordCommand: async function (row, index) {
			let { goodsGroupId, brandId } = row
			this.loading = true
			let {
				data: { resultCode, result, resultData },
			} = await createWordCommand({
				goodsGroupId, //分组id
				targetType: 1, //目标类型: 1会场 2商品
				targetId: brandId, //目标id: 会场id、商品id
			})
			this.loading = false
			if (resultCode == 0 && result == 'success') {
				this.tableData188[index].excellentWordCommand = resultData.codeStr
			}
		},
		saleState(row) {
			if (this.currentTime < row.saleStartTime) {
				return {
					type: 'danger',
					label: '未开始',
				}
			}
			if (
				this.currentTime >= row.saleStartTime &&
				this.currentTime <= row.saleEndTime
			) {
				return {
					type: '',
					label: '进行中',
				}
			}
			if (this.currentTime > row.saleEndTime) {
				return {
					type: 'info',
					label: '已结束',
				}
			}
		},
		brandName(value) {
			let nowYear = new Date().getYear()
			nowYear += nowYear < 2000 ? 1900 : 0
			if (value && value.indexOf('[') > -1) {
				let brandTime = value.substring(
					value.indexOf('[') + 1,
					value.length - 1
				)
				let month = '0' + (Number(brandTime.substring(0, 2)) - 1 + '')
				let day = brandTime.substring(2, 4)
				brandTime = new Date(nowYear, month, day).getTime()
				if (this.currentTime > brandTime + 7 * 24 * 60 * 60 * 1000) {
					//超出品牌名称[]中的时间7天后标红
					return '<div class="group-row-bg-red">' + value + '</div>'
				} else {
					return value
				}
			} else {
				return value
			}
		},
		sourceTypeMap(sourceType) {
			const map = new Map([
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
			])
			let key = sourceType
			if (Number.isInteger(key)) {
				key = key.toString()
			}
			if (!map.get(key)) {
				return '-'
			}
			return map.get(key)
		},
		tagList(tag) {
			if (!tag) {
				return []
			}
			return tag.split(',')
		},
		onCopy: function () {
			this.$message.success('复制成功')
		},
		onError: function () {
			this.$message.error('复制失败')
		},
		// 获取分组列表
		init: async function (flag) {
			this.loading = true
			let paramJson = this.findSearchParams188(flag)
			const {
				data: { resultCode, resultData },
			} = await getGoodsGroupListByConditionForCMS(paramJson)
			if (resultCode == 0) {
				this.isShow = true
				this.tableData188 = resultData.goodsGroupList
				this.page188.count = resultData.goodsGroupCount
				this.currentTime = resultData.currentTime
			} else {
				this.page188.count = 0
				this.tableData188 = []
			}
			this.loading = false
		},
		findSearchParams188(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page188.currentPage = 1
			}
			const paramJson = Object.assign(this.formData187, {
				length: this.page188.length,
				goodsType: 1,
				startIndex: (this.page188.currentPage - 1) * this.page188.length,
			})
			return paramJson
		},
		// 打开粘贴不发货地区弹窗
		openInputNoDeliveryArea() {
			this.inputNoDeliveryAreaVisible = true
		},
		// 复制不发货地区数据
		copynotDeleveryData() {
			const str = JSON.stringify({
				goodsGroupNotdeliverAreas: this.formData189.goodsGroupNotdeliverAreas,
				noDeliverAreaName: this.noDeliverAreaName,
			})
			copyText(str, () => {
				this.$message.success('复制成功')
			})
		},
		//获取商家地址
		afterSalesAddressList: async function (row) {
			let {
				data: { resultCode = 0, resultData = [] },
			} = await afterSalesAddressList({ supplierId: row.supplierId })
			if (resultCode == 0) {
				this.addressList = resultData
			}
			if (row.afterSalesAddressId) {
				this.formData189.selectAd = row.afterSalesAddressId
			}
		},
		//选择地址
		selectChange(val) {
			this.formData189.selectAd = val
		},
		//点击地址选择框
		handleAddress() {
			if (!this.formData189.brandName) {
				this.$message.success('请先选择会场')
			}
		},
		//清空地址
		clearSelectAd() {
			this.formData189.selectAd = ''
		},
	},
}
</script>
<style lang="scss" scoped>
.shop-main-btn {
	margin-bottom: 10px;
}
</style>
