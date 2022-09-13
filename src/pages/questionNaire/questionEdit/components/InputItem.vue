<template>
	<div class="input-item">
		<el-input
			v-if="multiLine"
			type="textarea"
			:autosize="{ minRows: 4, maxRows: 6 }"
			maxlength="1000"
			show-word-limit
		></el-input>
		<el-input v-else maxlength="1000" show-word-limit></el-input>

		<el-select class="select-item" v-model="multiLine" @change="handleChange">
			<el-option label="单行" :value="false"></el-option>
			<el-option label="多行" :value="true"></el-option>
		</el-select>
	</div>
</template>

<script>
export default {
	model: {
		prop: 'multiLine',
		event: 'change',
	},
	props: {
		multiLine: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {}
	},

	methods: {
		handleChange(e) {
			this.multiLine = e
			this.$forceUpdate()
			this.$emit('change', e)
		},
	},
}
</script>

<style lang="scss" scoped>
.input-item {
	display: flex;

	.select-item {
		margin-left: 10px;
	}
}
</style>
