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
import { accOperationsAccountDetail } from '@/api/accountService'
export default {
	components: {
		YxInfo,
	},
	name: 'baseInfo',
	data() {
		return {
			infoData: {
				accountName: '运营账户',
			},
			infoItems: [
				{
					type: 'custom',
					title: 'logo',
					dataIndex: 'supplierRemark',
				},
				{
					type: 'string',
					title: '账户名称',
					dataIndex: 'accountName',
				},

				{
					type: 'string',
					title: '可用余额',
					dataIndex: 'balance',
					customRender: () => {
						return numberFormat(this.infoData.balance, 2)
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
		this.getAccOperationsAccountDetail()
	},

	methods: {
		getAccOperationsAccountDetail: async function () {
			let {
				data: { resultCode, resultData },
			} = await accOperationsAccountDetail({})
			if (resultCode == 0) {
				this.infoData = {
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
