<!--
 * @Author: your name
 * @Date: 2021-12-22 10:52:48
 * @LastEditTime: 2021-12-22 10:53:57
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \egg\src\pages\shop\shopOrderSettlement\index.vue
-->
<template>
	<div class="InviteList-page">
		<!-- 基于element的搜索表格组合 -->
		<FormTable />
	</div>
</template>
<script>
import FormTable from './components/FormTable'
export default {
	name: 'shopOrderSettlement',
	components: {
		FormTable,
	},
}
</script>
