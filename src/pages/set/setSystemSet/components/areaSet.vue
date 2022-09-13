<template>
	<div v-loading="showLoading" class="area-box">
		<el-tree
			:data="areaTree"
			:props="props"
			ref="areaTree"
			node-key="areaId"
			:expand-on-click-node="false"
		>
			<div class="custom-tree-node" slot-scope="{ node, data }">
				<div>
					<el-input
						class="input-item"
						v-if="data.edit"
						v-model="data.areaName"
						:placeholder="
							data.level == 2
								? '请输入省份'
								: data.level == 3
								? '请输入城市'
								: '请输入区域'
						"
					></el-input>
					<span class="span-item" v-else>{{ data.areaName }}</span>
					<el-input
						class="input-item"
						v-if="data.edit"
						v-model="data.areaCode"
						placeholder="请输入地区编码"
					></el-input>
					<span class="span-item" v-else>{{ data.areaCode }}</span>
				</div>

				<div>
					<template v-if="!data.edit">
						<el-button
							type="text"
							v-if="data.level == 1"
							@click="() => addRow(data)"
						>
							新增省份
						</el-button>
						<el-button
							type="text"
							v-if="data.level == 2"
							@click="() => addRow(data)"
						>
							新增城市
						</el-button>
						<el-button
							type="text"
							v-if="data.level == 3"
							@click="() => addRow(data)"
						>
							新增区域
						</el-button>
						<el-button @click="editItem(data, true)" type="text"
							>修改</el-button
						>
						<el-button @click="_deleteAreaByAreaId(node, data)" type="text"
							>删除</el-button
						>
					</template>
					<el-button v-if="data.edit" @click="saveArea(node, data)" type="text"
						>保存</el-button
					>
					<el-button
						@click="removeItem(node, data)"
						v-if="data.edit"
						type="text"
						>取消</el-button
					>
				</div>
			</div>
		</el-tree>
	</div>
</template>

<script>
import {
	getAreaList,
	updateAreaByAreaId,
	deleteAreaByAreaId,
	addArea,
} from '@/api/area'
export default {
	data() {
		return {
			props: {
				children: 'childAreaList',
				// isLeaf: 'leaf',
			},
			areaList: [],
			areaTree: [],
			isShow: false,
			showLoading: false,
		}
	},

	methods: {
		saveArea: async function (node, data) {
			console.log(node)
			if (
				!data.areaName.replace(/\s+/g, '') ||
				!data.areaCode.replace(/\s+/g, '')
			) {
				this.$message.warning(`不能为空`)
				return
			}
			if (data.isNew) {
				// 新增
				let {
					data: { resultCode, resultMsg, resultData },
				} = await addArea({
					areaName: data.areaName.replace(/\s+/g, ''),
					areaCode: data.areaCode.replace(/\s+/g, ''),
					parentId: data.parentId,
				})
				if (resultCode == 0) {
					this.$message.success(resultMsg)
					const parent = node.parent
					const children = parent.data.childAreaList || parent.data
					const index = children.findIndex((d) => d.areaId === data.areaId)
					this.$set(children, index, resultData.area)
				}
			} else {
				// 编辑
				let {
					data: { resultCode, resultMsg },
				} = await updateAreaByAreaId({
					areaName: data.areaName.replace(/\s+/g, ''),
					areaCode: data.areaCode.replace(/\s+/g, ''),
					areaId: data.areaId,
				})
				if (resultCode == 0) {
					this.$message.success(resultMsg)
					this.$set(data, 'edit', false)
				}
			}
		},
		addRow(data) {
			let placeholder =
				data.level == 1
					? '请输入省份'
					: data.level == 2
					? '请输入城市'
					: '请输入区域'
			const newChild = {
				areaId: data.areaId + '22',
				areaName: '',
				areaCode: '',
				level: data.level + 1,
				edit: true,
				isNew: true,
				parentId: data.areaId,
				placeholder: placeholder,
				childAreaList: [],
			}
			if (!data.childAreaList) {
				this.$set(data, 'childAreaList', [])
			}
			data.childAreaList.push(newChild)
			this.$refs.areaTree.store.nodesMap[data.areaId].expanded = true
		},
		_deleteAreaByAreaId(node, data) {
			this.$confirm('是否确定要删除该区域', '提示', {
				type: 'warning',
				callback: async (action) => {
					if (action === 'confirm') {
						let {
							data: { resultCode, resultMsg },
						} = await deleteAreaByAreaId({
							areaId: data.areaId,
						})
						if (resultCode == 0) {
							this.$message.success(resultMsg)
							const parent = node.parent
							const children = parent.data.childAreaList || parent.data
							const index = children.findIndex((d) => d.areaId === data.areaId)
							children.splice(index, 1)
						}
					}
				},
			})
		},
		removeItem(node, data) {
			if (data.isNew) {
				const parent = node.parent
				const children = parent.data.childAreaList || parent.data
				const index = children.findIndex((d) => d.areaId === data.areaId)
				children.splice(index, 1)
			} else {
				this.$set(data, 'edit', false)
			}
		},
		editItem(row, flag) {
			this.$set(row, 'edit', flag)
		},
		init: async function () {
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await getAreaList({
				parentId: 0,
			})
			this.showLoading = false
			if (resultCode == 0) {
				this.isShow = true
				this.areaTree = resultData.areaTree
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
