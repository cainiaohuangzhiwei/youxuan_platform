<template>
	<div class="container">
		<yx-info :data="infoData" :items="infoItems">
			<!-- 自定义插槽 -->
			<div slot="supplierRemark" class="check-msg">
				<img src="@/assets/image/logo_icon.png" />
			</div>
		</yx-info>
	</div>
</template>

<script>
import YxInfo from '@wg-vue-materials/yx-info'
import { numberFormat } from '@/utils/helper/common'
import { platformWeegetAccountDetail } from '@/api/platformAccount'
export default {
	components: {
		YxInfo,
	},
	name: 'baseInfo',
	data() {
		return {
			infoData: {},
			infoItems: [
				{
					type: 'custom',
					title: 'logo',
					dataIndex: 'supplierRemark',
				},
				{
					type: 'string',
					title: '账户id',
					dataIndex: 'accountId',
				},
				{
					type: 'string',
					title: '账户名称',
					dataIndex: 'accountName',
				},

				{
					type: 'string',
					title: '可用余额',
					dataIndex: 'availableAmount',
					customRender: () => {
						return numberFormat(this.infoData.availableAmount, 2)
					},
				},
				{
					type: 'string',
					title: '冻结',
					dataIndex: 'frozenAmount',
					customRender: () => {
						return numberFormat(this.infoData.frozenAmount, 2)
					},
				},
			],
		}
	},

	created() {
		this.platformWeegetAccountDetail()
	},

	methods: {
		platformWeegetAccountDetail: async function () {
			let paramJson = {
				accountId: this.$route.params.accountId,
			}
			let {
				data: { resultCode, resultData },
			} = await platformWeegetAccountDetail(paramJson)
			if (resultCode == 0) {
				this.infoData = {
					accountId: this.$route.params.accountId,
					...resultData,
				}
			}
		},
	},
}
</script>

<style scoped>
.info-container {
	padding: 10px 0 35px;
}
</style>
