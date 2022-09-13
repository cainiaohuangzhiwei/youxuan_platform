<template>
	<div>
		<el-dialog
			width="800px"
			title="添加白名单"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
		>
			<el-row>
				<div class="white-list-box">
					<div class="white-list-header">
						<div class="white-item tw">用户ID</div>
						<div class="white-item tw">实验</div>
						<div class="white-item tw">策略</div>
						<div class="white-item tw operating">操作</div>
					</div>
					<el-form :model="tableDataForm" ref="form">
						<template v-for="(item, index) in tableDataForm.tableData">
							<div class="white-list-cont" :key="index">
								<div class="white-item">
									<el-form-item
										:key="item.key"
										:prop="'tableData.' + index + '.userId'"
										class="el-form-item"
										:rules="{
											trigger: 'blur',
											type: 'number',
											validator: validateUserId,
										}"
									>
										<el-input
											type="text"
											v-model="item.userId"
											placeholder
											clearable
										></el-input>
									</el-form-item>
								</div>
								<div class="white-item">
									<el-select v-model="item.experimentId" placeholder="请选择">
										<el-option
											v-for="item in exprimentList"
											:key="item.id"
											:label="item.experimentName"
											:value="item.id"
											@click.native="handleSelect(item, index)"
										>
										</el-option>
									</el-select>
								</div>
								<div class="white-item">
									<el-select
										@click.native="getStrategyOptions(item, index)"
										v-model="item.strategyName"
										placeholder="请选择"
									>
										<el-option
											v-for="items in item.strategyList"
											:key="items.id"
											:label="items.strategyName"
											:value="items.strategyName"
											@click.native="selectstrategyId(items, index)"
										>
										</el-option>
									</el-select>
								</div>
								<div
									class="white-item operating"
									@click="delWhiteList(index * 1)"
								>
									<el-button
										type="danger"
										icon="el-icon-delete"
										circle
									></el-button>
								</div>
							</div>
						</template>
					</el-form>
				</div>
			</el-row>
			<el-row class="addButton"
				><el-button type="primary" @click="addWhiteList"
					>添加白名单</el-button
				></el-row
			>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" :disabled="wdisabled" @click="submit"
					>确 定</el-button
				>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import {
	getExprimentList,
	getStrategyListByExperimentId,
	whiteListSave,
	getWihteListByTestId,
} from '@/api/abTest'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		editRow: {
			type: Object,
			default: () => ({}),
		},
	},
	components: {},
	data() {
		/////////用户id验证规则
		let validateUserId = (rule, value, callback) => {
			if (value == '') {
				callback(new Error('用户ID不能为空'))
				this.validateUserIdPass = false
			} else if (!Number.isInteger(value * 1)) {
				callback(new Error('用户ID请输入数字'))
				this.validateUserIdPass = false
			} else {
				callback()
				this.validateUserIdPass = true
			}
		}

		return {
			validateUserId, /////////用户id验证规则
			validateUserIdPass: true, /////////用户id验证通过
			exprimentList: [], /////////////实验列表
			tableDataForm: { tableData: [] },
			strategyList: [],
			wdisabled: false,
		}
	},

	watch: {
		localVisible(val) {
			//的watch监听-打开白名单
			if (val) {
				this.getWihteList()
			}
		},
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
		//////////点击策略加载
		getStrategyOptions(item, index) {
			if (!item.strategyList) {
				this.getStrategyList(item.experimentId, index)
			}
		},
		//////////实验选中事件
		handleSelect(event, index) {
			this.getStrategyList(event.id, index)
			if (this.tableDataForm.tableData[index].strategyId != '') {
				this.tableDataForm.tableData[index].strategyId = ''
				this.tableDataForm.tableData[index].strategyName = ''
			}
			this.tableDataForm.tableData.sort()
		},
		// //////////策略选中
		selectstrategyId(event, index) {
			this.tableDataForm.tableData[index].strategyId = event.id
		},
		///////////获取策略列表
		getStrategyList: async function (expriId, index) {
			let {
				data: { resultCode, resultData },
			} = await getStrategyListByExperimentId({ experimentId: expriId })
			if (resultCode == 0) {
				let that = this
				this.$nextTick(function () {
					if (that.tableDataForm.tableData[index].experimentId == expriId) {
						that.tableDataForm.tableData[index].strategyList = resultData || []
						that.tableDataForm.tableData.sort()
					}
				})
			}
		},
		///////////获取实验列表
		getExperimentIdList: async function () {
			let {
				data: { resultCode, resultData },
			} = await getExprimentList({
				testId: this.editRow.id,
			})

			if (resultCode == 0) {
				let that = this
				this.$nextTick(function () {
					that.exprimentList = resultData || []
				})
			}
		},
		reset() {
			this.tableDataForm.tableData = []
			this.exprimentList = []
		},
		////////////处理input无法输入的问题
		onInput() {
			this.$forceUpdate()
		},
		/////////获取白名单列表
		async getWihteList() {
			this.getExperimentIdList()
			let {
				data: { resultCode, resultData },
			} = await getWihteListByTestId({
				testId: this.editRow.id,
			})
			if (resultCode == 0) {
				this.tableDataForm.tableData = Array.isArray(resultData)
					? resultData
					: []
			}
		},
		////////添加白名单
		addWhiteList() {
			let addJson = {
				experimentId: '',
				id: '',
				strategyId: '',
				testId: this.editRow.id,
				userId: '',
			}
			this.exprimentList.id = []
			this.tableDataForm.tableData.push(addJson)
		},
		////////删除白名单
		delWhiteList(key) {
			this.tableDataForm.tableData.splice(key, 1)
		},
		////////////提交
		async submit() {
			let that = this
			if (this.checkData()) {
				this.wdisabled = true
				let par = {}

				par.list = this.tableDataForm.tableData
				// par.list.map((oj) => {
				// 	delete oj.strategyName
				// })
				let result = {}
				try {
					result = await whiteListSave(par)
				} catch {
					this.wdisabled = false
				}

				if (result.data && result.data.resultCode == 0) {
					this.$message({
						message: '添加成功',
						type: 'success',
					})
					setTimeout(() => {
						this.wdisabled = false
						that.resetForm()
					}, 800)
				} else {
					this.wdisabled = false
				}
			}
		},
		///////////////验证
		checkData() {
			let that = this
			if (this.tableDataForm.tableData.length == 0) {
				this.$message({
					message: '请先添加白名单',
					type: 'warning',
				})
				return false
			}
			let useridArray = this.tableDataForm.tableData.map((oj) => {
				if (Number.isInteger(oj.userId * 1)) {
					return oj.userId
				}
			})
			return this.tableDataForm.tableData.every((val, index) => {
				if (val.userId == '') {
					that.$message({
						message: '第' + (index + 1) + '行的用户id必选项',
						type: 'error',
					})
					return false
				} else if (val.userId.length >= 16) {
					that.$message({
						message: '第' + (index + 1) + '行的用户id长度不能超过15位',
						type: 'error',
					})
					return false
				} else if (val.experimentId == '') {
					that.$message({
						message: '第' + (index + 1) + '行的实验为必选项',
						type: 'error',
					})
					return false
				} else if (val.strategyId == '') {
					that.$message({
						message: '第' + (index + 1) + '行的策略为必选项',
						type: 'error',
					})
					return false
				} else {
					let arr = new Set(useridArray)
					if (!that.validateUserIdPass) {
						that.$message({
							message: '用户ID没有通过验证',
							type: 'error',
						})
						return false
					} else if (arr.size != useridArray.length) {
						that.$message({
							message: '重复的用户ID',
							type: 'warning',
						})
						return false
					} else {
						return true
					}
				}
			})
			//return true
		},

		// 关闭弹窗
		resetForm() {
			this.wdisabled = false
			this.localVisible = false //////////重置
			this.reset()
		},
	},
}
</script>

<style lang="scss" scoped>
.addButton {
	padding: 10px 0 10px 10px;
}
.dialog-cont {
	border-top: 1px solid #eee;
}
.dialog-footer {
	border-top: 1px solid #eee;
	padding: 10px;
	text-align: right;
}
.white-list-box {
	width: 100%;

	.white-list-header,
	.white-list-cont {
		padding: 0px 0 10px 0;
		display: flex;
		justify-content: center;
		align-items: center;
		.white-item {
			width: 25%;
			flex: auto;
			text-align: left;
			padding: 0 10px;
			.el-form-item {
				margin-bottom: 0;
			}
		}
		.tw {
			font-weight: bold;
		}
		.operating {
			width: 18px;
		}
	}
	.white-list-cont {
		padding: 0px 0 21px 0;
	}
}
</style>
