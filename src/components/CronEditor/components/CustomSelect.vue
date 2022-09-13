<template>
	<el-select
		:value="currentValue"
		:disabled="disabled"
		:multiple="isMultiple"
		:placeholder="placeholder"
		:style="`width: ${width}px; margin: 0 8px;`"
		:clearable="clearable"
		:multiple-limit="multipleLimit"
		@change="onChange"
	>
		<el-option
			v-for="item in options"
			:key="item.value"
			:label="item.label"
			:value="item.value"
		>
		</el-option>
	</el-select>
</template>

<script>
export default {
	name: 'CustomSelect',
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		multiple: {
			type: Boolean,
			default: false,
		},
		multipleLimit: {
			type: Number,
			default: 0,
		},
		clearable: {
			type: Boolean,
			default: false,
		},
		value: {
			type: String,
			default: '',
		},
		options: {
			type: Array,
			default: () => [],
		},
		width: {
			type: Number,
			default: 100,
		},
		placeholder: {
			type: String,
			default: '请选择',
		},
	},
	created() {
		this.stringValue(this.value)
	},
	data: () => ({
		currentValue: '',
		isMultiple: false,
	}),
	watch: {
		value(val) {
			this.stringValue(val)
		},
	},
	methods: {
		stringValue(value) {
			this.isMultiple = this.multipleLimit === 1 ? false : this.multiple

			if (value && Array.isArray(value)) {
				this.currentValue = value.map((v) => v.toString())
				if (!this.isMultiple) {
					this.currentValue = this.currentValue[0]
				}
			} else {
				this.currentValue = value.toString()
			}
		},
		callbackValueFormat(val) {
			if (this.multiple) {
				const arrayResult = Array.isArray(val) ? val : [val]
				return arrayResult.filter((item) => item !== '')
			}
			return val
		},
		onChange(val) {
			const getRenderVal = this.callbackValueFormat(val)
			this.$emit('change', getRenderVal)
		},
	},
}
</script>
