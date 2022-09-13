<template>
	<div>
		<div class="upload-box">
			<el-card class="box-card">
				<div class="title">小额打款记录</div>
				<p class="item-box">
					<span class="item-label">订单号</span>
					<router-link :to="`/business/orderDetails/${detail.orderId}`">
						<el-button type="text">{{ detail.orderSn }}</el-button>
					</router-link>
				</p>
				<p class="item-box">
					<span class="item-label">发起方:</span
					>{{
						detail.compensationPlatformType == 8
							? '商家'
							: detail.compensationPlatformType == 4
							? '平台'
							: ''
					}}发起
				</p>
				<p class="item-box">
					<span class="item-label">小额打款发起时间:</span
					>{{ moment(detail.createTime).format('YYYY-MM-DD HH:mm:ss') }}
				</p>
				<p class="item-box" v-if="detail.processState == 2">
					<span class="item-label">剩余商家处理时间:</span
					><span class="item-timer">{{ countDown(detail.deadline) }}</span>
				</p>
				<p class="item-box">
					<span class="item-label">备注：</span>{{ detail.remark }}
				</p>
				<p class="item-box">
					<span class="item-label">提示：</span>如该小额打款记录{{
						detail.smallPaymentConfirmTimeout
					}}小时内未发起申诉，将默认您对本记录无异议完成扣款，望悉知
				</p>
				<div class="item-box">
					<span class="item-label">相关截图：</span>
					<div class="goods_img_list">
						<div v-for="item in detail.imageUrls" :key="item">
							<div class="goods_img_list_warp">
								<el-image
									class=""
									fit="cover"
									:preview-src-list="previewSrcList(detail.imageUrls)"
									:src="getBigImg(item)"
								>
									<div slot="error" class="el-image__error">
										<i class="el-icon-picture-outline"></i>
									</div>
								</el-image>
							</div>
						</div>
					</div>
				</div>
				<p class="item-box">
					<span class="item-label">处理状态：</span
					>{{ violationStatus[detail.processState] }}
				</p>
			</el-card>
		</div>

		<div class="upload-box" v-if="detail.processState == 2">
			<el-card class="box-card">
				<p class="item-box">
					承担金额：{{ detail.compensationAmount }}，商家承担{{
						detail.supplierCompensationAmount
					}}，平台承担{{ detail.platformCompensationAmount }}
				</p>
				<el-input
					oninput="value=value.toString().match(/^\d+(?:\.\d{0,2})?/)"
					type="number"
					style="margin-bottom: 20px"
					class="goods_img_list"
					max="100"
					min="0"
					@change="moneyCalculate"
					v-model="supplierInput"
					autocomplete="off"
				></el-input>
				平台承担<el-input
					type="number"
					class="goods_img_list"
					v-model="platformInput"
					autocomplete="off"
					disabled
				></el-input>
				<el-input
					class="representation"
					type="textarea"
					placeholder="请输入备注"
					v-model="reason"
					maxlength="120"
					:autosize="autosize"
					show-word-limit
				></el-input>
				<el-upload
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
							_uploadImageHttpRequest(file)
						}
					"
				>
					<div class="upload-title">
						请上传驳回材料
						<el-button class="btn" size="small" type="primary"
							>点击上传</el-button
						>
					</div>
					<div slot="tip" class="el-upload__tip">
						<p>1.一次上传最多允许4张图片</p>
						<p>2.上传图片只支持jpg、jpeg、png格式图片</p>
						<!-- <p>3.每张图片不允许超过2MB</p> -->
					</div>
				</el-upload>
				<div class="image-list">
					<div class="img_list" v-for="(item, index) in imageList" :key="index">
						<el-image
							fit="cover"
							class="img"
							:src="getSmallImg(item)"
							:preview-src-list="previewSrcList(activityImage)"
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
						v-auth="'closeSmallPayment'"
						v-if="detail.processState == 2"
						@click="_merchantViolationAudit(1)"
						type="info"
						>确认关闭</el-button
					>
					<el-button
						style="margin-left: 60px"
						v-auth="'rejectSmallPayment'"
						v-if="detail.processState == 2"
						@click="_merchantViolationAudit(2)"
						type="primary"
						>确认驳回</el-button
					>
				</div>
			</el-card>
		</div>

		<div v-if="detail.records" class="title">操作记录</div>
		<yx-table
			v-loading="loading"
			:columns="tableColumns106"
			:data="detail.records"
		>
			<template slot="imageList" slot-scope="scope">
				<div class="goods_img_list">
					<div v-for="item in scope.row.imageUrls" :key="item">
						<div class="goods_img_list_warp">
							<el-image
								class=""
								fit="cover"
								:preview-src-list="previewSrcList(scope.row.imageUrls)"
								:src="getBigImg(item)"
							>
								<div slot="error" class="el-image__error">
									<i class="el-icon-picture-outline"></i>
								</div>
							</el-image>
						</div>
					</div>
				</div>
			</template>
		</yx-table>
	</div>
</template>

<script>
import { detail, close, reject } from '@/api/yxCompensationAmount'
import { accSub } from '@/utils/helper/common'
import { getBigImg, getSmallImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
export default {
	name: 'PaymentsSmallDetailsNew',
	components: {
		YxTable,
	},
	data() {
		return {
			moment,
			getBigImg,
			getSmallImg,
			accSub,
			// violationSn: this.$route.params.violationSn,
			processTypeStatus: [
				'',
				'生成小额打款记录',
				'发起申诉',
				'申诉打回',
				'修改商家承担金额驳回',
				'关闭',
				'商家同意',
				'自动确认',
			],
			violationStatus: ['', '待商家处理', '待平台处理', '已完成', '已关闭'],
			// uploadImageList,
			autosize: { minRows: 5, maxRows: 6 },
			violationSn: 'WG1563249674906343602', //违规编号
			id: this.$route.query.id, //违规编号
			reason: '', //原因
			supplierInput: '', //商家
			platformInput: '', //平台
			loading: false,
			tableColumns106: [
				{
					type: 'date',
					title: '时间',
					dataIndex: 'addTime',
				},
				{
					type: 'string',
					dataIndex: 'processType',
					title: '处理结果',
					customRender: (row) => {
						return row.processType != 4
							? this.processTypeStatus[row.processType]
							: '修改商家承担金额驳回' +
									'(' +
									row.beforeCompensationAmount +
									'-' +
									row.nowCompensationAmount +
									')'
					},
				},
				{
					type: 'string',
					dataIndex: 'remark',
					title: '原因说明',
				},
				{
					type: 'custom',
					dataIndex: 'imageList',
					title: '图片信息',
				},
				{
					type: 'string',
					dataIndex: 'operatorName',
					title: '处理人',
				},
			],
			tableData106: [],
			activityImage: [],
			imageList: [],
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
		moneyCalculate(e) {
			if (this.detail.compensationAmount) {
				this.platformInput = this.accSub(this.detail.compensationAmount, e)
			} else {
				this.platformInput = 0
			}
		},
		//放大图片滚动
		previewSrcList(list) {
			return list.map((item) => {
				return getBigImg(item)
			})
		},
		async _merchantViolationDetail() {
			let {
				data: { resultCode, resultData },
			} = await detail({
				id: this.id,
			})
			if (resultCode == 0) {
				setInterval(() => {
					this.now = moment()
				}, 1000)
				this.detail = resultData
				this.platformInput = resultData.platformCompensationAmount
				this.supplierInput = resultData.supplierCompensationAmount
			}
		},
		//确认
		async _merchantViolationAudit(audit) {
			let _this = this
			// audit  1-确认关闭，2-确认驳回
			if (!_this.reason && audit == 2) {
				return _this.$message.warning('请输入驳回原因')
			}
			console.log('111', _this.supplierInput)
			//1关2驳
			let title = ''
			if (audit == 1) {
				title = '关闭小额打款记录，将会自动修改商家承担金额为0，请确认是否关闭'
			} else if (audit == 2) {
				if (this.supplierInput == 0) {
					title = '商家承担金额为0，系统将为你关闭扣款，请确认是否关闭'
				} else {
					title =
						'现“商家承担' +
						this.supplierInput +
						'平台承担' +
						this.platformInput +
						'，请确认是否按照现有金额驳回'
				}
			}
			_this.$confirm(title, '提示', {
				type: 'warning',
				async callback(action) {
					if (action === 'confirm') {
						_this.disposeMethod(audit)
					}
				},
			})
		},
		async disposeMethod(audit) {
			let Url = audit == 1 ? close : reject
			// console.log('111', this.activityImage)
			// return
			let {
				data: { resultCode, resultData },
			} = await Url({
				id: this.id,
				remark: this.reason,
				imageUrlList: this.activityImage,
				platformCompensationAmount: this.platformInput,
				supplierCompensationAmount: this.supplierInput,
				userName: this.$store.state.user.userInfo.clerkName,
			})
			if (resultCode == 0 && resultData) {
				this.$message.success('成功')
				this._merchantViolationDetail()
				this.fileList = []
			}
		},
		// 删除图片
		deleteImg(item, index) {
			let self = this
			this.$confirm('确定删除此图片', '提示', {
				type: 'warning',
				callback: function (action) {
					if (action === 'confirm') {
						self.$delete(self.activityImage, index)
						self.$delete(self.imageList, index)
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

		// 上传图片
		_uploadImageHttpRequest: async function (params) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({ formId: '#addMaterial', imageType: 80 })
			)
			formData.append('file', params.file)
			const res = await uploadImageList(formData)
			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				this.imageList.push(
					getBigImg(res.data.resultData.imageList[0].imageUrl)
				)
				this.activityImage.push(res.data.resultData.imageList[0].imageUrl)
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
	display: flex;
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
.goods_img_list {
	width: 100px;
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
