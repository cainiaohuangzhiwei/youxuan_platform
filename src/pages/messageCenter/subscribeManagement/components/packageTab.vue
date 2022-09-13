<template>
	<div class="package">
		<basicContainer>
			<div class="bak">
				<div class="text">
					该列表只记录无指定内容、推送时间的订阅数据，不包含明确内容与推送场景的订阅
				</div>
			</div>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns105"
				:data="tableData105"
				:pagination="page"
			>
				<template slot="templateContent" slot-scope="scope">
					<div class="font">{{ scope.row.templateName }}</div>
					<div
						class="opacity"
						v-for="(item, index) in scope.row.templateContentJson"
						:key="index"
					>
						{{ item.content }}
					</div>
				</template>
				<!-- <template slot="action" slot-scope="scope">
					<el-link
						v-if="scope.row.allSubscribeCount"
						type="primary"
						@click="createTask"
						>创建任务</el-link
					>
					<div v-else>创建任务</div>
				</template> -->
			</yx-table>
			<edit-dialog
				ref="mall"
				title="创建推送任务"
				:visible.sync="pushDialog"
				:createTaskShow.sync="createTaskShow"
				@fatherMethod="fatherMethod"
				:forbiddenShow.sync="forbiddenShow"
				:itemInfo.sync="editItem"
			/>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import EditDialog from './EditDialog'
import { subscribeCountPage } from '@/api/messageCenter'

export default {
	// props: {
	// 	activeName: {
	// 		type: String,
	// 		default: '',
	// 	},
	// },
	components: {
		BasicContainer,
		YxTable,
		EditDialog,
	},
	data() {
		return {
			pushDialog: false,
			createTaskShow: false,
			forbiddenShow: false,
			editItem: {},
			tableData105: [],
			tableColumns105: [
				{
					type: 'string',
					dataIndex: 'templateId',
					title: '模板id',
				},
				{
					type: 'custom',
					dataIndex: 'templateContent',
					title: '模板内容',
				},
				{
					type: 'string',
					dataIndex: 'remainSubscribeCount',
					title: '剩余订阅总次数/总人数',
					customRender: (row) => {
						return row.totalTimes + '次/' + row.totalPerson + '人'
					},
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '推送任务',
							click: (row) => {
								// 兼容旧版本数据
								const getPushTaskData = {
									...row,
									templateSn: row.templateId,
								}
								this.component(getPushTaskData)
							},
						},
					],
				},
				// {
				// 	type: 'custom',
				// 	dataIndex: 'action',
				// 	title: '操作',
				// },
			],
			page: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.init()
				},
			},
		}
	},
	created() {
		this.init()
	},

	methods: {
		component(row) {
			this.$emit('componentRow', row)
		},
		// 子组件调用父组件会场列表方法更新
		fatherMethod() {
			this.init()
		},
		createTask() {
			this.forbiddenShow = false
			this.pushDialog = true
			this.createTaskShow = true
		},
		async init() {
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await subscribeCountPage(this.findSearchParams())
			if (resultCode == 0) {
				const resultArray = resultData.map((item) => {
					return {
						...item,
						templateContentJson: JSON.parse(item.templateParam || '[]'),
					}
				})
				this.tableData105 = resultArray
			} else {
				this.tableData105 = []
			}
			this.loading = false
		},
		// 搜索条件
		findSearchParams(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page.currentPage = 1
			}
			const paramJson = {
				pageSize: this.page.length,
				pageNum: this.page.currentPage,
			}
			return paramJson
		},
	},
}
</script>
<style lang="scss" scoped>
.bak {
	margin-bottom: 20px;
	width: 100%;
	height: 60px;
	background: #202d3d;
}
.text {
	color: #fff;
	position: absolute;
	margin-top: 20px;
	margin-left: 30%;
	opacity: 0.8;
}
.font {
	font-size: 15px;
}
.opacity {
	opacity: 0.8;
}
</style>
