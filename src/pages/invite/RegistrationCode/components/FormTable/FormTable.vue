<template>
	<basic-container>
		<el-tabs v-model="activeName" type="card">
			<el-tab-pane label="海报设置" name="posterTab">
				<el-button type="primary" @click="editRegistrationCode"
					>新增海报</el-button
				>
				<yx-table
					v-loading="showLoading"
					:columns="tableColumns"
					:pagination="page"
					:data="tableData"
				></yx-table>
				<editPosterDialog
					:dialogVisible.sync="posterPopup"
					:itemInfo.sync="editItem"
					@updateList="getPosterList(true)"
				></editPosterDialog>
			</el-tab-pane>
			<el-tab-pane label="基础设置" name="basicsTab">
				<el-row>
					<div>基础设置</div>
				</el-row>
				<el-row>
					<el-col :span="2">有效期:</el-col>
					<el-col class="dis_f_ac" :span="16">
						<el-input
							class="form_input"
							:value="validityTime"
							@input="(e) => (validityTime = isnumber(e))"
							type="number"
							placeholder="请输入内容"
						></el-input
						>天（生成注册码后的N*24小时）
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="2">邀请人数上限:</el-col>
					<el-col class="dis_f_ac" :span="16">
						<el-input
							class="form_input"
							v-model="invitePerson"
							type="number"
							placeholder="请输入内容"
						></el-input
						>人 （有效期内可邀请人数上限）
					</el-col>
				</el-row>
				<el-button type="primary" @click="addRegisterCode">保存</el-button>
			</el-tab-pane>
		</el-tabs>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import { getPoster, deletePoster } from '@/api/yhtPlusCmsRegisterCodePoster'
import { getRegisterCode, addRegisterCode } from '@/api/yhtPlusCmsRegisterCode'
import { getConstantValueByKey } from '@/utils/helper/common'
import { getBigImg } from '@/utils/imageTool'
import editPosterDialog from './editPosterDialog'
let that
export default {
	components: {
		BasicContainer,
		YxTable,
		editPosterDialog,
	},
	name: 'FormTable',

	data() {
		return {
			showLoading: true,
			editItem: {},
			uploadImgWidth: 640, //上传图片宽带
			uploadImgHeight: 1008, //上传图片宽度
			qrCodeWidth: 150, //二维码宽度
			qrCodeHeight: 150, //二维码高度
			popupTitle: '新增海报', //弹框标题
			posterPopup: false, //弹框开关
			activeName: 'posterTab',
			validityTime: '', //有效期
			invitePerson: '', //邀请人数上限
			orderStatus: [],
			tableData: [],
			tableColumns: [
				{
					type: 'image',
					dataIndex: 'imageUrl',
					class: 'poster_img',
					title: '海报',
				},
				{
					type: 'string',
					dataIndex: 'state',
					title: '状态',
					customRender: (
						row
						// column
					) => {
						return getConstantValueByKey(
							this.$store.state.app.constant.NEW_GUIDELINES_STATUS,
							row.state,
							'-',
							'state'
						)
					},
				},
				{
					type: 'action',
					title: '操作',
					width: '150',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.editRegistrationCode(row)
							},
						},
						{
							title: '删除',
							click: (row) => {
								this.deletePoster(row)
							},
						},
					],
				},
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getPosterList()
				},
			},
		}
	},
	beforeCreate() {
		that = this
	},
	created() {
		this.getPosterList(true)
		this.getRegisterCode()
	},

	methods: {
		isnumber(val) {
			val = val.replace(/[^0-9]/gi, '')
			// 此处还可以限制位数以及大小
			return val
		},
		deletePoster(data) {
			//删除海报
			this.$confirm('确定删除？', '提示', {
				type: 'warning',
				async callback(action) {
					if (action === 'confirm') {
						let {
							data: { resultMsg },
						} = await deletePoster(data)
						that.$message.success(resultMsg)
						that.getPosterList(true)
					}
				},
			})
		},
		editRegistrationCode(data) {
			//显示编辑弹框
			if (data && data.posterImgId) {
				this.editItem = data
			} else {
				this.editItem = {}
			}

			this.posterPopup = true
		},
		findSearchParams(flag) {
			//搜索条件
			let paramJson = {}
			paramJson.length = this.page.length
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			paramJson.startIndex = (this.page.currentPage - 1) * this.page.length
			return paramJson
		},
		async getPosterList(flag) {
			//获取海报
			this.showLoading = true
			let paramJson = this.findSearchParams(flag)
			let {
				data: { resultData },
			} = await getPoster(paramJson)
			this.showLoading = false
			if (resultData.posterAllList && resultData.posterAllList.length) {
				this.tableData = resultData.posterAllList.map((item) => {
					item.imageUrl = getBigImg(item.posterImg)
					return item
				})
				this.page.count = resultData.posterAllCount
			} else {
				this.page.count = 0
				this.tableData = []
			}
		},
		async getRegisterCode() {
			//获取基础设置
			let {
				data: {
					resultData: { registerCode },
				},
			} = await getRegisterCode()
			this.validityTime = registerCode[0].validityTime
			this.invitePerson = registerCode[0].invitePerson
		},
		async addRegisterCode() {
			//保存基础设置
			if (this.validityTime <= 0 || this.validityTime >= 99) {
				this.$message.warning({ message: '有效期必须大于0且小于99' })
				return
			}
			if (this.invitePerson <= 0 || this.invitePerson >= 999) {
				this.$message.warning({ message: '邀请人数上限必须大于0且小于999' })
				return
			}
			let {
				data: { resultMsg },
			} = await addRegisterCode({
				validityTime: this.validityTime,
				invitePerson: this.invitePerson,
			})
			this.$message.success(resultMsg)
		},
	},
}
</script>

<style lang="scss">
.poster_img {
	width: 106px;
	height: 167px;
}
.form_input {
	width: 150px;
	margin: 0 20px;
}
.dis_f_ac {
	display: flex;
	align-items: center;
}
.wg_upload {
	box-sizing: border-box;
	cursor: pointer;
	width: 120px;
	height: 120px;
	background: #ddd;
	float: left;
	text-align: center;
	line-height: 20px;
	border: 1px solid #ccc;
	border-radius: 4px;
	.upload_block {
		width: 120px;
		height: 120px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
.upload_tip {
	width: 120px;
	height: 120px;
	line-height: 120px;
}
.wg_image_box {
	overflow: hidden;
	position: relative;
	cursor: pointer;
	width: 120px;
	height: 120px;
	line-height: 116px;
	text-align: center;
	border: 1px solid #ccc;
	border-radius: 5px;
	box-shadow: #e6e6e6 0px 0px 7px 1px;
	.img100 {
		width: 100%;
		height: 100%;
	}
	.wg_image_item {
		width: 100%;
		height: 100%;
	}
	.wg_image_item_dlt {
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
</style>
