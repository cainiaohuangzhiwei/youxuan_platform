<template>
	<div class="operatingRecordOld">
		<basicContainer>
			<yx-form
				:inline="true"
				:data="formData103"
				:items="formCfg103"
				:formAction="formAction103"
			>
				<template slot="objects">
					<div>
						<el-select
							clearable
							v-model="formData103.objects"
							filterable
							remote
							reserve-keyword
							:remote-method="_findObjects"
							:loading="loadingObjects"
							@focus="_findObjects('')"
						>
							<el-option
								v-for="item in objectList"
								:key="item"
								:label="item"
								:value="item"
							>
							</el-option>
						</el-select>
					</div>
				</template>
			</yx-form>
			<yx-table
				:select="false"
				v-loading="loading"
				:columns="tableColumns104"
				:pagination="page104"
				:data="tableData104"
			></yx-table>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxForm from '@wg-vue-materials/yx-form'
import YxTable from '@wg-vue-materials/yx-table'
import moment from 'moment'
import { operationalLogsList, findObjects } from '@/api/yhtPlusOperationalLogs'

export default {
	components: {
		BasicContainer,
		YxForm,
		YxTable,
	},
	props: [],
	data() {
		return {
			loading: false,
			loadingObjects: false,
			objectList: [],
			formData103: {
				userName: '',
				objects: '',
				event: '',
				startTime: moment().startOf('month').valueOf(),
				endTime: moment().endOf('month').valueOf(),
			},
			formCfg103: [
				{
					type: 'input',
					title: '操作人',
					dataIndex: 'userName',
					placeholder: '请输入操作人',
				},
				{
					type: 'custom',
					title: '操作对象',
					dataIndex: 'objects',
				},
				{
					type: 'input',
					title: '操作事件',
					dataIndex: 'event',
					placeholder: '请输入操作事件',
				},
				{
					type: 'datetimerange',
					title: '操作时间',
					dataIndex: ['startTime', 'endTime'],
					placeholder: ['请选择开始时间', '请选择结束时间'],
				},
			],
			formAction103: [
				{
					title: '重置',
					auth: '',
					isClear: true,
				},
				{
					title: '查询',
					type: 'primary',
					auth: '',
					click: () => {
						if (!this.loading) this.getData104(true)
					},
					tableId: 104,
				},
			],
			tableData104: [],
			tableColumns104: [
				{
					type: 'string',
					dataIndex: 'userName',
					title: '操作人',
				},
				{
					type: 'date',
					dataIndex: 'addTime',
					title: '操作时间',
				},
				{
					type: 'string',
					dataIndex: 'objects',
					title: '操作对象',
				},
				{
					type: 'string',
					dataIndex: 'event',
					title: '操作事件',
				},
			],
			page104: {
				count: 0,
				length: 10,
				currentPage: 1,
				tableChange: () => {
					this.getData104()
				},
			},
		}
	},

	created() {
		this.getData104(true)
		this._findObjects()
	},

	methods: {
		// 获取事件名称
		async _findObjects(query = '') {
			this.loadingObjects = true
			let {
				data: { resultCode, resultData },
			} = await findObjects({
				startIndex: 0,
				length: 20,
				objects: query,
			})
			this.loadingObjects = false
			if (resultCode == 0) {
				this.objectList = resultData.objectList
			} else {
				this.objectList = []
			}
		},
		async getData104(flag) {
			this.loading = true
			let paramJson = this.findSearchParams104(flag)
			const {
				data: { resultCode, resultData },
			} = await operationalLogsList(paramJson)
			if (resultCode == 0) {
				this.tableData104 = resultData.operationalLogList
				this.page104.count = resultData.count
			} else {
				this.tableData104 = []
				this.page104.count = 0
			}
			this.loading = false
		},
		findSearchParams104(flag) {
			// 当前页的条数开始
			if (flag) {
				this.page104.currentPage = 1
			}
			const paramJson = Object.assign(this.formData103, {
				length: this.page104.length,
				startIndex: (this.page104.currentPage - 1) * this.page104.length,
			})
			return paramJson
		},
	},
}
</script>
