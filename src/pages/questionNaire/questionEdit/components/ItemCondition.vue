<template>
	<div class="content-left">
		<el-select
			v-model="item.qid"
			@change="handleQua"
			placeholder="请选择触发题目"
		>
			<el-option
				v-for="(item, i) in quaList"
				:key="i"
				:label="`${item.sortNum}. ${item.questionTitle}`"
				:value="item.qid"
			>
			</el-option>
		</el-select>
		<div class="content_text">选中</div>
		<el-select
			v-model="item.oid"
			@change="handleOptions"
			placeholder="触发选项"
		>
			<el-option
				v-for="(item, i) in optionsList"
				:key="i"
				:label="`${i + 1}. ${item.optionsValue}`"
				:value="item.oid"
			>
			</el-option>
		</el-select>
	</div>
</template>

<script>
export default {
	name: 'ItemCondition',
	model: {
		prop: 'item',
		event: 'change',
	},
	props: {
		item: {
			type: Object,
			default: () => ({}),
		},
		quaList: {
			type: Array,
			default: () => [],
		},
	},

	data() {
		return {
			optionsList: [],
		}
	},

	created() {
		if (this.item.qid !== '') {
			const target = this.quaList.find((x) => x.qid === this.item.qid)
			if (target) {
				if (this.item.oid !== '' && this.optionsList.length === 0) {
					this.optionsList = target.optionsList
					const targetOption = target.optionsList.find(
						(x) => x.oid === this.item.oid
					)
					if (!targetOption) {
						this.item.oid = ''
					}
				}
			} else {
				this.$emit('delete')
			}
		}
	},
	methods: {
		handleQua(val) {
			const target = this.quaList.find((x) => x.qid === val)
			if (target) {
				this.item.quaValue = target.questionTitle
				this.item.oid = ''
				this.item.qid = target.qid
				this.$emit('change', this.item)
				this.optionsList = target.optionsList
			}
		},
		handleOptions(val) {
			const target = this.optionsList.find((x) => x.oid === val)
			if (target) {
				this.item.optionsValue = target.optionsValue
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.content-left {
	display: flex;
	align-items: center;

	.content_text {
		margin: 0 10px;
	}
}
</style>
