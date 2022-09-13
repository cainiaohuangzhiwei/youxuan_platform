<template>
	<div class="express-bill-detail">
		<el-tabs v-model="activeName" type="card">
			<el-tab-pane label="揽件订单详情" name="detail">
				<Detail />
			</el-tab-pane>
			<el-tab-pane label="处理记录" name="timeLine">
				<TimeLine v-if="activeName == 'timeLine'" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import Detail from '../Detail'
import TimeLine from '../TimeLine'
export default {
	components: {
		Detail,
		TimeLine,
	},
	data() {
		return {
			activeName: 'detail',
		}
	},
}
</script>

<style lang="scss">
.express-bill-detail {
	.el-form--inline .el-form-item {
		margin-right: 30px;
	}
}
</style>
