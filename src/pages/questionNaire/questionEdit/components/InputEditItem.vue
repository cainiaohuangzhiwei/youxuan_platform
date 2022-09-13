<template>
	<div class="input-item">
		<span class="input-item-placeHolder" v-if="visible && !value">
			暂无内容
		</span>
		<span v-if="visible">{{ value }}</span>
		<el-form
			v-else
			label-width="10px"
			:model="inputForm"
			ref="inputForm"
			@submit.native.prevent="() => {}"
		>
			<el-form-item label="" prop="inputValue" :rules="rules">
				<el-input
					v-model="inputForm.inputValue"
					style="width: calc(100% - 80px)"
					:placeHolder="placeHolder"
					show-word-limit
					@keyup.enter.native="save"
					maxlength="100"
				></el-input>
				<el-button class="input-item_btn" type="text" @click="save">
					完成
				</el-button>
			</el-form-item>
		</el-form>

		<el-button v-if="visible" class="input-item_btn" type="text" @click="edit">
			编辑
		</el-button>
	</div>
</template>

<script>
export default {
	model: {
		prop: 'value',
		event: 'change',
	},
	props: {
		value: {
			type: String,
			default: '',
		},
		placeHolder: {
			type: String,
			default: '',
		},
		rules: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			visible: true,
			inputForm: {
				inputValue: '',
			},
		}
	},

	methods: {
		edit() {
			this.visible = false
			this.inputForm.inputValue = this.value
		},
		save(e) {
			e.preventDefault()
			this.$refs.inputForm.validate((valid) => {
				if (valid) {
					this.visible = true
					this.value = this.inputForm.inputValue
					this.$emit('change', this.inputForm.inputValue)
				} else {
					return false
				}
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.input-item {
	// display: flex;
	// align-items: center;

	.input-item-placeHolder {
		color: #999;
	}

	.input-item_btn {
		margin-left: 10px;
	}
}
</style>
