<template>
	<div class="region-item">
		<el-form :inline="true">
			<el-form-item
				v-for="(option, index) in optionsList"
				:key="index"
				:label="option.optionsValue"
			>
				<el-select> </el-select>
				<el-button
					type="text"
					style="margin-left: 10px"
					@click="handleDelete(index, option.optionsValue === '省份')"
					>{{ option.optionsValue !== '省份' ? '删除' : '' }}</el-button
				>
			</el-form-item>
		</el-form>
		<el-button size="mini" type="primary" round @click="handleReset">
			显示三级地级市选择
		</el-button>
	</div>
</template>

<script>
export default {
	model: {
		prop: 'optionsList',
		event: 'change',
	},
	props: {
		optionsList: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			originList: [
				{
					optionsValue: '省份',
					imageUrl: '',
					areaLevel: 2,
				},
				{
					optionsValue: '城市',
					imageUrl: '',
					areaLevel: 3,
				},
				{
					optionsValue: '地区',
					imageUrl: '',
					areaLevel: 4,
				},
			],
		}
	},

	methods: {
		handleReset() {
			this.optionsList = JSON.parse(JSON.stringify(this.originList))
			this.$forceUpdate()
			this.$emit('change', this.optionsList)
		},
		handleDelete(index, disabled) {
			if (disabled) return
			this.optionsList.splice(index, 2)
			this.$forceUpdate()
			this.$emit('change', this.optionsList)
		},
	},
}
</script>

<style lang="scss" scoped>
.input-item {
	display: flex;
}
</style>
