<template>
	<basicContainer>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="新店主指引" name="shopOwnerTab">
				<span slot="label">新店主指引</span>
				<shopOwnerTab ref="shopOwnerTab"></shopOwnerTab>
			</el-tab-pane>
			<el-tab-pane label="指引素材" name="materialTab">
				<span slot="label">指引素材</span>
				<materialTab ref="materialTab"></materialTab>
			</el-tab-pane>
		</el-tabs>
	</basicContainer>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import shopOwnerTab from './components/shopOwnerTab'
import materialTab from './components/materialTab'
export default {
	components: {
		BasicContainer,
		shopOwnerTab,
		materialTab,
	},
	data() {
		return {
			activeName: 'shopOwnerTab',
			query: this.$route.query,
			sensitiveWordMap: {},
		}
	},
	created() {
		this.$nextTick(() => {
			if (!this.query.type) {
				this.$refs.shopOwnerTab.init(true)
			} else {
				this.activeName = this.query.type
				this.$refs[this.query.type].init(true)
			}
		})
	},
	methods: {
		handleClick({ name }) {
			this.$refs[name].init(true)
		},
	},
}
</script>
