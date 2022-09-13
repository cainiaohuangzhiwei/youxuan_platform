<template>
	<div class="deliverState">
		<div v-if="deliverState == 1">
			<i class="el-icon-box" style="color: #f42121; margin-right: 5px"></i>
			<span style="color: #f42121">待发货(未拣货)</span>
		</div>
		<div v-else-if="deliverState == 2">
			<span class="circle" style="background: #da6009"></span>
			<span style="color: #da6009">待发货(已拣货)</span>
		</div>
		<div v-else-if="deliverState == 3">
			<span class="circle" style="background: #e6a23c"></span>
			<span style="color: #e6a23c">已发货(部分商品发货)</span>
		</div>
		<div v-else-if="deliverState == 4">
			<span class="circle" style="background: #72da09"></span>
			<span style="color: #72da09">已发货(全部商品发货)</span>
		</div>
		<div v-else-if="deliverState == 5">
			<span class="circle" style="background: #09da52"></span>
			<span style="color: #09da52">已确认收货</span>
		</div>
		<span v-else style="color: #909399">其他</span>
	</div>
</template>

<script>
export default {
	props: ['deliverState'],
}
</script>

<style lang="scss" scoped>
.circle {
	display: inline-block;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	margin-right: 5px;
}
.circle_success {
	display: inline-block;
	width: 8px;
	height: 8px;
	background: #09da52;
	border-radius: 50%;
	margin-right: 5px;
}
</style>
