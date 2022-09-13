<template>
	<div class="charttest">
		<div class="echarts-dom" :id="echartsId"></div>
		<div class="action-box" v-if="myTreeDatas.length > 0">
			<el-button
				type="primary"
				icon="el-icon-arrow-left"
				circle
				@click="actionTypeClick('up')"
			></el-button>
			<el-button type="primary" round @click="actionTypeClick('root')"
				>{{ selectNodeOrgId }}查询该节点</el-button
			>
			<el-button
				type="primary"
				icon="el-icon-arrow-right"
				circle
				@click="actionTypeClick('down')"
			></el-button>
		</div>
	</div>
</template>

<script>
import * as echarts from 'echarts'
import { debounce } from 'lodash'
import { getLastMonthOrganization } from '@/api/ka'
export default {
	name: 'echartsTree',
	props: {
		treeDatas: {
			type: Object,
			default: () => ({}),
		},
		formData: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			flag: false,
			clickExpandable: 1,
			map: {},
			chart: null,
			myTreeDatas: [], // 树形图数据
			idNodesChainKeys: {}, // 树型图子项一维关系链
			selectNodeData: '', // 当前选中节点数据
			oldSelectNodeData: '', // 上一次选中对象
			backgroundColorMap: {
				// 背景框等级颜色配置表
				1: '#0c5ea9', // "深蓝色"
				2: '#d2e4ff', // "浅蓝色"
				3: '#fbed26', // "黄色"
				4: '#FF0080', // "粉色"
				5: '#f3f3f1', // "白色"
				6: '#FFEEE2', // "白色"
				7: '#DDDDDD', // "灰色"
				8: '#FFF7D4', // "金色"
			},
			fontColorMap: {
				// 背景框等级颜色配置表
				1: '#FFFFFF', // "白色"
				2: '#7babf2', // "浅蓝色"
				3: '#000000', // "黑色"
				4: '#FFFFFF', // "粉色"
				5: '#000000', // "黑色"
				6: '#C26F47', // "白色"
				7: '#666666', // "灰色"
				8: '#D99306', // "金色"
			},
		}
	},
	watch: {
		//观察option的变化
		treeDatas() {
			if (this.chart) {
				// this.selectNodeData = ''
				let option = this.setEChartsOption()
				this.chart.clear()
				this.chart.setOption(option)
			}
		},
	},
	computed: {
		echartsId() {
			return 'echarts' + Math.random() * 100000
		},
		/**
		 * 获取选中的节点的店主id
		 */
		selectNodeOrgId() {
			let idStr = ''
			if (this.selectNodeData.organizationId) {
				idStr = '(' + this.selectNodeData.organizationId + ')'
			}
			return idStr
		},
	},
	methods: {
		/**
		 * 初始化图表
		 */
		initEchart() {
			// 初始化图表配置
			let option = this.setEChartsOption()
			this.chart = echarts.init(document.getElementById(this.echartsId))
			this.chart.setOption(option)
			// 监听窗口大小变化
			window.addEventListener(
				'resize',
				debounce(
					() => {
						this.chart.resize()
					},
					1000,
					{
						leading: true,
						trailing: false,
					}
				)
			)
			// 设置点击事件
			this.chart.on('click', (param) => {
				if (typeof param.seriesIndex === 'undefined') {
					return
				}
				this.clickExpandable = param.data.expandable
				console.log('选中节点---', param)
				// 获取当前选中数据
				this.selectNodeData = param.data
				// 更新节点展开项
				this.clickTreeSpreadChange(param)
				// 打开新窗口
				if (!param.data.children && param.data.canDeepSearch == 1) {
					//7.132.0迭代  只展开四层节点，在最后一层节点还有往下钻的节点打开查询
					let nextData = {
						dataTime: this.formData.dataTime,
						organizationId: param.data.organizationId,
						rootOrganizationId: this.formData.organizationId,
						// pageSize: 5,
						// pageNum: 1,
					}
					this.$emit('getData', nextData, 'root')
					// window.open(
					// 	'/yhtplus/egg/statistics/shopFamilyTree?rootOrganizationId=' +
					// 		param.data.organizationId +
					// 		'&currentDepth=1&pageNum=1&dataTime=' +
					// 		this.formData.dataTime +
					// 		'&organizationId=' +
					// 		param.data.organizationId
					// )
				}
			})
		},
		/**
		 * 设置图表配置项
		 */
		setEChartsOption() {
			// 获取树形图数据
			this.formatMapData()
			// 设置树形图配置项
			let option = {
				tooltip: {
					trigger: 'item',
					triggerOn: 'mousemove',
				},
				series: [
					{
						type: 'tree', // 图表类型
						data: this.myTreeDatas, // 图表数据
						left: '-5%', // 间距
						right: '-6%',
						top: '8%',
						bottom: '20%',
						// roam: 'move', // 是否开启鼠标缩放和平移漫游
						symbolSize: 10, // 展开标记大小
						edgeShape: 'polyline', // 直角线
						orient: 'vertical', // 树形图展开方向
						expandAndCollapse: true, // 默认不展开
						select: {
							// 选中样式
							label: {
								backgroundColor: 'yellow',
							},
						},
						label: {
							position: 'bottom', // 文本内容位置
							verticalAlign: 'middle',
							align: 'center', // 内容居中位置
							fontSize: 10, // 字体大小
							lineHeight: 18, // 行高
							backgroundColor: 'white', // 默认背景颜色
							borderWidth: 1, // 边框宽
							borderRadius: 5, // 圆角
							padding: 5, // 边框
							offset: [0, 30], // 文本框偏移
							overflow: 'truncate', // 超出内容省略号展示
							formatter: (param) => {
								let content = ''
								let top = ''
								let organizationName =
									param.data.organizationName.length > 6
										? param.data.organizationName.substring(0, 4) + '...'
										: param.data.organizationName
								let basicLevelNmae =
									param.data.basicLevel == 1
										? '实习店主'
										: param.data.basicLevel == 2
										? '正式店主'
										: param.data.basicLevel == 3
										? '进阶店主'
										: param.data.basicLevel == 4
										? '优秀服务商'
										: '签约服务商'
								if (param?.data?.organizationId) {
									content = `${param.data.organizationId} ${organizationName} ${basicLevelNmae}\n${param.data.commission} ${param.data.saleAmount}【${param.data.formalOrganizationNum} ${param.data.advancedOrganizationNum} ${param.data.legExcellentSignCount} ${param.data.teamExcellentSigncount}】  ${param.data.directlySaleAmount}`
									top = `\n ${'↓   ↓   ↓'}`
								}
								return param.data.canDeepSearch == 1 && param.data.position == 3
									? content + top
									: content
							},
						},
						tooltip: {
							formatter: (param) => {
								let content = ''
								//防止重复调用
								if (param?.data?.organizationId) {
									if (this.flag) {
										return
									}
									this.flag = true //防重复调用加锁
									if (this.map[param?.data?.organizationId] != undefined) {
										//同个值有数据解锁且返回存储的值
										this.flag = false
										return this.map[param?.data?.organizationId]
									} else {
										//获取上月数据
										content = this._queryDownList(param)
									}
								}
								//获取Promise内的值
								content.then((result) => {
									this.map[param?.data?.organizationId] = result
								})
								return this.map[param?.data?.organizationId]
							},
						},
						animationDurationUpdate: 750,
					},
				],
			}
			return option
		},
		//获取上月数据
		async _queryDownList(param) {
			// return new Promise(async (resolve, reject) => {
			let content = ''
			let {
				data: { resultCode, resultData },
			} = await getLastMonthOrganization({
				organizationId: param?.data?.organizationId,
			})
			if (resultCode === 0) {
				if (resultData && resultData.basicLevel) {
					let basicLevelNmae =
						resultData.basicLevel == 1
							? '实习店主'
							: resultData.basicLevel == 2
							? '正式店主'
							: resultData.basicLevel == 3
							? '进阶店主'
							: resultData.basicLevel == 4
							? '优秀服务商'
							: '签约服务商'
					content = `上月级别：${basicLevelNmae}<br>${resultData.commission}，${resultData.saleAmount}【${resultData.formalOrganizationNum} ${resultData.advancedOrganizationNum} ${resultData.legExcellentSignCount} ${resultData.teamExcellentSigncount} 】 ${resultData.directlySaleAmount}`
				} else {
					content = '暂无数据'
				}
			} else {
				content = '暂无数据'
			}
			this.flag = false
			return content
			// resolve(content)
			// })
		},
		actionTypeClick(type) {
			this.$emit(
				'actionTypeClick',
				type,
				this.selectNodeData,
				this.idNodesChainKeys[this.selectNodeData.organizationId],
				this.clickExpandable
			)
		},
		/**
		 * 更新选中节点的下一页数据
		 */
		updataSelectPageNum(pageNum) {
			this.selectNodeData.pageNum = pageNum
		},
		/**
		 * 清除选中状态
		 */
		clearSelectPageParam() {
			this.selectNodeData = ''
			this.oldSelectNodeData = ''
		},
		/**
		 * 图表数据格式化处理
		 */
		formatMapData() {
			// 树形图节点
			let treeNodes = ''

			if (Object.keys(this.treeDatas).length > 0) {
				// 递归处理树型图
				treeNodes = this.recursionTreeNode(
					JSON.parse(JSON.stringify(this.treeDatas)),
					0
				)

				treeNodes = [treeNodes]
				// 展开节点设置
				treeNodes = this.collapsedNodesChange(
					treeNodes,
					this.idNodesChainKeys[this.selectNodeData.organizationId]
				)
			}
			// 更新树形数据
			this.myTreeDatas = treeNodes
		},
		/**
		 * 递归检索树形结果数据
		 * @data {Object} 递归的节点数据
		 * @idNodesChainIndex {String} 节点父级关系链
		 *
		 * @return 树型图数据
		 */
		recursionTreeNode(data, idNodesChainIndex) {
			// 判断是否有子节点数据

			if (data?.kaBoardBOList?.length >= 0) {
				// 递归子节点数据
				data.children = data.kaBoardBOList.map((item, index) => {
					let idNodesChainIndexStr = idNodesChainIndex + ',' + index
					return this.recursionTreeNode(item, idNodesChainIndexStr)
				})
				// 提高节点信息数据
				data.totalPage = data.kaBoardBOList.length // 总页数
				data.currentDepth = data.kaBoardBOList.nodeColorType // 当前层级
			} else {
				// 没有子项数据
				data.totalPage = 0
				data.currentDepth = 0
			}
			// 设置页码, 页码需要自己维护，进行翻页处理
			if (!data.pageNum) {
				data.pageNum = 1
			}

			// 设置节点第一项展开状态 true不展开false展开
			data.collapsed = true

			// 获取店铺id映射关系
			this.idNodesChainKeys[data.organizationId] = idNodesChainIndex + ''
			// 删除子项数据
			delete data.kaBoardBOList
			// 设置文本背景颜色
			data.label = {}
			data.label.backgroundColor = this.backgroundColorMap[data.nodeColorType]
			data.label.color = this.fontColorMap[data.nodeColorType]
			// 边框颜色
			data.label.borderColor = this.backgroundColorMap[data.nodeColorType]
			// 选种边框颜色
			data.emphasis = {
				label: { borderColor: this.fontColorMap[data.nodeColorType] },
			}
			return data
		},
		/**
		 * 节点展开事项
		 */
		clickTreeSpreadChange(param) {
			if (param?.data?.organizationId) {
				// 获取选中节点的父级关系链
				let targetChainIndexStr = this.idNodesChainKeys[
					param.data.organizationId
				]

				// 获取上一次选中节点的父级关系链
				let newChainIndexStr = this.idNodesChainKeys[
					this.oldSelectNodeData.organizationId
				]
				// 判断点击id是否相等，相等则不处理
				// 判断该节点是否还有子项数据 是否可继续展开，1：是；0：否
				if (
					!this.oldSelectNodeData ||
					(newChainIndexStr.indexOf(targetChainIndexStr) != 0 &&
						param.data.totalPage > 0)
				) {
					this.oldSelectNodeData = param.data
					let option = this.setEChartsOption()
					this.chart.clear()
					this.chart.setOption(option)
				}
			}
		},
		/**
		 * 展开节点变更
		 */
		collapsedNodesChange(nodesData, idNodesChainIndexStr) {
			let idNodesChainIndex = 0
			if (idNodesChainIndexStr) {
				let idNodesChainIndexAry = idNodesChainIndexStr.split(',')
				// 获取展开节点下标
				if (idNodesChainIndexAry.length) {
					idNodesChainIndex = idNodesChainIndexAry[0]
				}
				// 删除第一个数据链索引
				let index = idNodesChainIndexStr.indexOf(',')
				if (index != -1) {
					idNodesChainIndexStr = idNodesChainIndexStr.substring(
						index + 1,
						idNodesChainIndexStr.length
					)
				} else {
					idNodesChainIndexStr = ''
				}
			}

			// 默认展开第一列第一项
			nodesData[idNodesChainIndex].collapsed = false
			// 判断是否有下一页数据
			if (nodesData[idNodesChainIndex].totalPage) {
				nodesData[idNodesChainIndex].children = this.collapsedNodesChange(
					nodesData[idNodesChainIndex].children,
					idNodesChainIndexStr
				)
			}
			return nodesData
		},
	},
	/**
	 * 1。最底部的店主只展示等级颜色的一个点
	 */
	mounted() {
		this.$nextTick(() => {
			this.initEchart()
		})
	},
}
</script>

<style lang="scss">
.charttest {
	width: 100%;
	height: 100%;
	position: relative;
}

.echarts-dom {
	width: 100%;
	height: 100%;
}
.action-box {
	position: absolute;
	top: 20px;
	right: 20px;
}
</style>
