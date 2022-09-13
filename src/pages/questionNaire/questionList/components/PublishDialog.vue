<template>
	<div>
		<el-dialog
			class="publish-dialog"
			ref="elDialog"
			title="投放问卷"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			:modal-append-to-body="false"
		>
			<yx-form
				ref="form"
				:inline="false"
				:items="item"
				:data="funData"
				:rules="funRules"
				:labelWidth="'140px'"
				:formAction="funAction"
			>
			</yx-form>

			<yx-form
				ref="formInfo"
				:inline="false"
				:items="itemInfo"
				:data="funDataInfo"
				:labelWidth="'140px'"
				:formAction="[]"
			>
				<!-- <template #codeImagePath>
					<el-button
						v-if="codeUrl"
						type="text"
						style="white-space: inherit; text-align: left"
						v-clipboard:copy="codeUrl"
						v-clipboard:success="onCopy"
						v-clipboard:error="onError"
					>
						H5地址： {{ codeUrl }}
					</el-button>
				</template> -->
				<template #publishImagePath>
					<div>
						<div class="code_right">
							<el-button
								:type="parseType === 1 ? 'primary' : ''"
								class="btn"
								@click="toParseLink(1)"
							>
								生成链接<br />（小程序）
							</el-button>
							<el-button
								class="btn"
								:type="parseType === 2 ? 'primary' : ''"
								:loading="parseType === 2 && infoLoading"
								@click="toParseLink(2)"
							>
								生成链接跳转浏览器<br />（短信）
							</el-button>
							<el-button
								class="btn"
								:type="parseType === 3 ? 'primary' : ''"
								:loading="parseType === 3 && infoLoading"
								@click="toParseLink(3)"
							>
								生成链接拉起小程序<br />（短信）
							</el-button>
							<el-button
								class="btn"
								:type="parseType === 4 ? 'primary' : ''"
								:loading="parseType === 4 && infoLoading"
								@click="toParseLink(4)"
							>
								生成链接跳转小程序<br />（公众号）
							</el-button>
							<el-button
								class="btn"
								:type="parseType === 5 ? 'primary' : ''"
								:loading="parseType === 5 && infoLoading"
								@click="toParseLink(5)"
							>
								生成链接拉起小程序<br />（社群）
							</el-button>
						</div>

						<div v-loading="loading">
							<el-image
								class="code_image"
								:z-index="zIndex"
								v-if="funDataInfo.codeImagePath.length > 0"
								:src="funDataInfo.codeImagePath"
								:fit="fit"
								:preview-src-list="funDataInfo.codeImagePath"
							/>
						</div>

						<br />
						<el-button
							v-if="parseLink"
							type="text"
							style="white-space: inherit; text-align: left"
							v-clipboard:copy="parseLink"
							v-clipboard:success="onCopy"
							v-clipboard:error="onError"
						>
							点击复制： {{ parseLink }}
						</el-button>
					</div>
				</template>
			</yx-form>
		</el-dialog>
	</div>
</template>

<script>
import { getCodeImage } from '@/api/shopDetail'
import YxForm from '@wg-vue-materials/yx-form'
import { questionNaireOpen, transformMsgLink } from '@/api/questionNaire'
import { getSmallImg } from '@/utils/imageTool'
import Cookies from 'js-cookie'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		action: {
			type: String,
			default: 'add',
		},
		publishId: {
			type: String,
			default: '',
		},
		shortId: {
			type: String,
			default: '',
		},
	},

	components: {
		YxForm,
	},

	data() {
		return {
			item: [
				{
					title: '选择要投放的时间',
					type: 'datetimerange',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['开始时间', '结束时间'],
				},
			],
			funData: {
				launchProduct: 1,
				startTime: '',
				endTime: '',
			},
			funRules: {
				startTime: [
					{
						required: true,
						message: '请选择要投放的开始时间',
					},
				],
				endTime: [
					{
						required: true,
						message: '请选择要投放的结束时间',
					},
				],
			},
			funAction: [
				{
					title: '确定投放',
					type: 'primary',
					click: () => {
						this.submitForm()
					},
				},
			],
			itemInfo: [
				// {
				// 	title: '问卷链接',
				// 	type: 'custom',
				// 	dataIndex: 'codeImagePath',
				// },
				{
					title: '选择投放渠道',
					type: 'custom',
					dataIndex: 'publishImagePath',
				},
			],
			funDataInfo: {
				codeImagePath: [],
				publishImagePath: [],
			},
			codeUrl: '',
			loading: false,
			infoLoading: false,
			zIndex: 2001,
			parseLink: '',
			parseType: 1,
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
	},

	methods: {
		// 回显
		detail(row) {
			this.flag = true
			const tempArr = Object.assign({}, row)
			const { launchProduct, startTime, endTime } = tempArr
			this.funData = {
				launchProduct,
				startTime,
				endTime,
			}
			this.funDataInfo = {
				codeImagePath: [],
				// publishImagePath: [],
			}
			this.parseType = ''
			this.parseLink =
				this.getOrigin() +
				'/yhtplus/H5/customer/pages/questionNaire.html?qId=' +
				this.shortId +
				'&auth=1&authShop=1'
			this.codeUrl =
				this.getOrigin() +
				'/yhtplus/H5/customer/pages/questionNaire.html?qId=' +
				this.publishId +
				'&auth=1&authShop=1'
			this.parseType = 1
			this.$forceUpdate()
			// this.updateData()
		},
		// 获取图片
		async updateData(channel) {
			this.loading = true
			const paramsData = {
				page: 'subpages/H5/h5Page',
				scene: `t=12&q=${this.shortId}${channel ? '&c=' + channel : ''}`,
			}

			const res = await getCodeImage(paramsData)
			const { resultCode, resultData } = res.data

			if (resultCode == 0 && resultData.codeImagePath) {
				this.funDataInfo.codeImagePath =
					resultData.codeImagePath.length > 0
						? [
								getSmallImg(
									resultData.codeImagePath.replace('/data/yhtplusFile/', '')
								),
						  ]
						: []
			}
			this.loading = false
			const elDialog = this.$refs.elDialog
			const zIndex = elDialog.$el.style.zIndex
			this.zIndex = Number(zIndex) + 1
		},
		getOrigin() {
			const environment = Cookies.get('environment')
			if (!environment || environment === 'local' || environment === 'daily') {
				return 'https://ali-pressure.yunhuotong.net'
			} else if (environment === 'pre') {
				return 'https://ali-release.yunhuotong.net'
			} else if (environment === 'gray') {
				return 'https://yhtplus-v2.yunhuotong.net'
			} else if (environment === 'prod') {
				return 'https://yhtplus.yunhuotong.net'
			}
		},

		onCopy(e) {
			if (e.text) {
				this.$message.success('复制成功')
			}
		},
		onError() {
			this.$message.error('复制失败')
		},

		// 保存
		async submitForm() {
			const submitData = {
				queQuestionnaireId: this.publishId,
				userId: this.$store.state.user.userInfo.userId || '',
				...this.funData,
				launchProduct: 1,
				startTime: ((this.funData.startTime / 1000) >>> 0) * 1000,
				endTime: ((this.funData.endTime / 1000) >>> 0) * 1000,
				codeImagePath: undefined,
			}
			questionNaireOpen(submitData)
				.then(({ data }) => {
					if (data.resultCode == 0) {
						this.$message.success('投放成功')
						this.$emit('open')
					}
				})
				.finally(() => {
					this.resetForm()
				})
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.$refs.form.$refs.YxForm.resetFields()
			this.shortLink = 0
			this.msgLink = 0
		},
		toCode(str) {
			const key = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
			let l = key.length //获取密钥的长度
			let a = key.split('') //把密钥字符串转换为字符数组
			let s = '',
				b,
				b1,
				b2,
				b3 //定义临时变量
			for (let i = 0; i < str.length; i++) {
				//遍历字符串
				b = str.charCodeAt(i) //逐个提取每个字符，并获取Unicode编码值
				b1 = b % l //求Unicode编码值得余数
				b = (b - b1) / l //求最大倍数
				b2 = b % l //求最大倍数的于是
				b = (b - b2) / l //求最大倍数
				b3 = b % l //求最大倍数的余数
				s += a[b3] + a[b2] + a[b1] //根据余数值映射到密钥中对应下标位置的字符
			}
			return s //返回这些映射的字符
		},
		toParseLink(type) {
			this.parseType = type
			let parseLink = ''
			let fetch = null // 需要后端处理
			const originUrl =
				this.getOrigin() +
				'/yhtplus/H5/customer/pages/questionNaire.html?qId=' +
				this.shortId
			this.funDataInfo.codeImagePath = []
			if (type === 1) {
				// 小程序
				parseLink = originUrl + '&auth=1&authShop=1'
			} else if (type === 2) {
				// 跳转浏览器（短信）
				parseLink = originUrl + '&auth=-1&channel=3'
				fetch = {
					type: 1,
					url: parseLink,
				}
			} else if (type === 3) {
				// 跳转浏览器，拉起小程序（短信）
				parseLink = originUrl + '&auth=1&authShop=1&channel=6'
				fetch = {
					type: 2,
					query: 'type=3&authMsg=1&link=' + this.toCode(parseLink),
					path: 'subpages/H5/h5Page',
				}
			} else if (type === 4) {
				// 小程序地址（公众号）
				parseLink = originUrl + '&auth=1&authShop=1&channel=4'
				fetch = {
					type: 2, // 小程序地址处理
					query: 'type=3&authMsg=1&link=' + this.toCode(parseLink),
					path: 'subpages/H5/h5Page',
				}
				this.updateData(4)
			} else if (type === 5) {
				// 短链拉起小程序（社群）
				parseLink = originUrl + '&auth=1&authShop=1&channel=5'
				fetch = {
					type: 2, // 小程序地址处理
					query: 'type=3&authMsg=1&link=' + this.toCode(parseLink),
					path: 'subpages/H5/h5Page',
				}
				this.updateData(5)
			}

			if (fetch) {
				this.translateLink(fetch)
			} else {
				this.funDataInfo.publishImagePath = []

				this.parseLink = parseLink
				this.$message.success('已生成')
			}
		},
		translateLink(fetch) {
			if (this.infoLoading) return
			this.infoLoading = true
			transformMsgLink(fetch)
				.then((res) => {
					if (res && res.data && res.data.resultCode == 0) {
						this.parseLink = res.data.resultData
						this.$message.success('已生成')
					}
				})
				.finally(() => {
					this.infoLoading = false
				})
		},
	},
}
</script>

<style lang="scss">
.publish-dialog {
	.el-dialog__body {
		max-height: 70vh;
		overflow-y: auto;
	}
}
</style>
<style lang="scss" scoped>
.code_image {
	width: 200px;
}
.code_image.small {
	width: 100px;
	height: 100px;
}
.code_right {
	margin-bottom: 10px;
	.btn {
		margin-bottom: 10px;
	}
}
.qrcode-body {
	position: relative;
	opacity: 0;
	width: 0;
	height: 0;
	z-index: -1;
	overflow: hidden;
}
</style>
