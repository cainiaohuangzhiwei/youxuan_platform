<template>
	<div class="Service-page">
		<!-- 基于element的搜索表格组合 -->
		<FormTable />
	</div>
</template>
<script>
import FormTable from './components/AdFormTable'
export default {
	name: 'signinAd',
	components: {
		FormTable,
	},
}
</script>
