<template>
	<div>
		<div class="preheatingCla">
			<yx-form
				:inline="false"
				:rules="formRules"
				:data="formData"
				:items="formCfg"
				:formAction="formAction"
				labelWidth="80px"
				v-loading="showLoading"
			>
				<!-- <template #preheatTitle>
					<el-input
						placeholder="请输入预热标题"
						maxlength="80"
						show-word-limit
						v-model.trim="formData.preheatTitle"
					>
					</el-input>
				</template> -->
				<template #test>
					<el-input
						type="textarea"
						:rows="6"
						placeholder="请输入卖点描述"
						maxlength="200"
						show-word-limit
						v-model="formData.sellingPoint"
					>
					</el-input>
				</template>
				<template #number>
					<div class="base">
						<el-input
							style="width: 140px"
							v-model="formData.subscriptionBaseStart"
							placeholder="请输入订阅基数"
						></el-input>
						<div class="base_center">~</div>
						<el-input
							style="width: 140px"
							v-model="formData.subscriptionBaseEnd"
							placeholder="请输入订阅基数"
						></el-input>
					</div>
					<span class="base_tip">
						订阅基数用于预告页增加已订阅数据，烘托活动效果。每个会场的订阅基数按照等级在基数区间随机生成。
					</span>
				</template>
				<template #multiple>
					<div class="base">
						<span class="base_tip">
							每个用户点击一次订阅按钮，小程序显示的订阅次数自动增加
						</span>
						<el-input
							style="width: 140px"
							v-model="formData.subscriptionStepLength"
							placeholder=""
						></el-input>
						<span>次</span>
					</div>
				</template>
			</yx-form>
		</div>
	</div>
</template>
<script>
import YxForm from '@wg-vue-materials/yx-form'
import { uploadImageList } from '@/api/image'
import {
	savePreheatConfig,
	preheatConfigDetail,
	goodsGroupNoticeDateList,
	goodsGroupNoticeList,
} from '@/api/warmUp'
import { getSmallImg, getBigImg } from '@/utils/imageTool'
export default {
	components: {
		YxForm,
	},
	data() {
		return {
			showLoading: false,
			groupNoticeList: [],
			dateList: [],
			previewList: {
				preheatTitle:
					'重磅剧透！错过一定后悔！重磅剧透！错过一定后悔！重磅剧透！错过一定后悔！',
				atmosphereImageUrl: [],
				sellingPoint:
					'不同肤质适用的护肤品、亲子套装、夏季穿搭套装、办公室必备小零食…你想要的这里都有，你确定不看看吗？',
			},
			id: '',
			noticeDateTimestamp: '',
			flag: true,
			uploadImageList:
				'/weeget-infinite-backend-gateway/yhtplus/image/uploadImageList.action',
			formData: {
				preheatTitle: '',
				atmosphereImageUrl: [],
				sellingPoint: '',
				subscriptionBaseStart: '',
				subscriptionBaseEnd: '',
				subscriptionStepLength: 1,
			},
			formCfg: [
				{
					type: 'input',
					title: '预热标题',
					dataIndex: 'preheatTitle',
					maxlength: '80',
				},
				{
					type: 'uploadImage',
					title: '氛围图',
					dataIndex: 'atmosphereImageUrl',
					uploadAttributes: {
						limit: 1,
						imageName: 'atmosphereImageUrl',
						accept: 'image/jpeg, image/jpg, image/png, image/gif',
						action: this.uploadImageList,
						httpRequest: (file) =>
							this.uploadImageHttpRequest(file, 'atmosphereImageUrl'),
					},
				},
				{
					type: 'custom',
					title: '卖点描述',
					dataIndex: 'test',
				},
				{
					type: 'custom',
					title: '订阅基数',
					dataIndex: 'number',
				},
				{
					type: 'custom',
					title: '订阅倍增',
					dataIndex: 'multiple',
				},
			],
			formAction: [
				{
					title: '确定',
					type: 'primary',
					click: () => {
						this.saveWarm(true)
					},
				},
			],
			formRules: {
				preheatTitle: [
					{
						required: true,
						message: '请输入预热标题!',
						trigger: ['blur'],
						validator: (rule, value, callback) => {
							const specialKey =
								"[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'"
							const newValue = value.trim()
							if (!newValue) {
								callback(new Error('请输入预热标题'))
							} else if (specialKey.indexOf(value) > -1) {
								callback(new Error('请不要输入特殊字符'))
							}
							this.formData.preheatTitle = newValue
							callback()
						},
					},
				],
				number: [
					{
						// required: true,
						validator: (rule, value, callback) => {
							let numPattren = /^[+]{0,1}(\d+)$/
							// let floorPattren = /^[1-9]\d*$/
							if (
								this.formData.subscriptionBaseStart &&
								!this.formData.subscriptionBaseEnd
							) {
								callback(new Error('订阅基数必须都有输入'))
							} else if (
								!this.formData.subscriptionBaseStart &&
								this.formData.subscriptionBaseEnd
							) {
								callback(new Error('订阅基数必须都有输入'))
							} else if (
								this.formData.subscriptionBaseStart &&
								!numPattren.test(this.formData.subscriptionBaseStart)
							) {
								callback(new Error('请输入正确的格式'))
							} else if (
								this.formData.subscriptionBaseEnd &&
								!numPattren.test(this.formData.subscriptionBaseEnd)
							) {
								callback(new Error('请输入正确的格式'))
							} else if (
								this.formData.subscriptionBaseStart &&
								this.formData.subscriptionBaseEnd &&
								this.formData.subscriptionBaseStart >=
									this.formData.subscriptionBaseEnd
							) {
								callback(new Error('订阅基数第一个值必须小于第二个值'))
							}
							callback()
						},
						trigger: ['blur', 'change'],
					},
				],
			},
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.queryData()
			this._goodsGroupNoticeDateList()
		},
		async _goodsGroupNoticeDateList() {
			let {
				data: { resultCode, resultData },
			} = await goodsGroupNoticeDateList()
			if (resultCode == 0) {
				this.dateList = resultData
				console.log(this.dateList, 'fasdgadgadgg')
				if (this.dateList && this.dateList.length) {
					this.noticeDateTimestamp = this.dateList[0].noticeDateTimestamp || ''
				} else {
					this.noticeDateTimestamp = ''
				}
				if (this.noticeDateTimestamp) {
					this._goodsGroupNoticeList()
				}
			}
		},
		async _goodsGroupNoticeList() {
			let params = {
				noticeDateTimestamp: this.noticeDateTimestamp,
				length: 10,
				currentPage: 1,
			}
			let {
				data: { resultCode, resultData },
			} = await goodsGroupNoticeList(params)
			if (resultCode == 0) {
				this.groupNoticeList = resultData.records
			}
		},
		async queryData() {
			let {
				data: { resultCode, resultData },
			} = await preheatConfigDetail()
			if (resultCode == 0) {
				this.formData.preheatTitle = resultData.preheatTitle
				this.formData.sellingPoint = resultData.sellingPoint
				this.formData.subscriptionBaseStart = resultData.subscriptionBaseStart
				this.formData.subscriptionBaseEnd = resultData.subscriptionBaseEnd
				this.formData.subscriptionStepLength =
					resultData.subscriptionStepLength || 1
				resultData.atmosphereImageUrl = resultData.atmosphereImageUrl
					? [
							{
								atmosphereImageUrl: getBigImg(resultData.atmosphereImageUrl),
								imageUrl: resultData.atmosphereImageUrl,
							},
					  ]
					: []
				this.formData.atmosphereImageUrl = resultData.atmosphereImageUrl
				this.id = resultData.id
				this.previewList = JSON.parse(JSON.stringify(this.formData))
			}
		},
		async saveWarm() {
			let params = {
				preheatTitle: this.formData.preheatTitle,
				sellingPoint: this.formData.sellingPoint,
				subscriptionBaseStart: this.formData.subscriptionBaseStart,
				subscriptionBaseEnd: this.formData.subscriptionBaseEnd,
				subscriptionStepLength: this.formData.subscriptionStepLength,
			}
			if (
				this.formData.atmosphereImageUrl &&
				this.formData.atmosphereImageUrl.length
			) {
				params.atmosphereImageUrl = this.formData.atmosphereImageUrl[0].imageUrl
			} else {
				params.atmosphereImageUrl = ''
			}
			if (this.id) {
				params.id = this.id
			}
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await savePreheatConfig(params)
			this.showLoading = false
			if (resultCode == 0) {
				this.previewList.preheatTitle = resultData.preheatTitle
				this.previewList.sellingPoint = resultData.sellingPoint
				resultData.atmosphereImageUrl = resultData.atmosphereImageUrl
					? [
							{
								atmosphereImageUrl: getBigImg(resultData.atmosphereImageUrl),
								imageUrl: resultData.atmosphereImageUrl,
							},
					  ]
					: []
				this.previewList.atmosphereImageUrl = resultData.atmosphereImageUrl
				this.id = resultData.id
				this._goodsGroupNoticeDateList()
			}
		},
		handleClick() {
			this._goodsGroupNoticeList()
		},
		// 上传图标
		async uploadImageHttpRequest(params, key) {
			let formData = new FormData()
			formData.append(
				'data',
				JSON.stringify({
					formId: '#addImageFrom_goods',
					imageType: 63,
				})
			)
			if (params.file.size > 500 * 1024) {
				this.formData.atmosphereImageUrl = []
				this.$message.warning('上传的图片不能大于500K')
				return
			}
			formData.append('file', params.file)
			const res = await uploadImageList(formData)

			if (
				res.data.resultCode == 0 &&
				res.data.resultData.imageList.length > 0
			) {
				// this.funData.image = res.data.resultData.imageList[0].imageUrl
				this.formData[key] = res.data.resultData.imageList
				console.log(this.formData[key], 'xxxxxxx')
				this.formData[key][0][key] = getSmallImg(
					res.data.resultData.imageList[0].imageUrl
				)
				console.log(this.formData[key][0][key], 'faggggg')
				this.flag = false
			} else {
				this.$message.error('上传图片失败, 请重新上传')
			}
		},
	},
}
</script>
<style lang="scss" scoped></style>
