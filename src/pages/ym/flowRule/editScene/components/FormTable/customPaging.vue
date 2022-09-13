<template>
	<div>
		<el-pagination
			v-if="pageshow"
			ref="elPagination"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="currentPage"
			:page-sizes="[10, 30, 50, 100]"
			:page-size="10"
			background
			layout="total, sizes, prev, pager, next, jumper"
			:total="total"
		>
		</el-pagination>
	</div>
</template>
<script>
export default {
	props: {
		index: {
			type: Number,
			default: 0,
		},
		length: {
			type: Number,
			default: 10,
		},
		currentPage: {
			type: Number,
			default: 1,
		},
		total: {
			type: Number,
			default: 100,
		},
	},
	data() {
		return {
			pageshow: true,
		}
	},
	watch: {
		total() {
			this.pageshow = false
			this.$nextTick(() => {
				//重新渲染分页
				this.pageshow = true
			})
		},
		currentPage(val) {
			console.log(val, '8888')
		},
	},
	methods: {
		handleSizeChange(val) {
			console.log('7777')
			this.length = val
			let params = {
				pageSize: val,
				pageNum: this.currentPage,
				index: this.index,
			}
			this.$emit('tableChange', params)
		},
		handleCurrentChange(val) {
			console.log('666666')
			this.currentPage = val
			let params = {
				pageSize: this.length,
				pageNum: val,
				index: this.index,
			}
			this.$emit('tableChange', params)
		},
	},
}
</script>
