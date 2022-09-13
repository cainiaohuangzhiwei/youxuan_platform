<template>
	<div class="merchantWithholdImport-page">
		<!-- 导入扣款数据 -->
		<MerchantWithholdData />
	</div>
</template>
<script>
import MerchantWithholdData from './components/MerchantWithholdData'
export default {
	name: 'MerchantWithholdImport',
	components: {
		MerchantWithholdData,
	},
}
</script>
