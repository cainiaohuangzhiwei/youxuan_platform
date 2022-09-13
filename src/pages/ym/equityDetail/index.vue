<template>
	<basicContainer>
		<div class="info-box">
			<yx-info
				:inline="false"
				:loading="showLoading"
				:data="formData"
				:items="formCfg"
				:column="2"
			>
				<template slot="receivedNum">
					<div>
						<span>已领取数量：</span>
						<span v-if="isReceivedNum">{{ receivedNum }}</span>
						<el-button
							@click="_getEquityReceivedCount"
							size="medium"
							style="color: #ffb04b"
							v-else
							type="text"
							>查看领取数量</el-button
						>
					</div>
				</template>
				<template slot="usedNum">
					<div>
						<span>已使用数量：</span>
						<span v-if="isUsedNum">{{ usedNum }}</span>
						<el-button
							@click="_getEquityUsedCount"
							size="medium"
							style="color: #ffb04b"
							v-else
							type="text"
							>查看使用数量</el-button
						>
					</div>
				</template>
			</yx-info>
		</div>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="已领取" name="receivedSet">
				<span slot="label">已领取</span>
				<receivedSet :params="params" ref="receivedSet"></receivedSet
			></el-tab-pane>
			<el-tab-pane label="已使用" name="usedSet">
				<span slot="label">已使用</span>
				<usedSet :params="params" ref="usedSet"></usedSet
			></el-tab-pane>
		</el-tabs>
	</basicContainer>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import {
	getEquityMore,
	getEquityReceivedCount,
	getEquityUsedCount,
} from '@/api/yhtPlusCmsEquity'
import YxInfo from '@wg-vue-materials/yx-info'
import receivedSet from './components/receivedSet'
import usedSet from './components/usedSet'
import moment from 'moment'
import { setViewTitle } from '@/utils/helper/common'
export default {
	components: {
		BasicContainer,
		YxInfo,
		receivedSet,
		usedSet,
	},
	data() {
		return {
			activeName: 'receivedSet',
			params: this.$route.params,
			query: this.$route.query,
			isReceivedNum: false,
			receivedNum: 0,
			isUsedNum: false,
			usedNum: 0,
			formData: {},
			formCfg: [
				{
					type: 'string',
					title: '权益卡ID',
					dataIndex: 'equityId',
					width: 300,
				},
				{
					type: 'string',
					title: '权益类型',
					dataIndex: 'equityTypeStr',
					width: 300,
				},
				{
					type: 'string',
					title: '权益卡名称',
					dataIndex: 'equityName',
					width: 300,
				},
				{
					type: 'string',
					title: '有效时间',
					dataIndex: 'timerStr',
					width: 300,
				},
				{
					type: 'string',
					title: '适用范围',
					dataIndex: 'grantScopeStr',
					width: 300,
				},
				{
					type: 'string',
					title: '使用方式',
					dataIndex: 'usingMethodStr',
					width: 300,
				},
				{
					type: 'custom',
					title: '已领取数量',
					dataIndex: 'receivedNum',
					width: 300,
				},
				{
					type: 'custom',
					title: '已使用数量',
					dataIndex: 'usedNum',
					width: 300,
				},
			],
			showLoading: false,
		}
	},
	created() {
		setViewTitle(this.$store, this.$route, this.params.equityId)
		this._getEquityMore()
	},
	methods: {
		_getEquityUsedCount: async function () {
			let {
				data: { resultCode, resultData },
			} = await getEquityUsedCount({
				equityId: this.params.equityId,
			})
			if (resultCode == 0) {
				this.usedNum = resultData.userdCount
				this.isUsedNum = true
			}
		},
		_getEquityReceivedCount: async function () {
			let {
				data: { resultCode, resultData },
			} = await getEquityReceivedCount({
				equityId: this.params.equityId,
			})
			if (resultCode == 0) {
				this.receivedNum = resultData.receivedCount
				this.isReceivedNum = true
			}
		},
		_getEquityMore: async function () {
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await getEquityMore({
				equityId: this.params.equityId,
			})
			this.showLoading = false
			if (resultCode == 0) {
				let equity = resultData.equity || {}
				equity.equityTypeStr = equity.equityType == 1 ? '运费保障卡' : ''
				equity.timerStr =
					equity.validityType == 1
						? moment(equity.startTime).format('YYYY-MM-DD HH:mm:ss') +
						  '-' +
						  moment(equity.endTime).format('YYYY-MM-DD HH:mm:ss')
						: equity.validityType == 2
						? '自领取起' + equity.validityDay + '天内有效'
						: ''
				equity.grantScopeStr =
					equity.grantScope == 1
						? '全场通用'
						: equity.grantScope == 2
						? '指定分组'
						: ''
				equity.usingMethodStr =
					equity.usingMethod == 1
						? '自用、转赠'
						: equity.usingMethod == 2
						? '自用'
						: ''
				this.formData = equity
				this.$nextTick(() => {
					if (!this.query.type) {
						this.$refs.receivedSet.init(true)
					} else {
						this.activeName = this.query.type
						this.$refs[this.query.type].init(true)
					}
				})
			}
		},
		handleClick({ name }) {
			this.$nextTick(() => {
				this.$refs[name].init(true)
			})
		},
	},
}
</script>

<style lang="scss" scoped></style>
