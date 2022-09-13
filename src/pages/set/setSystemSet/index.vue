<template>
	<basicContainer>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="商品" name="goodsSet">
				<span slot="label">商品</span>
				<goodsSet ref="goodsSet"></goodsSet>
			</el-tab-pane>
			<el-tab-pane label="店铺" name="storeSet">
				<span slot="label">店铺</span>
				<storeSet ref="storeSet"></storeSet>
			</el-tab-pane>
			<el-tab-pane v-if="getOrderConfiguration" label="订单" name="orderSet">
				<span slot="label">订单</span>
				<orderSet ref="orderSet"></orderSet>
			</el-tab-pane>
			<el-tab-pane label="退款单" name="refundSet">
				<span slot="label">退款单</span>
				<refundSet ref="refundSet"></refundSet>
			</el-tab-pane>
			<el-tab-pane v-if="areaSet" label="地区" name="areaSet">
				<span slot="label">地区</span>
				<areaSet ref="areaSet"></areaSet>
			</el-tab-pane>
			<el-tab-pane label="敏感词词库" name="sensitiveWordSet">
				<span slot="label">敏感词词库</span>
				<sensitiveWordSet ref="sensitiveWordSet"></sensitiveWordSet>
			</el-tab-pane>
			<el-tab-pane
				v-if="agreementList"
				label="协议管理"
				name="agreementManagement"
			>
				<span slot="label">协议管理</span>
				<agreementManagement ref="agreementManagement"></agreementManagement>
			</el-tab-pane>
		</el-tabs>
	</basicContainer>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import goodsSet from './components/goodsSet'
import storeSet from './components/storeSet'
import orderSet from './components/orderSet'
import refundSet from './components/refundSet'
import areaSet from './components/areaSet'
import sensitiveWordSet from './components/sensitiveWordSet'
import agreementManagement from './components/agreementManagement'
import { checkFunctionCode } from '@/utils/auth'
export default {
	components: {
		BasicContainer,
		goodsSet,
		storeSet,
		orderSet,
		refundSet,
		areaSet,
		sensitiveWordSet,
		agreementManagement,
	},
	data() {
		return {
			getOrderConfiguration: checkFunctionCode('getOrderConfiguration'),
			areaSet: checkFunctionCode('areaSet'),
			getExpressFeeRecodeList: checkFunctionCode('getExpressFeeRecodeList'),
			agreementList: checkFunctionCode('agreementList'),
			activeName: 'goodsSet',
			goodsConfiguration: {},
		}
	},
	created() {
		this.$nextTick(() => {
			this.$refs.goodsSet.init()
		})
	},
	methods: {
		handleClick({ name }) {
			if (this.$refs[name] && !this.$refs[name].isShow) {
				this.$refs[name].init(true)
			}
		},
	},
}
</script>
