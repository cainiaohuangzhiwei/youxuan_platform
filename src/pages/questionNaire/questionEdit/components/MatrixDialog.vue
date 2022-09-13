<template>
	<div>
		<el-dialog
			ref="elDialog"
			:title="detail.created ? '矩阵新增' : '矩阵编辑'"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<input-edit-item
				v-model="detail.questionTitle"
				:rules="quaRules.questionTitle"
			></input-edit-item>
			<br />
			<input-edit-item
				v-model="detail.subTitle"
				:rules="quaRules.subTitle"
			></input-edit-item>
			<br />
			<el-select v-model="detail.multipleChooseFlag">
				<el-option :value="0" label="矩阵单选">矩阵单选</el-option>
				<el-option :value="1" label="矩阵多选">矩阵多选</el-option>
			</el-select>

			<div class="input-content">
				<el-input
					v-model="detail.x"
					type="textarea"
					style="width: 45%"
					:autosize="{ minRows: 6, maxRows: 12 }"
				></el-input>

				<div class="input-content_right">
					<draggable
						v-model="detail.optionsList"
						chosenClass="chosen"
						forceFallback="true"
						group="rankOption"
						animation="1000"
						handle=".rank-option"
					>
						<div
							v-for="(item, index) in detail.optionsList"
							:key="index"
							class="input-content_right-item"
						>
							<div class="input-content_right-order">{{ index + 1 }}</div>
							<el-input
								v-model="item.optionsValue"
								:maxlength="12"
								@input.native="(e) => widthCheck(e.target, 12)"
								clearable
								:ref="`input${index}`"
								@keyup.enter.native="
									() =>
										index === detail.optionsList.length - 1
											? addOption()
											: nulll
								"
							></el-input>
							<i class="el-icon-rank rank-option"></i>
							<i class="el-icon-delete" @click="delOption(index)"></i>
						</div>
					</draggable>
					<el-button
						type="primary"
						plain
						round
						icon="el-icon-plus"
						size="mini"
						@click="addOption"
					>
						添加选项
					</el-button>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="resetForm">取 消</el-button>
				<el-button type="primary" @click="submit">完 成</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import InputEditItem from './InputEditItem'
import draggable from 'vuedraggable'

export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	components: {
		InputEditItem,
		draggable,
	},

	data() {
		return {
			detail: {
				questionTitle: '',
				subTitle: '',
				optionsList: [],
				x: '',
			},
			localVisible: false,
			quaRules: {
				questionTitle: [
					{ required: true, message: '请输入标题', trigger: 'blur' },
					{ max: 100, message: '标题长度不超过100个字符', trigger: 'blur' },
				],
				subTitle: [
					{ max: 100, message: '标题长度不超过100个字符', trigger: 'blur' },
				],
			},
			activeInput: 0,
		}
	},

	// computed: {
	// 	localVisible: {
	// 		get() {
	// 			return this.visible
	// 		},
	// 		set(val) {
	// 			this.$emit('update:visible', val)
	// 		},
	// 	},
	// },

	methods: {
		showDetail(detail) {
			this.localVisible = true
			this.detail = JSON.parse(JSON.stringify(detail))
		},
		rondom8() {
			const r = Math.floor(Math.random() * 2742745743360 + 78364164096)
			return r.toString(36)
		},
		addOption() {
			if (this.detail.optionsList.length >= 11) {
				this.$message.warning('选项标题最多支持11个')
				return
			}
			this.detail.optionsList.push({
				optionsValue: '',
				oid: this.rondom8(),
			})
			const key = `input${this.detail.optionsList.length - 1}`
			this.$nextTick(() => {
				this.$refs[key][0].focus()
			})
		},
		delOption(i) {
			this.detail.optionsList.splice(i, 1)
		},
		widthCheck(str, len) {
			let temp = 0
			for (let i = 0; i < str.value.length; i++) {
				if (/[\u4e00-\u9fa5]/.test(str.value[i])) {
					temp += 2
				} else {
					temp++
				}
				if (temp > len) {
					str.value = str.value.substr(0, i)
				}
			}
		},

		submit() {
			if (!this.detail.optionsList.length) {
				this.$message.error('选项不能为空')
				return
			}
			const detail = JSON.parse(JSON.stringify(this.detail))
			const x = detail.x
			const lines = x.split(/\s/g).filter((y) => y)
			if (!lines.length) {
				this.$message.error('矩阵小标题不能为空')
				return
			}
			if (lines.length > 20) {
				this.$message.warning(
					'矩阵小标题支持最多20行，现有' + lines.length + '行'
				)
				return
			}
			detail.optionsList.forEach((y) => {
				y.value = y.optionsValue
				this.widthCheck(y, 12)
				y.optionsValue = y.value
				delete y.value
			})
			const errorIndex = lines.findIndex((y) => y.length > 30)
			if (errorIndex > -1) {
				this.$message.warning(
					'每个矩阵小标题最多30字，现在“' + lines[errorIndex] + '”超出'
				)
				return
			}
			detail.subTitleList = lines
			delete detail.created
			this.detail = detail
			this.$emit('change', detail)
			this.resetForm()
		},
		// 关闭弹窗
		resetForm() {
			if (this.detail.created) {
				this.$emit('change', { delete: true })
			}
			this.detail = {
				optionsList: [],
				x: '',
				subTitleList: [],
			}
			this.localVisible = false
		},
	},
}
</script>

<style lang="scss" scoped>
.input-content {
	margin: 10px 0;
	display: flex;

	.input-content_right {
		margin-left: 20px;

		.input-content_right-item {
			display: flex;
			align-items: center;
			margin-bottom: 10px;

			.input-content_right-order {
				flex-shrink: 0;
				width: 25px;
			}

			.rank-option {
				cursor: move;
				padding: 0 6px;
			}

			.el-icon-delete {
				color: red;
			}
		}
	}
}
</style>
