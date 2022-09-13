<template>
	<div class="shopMonthlyStatementList-page">
		<!-- 基于element的搜索表格组合 -->
		<FormTable />
	</div>
</template>
<script>
import FormTable from './components/FormTable'
export default {
	name: 'shopMonthlyStatementList',
	components: {
		FormTable,
	},
}
</script>
