<template>
	<el-input
		type="textarea"
		v-model="inputData"
		:placeholder="placeholder"
	></el-input>
</template>

<script>
/* 
本组件自动切割输入文字为数组，输入多行文本，换行或用逗号隔开
自动返回数组类型进行批量搜索
*/
export default {
	name: 'SplittedInput',
	props: {
		value: {
			type: Array,
			default: () => {
				return []
			},
		},
		placeholder: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			inputData: '',
		}
	},
	watch: {
		inputData(val) {
			let resultStr = ''
			if (val.length > 0) {
				resultStr = val.replace(/,/g, ',').replace(/\n/g, ',')
			}
			const resultArr = resultStr.length > 0 ? resultStr.split(',') : []
			this.$emit('update:value', resultArr)
		},
	},
}
</script>
