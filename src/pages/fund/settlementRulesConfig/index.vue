<!--
 * @Author: your name
 * @Date: 2020-10-07 22:20:05
 * @LastEditTime: 2020-12-21 15:34:10
 * @LastEditors: liqianwei
 * @Description: In User Settings Edit
-->
<template>
	<div class="GoodsPrice-page">
		<!-- 基于element的搜索表格组合 -->
		<FormTable />
	</div>
</template>
<script>
import FormTable from './components/FormTable'
export default {
	name: 'SettlementRulesConfig',
	components: {
		FormTable,
	},
}
</script>
