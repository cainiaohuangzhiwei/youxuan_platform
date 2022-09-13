<template>
	<div class="orderFlowList-page">
		<!-- 基于element的搜索表格组合 -->
		<FormTable />
	</div>
</template>
<script>
import FormTable from './components/FormTable'
export default {
	name: 'OrderFlowList',
	components: {
		FormTable,
	},
}
</script>
