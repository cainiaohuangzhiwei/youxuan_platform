<template>
	<div class="优先爬取列表-page">
		<!-- 基于element的搜索表格组合 -->
		<FormTable />
	</div>
</template>
<script>
import FormTable from './components/FormTable'
export default {
	name: 'PriorityList',
	components: {
		FormTable,
	},
}
</script>
