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
				<el-tab-pane label="其他渠道" name="otherSources">
					<other-sources></other-sources>
				</el-tab-pane>
				<el-tab-pane label="邀请渠道" name="inviteChannels">
					<invite-channels></invite-channels>
				</el-tab-pane>
			</el-tabs>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import DefaultChannel from './DefaultChannel'
import MarketChannel from './MarketChannel'
import OtherSources from './OtherSources'
import InviteChannels from './InviteChannels'

export default {
	components: {
		BasicContainer,
		DefaultChannel,
		MarketChannel,
		OtherSources,
		InviteChannels,
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
