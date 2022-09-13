<!--
 * @Author: your name
 * @Date: 2020-10-07 22:20:05
 * @LastEditTime: 2020-10-08 21:08:28
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \youxuan_platform\src\pages\goods\GoodsPrice\index.vue
-->
<template>
	<div class="CollectionOrderExpenses-page">
		<!-- 基于element的搜索表格组合 -->
		<FormTable />
	</div>
</template>
<script>
import FormTable from './components/FormTable'
export default {
	name: 'CollectionOrderExpenses',
	components: {
		FormTable,
	},
}
</script>
