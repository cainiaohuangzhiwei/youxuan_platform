<template>
	<div>
		<div class="input-content">
			<el-table
				:data="row.subTitleList"
				style="width: 100%; margin-bottom: 10px"
				:header-cell-style="{ 'text-align': 'center' }"
				:cell-style="{ 'text-align': 'center' }"
				size="mini"
			>
				<el-table-column fixed label="" width="100">
					<template slot-scope="scope"> {{ scope.row }}</template>
				</el-table-column>
				<el-table-column
					v-for="option in row.optionsList"
					:key="option.oid"
					:label="option.optionsValue"
				>
					<template slot-scope="scope">
						<template v-if="row.multipleChooseFlag === 0">
							<el-radio
								class="sub-radio-item"
								v-model="radioList[scope.$index]"
								:label="option.oid"
							></el-radio>
						</template>

						<template v-if="row.multipleChooseFlag">
							<el-checkbox class="sub-radio-item" :label="option.optionsValue">
								{{ option.optionsValue }}
							</el-checkbox>
						</template>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-button type="primary" round size="mini" @click="show"> 编辑 </el-button>
	</div>
</template>

<script>
export default {
	model: {
		prop: 'row',
		event: 'change',
	},
	props: {
		row: {
			type: Object,
			default: () => ({}),
		},
	},

	data() {
		return {
			matrixVisible: false,
			radioList: [],
		}
	},

	created() {
		// 新增之后弹窗内容窗口
		if (this.row.created) {
			setTimeout(() => {
				this.show(true)
			}, 500)
		}
	},

	methods: {
		show() {
			const detail = JSON.parse(JSON.stringify(this.row))
			this.$emit('otherMethods', 'editMatrix', detail, (res) => {
				if (res) {
					const optionsList = JSON.parse(JSON.stringify(res.optionsList))
					res.optionsList = []
					this.row = JSON.parse(JSON.stringify(res))
					this.$emit('change', res)
					this.$nextTick(() => {
						this.row.optionsList = optionsList
						this.$emit('change', this.row)
					})

					this.radioList = res.subTitleList.map((e, i) =>
						res.multipleChooseFlag === 0 ? i : []
					)
				}
			})
		},
		handleChange() {},
	},
}
</script>

<style lang="scss">
.sub-radio-item {
	&.el-radio {
		margin-right: 10px;
		padding-left: 0;
		.el-radio__label {
			display: none;
		}
	}
	&.el-checkbox {
		padding-left: 0;
		.el-checkbox__label {
			display: none;
		}
	}
}
</style>
