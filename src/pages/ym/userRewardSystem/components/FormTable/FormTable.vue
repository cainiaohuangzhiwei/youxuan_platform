<template>
	<div>
		<h3>活动奖励工具</h3>
		<el-row>
			<el-button type="success" plain size="medium" @click="toPage('order')"
				>订单奖励活动</el-button
			>
			<el-button type="warning" plain size="medium" @click="toPage('live')"
				>直播奖励</el-button
			>
			<el-button type="primary" plain size="medium" @click="toPage('platform')"
				>自定义奖励</el-button
			>
		</el-row>
	</div>
</template>
<script>
export default {
	name: 'userRewardSystem',
	data() {
		return {}
	},
	methods: {
		toPage(type) {
			if (type === 'platform') {
				this.$router.push({ name: 'platformReward' })
			} else if (type === 'live') {
				this.$router.push({ name: 'liveReward' })
			} else if (type === 'order') {
				this.$router.push({ name: 'orderReward' })
			}
		},
	},
}
</script>
<style lang="scss"></style>
