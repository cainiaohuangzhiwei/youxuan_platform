<!--
 * @Author: your name
 * @Date: 2021-11-04 15:33:31
 * @LastEditTime: 2021-11-08 14:49:57
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \egg\src\pages\business\paymentsSmallList\index.vue
-->
<template>
	<div class="paymentsSmallList-page">
		<!-- 基于element的搜索表格组合 -->
		<FormTable />
	</div>
</template>
<script>
import FormTable from './components/FormTable'
export default {
	name: 'PaymentsSmallList',
	components: {
		FormTable,
	},
}
</script>
