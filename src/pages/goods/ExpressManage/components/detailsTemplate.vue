<template>
	<div>
		<el-form
			ref="settingTemplateForm"
			:model="form"
			size="mini"
			label-width="85px"
			v-loading="loading"
		>
			<el-form-item label="商家名称:" prop="supplierName">
				{{ supplierName }}
			</el-form-item>
			<el-form-item label="模板名称:" prop="templateName">
				{{ form.templateName }}
			</el-form-item>
			<el-form-item label="计价方式:">
				<el-radio-group v-model="form.calPattern">
					<el-radio :label="1">按件</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="运送方式:">
				<p style="color: #999">指定偏远地区，附加运费后可完成发货</p>
				<div>
					<div>
						<el-table
							:data="form.templateConfig.areaConfig"
							:border="true"
							:header-cell-style="{ background: '#F3F4F7' }"
							style="width: 100%"
							size="mini"
							class="tableBox"
							v-if="form.templateConfig.areaConfig.length > 0"
						>
							<el-table-column label="运送到">
								<template slot-scope="scope">
									{{
										scope.row.areaDelivery &&
										scope.row.areaDelivery.areaDeliveryDetailName
											? scope.row.areaDelivery.areaDeliveryDetailName
											: '未添加地区'
									}}
								</template>
							</el-table-column>
							<el-table-column label="首件数（件）" width="96">
								<template slot-scope="scope">
									{{ scope.row.firstItem }}
								</template>
							</el-table-column>
							<el-table-column label="首费（元）" width="110">
								<template slot-scope="scope">
									{{ scope.row.firstFee }}
								</template>
							</el-table-column>
							<el-table-column label="续件数（件）" width="100">
								<template slot-scope="scope">
									{{ scope.row.contItem }}
								</template>
							</el-table-column>
							<el-table-column label="续费（元）" width="110">
								<template slot-scope="scope">
									{{ scope.row.contFee }}
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div></div>
				</div>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import { getFeeTemplateDetail } from '@/api/yhtPlusCmsSupplierExpressTemplate'
export default {
	props: {
		templateId: {
			type: Number,
			default: 0,
		},
		supplierName: {
			type: String,
			default: '',
		},
	},
	watch: {
		templateId: {
			handler(val) {
				if (val) {
					this._getFeeTemplateDetail(val)
				} else {
					this.form = {
						templateId: '',
						templateName: '',
						calPattern: 1,
						templateConfig: {
							defaultConfig: {},
							areaConfig: [],
						},
						noAreaDelivery: {},
					}
				}
			},
			deep: true,
		},
	},
	data() {
		return {
			loading: false,
			form: {
				templateId: '',
				templateName: '',
				calPattern: 1,
				templateConfig: {
					defaultConfig: {},
					areaConfig: [],
				},
				noAreaDelivery: {},
			},
			showDestinationModel: false,
			defaultProps: {
				label: 'areaName',
				children: 'childAreaList',
			},
			defaultCheckedKeys: [],
			tree: [],
		}
	},

	created() {
		if (this.templateId) {
			this._getFeeTemplateDetail(this.templateId)
		}
	},
	methods: {
		async _getFeeTemplateDetail() {
			this.loading = true
			const {
				data: { resultCode, resultData = {} },
			} = await getFeeTemplateDetail({ templateId: this.templateId })
			this.loading = false
			if (resultCode == 0 && resultData) {
				this.form = resultData
			} else {
				this.form = {
					templateId: '',
					templateName: '',
					calPattern: 1,
					templateConfig: {
						defaultConfig: {},
						areaConfig: [],
					},
					noAreaDelivery: {},
				}
			}
			this.form.calPattern = 1
		},
	},
}
</script>

<style lang="scss" scoped>
.tableBox,
.default-setting .el-form-item__content {
	line-height: 24px;
}
.default-setting .el-form-item--mini.el-form-item,
.default-setting .el-form-item--small.el-form-item {
	margin-bottom: 0;
}
.tableBox .el-form-item--mini.el-form-item,
.tableBox .el-form-item--small.el-form-item {
	font-size: 12px;
	line-height: 23px;
	margin-bottom: 14px;
}
.tableBox .el-form-item--mini .el-form-item__content,
.tableBox .el-form-item--mini .el-form-item__label {
	font-size: 12px;
	line-height: 23px;
}
.default-setting {
	display: flex;
	justify-content: space-around;
	background: #f3f4f7;
	padding: 10px 10px 16px 10px;
}
.default_freight {
	display: inline-block;
	box-sizing: border-box;
	width: 40px;
	margin: 0 10px;
	border-bottom: 1px solid #333;
	overflow: hidden;
	text-align: center;
}
</style>
