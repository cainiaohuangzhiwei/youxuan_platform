<!--
 * @Description: i
 * @Author: liqianwei
 * @Email: liqianwei@weeget.cn
 * @Date: 2021-01-08 14:05:15
 * @LastEditTime: 2021-01-13 14:28:02
 * @LastEditors: liqianwei
-->
<template>
	<div>
		<!-- 商品货号查询 -->
		<yx-form ref="formTwo" :inline="true" :data="searchData" :items="searchCfg">
		</yx-form>
		<p class="goods__no" v-if="notGoodsNumber.length">
			以下货号搜索找不到对应商品：
			<span class="attribute">{{ notGoodsNumber.join('，') }}</span>
		</p>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'

export default {
	props: {
		notGoodsNumber: {
			type: Array,
			default: () => [],
		},
	},
	components: {
		YxForm,
	},
	name: 'FormTable',

	data() {
		return {
			searchCfg: [
				{
					title: '商品货号',
					type: 'textarea',
					dataIndex: 'keyword',
					placeholder: '请输入货号搜索,货号与货号之间使用逗号隔开或者换行',
				},
			],
			searchData: {
				keyword: '', // 商品货号
			},
		}
	},

	methods: {
		// 处理货号参数
		handleNoParams() {
			const searchData = JSON.parse(JSON.stringify(this.searchData))
			searchData.keyword = searchData.keyword.replace(/\n/g, ',')
			searchData.keyword = searchData.keyword.replace(/\s*/g, '') //商品货号
			// const goodsNumberLength = searchData.keyword.match(/,|，/g)

			// if (type === 1 && goodsNumberLength && goodsNumberLength.length > 500) {
			// 	return this.$message.warning('货号长度最多支持500个货号搜索')
			// }
			return searchData
		},
	},
}
</script>

<style lang="scss" scope></style>
