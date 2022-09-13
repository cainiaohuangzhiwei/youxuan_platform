<template>
	<basic-container>
		<div>
			<el-tabs v-model="activeName" type="card">
				<el-tab-pane label="默认渠道" name="defaultChannel">
					<default-channel></default-channel>
				</el-tab-pane>
				<el-tab-pane label="市场渠道" name="marketChannel">
					<market-channel></market-channel>
				</el-tab-pane>
			</el-tabs>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import DefaultChannel from './DefaultChannel'
import MarketChannel from './MarketChannel'

export default {
	components: {
		BasicContainer,
		DefaultChannel,
		MarketChannel,
	},
	name: 'FormTable',

	data() {
		return {
			activeName: 'defaultChannel',
		}
	},

	methods: {},
}
</script>
