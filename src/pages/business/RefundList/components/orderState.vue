<template>
	<div class="orderState">
		<span v-if="orderState > 0 && orderState < 8" style="color: #e6a23c"
			>待审核</span
		>
		<div v-else-if="orderState == 8">
			<span class="circle_success"></span>
			<span style="color: #09da52">审核通过</span>
		</div>
		<span v-else-if="orderState == 9" style="color: #f56c6c">审核不通过</span>
		<span v-else style="color: #909399">其他</span>
	</div>
</template>

<script>
export default {
	props: ['orderState'],
}
</script>

<style lang="scss" scoped>
.circle_success {
	display: inline-block;
	width: 8px;
	height: 8px;
	background: #09da52;
	border-radius: 50%;
	margin-right: 5px;
}
</style>
