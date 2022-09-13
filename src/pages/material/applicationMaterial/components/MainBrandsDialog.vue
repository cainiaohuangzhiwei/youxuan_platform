<template>
	<yx-dialog
		:bottomBtn="bottomBtn"
		:visible.sync="localVisible"
		:before-close="resetForm"
		title="选择活动素材"
	>
		<yx-form
			:inline="true"
			:data="dialogData"
			:items="dialogCfg"
			:formAction="dialogAction"
		></yx-form>
		<el-row style="text-align: right; margin-bottom: 10px"
			>已选择{{ selectGroupList.length }}个素材</el-row
		>
		<el-row>
			<yx-table
				v-loading="showLoading"
				:columns="tialogColumns"
				:pagination="tialogPage"
				:data="tialogData"
			>
				<template slot="brandParentName" slot-scope="scope">
					<div class="slot">
						<div>
							<img
								class="goods_img"
								:src="
									getSmallImg(scope.row.brandImgUrl || scope.row.brandLogoUrl)
								"
								alt=""
							/>
						</div>
						<p>{{ scope.row.brandParentName }}</p>
					</div>
				</template>
				<template slot="brandMaterial" slot-scope="scope">
					<div>
						<div style="text-align: left">
							<div class="goodsName">{{ scope.row.materialText }}</div>
							<div>
								<div
									v-for="(ite, i) in scope.row
										.activityMaterialContentRelationBOList"
									:key="i"
									class="image-box"
								>
									<el-image
										v-if="ite.materialType == 'image'"
										class="c_image"
										fit="cover"
										:src="ite.materialContent"
										:preview-src-list="scope.row.previewImgList"
									>
										<div slot="error" class="el-image__error">
											<i class="el-icon-picture-outline"></i>
										</div>
									</el-image>
									<video
										v-else-if="ite.materialType == 'video'"
										controls
										:src="ite.materialContent"
										class="c_image"
									></video>
								</div>
							</div>
						</div>
					</div>
				</template>
			</yx-table>
		</el-row>
	</yx-dialog>
</template>

<script>
import YxDialog from '@/components/Dialog/index.vue'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import { getSmallImg } from '@/utils/imageTool'
import { queryActivityListToBatch } from '@/api/newMaterial'
export default {
	components: {
		YxDialog,
		YxForm,
		YxTable,
	},
	props: {
		// 弹框开关
		visible: {
			type: Boolean,
			define: false,
		},
		mainBrandsRow: {
			type: Array,
			default: () => [],
		},
		//是否新增
		isAdd: {
			type: Boolean,
			define: false,
		},
	},
	data() {
		return {
			getSmallImg: getSmallImg,
			selectGroupList: [],
			showLoading: false,
			currentTime: '',
			sourceId: '',
			isFirstQuery: true,
			bottomBtn: [
				{
					title: '确定',
					click: () => {
						this.saveBrand()
					},
				},
				{
					title: '取消',
					click: () => {
						this.resetForm()
					},
				},
			],
			dialogData: {
				keyWord: [],
			},
			dialogCfg: [
				{
					title: '',
					type: 'textarea',
					dataIndex: 'keyWord',
					autosize: { minRows: 2, maxRows: 4 },
					placeholder: '请输入场次名称，请用逗号或者换行输入',
				},
			],
			dialogAction: [
				{
					title: '查询',
					type: 'primary',
					click: () => {
						this._brandParentList(true)
					},
				},
			],
			tialogColumns: [
				{
					type: 'string',
					dataIndex: 'activityMaterialName',
					title: '场次名称',
					width: 150,
				},
				// {
				// 	type: 'string',
				// 	dataIndex: 'goodsName',
				// 	title: '主推商品',
				// 	width: 200,
				// },
				{
					type: 'string',
					dataIndex: 'goodsGroupName',
					title: '主推档期',
					width: 200,
				},
				{
					type: 'custom',
					dataIndex: 'brandMaterial',
					title: '素材',
				},
				{
					type: 'action',
					title: '操作',
					width: '80',
					actions: [
						{
							title: '添加',
							click: (row) => {
								this.editUserList(row)
							},
							customRender: (action, row) => {
								action.title = this.findIndex(row) ? '添加' : '移除'
								return action
							},
						},
					],
				},
			],
			tialogPage: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this._brandParentList()
				},
			},
			tialogData: [],
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
	mounted() {},
	watch: {
		localVisible(val) {
			if (val) {
				this.selectGroupList = JSON.parse(JSON.stringify(this.mainBrandsRow))

				// 请求素材数据
				if (!this.isAdd && this.selectGroupList[0].activityMaterialContentId) {
					this.sourceId = this.selectGroupList[0].activityMaterialContentId
					this.isFirstQuery = true
					this._brandParentList(true)
				}
				this.dialogData.keyWord = ''
			}
		},
	},
	methods: {
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
		},
		saveBrand() {
			this.$emit('saveBrand', this.selectGroupList)
			this.localVisible = false
		},
		findIndex(row) {
			// 判断是否已经添加用户
			let ids = this.selectGroupList.map((item) => {
				return item.activityMaterialContentId
			})
			return ids.indexOf(row.activityMaterialContentId) == -1
		},
		editUserList(row) {
			// 添加/移除
			if (this.isAdd) {
				//添加素材时可多选
				let ids = this.selectGroupList.map((item) => {
					return item.activityMaterialContentId
				})
				if (ids.indexOf(row.activityMaterialContentId) == -1) {
					this.selectGroupList.push(row)
				} else {
					this.selectGroupList.splice(
						ids.indexOf(row.activityMaterialContentId),
						1
					)
				}
			} else {
				// 编辑素材时单选
				this.selectGroupList = [row]
			}
		},
		findUserParams(flag) {
			// 搜索条件
			const paramJson = {
				keyWord: this.dialogData.keyWord,
				pageNum: 1,
				pageSize: 10,
			}

			if (this.sourceId && this.isFirstQuery) {
				paramJson.sourceId = this.sourceId
				this.isFirstQuery = false
			}

			if (paramJson.keyWord.length > 0) {
				let keywordSplit
				keywordSplit = paramJson.keyWord.replaceAll('\n', ',')
				paramJson.keyWord = keywordSplit
			} else {
				paramJson.keyWord = ''
			}
			// 每页的加载数据长度
			paramJson.pageSize = this.tialogPage.length
			// 当前页的条数开始
			if (flag) {
				this.tialogPage.currentPage = 1
			}
			paramJson.pageNum = this.tialogPage.currentPage
			return paramJson
		},
		async _brandParentList(flag) {
			// 用户列表
			this.showLoading = true
			let paramJson = this.findUserParams(flag)
			let {
				data: { resultCode, resultData, total },
			} = await queryActivityListToBatch(paramJson)
			this.showLoading = false
			console.log(resultData, 'aafdfasdfdsfdf====')
			if (resultCode == 0) {
				this.tialogData = resultData?.map((item) => {
					let materialTextItem =
						item.activityMaterialContentRelationBOList.find(
							(x) => x.materialType == 'text'
						)
					item.materialText = materialTextItem?.materialContent || ''
					item.previewImgList = []
					item.activityMaterialContentRelationBOList.forEach((materialItem) => {
						if (materialItem.materialType == 'image') {
							item.previewImgList.push(materialItem.materialContent)
						}
					})
					return item
				})
				this.tialogPage.count = total
			} else {
				this.tialogPage.count = 0
				this.tialogData = []
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.slot {
	display: flex;
	align-items: center;
	justify-content: center;
}
.goods_img {
	width: 60px;
	height: 60px;
	margin-right: 10px;
	line-height: 155px;
}
.image-box {
	display: inline-block;
}
.c_image {
	width: 80px;
	height: 80px;
	margin-right: 10px;
	margin-top: 10px;
	border-radius: 5px;
	box-shadow: #e6e6e6 0px 0px 7px 1px;
}
</style>
