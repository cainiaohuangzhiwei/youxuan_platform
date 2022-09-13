<template>
	<div class="InterestList-page">
		<!-- 基于element的搜索表格组合 -->
		<FormTable />
	</div>
</template>
<script>
import FormTable from './components/FormTable'
export default {
	name: 'InterestList',
	components: {
		FormTable,
	},
}
</script>

<style lang="scss" scope>
.InterestList-page {
	background: none !important;
}
</style>
