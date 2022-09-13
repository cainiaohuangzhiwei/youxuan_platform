<template>
	<el-descriptions :title="tableTitle">
		<template slot="extra">
			<el-popover placement="bottom-end" width="200" trigger="click">
				<el-row type="flex" justify="space-between" align="middle">
					<el-checkbox
						v-model="tableColumnsChecked"
						:indeterminate="tableColumnsIsIndeterminate"
						@change="handleCheckAllTableColumnsChange"
						>全选</el-checkbox
					>
					<el-button type="text" @click="resetColumns">重置</el-button>
				</el-row>
				<el-checkbox-group
					v-model="tableColumnsSet"
					@change="handleCheckedTableColumnsChange"
				>
					<el-row v-for="item in defaultTableColumns" :key="item.dataIndex">
						<el-checkbox :label="item.dataIndex">{{ item.title }}</el-checkbox>
					</el-row>
				</el-checkbox-group>
				<div slot="reference">
					<i class="wg-font-18 pointer el-icon-setting"></i>
				</div>
			</el-popover>
		</template>
	</el-descriptions>
</template>

<script>
export default {
	props: {
		// 处理后设置的表格列数据
		tableColumns: {
			type: Array,
			default: () => [],
		},
		// 缓存Key
		tableStorageKey: {
			type: String,
			default: '',
		},
		// 左侧标题
		tableTitle: {
			type: String,
			default: '列表',
		},
	},
	created() {
		// console.log('this.tableColumns', this.tableColumns)
		this.defaultTableColumns = [].concat(this.tableColumns)
		// console.log('this.defaultTableColumns', this.defaultTableColumns)
		// 初始化
		this.initTableColumns()
	},
	data() {
		return {
			// 表格列设置
			tableColumnsSet: [],
			// 默认表格列数据
			defaultTableColumns: [],
			// 全选标记
			tableColumnsChecked: false,
			tableColumnsIsIndeterminate: true,
		}
	},
	methods: {
		initTableColumns() {
			if (!this.tableStorageKey) return
			// 获取缓存的列设置
			let tableColumnsStorage
			let defaultTableColumnsStorage
			try {
				tableColumnsStorage =
					localStorage[
						this.tableStorageKey + this.$store.state.user.userInfo.userId
					]
				defaultTableColumnsStorage =
					localStorage[
						'default' +
							this.tableStorageKey +
							this.$store.state.user.userInfo.userId
					]
			} catch (error) {
				tableColumnsStorage = ''
				defaultTableColumnsStorage = ''
			}
			// 对比缓存的默认表格列设置，有差异则重置
			if (defaultTableColumnsStorage) {
				let defaultTableColumnsStorageList = JSON.parse(
					defaultTableColumnsStorage
				)
				let difference = this.defaultTableColumns.filter((item) => {
					return defaultTableColumnsStorageList.indexOf(item.dataIndex) == -1
				})
				if (
					difference.length ||
					defaultTableColumnsStorageList.length !=
						this.defaultTableColumns.length
				) {
					tableColumnsStorage = ''
				}
			}
			// 有本地缓存
			if (tableColumnsStorage) {
				this.tableColumnsSet = JSON.parse(tableColumnsStorage)
				this.tableColumns = this.defaultTableColumns.filter((item) => {
					return this.tableColumnsSet.indexOf(item.dataIndex) > -1
				})
			} else {
				// 无缓存复制默认表格列数据
				this.tableColumns = [].concat(this.defaultTableColumns)
				this.tableColumnsSet = this.defaultTableColumns.map((item) => {
					return item.dataIndex
				})
				localStorage[
					this.tableStorageKey + this.$store.state.user.userInfo.userId
				] = JSON.stringify(this.tableColumnsSet)
				localStorage[
					'default' +
						this.tableStorageKey +
						this.$store.state.user.userInfo.userId
				] = JSON.stringify(this.tableColumnsSet)
			}
			this.tableColumnsChecked =
				this.tableColumnsSet.length == this.defaultTableColumns.length
			this.tableColumnsIsIndeterminate =
				this.tableColumnsSet.length > 0 &&
				this.tableColumnsSet.length < this.defaultTableColumns.length
			// console.log('this.tableColumns', this.tableColumns)
			this.$emit('update:tableColumns', this.tableColumns)
		},
		// 全选设置列表列
		handleCheckAllTableColumnsChange(val) {
			this.tableColumnsSet = val
				? this.defaultTableColumns.map((item) => {
						return item.dataIndex
				  })
				: []
			this.tableColumnsIsIndeterminate = false
			localStorage[
				this.tableStorageKey + this.$store.state.user.userInfo.userId
			] = JSON.stringify(this.tableColumnsSet)
			this.initTableColumns()
		},
		// 单选设置列表列
		handleCheckedTableColumnsChange(valArr) {
			let checkedCount = valArr.length
			this.tableColumnsSet = checkedCount
				? this.defaultTableColumns
						.map((item) => {
							return item.dataIndex
						})
						.filter((item) => {
							return valArr.indexOf(item) > -1
						})
				: []
			this.tableColumnsChecked = checkedCount == this.defaultTableColumns.length
			this.tableColumnsIsIndeterminate =
				checkedCount > 0 && checkedCount < this.defaultTableColumns.length
			localStorage[
				this.tableStorageKey + this.$store.state.user.userInfo.userId
			] = JSON.stringify(this.tableColumnsSet)
			this.initTableColumns()
		},
		// 重置设置列表列
		resetColumns() {
			localStorage[
				this.tableStorageKey + this.$store.state.user.userInfo.userId
			] = ''
			this.initTableColumns()
		},
	},
}
</script>
