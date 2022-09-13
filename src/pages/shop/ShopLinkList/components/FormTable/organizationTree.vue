<template>
	<yx-dialog title="店铺队员" :visible.sync="visible">
		<el-tree
			:data="organizationData"
			:props="defaultProps"
			@node-expand="handleNodeClick"
		>
			<span class="custom-tree-node" slot-scope="{ node, data }">
				<span>{{ node.label }}</span>
				<span v-if="node.label">
					<el-button
						v-auot="'getOrganizationDetails'"
						type="text"
						size="mini"
						@click="() => goShopDetail(data)"
					>
						店铺详情
					</el-button>
				</span>
			</span>
		</el-tree>
	</yx-dialog>
</template>

<script>
import { getOrganizationTree } from '@/api/yhtPlusCmsOrganization'
import YxDialog from '@/components/Dialog/index.vue'
export default {
	name: 'organizationTree',
	components: {
		YxDialog,
	},
	props: {
		// 弹框开关
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		// 店铺信息
		organizationInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			visible: false,
			organizationData: [],
			defaultProps: {
				children: 'children',
				label: 'label',
			},
		}
	},
	created() {
		this.visible = this.dialogVisible
	},
	watch: {
		visible(newVlaue) {
			this.$emit('update:dialogVisible', newVlaue)
			if (this.visible) {
				this._getOrganizationTree(this.organizationInfo)
			}
		},
		dialogVisible(newVlaue) {
			if (this.isShow !== newVlaue) {
				this.visible = newVlaue
			}
		},
	},

	methods: {
		goShopDetail(row) {
			this.$router.push({
				path: `shop/shopDetail/${row.organizationId}`,
			})
		},
		handleNodeClick(row) {
			if (row.childrenCount && !row.children[0].organizationId) {
				this._getOrganizationTree(row, true)
			}
		},
		async _getOrganizationTree(data, flag) {
			let paramJson = {
				fatherId: data.organizationId,
				startIndex: 0,
				length: data.childrenCount,
			}
			if (flag) {
				paramJson.parentId = data.organizationId
			} else {
				this.organizationData = []
			}
			let {
				data: { resultData },
			} = await getOrganizationTree(paramJson)
			let list = resultData.organizationList.map((item, index) => {
				let str = `${item.organizationId}，${item.organizationName}，${item.phone}，${item.childrenCount}`
				let infos = {
					label: str,
					organizationId: item.organizationId,
					childrenCount: item.childrenCount,
					index: index,
					children: [],
				}
				if (item.childrenCount) {
					infos.children.push({
						label: '',
					})
				}
				return infos
			})
			if (flag) {
				data.children = list
			} else {
				this.organizationData = list
			}
		},
	},
}
</script>
