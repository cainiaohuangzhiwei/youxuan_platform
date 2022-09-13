<template>
	<div class="select-skip-type">
		<yx-form
			:inline="true"
			:data="formData"
			:items="formCfg"
			labelPosition="right"
			labelWidth="110px"
			:formDisabled="formDisabled"
		>
		</yx-form>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'

export default {
	name: 'SelectSkipType',

	props: {
		// 弹框开关
		defaultValue: {
			type: Object,
			default: () => {},
		},
		formDisabled: {
			type: Boolean,
			default: false,
		},
	},

	watch: {
		defaultValue(val) {
			this.formData = {
				skipType: val?.skipType || '',
				areaName: val?.areaName || '',
				skipUrl: val?.skipUrl || '',
				skipDesc: val?.skipDesc || '',
				appUrl: val?.appUrl || '',
				appRouterName: val?.appRouterName || '',
			}
			this.optionsControl(val?.skipType)
		},
		formData: {
			immediate: true,
			deep: true,
			handler(newValue) {
				this.$emit('onChange', newValue)
			},
		},
	},

	components: {
		YxForm,
	},

	data() {
		return {
			formData: {
				skipType: '',
				areaName: '',
				skipUrl: '',
				skipDesc: '',
				appUrl: '',
				appRouterName: '',
			},
			formCfg: [
				{
					type: 'select',
					title: '跳转类型',
					dataIndex: 'skipType',
					placeholder: '请选择跳转类型',
					label: 'value',
					change: (val) => {
						this.handleSelectChange(val)
					},
					options: this.$store.state.app.constant.ATTRMAP,
				},
			],
			optionsMap: [
				{
					type: 'input',
					title: '埋点名',
					dataIndex: 'areaName',
					placeholder: '请输入埋点名',
					hide: true,
				},
				{
					type: 'input',
					title: '分组ID',
					dataIndex: 'skipUrl',
					placeholder: '请输入分组ID',
					hide: true,
				},
				{
					type: 'input',
					title: '商品ID',
					dataIndex: 'skipDesc',
					placeholder: '请输入商品ID',
					hide: true,
				},
				{
					type: 'input',
					title: '活动配置ID',
					dataIndex: 'skipUrl',
					placeholder: '请输入活动配置ID',
					hide: true,
				},
				{
					type: 'input',
					title: 'H5地址',
					dataIndex: 'skipUrl',
					placeholder: '请输入H5地址',
					hide: true,
				},
				{
					type: 'input',
					title: '多件促销ID',
					dataIndex: 'skipUrl',
					placeholder: '请输入多件促销ID',
					hide: true,
				},
				{
					type: 'input',
					title: '营销活动ID',
					dataIndex: 'skipUrl',
					placeholder: '请输入营销活动ID',
					hide: true,
				},
				{
					type: 'input',
					title: '自定义/活动配置ID',
					dataIndex: 'skipUrl',
					placeholder: '请输入自定义/活动配置ID',
					hide: true,
				},
				{
					type: 'input',
					title: '小程序页面地址',
					dataIndex: 'skipUrl',
					placeholder: '请输入小程序页面地址',
					hide: true,
				},
				{
					type: 'input',
					title: 'APP-H5地址',
					dataIndex: 'appUrl',
					placeholder: '请输入APP-H5地址',
					hide: true,
				},
				{
					type: 'input',
					title: 'APP原生页面',
					dataIndex: 'appRouterName',
					placeholder: '请输入APP原生页面',
					hide: true,
				},
			],
		}
	},

	methods: {
		handleSelectChange(skipType) {
			this.optionsControl(skipType)
			this.$emit('onChange', this.formData)
		},

		optionsControl(skipType) {
			let optionsList = []

			function getShowResult(type, title) {
				// 领券中心
				if (type === '2') {
					return false
				}
				// 商品详情页
				if (type === '3') {
					return title === '分组ID' || title === '商品ID'
				}
				// 品牌特卖页
				if (type === '4') {
					return title === '分组ID'
				}
				// 小程序/APP
				if (type === '5') {
					return (
						title === '小程序页面地址' ||
						title === 'APP-H5地址' ||
						title === 'APP原生页面'
					)
				}
				// H5页面
				if (type === '6') {
					return title === 'H5地址'
				}
				// 多件促销
				if (type === '7') {
					return title === '多件促销ID'
				}
				// 满折满减/营销活动
				if (type === '8') {
					return title === '营销活动ID'
				}
				// 活动专区
				if (type === '9') {
					return title === '自定义/活动配置ID'
				}
				// 活动页
				if (type === '17') {
					return title === '活动配置ID'
				}
				// 切换首页
				if (type === '18') {
					return false
				}
			}

			// 领券中心
			optionsList = this.optionsMap.map((item) => {
				return {
					...item,
					hide: !getShowResult(skipType, item.title),
				}
			})

			this.formCfg = [
				{
					type: 'select',
					title: '跳转类型',
					dataIndex: 'skipType',
					placeholder: '请选择跳转类型',
					label: 'value',
					change: (val) => {
						this.handleSelectChange(val)
					},
					options: this.$store.state.app.constant.ATTRMAP,
				},
				...optionsList,
			]
		},
	},
}
</script>

<style>
.select-skip-type .el-form-item.el-form-item--small {
	margin: 8px !important;
	max-width: 500px;
}
</style>
