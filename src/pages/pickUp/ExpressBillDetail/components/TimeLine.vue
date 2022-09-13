<template>
	<div v-loading="infoLoading" class="audit-record">
		<el-timeline v-if="recordList.length > 0">
			<el-timeline-item
				v-for="(item, index) in recordList"
				:key="index"
				:timestamp="item.content"
				placement="top"
			>
				<el-card>
					<p>操作人：{{ item.operator }}</p>
					<p>
						时间：{{ moment(item.operateTime).format('YYYY-MM-DD HH:mm:ss') }}
					</p>
					<div>
						处理记录：
						<div class="remark-type" v-html="dealRemark(item.remark)"></div>
					</div>
				</el-card>
			</el-timeline-item>
		</el-timeline>
		<div v-if="recordList.length == 0 && !infoLoading">暂无操作记录</div>
	</div>
</template>
<script>
import { collectionOrderRecord } from '@/api/collectionOrder'
import moment from 'moment'
export default {
	components: {},
	name: 'OperationRecord',
	data() {
		return {
			moment,
			recordList: [],
		}
	},
	created() {
		this.getRecordList()
	},
	methods: {
		dealRemark(val) {
			let newVal

			if (val && val.slice(0, 1) == '{' && val.slice(-1) == '}') {
				newVal = JSON.parse(val)
				console.log(newVal)
				return `
				<div style='float:left;margin-right:40px'>
				修改前：
				<p>地址:${newVal.beforeAddress || '-'}</p>
				<p>上门取件开始时间：${
					newVal.beforePickupStartTime
						? moment(newVal.beforePickupStartTime).format('YYYY-MM-DD HH:mm:ss')
						: '-'
				}</p>
				<p>上门取件结束时间：${
					newVal.beforePickupEndTime
						? moment(newVal.beforePickupEndTime).format('YYYY-MM-DD HH:mm:ss')
						: '-'
				}</p>
				<p>电话：${newVal.beforePhone || '-'}</p>
				<p>姓名：${newVal.beforeName || '-'}</p>
				</div>
				<div style='float:left'>
				修改后：
				<p>地址:${newVal.afterAddress || '-'}</p>
				<p>上门取件开始时间：${
					newVal.afterPickupStartTime
						? moment(newVal.afterPickupStartTime).format('YYYY-MM-DD HH:mm:ss')
						: '-'
				}</p>
				<p>上门取件结束时间：${
					newVal.afterPickupEndTime
						? moment(newVal.afterPickupEndTime).format('YYYY-MM-DD HH:mm:ss')
						: '-'
				}</p>
				<p>电话：${newVal.afterPhone || '-'}</p>
				<p>姓名：${newVal.afterName || '-'}</p>
				</div>
				`
			} else {
				return val
			}
		},
		async getRecordList() {
			this.infoLoading = true
			const {
				data: { resultData, resultCode },
			} = await collectionOrderRecord({
				collectionOrderId: this.$route.params.id,
			})
			console.log(resultData)
			this.infoLoading = false
			if (resultCode == 0) {
				this.recordList = resultData
			} else {
				this.recordList = []
			}
		},
	},
}
</script>
<style lang="scss">
.audit-record {
	margin: 12px;
	min-height: 300px;
	.el-timeline-item__timestamp {
		color: brown;
		font-size: 16px;
	}
}
.remark-type {
	color: #333;
	margin-top: 20px;
}
</style>
