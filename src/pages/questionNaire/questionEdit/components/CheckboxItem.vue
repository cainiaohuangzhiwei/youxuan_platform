<template>
	<div>
		<draggable
			v-model="optionsList"
			chosenClass="chosen"
			forceFallback="true"
			group="checkbox"
			animation="1000"
			handle=".rank"
			@end="onDragEnd"
		>
			<div
				class="checkbox-option"
				v-for="(opt, opyIndex) in optionsList"
				:key="opyIndex"
			>
				<i class="el-icon-rank rank"></i>
				<el-checkbox :label="`${opt.optionsValue}-${opyIndex}`">
					<div class="checkbox-value">
						{{ opt.otherFlag ? '其他' : opt.optionsValue }}
					</div>
				</el-checkbox>
				<img
					v-if="opt.image || opt.imageUrl"
					class="option-img"
					:src="opt.image.imageList || [getSmallImg(opt.imageUrl)]"
				/>
				<el-button
					v-if="!opt.otherFlag"
					type="text"
					@click="editOption(opt, opyIndex)"
				>
					编辑
				</el-button>
				<template v-else>
					{{ opt.otherRequired ? '必答已开启' : '必答已关闭' }}
					<el-switch
						style="margin: 0 10px"
						active-color="#13ce66"
						v-model="opt.otherRequired"
					></el-switch>
				</template>
				<el-button type="text" @click="delOption(opyIndex)"> 删除 </el-button>
				<el-input v-if="opt.otherFlag" placeholder="请输入"></el-input>
			</div>
		</draggable>

		<div class="add-btn">
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
			<el-button
				type="primary"
				plain
				round
				icon="el-icon-plus"
				size="mini"
				@click="addOtherOption"
			>
				添加“其他”选项
			</el-button>
		</div>
	</div>
</template>

<script>
import { getSmallImg } from '@/utils/imageTool'
import draggable from 'vuedraggable'

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
		index: {
			type: Number,
			default: 0,
		},
	},

	components: {
		draggable,
	},

	data() {
		return {
			checked: [],
			loading: false,
			getSmallImg,
		}
	},

	methods: {
		addOtherOption() {
			const optionsList = JSON.parse(JSON.stringify(this.optionsList))
			if (optionsList.find((x) => x.image || x.imageUrl)) {
				this.$message.error('“其他”选项仅支持全文字选项')
				return
			}
			if (optionsList.length >= 12) {
				this.$message.error('最多12个选项')
				return
			}
			if (optionsList.findIndex((x) => x.otherFlag) > -1) {
				this.$message.error('只支持一个“其他”选项')
				return
			}
			optionsList.push({
				optionsValue: '其他',
				imageUrl: '',
				otherFlag: true,
				otherRequired: false,
			})
			this.$emit('change', optionsList)
		},
		addOption() {
			const optionsList = JSON.parse(JSON.stringify(this.optionsList))
			if (optionsList.length >= 12) {
				this.$message.error('最多12个选项')
				return
			}
			this.$emit('otherMethods', 'addOption', (res) => {
				if (res) {
					optionsList.push(res)
					this.$emit('change', optionsList)
				}
			})
		},
		editOption(item, optionIndex) {
			const optionsList = JSON.parse(JSON.stringify(this.optionsList))
			if (item.image) [(item.imageUrl = item.image.imageList)]
			this.$emit('otherMethods', 'editOption', item, (res) => {
				if (res) {
					optionsList[optionIndex] = res
					this.$emit('change', optionsList)
				}
			})
		},
		delOption(optionIndex) {
			const optionsList = JSON.parse(JSON.stringify(this.optionsList))
			if (optionsList.length <= 2) {
				this.$message.error('不能少于2项')
				return
			}

			optionsList.splice(optionIndex, 1)
			this.$emit('change', optionsList)
		},
		onDragEnd() {
			this.$emit('change', this.optionsList)
		},
	},
}
</script>

<style lang="scss" scoped>
.checkbox-option {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	margin-bottom: 10px;
	.el-checkbox {
		margin-right: 10px;
		max-width: 80%;
		display: flex;
		align-items: center;
	}
	.rank {
		cursor: move;
		padding-right: 10px;
	}
	.checkbox-value {
		white-space: initial;
		word-break: break-all;
	}
}
.option-img {
	width: 50px;
	height: 50px;
	object-fit: scale-down;
}
</style>
