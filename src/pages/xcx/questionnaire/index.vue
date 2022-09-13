<template>
	<basicContainer>
		<yx-table
			:select="false"
			v-loading="loading"
			:columns="tableColumnsQuestionnaire"
			:data="questionnaireEntranceList"
		>
			<template slot="queQuestionnaireUrl" slot-scope="scope">
				<el-button
					v-if="scope.row.queQuestionnaireUrl"
					type="text"
					style="white-space: inherit; text-align: left"
					v-clipboard:copy="scope.row.queQuestionnaireUrl"
					v-clipboard:success="onCopy"
					v-clipboard:error="onError"
				>
					{{ scope.row.queQuestionnaireUrl }}
				</el-button>
			</template>
		</yx-table>
		<edit-questionnaire
			:dialogVisible.sync="editVisible"
			:itemInfo="itemInfo"
			@updateList="getQuestionnaireList()"
		/>
	</basicContainer>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import YxTable from '@wg-vue-materials/yx-table'
import editQuestionnaire from './components/editQuestionnaire'
import moment from 'moment'
import Cookies from 'js-cookie'
import { questionnaireEntranceList } from '@/api/questionNaire'

export default {
	components: {
		BasicContainer,
		YxTable,
		editQuestionnaire,
	},
	props: [],
	data() {
		return {
			loading: false,
			questionnaireEntranceList: [],
			tableColumnsQuestionnaire: [
				{
					type: 'string',
					dataIndex: 'id',
					title: '入口ID',
				},
				{
					type: 'string',
					dataIndex: 'entranceName',
					title: '问卷入口',
				},
				{
					type: 'custom',
					dataIndex: 'queQuestionnaireUrl',
					title: '问卷链接',
				},
				{
					type: 'string',
					dataIndex: 'startTime',
					title: '入口有效期',
					customRender: (row) => {
						return (
							moment(row.startTime).format('YYYY-MM-DD HH:mm:ss') +
							' - ' +
							moment(row.endTime).format('YYYY-MM-DD HH:mm:ss')
						)
					},
				},
				{
					type: 'action',
					title: '操作',
					actions: [
						{
							title: '编辑',
							click: (row) => {
								this.editVisible = true
								this.itemInfo = { ...row }
							},
						},
					],
				},
			],
			editVisible: false,
			itemInfo: {},
		}
	},

	created() {
		this.getQuestionnaireList()
	},

	methods: {
		async getQuestionnaireList() {
			this.loading = true
			const {
				data: { resultCode, resultData },
			} = await questionnaireEntranceList()

			this.loading = false
			if (resultCode == 0 && Array.isArray(resultData)) {
				this.questionnaireEntranceList = resultData.map((item) => {
					let queQuestionnaireUrl = ''
					if (item.queQuestionnaireId) {
						queQuestionnaireUrl = `${this.getOrigin()}/yhtplus/H5/customer/pages/questionNaire.html?qId=${
							item.queQuestionnaireId
						}&auth=1&authShop=1`
					}
					item.queQuestionnaireUrl = queQuestionnaireUrl
					return item
				})
			}
		},
		getOrigin() {
			const environment = Cookies.get('environment')
			if (!environment || environment === 'local' || environment === 'daily') {
				return 'https://ali-pressure.yunhuotong.net'
			} else if (environment === 'pre') {
				return 'https://ali-release.yunhuotong.net'
			} else if (environment === 'gray') {
				return 'https://yhtplus-v2.yunhuotong.net'
			} else if (environment === 'prod') {
				return 'https://yhtplus.yunhuotong.net'
			}
		},
	},
}
</script>
