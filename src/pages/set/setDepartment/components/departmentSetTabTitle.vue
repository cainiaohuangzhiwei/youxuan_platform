<template>
	<div v-loading="showLoading" class="area-box">
		<el-button type="text" @click="newDepartment" icon="el-icon-plus"
			>新增部门</el-button
		>
		<el-tree
			:data="departmentTree"
			:props="props"
			ref="departmentTree"
			default-expand-all
			node-key="departmentId"
			:expand-on-click-node="false"
		>
			<div class="custom-tree-node" slot-scope="{ node, data }">
				<div>
					<el-input
						class="input-item"
						v-if="data.edit"
						v-model="data.departmentName"
						:placeholder="data.level == 1 ? '请输入部门' : '请输入子部门'"
					></el-input>
					<span class="span-item" v-else>{{ data.departmentName }}</span>
				</div>
				<div>
					<template v-if="!data.edit">
						<span style="margin-right: 10px" v-if="data.bindOrg == 1"
							>已绑定店主</span
						>
						<el-button @click="_getDepartmentWechatCode(data)" type="text"
							>微信号</el-button
						>
						<el-button @click="_getNewOneImage(data)" type="text"
							>设置图片</el-button
						>
						<el-button @click="addRow(data)" type="text">新增子部门</el-button>
						<el-button @click="editItem(data)" type="text">修改</el-button>
						<el-button
							@click="_deleteDepartmentByDepartmentId(node, data)"
							type="text"
							>删除</el-button
						>
					</template>
					<template v-else>
						<el-button @click="saveArea(node, data)" type="text"
							>保存</el-button
						>
						<el-button @click="removeItem(node, data)" type="text"
							>取消</el-button
						>
					</template>
				</div>
			</div>
		</el-tree>
		<Dialog
			:title="dialogTitle126"
			:visible.sync="dialogVisible126"
			:width="dialogWidth126"
			:bottomBtn="dialogBottomBtn126"
		>
			<yx-form
				ref="dialog126"
				labelWidth="120px"
				:data="formData126"
				:items="formCfg126"
				:formAction="formAction126"
				:rules="formRules126"
			>
			</yx-form>
		</Dialog>
		<Dialog
			:title="dialogTitle127"
			:visible.sync="dialogVisible127"
			:width="dialogWidth127"
			:bottomBtn="dialogBottomBtn127"
		>
			<yx-form
				ref="dialog127"
				labelWidth="120px"
				:data="formData127"
				:items="formCfg127"
				:formAction="formAction127"
			>
			</yx-form>
		</Dialog>
	</div>
</template>

<script>
import {
	getDepartmentList,
	getDepartmentWechatCode,
	updateDepartmentWechatCode,
	updateDepartmentByDepartmentId,
	deleteDepartmentByDepartmentId,
	addDepartment,
} from '@/api/department'
import { getNewOneImage } from '@/api/image'
import { getBigImg } from '@/utils/imageTool'
import { uploadImageList } from '@/api/image'
import Dialog from '@/components/Dialog'
import YxForm from '@wg-vue-materials/yx-form'
export default {
	components: {
		YxForm,
		Dialog,
	},
	data() {
		return {
			formData127: {
				departmenList: [],
			},
			formCfg127: [
				{
					type: 'uploadImage',
					title: '',
					dataIndex: 'departmenList',
					uploadAttributes: {
						limit: 1,
						// isEdit: true,
						imageName: 'bigUrl',
						httpRequest: (file) => this.uploadImageHttpRequest(file),
					},
				},
			],
			formAction127: [],
			dialogTitle127: '设置图片',
			dialogWidth127: '400px',
			dialogVisible127: false,
			dialogBottomBtn127: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this._updateDepartmentByDepartmentId()
					},
				},
			],
			formData126: {
				wechatCode: '',
			},
			formRules126: {
				wechatCode: [
					{ required: true, message: '请输入微信号', trigger: 'blur' },
				],
			},
			formCfg126: [
				{
					type: 'input',
					title: '微信号',
					dataIndex: 'wechatCode',
				},
			],
			formAction126: [],
			dialogTitle126: '微信号',
			dialogWidth126: '400px',
			dialogVisible126: false,
			dialogBottomBtn126: [
				{
					title: '确 定',
					type: 'primary',
					click: () => {
						this.$refs.dialog126.$refs.YxForm.validate((valid) => {
							if (valid) {
								// 规则校验通过
								this._updateDepartmentWechatCode()
								// this.dialogVisible105 = false
							}
						})
					},
				},
			],
			props: {
				children: 'childDepartmentList',
				// isLeaf: 'leaf',
			},
			showLoading: false,
			departmentTree: [],
			isShow: false,
		}
	},

	methods: {
		newDepartment() {
			this.departmentTree.push({
				departmentId:
					this.departmentTree[this.departmentTree.length - 1].departmentId +
					56465,
				departmentName: '',
				level: 1,
				edit: true,
				isNew: true,
				parentId: 0,
				childDepartmentList: [],
			})
		},
		// 保存部门
		saveArea: async function (node, data) {
			if (!data.departmentName.replace(/\s+/g, '')) {
				this.$message.warning(`不能为空`)
				return
			}
			if (data.isNew) {
				// 新增
				let {
					data: { resultCode, resultMsg, resultData },
				} = await addDepartment({
					departmentName: data.departmentName.replace(/\s+/g, ''),
					parentId: data.parentId,
				})
				if (resultCode == 0) {
					this.$message.success(resultMsg)
					const parent = node.parent
					const children = parent.data.childDepartmentList || parent.data
					const index = children.findIndex(
						(d) => d.departmentId === data.departmentId
					)
					this.$set(children, index, resultData.department)
				}
			} else {
				// 编辑
				let {
					data: { resultCode, resultMsg },
				} = await updateDepartmentByDepartmentId({
					departmentName: data.departmentName.replace(/\s+/g, ''),
					departmentId: data.departmentId,
				})
				if (resultCode == 0) {
					this.$message.success(resultMsg)
					this.$set(data, 'edit', false)
				}
			}
		},
		// 删除部门
		_deleteDepartmentByDepartmentId(node, data) {
			this.$confirm('是否确定要删除该部门', '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						let {
							data: { resultCode, resultMsg },
						} = await deleteDepartmentByDepartmentId({
							departmentId: data.departmentId,
						})
						if (resultCode == 0) {
							this.$message.success(resultMsg)
							const parent = node.parent
							const children = parent.data.childDepartmentList || parent.data
							const index = children.findIndex(
								(d) => d.departmentId === data.departmentId
							)
							children.splice(index, 1)
						}
					}
				},
			})
		},
		// 设置图片
		_updateDepartmentByDepartmentId: async function () {
			if (!this.formData127.departmenList.length && !this.formData127.imageId) {
				this.dialogVisible127 = false
				return
			}
			let paramJson = {
				departmentId: this.formData127.departmentId,
				image: this.formData127.departmenList[0],
			}
			if (this.formData127.departmenList.length) {
				paramJson.image = this.formData127.departmenList[0]
				delete paramJson.image.bigUrl
			} else if (this.formData127.imageId) {
				paramJson.imageId = this.formData127.imageId
			}
			let {
				data: { resultCode, resultMsg },
			} = await updateDepartmentByDepartmentId(paramJson)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible127 = false
			}
		},
		async uploadImageHttpRequest(params) {
			//上传banner
			let formData = new FormData()
			// formData.append('formId', '#portraitImageFrom')
			formData.append('data', JSON.stringify({ imageType: 52 }))
			formData.append('image', params.file)
			let {
				data: { resultCode, resultData },
			} = await uploadImageList(formData)
			if (resultCode == 0) {
				resultData.imageList[0].bigUrl = getBigImg(
					resultData.imageList[0].imageUrl
				)
				this.formData127.departmenList = resultData.imageList
			}
			this.$forceUpdate()
		},
		// 设置图片
		_getNewOneImage: async function ({ departmentId }) {
			let {
				data: { resultCode, resultData },
			} = await getNewOneImage({
				itemId: departmentId,
				type: 52,
			})
			if (resultCode == 0) {
				this.formData127 = {
					departmentId,
					departmenList: [],
					imageId: null,
				}
				if (resultData.image) {
					resultData.image.bigUrl = getBigImg(resultData.image.imageUrl)
					this.formData127.departmenList = [
						JSON.parse(JSON.stringify(resultData.image)),
					]
					this.formData127.imageId = resultData.image.imageId
				}
				this.$forceUpdate()
				this.dialogVisible127 = true
			}
		},
		// 修改部门微信号
		_updateDepartmentWechatCode: async function () {
			let {
				data: { resultCode, resultMsg },
			} = await updateDepartmentWechatCode(this.formData126)
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.dialogVisible126 = false
			}
		},
		// 获取微信号
		_getDepartmentWechatCode: async function ({ departmentId }) {
			let {
				data: { resultCode, resultData },
			} = await getDepartmentWechatCode({ departmentId })
			if (resultCode == 0) {
				this.formData126 = {
					wechatCode: resultData.wechatCode,
					departmentId,
				}
				this.$nextTick(() => {
					this.$refs.dialog126.$refs.YxForm.clearValidate()
				})
				this.dialogVisible126 = true
			}
		},
		// 新增部门
		addRow(data) {
			const newChild = {
				departmentId: data.departmentId + '22',
				departmentName: '',
				level: data.level + 1,
				edit: true,
				isNew: true,
				parentId: data.departmentId,
				childDepartmentList: [],
			}
			if (!data.childDepartmentList) {
				this.$set(data, 'childDepartmentList', [])
			}
			data.childDepartmentList.push(newChild)
			if (this.$refs.departmentTree.store.nodesMap[data.departmentId]) {
				this.$refs.departmentTree.store.nodesMap[
					data.departmentId
				].expanded = true
			}
		},
		// 取消保存
		removeItem(node, data) {
			if (data.isNew) {
				const parent = node.parent
				const children = parent.data.childDepartmentList || parent.data
				const index = children.findIndex(
					(d) => d.departmentId === data.departmentId
				)
				children.splice(index, 1)
			} else {
				this.$set(data, 'edit', false)
			}
		},
		// 编辑
		editItem(row) {
			this.$set(row, 'edit', true)
		},
		async init() {
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await getDepartmentList()
			this.showLoading = false
			if (resultCode == 0) {
				this.isShow = true
				this.departmentTree = resultData.departmentTree
			}
		},
	},
}
</script>

<style>
.area-box .el-tree-node__content {
	height: 40px !important;
}
</style>

<style scoped>
.area-box .input-item {
	display: inline-block;
	width: 150px;
	margin-right: 20px;
}
.area-box .span-item {
	margin-left: 20px;
}
.area-box .custom-tree-node {
	display: flex;
	justify-content: space-between;
	width: 100%;
	padding: 10px 0;
	height: 60px;
	align-items: center;
}
</style>
