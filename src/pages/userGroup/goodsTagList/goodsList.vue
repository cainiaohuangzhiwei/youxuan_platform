<template>
	<div class="historyLeadRecord-page">
		<!-- 基于element的搜索表格组合 -->
		<FormTable />
	</div>
</template>
<script>
import FormTable from './components/GoodsListFormTable'
export default {
	name: 'goodsTagGoodsList',
	components: {
		FormTable,
	},
}
</script>
