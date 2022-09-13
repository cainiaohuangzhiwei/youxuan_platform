<template>
	<div>
		<div class="upload-box">
			<div class="title">违规记录</div>
			<p class="item-box">
				<span class="item-label">违规订单号：</span>
				<router-link :to="`/business/orderDetails/${detail.orderId}`">
					<el-button type="text">{{ detail.orderSn }}</el-button>
				</router-link>
			</p>
			<p class="item-box">
				<span class="item-label">违规编号：</span>{{ detail.violationSn }}
			</p>
			<p class="item-box">
				<span class="item-label">违规发起时间：</span
				>{{ moment(detail.addTime).format('YYYY-MM-DD HH:mm:ss') }}
			</p>
			<p class="item-box" v-if="detail.violationStatus == 1">
				<span class="item-label">剩余处理时间：</span
				><span class="item-timer">{{
					countDown(detail.merchantBeenConfirmTime)
				}}</span>
			</p>
			<p class="item-box">
				<span class="item-label">违规处罚事项：</span
				>{{ violationTypeList[detail.violationType] }}
			</p>
			<p class="item-box">
				<span class="item-label">违规处理：</span>{{ detail.punishResult }}
			</p>
			<div class="item-box">
				<span class="item-label">相关截图：</span>
				<div class="image-box">
					<el-image
						class="image-item"
						v-for="(url, index) in detail.images"
						:key="index"
						style="width: 100px; height: 100px"
						:src="getSmallImg(url)"
						:preview-src-list="previewSrcList(detail.images)"
						fit="contain"
					></el-image>
				</div>
			</div>
			<p class="item-box">
				<span class="item-label">申诉状态：</span
				>{{ violationStatus[detail.violationStatus] }}
			</p>
		</div>
		<div class="upload-box">
			<el-input
				v-if="detail.violationStatus == 2"
				class="representation"
				type="textarea"
				placeholder="请输入驳回原因"
				v-model="reason"
				maxlength="120"
				:autosize="autosize"
				show-word-limit
			></el-input>
			<el-upload
				v-auth="'violationAuditFileUpload'"
				v-if="!detail.importConfirm || detail.violationStatus == 2"
				action=""
				:limit="4"
				:on-exceed="handleExceed"
				accept="image/jpeg, image/jpg, image/png"
				:before-upload="beforeUpload"
				multiple
				:file-list="fileElList"
				:show-file-list="false"
				:http-request="
					(file) => {
						uploadImageHttpRequest(file)
					}
				"
			>
				<div class="upload-title">
					{{ !detail.importConfirm ? '请上传违规证明材料' : '请上传驳回材料'
					}}<el-button class="btn" size="small" type="primary"
						>点击上传</el-button
					>
				</div>
				<div slot="tip" class="el-upload__tip">
					<p>1.一次上传最多允许4张图片</p>
					<p>2.上传图片只支持jpg、jpeg、png格式图片</p>
					<p>3.每张图片不允许超过2MB</p>
				</div>
			</el-upload>
			<div class="image-list">
				<div class="img_list" v-for="(item, index) in fileList" :key="index">
					<el-image
						fit="cover"
						class="img"
						:src="getSmallImg(item)"
						:preview-src-list="previewSrcList(fileList)"
						:key="index"
					>
						<div slot="error" class="el-image__error">
							<i class="el-icon-picture-outline"></i>
						</div>
					</el-image>
					<div class="img_dlt" @click="deleteImg(item, index)">删除</div>
				</div>
			</div>
			<div class="bottom-box">
				<el-button
					v-auth="'violationAudit'"
					v-if="detail.violationStatus == 2"
					@click="_merchantViolationAudit(1)"
					type="info"
					>确认关闭</el-button
				>
				<el-button
					style="margin-left: 60px"
					v-auth="'violationAudit'"
					v-if="detail.violationStatus == 2"
					@click="_merchantViolationAudit(2)"
					type="primary"
					>确认驳回</el-button
				>
				<el-button
					v-auth="'violationImportConfirm'"
					v-if="!detail.importConfirm"
					@click="_importConfirm"
					type="primary"
					>上传完成，确认记录</el-button
				>
			</div>
		</div>
		<div v-if="violationForsOperateList" class="title">申诉记录</div>
		<yx-table
			v-if="violationForsOperateList"
			v-loading="loading"
			:columns="tableColumns106"
			:data="tableData106"
		>
			<template slot="imageList" slot-scope="scope">
				<div>
					<div class="image-box">
						<el-image
							class="image-item"
							v-for="(url, index) in scope.row.imageList"
							:key="index"
							style="width: 100px; height: 100px"
							:src="getSmallImg(url)"
							:preview-src-list="previewSrcList(scope.row.imageList)"
							fit="contain"
						></el-image>
					</div>
				</div>
			</template>
		</yx-table>
	</div>
</template>

<script>
import {
	merchantViolationAudit,
	importConfirm,
	merchantViolationDetail,
	forsOperateList,
	auditFileUpload,
} from '@/api/supply'
import { checkFunctionCode } from '@/utils/auth'

import { getBigImg, getSmallImg } from '@/utils/imageTool'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
export default {
	components: {
		YxTable,
	},
	data() {
		return {
			violationForsOperateList: checkFunctionCode('violationForsOperateList'),
			moment,
			getBigImg,
			getSmallImg,
			// violationSn: this.$route.params.violationSn,
			violationTypeList: [
				'',
				'超时发货',
				'超时揽收',
				'虚假发货',
				'包装违规',
				'空包',
				'错发',
				'漏发',
				'商品缺货',
				'物流停滞',
				'其他发货异常',
				'未按规则提交资质材料',
				'资质造假',
				'样品检验',
				'飞行检查',
				'商品违规审查',
				'知识产权侵权',
				'商品价格违规',
				'出售假冒/盗版商品',
				'物理/化学/安全等项目不合格',
				'商品质量抽检规则',
				'经营/售卖三无产品',
				'虚假宣传',
				'妨害消费者权益',
				'违背交易流程',
				'不当获取/使用信息',
				'违背承诺',
				'发票开具',
				'消极处理售后',
				'严重售后问题',
				'扰乱平台秩序/不配合平台管理',
				'骚扰他人',
				'虚假交易',
				'其他违规',
			],
			violationStatus: ['', '待处理', '申诉中', '已完成', '已关闭'],
			autosize: { minRows: 5, maxRows: 6 },
			violationSn: this.$route.params.violationSn, //违规编号
			supplierId: this.$route.params.supplierId, //违规编号
			reason: '', //驳回原因
			loading: false,
			tableColumns106: [
				{
					type: 'date',
					title: '时间',
					dataIndex: 'addTime',
				},
				{
					type: 'string',
					dataIndex: 'operation',
					title: '处理结果',
				},
				{
					type: 'string',
					dataIndex: 'operatorRemark',
					title: '原因说明',
				},
				{
					type: 'custom',
					dataIndex: 'imageList',
					title: '图片信息',
				},
				{
					type: 'string',
					dataIndex: 'operateName',
					title: '处理人',
				},
			],
			tableData106: [],
			fileElList: [],
			fileList: [],
			now: moment(),
			endDate: moment().valueOf() + 60 * 1000 * 60 * 3 + 1820,
			processingTime: moment().valueOf() + 60 * 1000 * 60 * 3 + 1820,
			setTimeout: null,
			processingStr: '',
			detail: {},
		}
	},
	mounted() {
		this._merchantViolationDetail()
		if (this.violationForsOperateList) {
			this._forsOperateList()
		}
	},
	computed: {
		//计算属性，返回剩余时间
		countDown() {
			return function (endDate) {
				let m1 = this.now
				let m2 = moment(endDate)
				let du = moment.duration(m2 - m1, 'ms'),
					day = du.get('day'),
					hours = du.get('hours') + day * 24,
					mins = du.get('minutes'),
					ss = du.get('seconds')
				if (hours <= 0 && mins <= 0 && ss <= 0) {
					return '已超时'
				} else {
					return `${this.PrefixInteger(hours, 2)}小时${this.PrefixInteger(
						mins,
						2
					)}分钟${this.PrefixInteger(ss, 2)}秒`
				}
			}
		},
	},
	methods: {
		previewSrcList(list) {
			return list.map((item) => {
				return getBigImg(item)
			})
		},
		async _forsOperateList() {
			let {
				data: { resultCode, resultData },
			} = await forsOperateList({
				violationSn: this.violationSn,
				supplierId: this.detail.supplierId,
			})
			if (resultCode == 0) {
				this.tableData106 = resultData
			}
		},
		async _merchantViolationDetail() {
			let {
				data: { resultCode, resultData },
			} = await merchantViolationDetail({
				violationSn: this.violationSn,
				supplierId: this.supplierId,
			})
			if (resultCode == 0) {
				setInterval(() => {
					this.now = moment()
				}, 1000)
				this.detail = resultData
			}
		},
		// 商家违规导入确认
		async _importConfirm() {
			let {
				data: { resultCode, resultData },
			} = await importConfirm({
				fileUrls: this.fileList,
				violationSn: this.violationSn, // 违规号
				userName: this.$store.state.user.userInfo.clerkName,
			})
			if (resultCode == 0) {
				if (resultData) {
					this._merchantViolationDetail()
					if (this.violationForsOperateList) {
						this._forsOperateList()
					}
					this.fileList = []
					this.$message.success('确认成功')
				} else {
					this.$message.error('确认失败')
				}
			}
		},
		//商家违规审核
		async _merchantViolationAudit(audit) {
			// audit  1-确认关闭，2-确认驳回
			if (!this.reason && audit == 2) {
				return this.$message.warning('请输入驳回原因')
			}
			let {
				data: { resultCode, resultData },
			} = await merchantViolationAudit({
				audit,
				reason: this.reason,
				fileUrls: this.fileList,
				userName: this.$store.state.user.userInfo.clerkName,
				violationSn: this.violationSn, // 违规号
			})
			if (resultCode == 0 && resultData) {
				this._merchantViolationDetail()
				this.fileList = []
				if (this.violationForsOperateList) {
					this._forsOperateList()
				}
			}
		},
		// 删除图片
		deleteImg(item, index) {
			let self = this
			this.$confirm('确定删除此图片', '提示', {
				type: 'warning',
				callback: function (action) {
					if (action === 'confirm') {
						self.$delete(self.fileList, index)
						self.$delete(self.fileElList, index)
					}
				},
			})
		},
		handleExceed() {
			this.$message.warning(`最多只能上传4张图片`)
		},
		async beforeUpload(file) {
			const isLt2M = file.size / 1024 / 1024 < 2
			const type =
				file.type == 'image/jpeg' ||
				file.type == 'image/jpg' ||
				file.type == 'image/png'
			if (!type) {
				this.$message({
					message: '上传图片只支持jpg、jpeg、png格式图片!',
					type: 'warning',
				})
				return Promise.reject(type)
			}
			if (!isLt2M) {
				this.$message({
					message: '上传图片大于2M,请重新选择!',
					type: 'warning',
				})
				return Promise.reject(isLt2M)
			}
			return isLt2M
		},
		PrefixInteger(num, n) {
			return (Array(n).join(0) + num).slice(-n)
		},
		uploadImageHttpRequest: async function (params) {
			let formData = new FormData()
			formData.append('data', JSON.stringify({ imageType: 68 }))
			formData.append('file', params.file)
			const {
				data: { resultCode, resultData },
			} = await auditFileUpload(formData)
			if (resultCode == 0) {
				this.fileList.push(resultData.fileUrl)
				this.fileElList.push({ url: resultData.fileUrl })
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.title {
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 20px;
}
.item-box {
	min-height: 25px;
	padding: 5px 0;
	line-height: 20px;
	.item-label {
		display: inline-block;
		width: 120px;
	}
	.item-timer {
		color: #ff9900;
	}
	.image-box {
		display: inline-flex;
		flex-wrap: wrap;
		.image-item {
			margin-right: 10px;
		}
	}
}
.upload-title {
	margin-top: 20px;
	.btn {
		margin-left: 10px;
	}
}
.img_list {
	overflow: hidden;
	position: relative;
	cursor: pointer;
	width: 120px;
	height: 120px;
	line-height: 116px;
	margin: 5px;
	padding: 0px;
	text-align: center;
	float: left;
	border: 1px solid #ccc;
	margin-top: 15px;
	border-radius: 5px;
	box-shadow: #e6e6e6 0px 0px 7px 1px;
	.img {
		width: 100%;
		height: 100%;
	}
	.img_dlt {
		width: 100%;
		height: 24px;
		position: absolute;
		background: #e7e7e7;
		bottom: 0;
		left: 0;
		z-index: 20;
		text-align: center;
		line-height: 24px;
		border: 0;
		border-top-width: 0px;
	}
}
.image-list {
	display: inline-flex;
	flex-wrap: wrap;
	margin-top: 20px;
}
.bottom-box {
	text-align: right;
}
.upload-box {
	background-color: #fff;
	padding: 20px;
	margin-bottom: 20px;
}
</style>
