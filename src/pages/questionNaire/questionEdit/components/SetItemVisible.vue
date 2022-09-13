<template>
	<div>
		<el-dialog
			ref="elDialog"
			title="启用显示条件"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<el-alert type="warning" :closable="false">
				设置条件后，满足任一条件显示本题目，否则隐藏本题。<br />
				条件中的触发题目范围为“本题目之前的题目”。
			</el-alert>
			<div v-for="(item, i) in showConditionList" :key="i">
				<div v-if="!item.isDelete" class="content">
					<item-condition
						:quaList="quaList"
						v-model="showConditionList[i]"
						@delete="() => del(i, true)"
					></item-condition>
					<i
						v-if="showConditionList.length !== 1"
						class="el-icon-remove-outline plus"
						style="color: #f56c6c"
						@click="del(i)"
					></i>
				</div>
				<el-alert
					v-if="deleteIndex.includes(i)"
					type="warning"
					:closable="false"
					title="这个条件已失效"
				>
				</el-alert>
			</div>

			<el-button
				type="danger"
				plain
				round
				style="margin-top: 10px"
				@click="init"
				>清除条件控制</el-button
			>
			<el-button type="primary" round style="margin-top: 10px" @click="add"
				>添加条件</el-button
			>
			<span slot="footer" class="dialog-footer">
				<el-button @click="resetForm">取 消</el-button>
				<el-button type="primary" @click="saveForm">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import ItemCondition from './ItemCondition'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		ItemCondition,
	},

	data() {
		return {
			quaList: [],
			row: {},
			// quaIndex: '',
			optionsList: [],
			// optionsIndex: '',
			zIndex: 2001,
			showConditionList: [],
			deleteIndex: [],
		}
	},

	computed: {
		localVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			},
		},
	},

	methods: {
		detail(row, quaList) {
			this.row = row
			if (row.showConditionList && row.showConditionList.length) {
				this.showConditionList = JSON.parse(
					JSON.stringify(row.showConditionList || [])
				)
			} else {
				this.init()
			}
			this.quaList = quaList
		},

		handleQua(val) {
			this.oid = ''
			this.optionsList = this.quaList[val].optionsList
		},

		add() {
			this.showConditionList.push({
				oid: '',
				qid: '',
			})
		},
		del(i, delay) {
			if (delay) {
				this.deleteIndex.push(i)

				setTimeout(() => {
					this.showConditionList[i].isDelete = true
					this.deleteIndex = []
					this.$forceUpdate()
					const newConditionList = this.showConditionList.filter(
						(x) => !x.isDelete
					)
					this.$emit('submit', JSON.parse(JSON.stringify(newConditionList)))
				}, 1000)
			} else {
				this.showConditionList[i].isDelete = true
				this.$forceUpdate()
			}
		},

		// 关闭弹窗
		resetForm() {
			this.showConditionList = []
			this.localVisible = false
		},
		init() {
			this.showConditionList = [
				{
					oid: '',
					qid: '',
				},
			]
		},

		saveForm() {
			const showConditionList = new Map()
			let flag = true
			if (this.showConditionList.length === 1) {
				const x = this.showConditionList[0]
				if (x.oid === '' && x.qid === '') {
					this.$emit('submit', [])
					this.resetForm()
					return
				}
			}
			const newConditionList = JSON.parse(
				JSON.stringify(this.showConditionList.filter((x) => !x.isDelete))
			)
			for (let i = 0; i < newConditionList.length; i++) {
				const x = newConditionList[i]
				if (x.qid === '' || x.oid === '') {
					this.$message.warning('第' + (i + 1) + '条是未完成的条件，请检查')
					flag = false
					break
				}
				const key = `${x.qid}-${x.oid}`
				if (showConditionList.has(key)) {
					this.$message.warning(
						`第${i + 1}和第${showConditionList.get(key)}个条件重复，请检查`
					)
					flag = false
					break
				} else {
					showConditionList.set(key, i + 1)
				}
			}
			if (flag) {
				this.$emit('submit', newConditionList)
				this.resetForm()
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.content {
	margin-top: 20px;
	display: flex;
	align-items: center;

	.plus {
		padding-left: 10px;
		font-size: 20px;
		color: #409eff;
		cursor: pointer;
	}
}
</style>
