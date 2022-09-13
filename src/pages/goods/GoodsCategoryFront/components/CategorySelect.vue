<template>
	<div>
		<el-dialog
			width="650px"
			title="关联商品类目"
			append-to-body
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			@close="resetForm"
			@open="init"
		>
			<el-input
				placeholder="输入关键字进行过滤"
				v-model="filterText"
				style="margin-bottom: 12px"
			>
			</el-input>
			<div class="selected-name">
				已选中：<span
					v-for="item in selected"
					:key="item.goodsCategoryId"
					class="item-name"
					>{{ item.goodsCategoryName }}</span
				>
			</div>
			<el-tree
				v-loading="loading"
				ref="tree"
				node-key="goodsCategoryId"
				:highlight-current="true"
				:expand-on-click-node="false"
				:data="treeData"
				:props="{
					children: 'goodsCategoryChildList',
					label: 'goodsCategoryName',
				}"
				show-checkbox
				:current-node-key="0"
				:filter-node-method="filterNode"
				@check="handleNodeClick"
			></el-tree>
			<div slot="footer">
				<el-button type="primary" @click="submitForm">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			default: '',
		},
		goodsCategorySelected: {
			type: Array,
			default: () => [],
		},
	},

	components: {},

	data() {
		return {
			filterText: '',
			treeData: [],
			selected: [],
			loading: false,
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
	watch: {
		filterText(val) {
			this.$refs.tree.filter(val)
		},
	},
	methods: {
		init() {
			this.treeData = this.$store.state.user.treeData
			if (this.goodsCategorySelected && this.goodsCategorySelected.length > 0) {
				this.$nextTick(() => {
					this.$refs.tree.setCheckedNodes(this.goodsCategorySelected)
				})
				this.selected = this.goodsCategorySelected
			}
		},
		// 关闭弹窗
		resetForm() {
			this.localVisible = false
			this.$refs.tree.setCheckedKeys([])
			this.selected = []
		},
		filterNode(value, data, node) {
			// if (!value) return true
			// return data.goodsCategoryName.indexOf(value) !== -1
			if (!value) return true
			let parentNode = node.parent,
				labels = [node.label],
				level = 1
			while (level < node.level) {
				labels = [...labels, parentNode.label]
				parentNode = parentNode.parent
				level++
			}
			return labels.some((label) => label.indexOf(value) !== -1)
		},
		handleNodeClick: function (data, node) {
			let arr = []
			node &&
				node.checkedNodes &&
				node.checkedNodes.length > 0 &&
				node.checkedNodes.forEach((item) => {
					if (item.goodsCategoryLevel == 3) {
						arr.push(item)
					}
				})
			this.selected = arr
		},
		// 保存
		submitForm() {
			this.$emit('fatherMethodInit', this.selected)
			this.localVisible = false
		},
	},
}
</script>
<style lang="scss" scoped>
.selected-name {
	height: 100px;
	overflow: scroll;
	.item-name {
		padding: 0 10px 10px 0;
	}
}
</style>
