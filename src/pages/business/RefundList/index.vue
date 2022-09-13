<template>
	<div class="RefundList-page">
		<!-- 基于element的搜索表格组合 -->
		<FormTable />
	</div>
</template>
<script>
import FormTable from './components/FormTable'
export default {
	name: 'RefundList',
	components: {
		FormTable,
	},
}
</script>
