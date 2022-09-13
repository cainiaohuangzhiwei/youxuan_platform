<template>
	<!-- <el-main> -->
	<div>
		<el-table
			ref="YxTable"
			:border="border"
			:row-key="getRowKey"
			:data="data"
			:span-method="spanMethod"
			:highlight-current-row="highlightCcurrentRow"
			:row-class-name="rowClassName"
			:default-expand-all="defaultExpandAll"
			:tree-props="treeProps"
			:filter-method="filterMethod"
			:expand-row-keys="expandRowKeys"
			:reserve-selection="reserveSelection"
			@current-change="changeRow"
			@row-click="rowClick"
			@selection-change="selectionChange"
			:height="height"
		>
			<el-table-column v-if="select" type="selection"></el-table-column>
			<template v-for="(item, index) in columns">
				<template v-if="!item.type || item.type == 'string'">
					<el-table-column
						:key="index"
						v-if="!item.hide"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="item.title"
						:width="item.width"
						:sortable="item.sorter || false"
						:align="item.align || 'left'"
						:render-header="item.renderHeader"
						:header-align="item.headerAlign"
						:formatter="item.customRender ? item.customRender : null"
					>
					</el-table-column>
				</template>
				<template v-if="item.type == 'map'">
					<el-table-column
						:key="index"
						v-if="!item.hide"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="item.title"
						:width="item.width"
						:align="item.align || 'left'"
						:render-header="item.renderHeader"
						:header-align="item.headerAlign"
					>
						<template slot-scope="scope">
							<div :class="item.class">{{ formatterMap(item, scope.row) }}</div>
						</template>
					</el-table-column>
				</template>
				<template v-if="item.type == 'newMap'">
					<el-table-column
						:key="index"
						v-if="!item.hide"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="item.title"
						:width="item.width"
						:align="item.align || 'left'"
						:render-header="item.renderHeader"
						:header-align="item.headerAlign"
					>
						<template slot-scope="scope">
							<div :class="item.class">
								{{ formatterNewMap(item, scope.row) }}
							</div>
						</template>
					</el-table-column>
				</template>
				<!-- 时间类型 -->
				<template v-if="item.type == 'data'">
					<el-table-column
						:key="index"
						v-if="!item.hide"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="item.title"
						:width="item.width"
						:align="item.align || 'left'"
						:header-align="item.headerAlign"
						:render-header="item.renderHeader"
						:formatter="formatterData"
					>
						<template slot-scope="scope">
							<div :class="item.class">
								{{ formatterData(item, scope.row) }}
							</div>
						</template>
					</el-table-column>
				</template>
				<template v-if="item.type == 'date'">
					<el-table-column
						:key="index"
						v-if="!item.hide"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="item.title"
						:width="item.width"
						:align="item.align || 'left'"
						:render-header="item.renderHeader"
						:header-align="item.headerAlign"
						:formatter="formatterData"
					>
						<template slot-scope="scope">
							<div :class="item.class">
								{{ formatterData(item, scope.row) }}
							</div>
						</template>
					</el-table-column>
				</template>
				<!-- 金额 -->
				<template v-if="item.type == 'amount'">
					<el-table-column
						:key="index"
						v-if="!item.hide"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="item.title"
						:width="item.width"
						:align="item.align || 'center'"
						:render-header="item.renderHeader"
						:header-align="item.headerAlign"
						:formatter="formatterData"
					>
						<template slot-scope="scope">
							<div :class="item.class">
								￥{{ getNumberFormat(scope.row, item) }}
							</div>
						</template>
					</el-table-column>
				</template>
				<template v-else-if="item.type == 'image'">
					<el-table-column
						:key="index"
						v-if="!item.hide"
						:fixed="item.fixed"
						:label="item.title"
						:width="item.width"
						:align="item.align || 'left'"
						:render-header="item.renderHeader"
						:header-align="item.headerAlign"
					>
						<template slot-scope="scope">
							<el-image
								:class="item.class || 'c_image'"
								fit="cover"
								:src="scope.row[item.dataIndex]"
								:preview-src-list="[scope.row[item.dataIndex]]"
							>
								<div slot="error" class="image-slot">
									<i class="el-icon-picture-outline"></i>
								</div>
							</el-image>
						</template>
					</el-table-column>
				</template>
				<template v-else-if="item.type == 'action'">
					<el-table-column
						:key="index"
						v-if="!item.hide"
						:fixed="item.fixed"
						:label="item.title"
						:width="item.width"
						:align="item.align || 'left'"
						:render-header="item.renderHeader"
						:header-align="item.headerAlign"
					>
						<template slot-scope="scope">
							<template v-for="(action, actionIndex) in item.actions">
								<el-button
									v-if="
										!getAtionFormatter(action, actionIndex, scope.row)
											.popconfirm
									"
									v-auth="
										getAtionFormatter(action, actionIndex, scope.row).auth || ''
									"
									v-show="
										!getAtionFormatter(action, actionIndex, scope.row).hide
									"
									:key="actionIndex"
									:type="
										getAtionFormatter(action, actionIndex, scope.row).type
											? getAtionFormatter(action, actionIndex, scope.row).type
											: 'text'
									"
									size="small"
									@click="itemClick($event, action, scope)"
									>{{ getAtionFormatter(action, actionIndex, scope.row).title }}
								</el-button>
								<el-popconfirm
									v-else
									class="popconfirm-btn"
									:key="actionIndex"
									v-auth="
										getAtionFormatter(action, actionIndex, scope.row).auth || ''
									"
									v-show="
										!getAtionFormatter(action, actionIndex, scope.row).hide
									"
									:confirmButtonText="
										getAtionFormatter(action, actionIndex, scope.row)
											.confirmButtonText
									"
									:confirmButtonType="
										getAtionFormatter(action, actionIndex, scope.row)
											.confirmButtonType
									"
									:cancelButtonText="
										getAtionFormatter(action, actionIndex, scope.row)
											.cancelButtonText
									"
									:cancelButtonType="
										getAtionFormatter(action, actionIndex, scope.row)
											.cancelButtonType
									"
									:icon="getAtionFormatter(action, actionIndex, scope.row).icon"
									:iconColor="
										getAtionFormatter(action, actionIndex, scope.row).iconColor
									"
									:hideIcon="
										getAtionFormatter(action, actionIndex, scope.row).hideIcon
									"
									:title="
										getAtionFormatter(action, actionIndex, scope.row)
											.popconfirmTitle
									"
									@confirm="itemClick($event, action, scope, 'confirm')"
									@cancel="itemClick($event, action, scope, 'cancel')"
								>
									<el-button
										:type="
											getAtionFormatter(action, actionIndex, scope.row).type
												? getAtionFormatter(action, actionIndex, scope.row).type
												: 'text'
										"
										size="small"
										slot="reference"
										>{{
											getAtionFormatter(action, actionIndex, scope.row).title
										}}</el-button
									>
								</el-popconfirm>
							</template>
						</template>
					</el-table-column>
				</template>
				<template v-else-if="item.type == 'custom'">
					<el-table-column
						:key="index"
						v-if="!item.hide"
						:fixed="item.fixed"
						:label="item.title"
						:width="item.width"
						:align="item.align || 'left'"
						:render-header="item.renderHeader"
						:header-align="item.headerAlign"
					>
						<template slot-scope="scope">
							<slot
								:name="item.dataIndex"
								:row="scope.row"
								:index="scope.$index"
							></slot>
						</template>
					</el-table-column>
				</template>
			</template>
		</el-table>
		<template v-if="pagination && pagination.count">
			<el-pagination
				background
				@size-change="sizeChange"
				@current-change="currentChange"
				:current-page="pagination.currentPage"
				:page-sizes="getPageSizes(pagination.pageSizes)"
				:page-size="getpageSize(pagination)"
				layout="total, sizes, prev, pager, next, jumper"
				:total="pagination.count"
			></el-pagination>
		</template>
	</div>
	<!-- </el-main> -->
</template>

<script>
/**
 * @Description: 使用例子 ：
 * <div>
		<yx-table :select="true"
      :columns="tableColumns"
      :selectionChange="selectionChange"
      :pagination="page"
      :data="tableData"></yx-table>
	</div>
 * @property {boolean} select 是否显示勾选列
 * @property {array} items 组件使用数据的配置
 * @property {object} data 组件渲染所使用的数据
 * @property {Function} selectionChange 勾选回调
 * @property {Function} rowClick 行点击回调
 * @property {array} selectedRowKeys 默认选中列
 * @property {object} pagination 分页对象
 *
 */
import moment from 'moment'
export default {
	name: 'yx-table',
	props: {
		rowKey: {
			type: String,
			default: '',
		},
		// 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
		reserveSelection: {
			type: Boolean,
			default: false,
		},
		// 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
		defaultExpandAll: {
			type: Boolean,
			default: false,
		},
		// 渲染嵌套数据的配置选项
		treeProps: {
			type: Object,
			default: () => {},
		},
		// 数据过滤使用的方法，如果是多选的筛选项，对每一条数据会执行多次，任意一次返回 true 就会显示。
		filterMethod: {
			type: Function,
			default: () => {},
		},
		// 行的 className
		rowClassName: {
			type: Function,
			default: () => {},
		},
		select: {
			type: Boolean,
			default: false,
		},
		highlightCcurrentRow: {
			type: Boolean,
			default: false,
		},
		spanMethod: {
			type: Function,
			default: () => {},
		},
		// 可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。
		expandRowKeys: {
			type: Array,
			default: () => [],
		},
		data: {
			type: Array,
			default: () => [],
		},
		columns: {
			type: Array,
			default: () => [],
		},
		selectionChange: {
			type: Function,
			default: () => {},
		},
		changeRow: {
			type: Function,
			default: () => {},
		},
		rowClick: {
			type: Function,
			default: () => {},
		},
		selectedRowKeys: {
			type: Array,
			default: () => [],
		},
		pagination: {
			type: Object,
			default: () => {},
		},
		currentInfo: {
			type: Object,
			default: () => {},
		},
		height: {
			type: [String, Number, Boolean],
			default: false,
		},
		border: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			currentRow: {},
		}
	},
	created() {
		this.toggleSelectedRowKeys()
	},
	watch: {
		currentInfo() {
			this.$refs.YxTable.setCurrentRow(this.currentInfo)
			this.currentRow = this.currentInfo
		},
		selectedRowKeys() {
			this.toggleSelectedRowKeys()
		},
	},
	methods: {
		getRowKey() {
			return this.rowKey
		},
		/**
		 *  金额处理方法
		 *
		 * @number 要格式化的数字
		 * @decimals 保留几位小数
		 * @dec_point 小数点符号
		 * @thousands_sep 千分位符号
		 * @roundtag 舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
		 *
		 *  @return 返回视图标题
		 */
		numberFormat(number, decimals, dec_point, thousands_sep, roundtag) {
			/*
			 * 参数说明：
			 * number：要格式化的数字
			 * decimals：保留几位小数
			 * dec_point：小数点符号
			 * thousands_sep：千分位符号
			 * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
			 * */
			number = (number + '').replace(/[^0-9+-Ee.]/g, '')
			roundtag = roundtag || 'floor' //"ceil","floor","round"
			let n = !isFinite(+number) ? 0 : +number,
				prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
				sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
				dec = typeof dec_point === 'undefined' ? '.' : dec_point,
				s = '',
				toFixedFix = function (ns, precs) {
					let k = Math.pow(10, prec)

					return (
						'' +
						parseFloat(
							Math[roundtag](parseFloat((ns * k).toFixed(precs * 2))).toFixed(
								precs * 2
							)
						) /
							k
					)
				}
			s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
			let re = /(-?\d+)(\d{3})/
			while (re.test(s[0])) {
				s[0] = s[0].replace(re, '$1' + sep + '$2')
			}

			if ((s[1] || '').length < prec) {
				s[1] = s[1] || ''
				s[1] += new Array(prec - s[1].length + 1).join('0')
			}
			return s.join(dec)
		},
		getNumberFormat(row, item) {
			let {
				decimals = 2,
				decPoint = '.',
				thousandsSep = ',',
				roundtag = 'floor',
			} = item
			return this.numberFormat(
				row[item.dataIndex],
				decimals,
				decPoint,
				thousandsSep,
				roundtag
			)
		},
		getCopyFormatter(action, row) {
			if (action.copyFormatter) {
				return action.copyFormatter(row)
			}
		},
		onCopyClick(action, row) {
			/** 复制粘贴点击事件 **/
			let copyStr = this.getCopyFormatter(action, row)
			if (!copyStr) {
				this.$message.error('复制失败')
			}
			if (action.click) {
				action.click(row)
			}
		},
		onCopyError(event, action, row) {
			/** 复制粘贴-失败 **/
			// console.log('复制失败', event)
			this.$message.error('复制失败')
			if (action.copyError) {
				action.copyError(event, row)
			}
		},
		onCopySuccess(event, action, row) {
			/** 复制粘贴-成功 **/
			// console.log('复制成功', event)
			this.$message.success('复制成功')
			if (action.copySuccess) {
				action.copySuccess(event, row)
			}
		},
		formatterNewMap(item, row) {
			const map = new Map(item.options)
			let key = row[item.dataIndex]
			if (Number.isInteger(key)) {
				key = key.toString()
			}
			if (!map.get(key)) {
				return '-'
			}
			return map.get(key)
		},
		formatterMap(item, row) {
			for (let key in item.options) {
				if (item.options[key] == row[item.dataIndex]) {
					return key
				}
			}
			return item.options[row[item.dataIndex]]
		},
		formatterData(item, row) {
			let format = item.format ? item.format : 'YYYY-MM-DD HH:mm:ss'
			return row[item.dataIndex]
				? moment(row[item.dataIndex]).format(format)
				: '-'
		},
		toggleSelectedRowKeys() {
			this.$nextTick(() => {
				if (this.selectedRowKeys && this.selectedRowKeys.length) {
					this.selectedRowKeys.forEach((row) => {
						this.$refs.YxTable.toggleRowSelection(row)
					})
				}
			})
		},
		itemClick(e, action, scope, Events) {
			let { row, $index } = scope
			if (action.click && !action.popconfirm) {
				action.click(row, e, $index)
			} else if (action.popconfirm && action[Events]) {
				action.popconfirm && action[Events](row, e, $index)
			}
		},
		getAtionFormatter(action, actionIndex, row) {
			if (action.customRender) {
				let newAction = action.customRender(Object.assign({}, action), row)
				if (newAction) {
					if (!newAction.hide) {
						action.hide = false
					} else {
						action.hide = true
					}
				}
				return newAction
			}
			return action
		},
		getpageSize(data) {
			/** 获取没也长度 **/
			let sizeArr = this.getPageSizes(data.pageSizes)
			if (data.length) {
				let isHas = false
				sizeArr.map((item) => {
					if (data.length === item) {
						isHas = true
					}
				})
				if (isHas) {
					return data.length
				}
			}
			return sizeArr[0]
		},
		getPageSizes(data) {
			/** 页码类型 **/
			let sizes = [10, 30, 50, 100]
			if (
				data &&
				Object.prototype.toString.call(data) === '[object Array]' &&
				data.length > 0
			) {
				return data
			} else {
				return sizes
			}
		},
		sizeChange(data) {
			/** 页码长度变化回调 **/
			this.pagination.length = data
			if (this.pagination.tableChange) {
				this.pagination.tableChange()
			}
		},
		currentChange(data) {
			/** 选中页码下标变化回调 **/
			this.pagination.currentPage = data
			if (this.pagination.tableChange) {
				this.pagination.tableChange()
				this.$nextTick(() => {
					this.$refs.YxTable.bodyWrapper.scrollTop = 0
				})
			}
		},
	},
}
</script>

<style scoped>
.el-pagination {
	padding: 22px 10px;
	text-align: center;
}
.popconfirm-btn {
	margin-left: 10px;
}
.c_image {
	width: 120px;
	height: auto;
}
</style>
