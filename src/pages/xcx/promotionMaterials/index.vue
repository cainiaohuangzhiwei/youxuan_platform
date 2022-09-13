<template>
	<basicContainer>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="每日放心购" name="buyEverydayTab">
				<span slot="label">每日放心购</span>
				<!-- <issue-tab ref="issueTab"></issue-tab> -->
				<buy-everyday-tab ref="buyEverydayTab"></buy-everyday-tab>
			</el-tab-pane>
			<el-tab-pane label="钜划算" name="greatMoneyTab">
				<span slot="label">钜划算</span>
				<great-money-tab ref="greatMoneyTab"></great-money-tab
			></el-tab-pane>
			<el-tab-pane label="S级促销" name="levelPromotionTab">
				<span slot="label">S级促销</span>
				<level-promotion-tab ref="levelPromotionTab"></level-promotion-tab
			></el-tab-pane>
		</el-tabs>
	</basicContainer>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import buyEverydayTab from './components/buyEverydayTab'
import greatMoneyTab from './components/greatMoneyTab'
import levelPromotionTab from './components/levelPromotionTab'
// import issueTab from './components/issueTab'
// import issueTypeTab from './components/issueTypeTab'
export default {
	components: {
		BasicContainer,
		buyEverydayTab,
		greatMoneyTab,
		levelPromotionTab,
		// issueTab,
		// issueTypeTab,
	},
	data() {
		return {
			activeName: 'buyEverydayTab',
		}
	},
	created() {
		this.$nextTick(() => {
			this.$refs.buyEverydayTab.init(true)
		})
	},
	methods: {
		handleClick({ name }) {
			if (this.$refs[name] && !this.$refs[name].isShow) {
				this.$refs[name].init(true)
			}
		},
	},
}
</script>
