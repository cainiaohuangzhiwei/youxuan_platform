<template>
	<basic-container>
		<div>
			<div v-if="activeName === 'public'">
				<public-box :infoData.sync="infoData"></public-box>
			</div>
			<div v-if="activeName === 'personal'">
				<personal :infoData.sync="infoData"></personal>
			</div>
		</div>
	</basic-container>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import personal from './components/personal'
import publicBox from './components/public'
import { getSuningBankAccountInfo } from '@/api/accountService'
import { setViewTitle } from '@/utils/helper/common'
import { ACCOUNT_TYPE } from './constants.js'
export default {
	components: {
		BasicContainer,
		personal,
		publicBox,
	},
	name: 'addBankAccount',
	data() {
		return {
			activeName: 'public',
			params: this.$route.params,
			infoData: {},
		}
	},
	created() {
		this.setTitle()
		this.infoData = {}
		if (this.params.suningOpenAccountBankInfoId != 'null') {
			this._getDetailByPlatform()
		} else {
			if (this.params.skipType === ACCOUNT_TYPE.PUBLIC) {
				this.activeName = 'public'
			} else {
				this.activeName = 'personal'
			}
		}
	},
	methods: {
		async _getDetailByPlatform() {
			const {
				data: { resultCode, resultData },
			} = await getSuningBankAccountInfo({
				suningOpenAccountBankInfoId: this.params.suningOpenAccountBankInfoId,
			})
			if (resultCode == 0) {
				if (!resultData.toPublicBankAccount) {
					this.activeName = 'personal'
				} else {
					this.activeName = 'public'
				}
				this.infoData = resultData
			}
		},

		setTitle() {
			// tab 标题设置
			this.activeName = ''
			let title = ''
			if (this.params.suningOpenAccountBankInfoId == 'null') {
				title = '新增银行卡'
			} else {
				title = '银行卡详情'
			}

			console.log('this.params.skipType>>', this.params.skipType)

			if (this.params.skipType === ACCOUNT_TYPE.PUBLIC) {
				title = `${title}(对公)`
			} else {
				title = `${title}(对私)`
			}

			setViewTitle(this.$store, this.$route, null, title)
		},
	},
}
</script>

<style></style>
