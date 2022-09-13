<template>
	<basicContainer>
		<!-- <el-button type="primary" class="el-icon-right" @click="oldSystem"
			>老系统</el-button
		> -->
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="首款" name="addFirstMoneyTab">
				<addFirst-money-tab
					:reconciliationRecordId="reconciliationRecordId"
					ref="addFirstMoneyTab"
				></addFirst-money-tab>
			</el-tab-pane>
			<el-tab-pane label="尾款" name="addFinalPayment"
				><addFinal-payment
					:reconciliationRecordId="reconciliationRecordId"
					ref="addFinalPayment"
				></addFinal-payment
			></el-tab-pane>
		</el-tabs>
	</basicContainer>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import addFinalPayment from './components/addFinalPayment'
import addFirstMoneyTab from './components/addFirstMoneyTab'
export default {
	components: {
		BasicContainer,
		addFinalPayment,
		addFirstMoneyTab,
	},
	data() {
		return {
			activeName: 'addFirstMoneyTab',
			reconciliationRecordId: '',
		}
	},
	mounted() {
		this.reconciliationRecordId = this.$route.query.reconciliationRecordId
	},
	methods: {
		// 打开老系统
		oldSystem() {
			window.open(
				`/yhtplus/web/billParticularsOld.html?reconciliationRecordId=${this.$route.params.reconciliationRecordId}`
			)
		},
		handleClick({ name }) {
			if (name == 'addFirstMoneyTab') {
				this.$refs[name].getData106(true)
				this.$emit('initTable')
			} else {
				this.$refs[name].getData102(true)
			}
		},
	},
}
</script>
