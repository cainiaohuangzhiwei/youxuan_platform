<template>
	<basicContainer>
		<el-tabs v-model="activeName" type="card">
			<el-tab-pane label="权益卡订单列表" name="equityCardList">
				<equity-cardList ref="equityCardList"></equity-cardList>
			</el-tab-pane>
			<el-tab-pane label="赔付列表" name="compensateList"
				><compensate-list ref="compensateList"></compensate-list
			></el-tab-pane>
		</el-tabs>
	</basicContainer>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import compensateList from './components/compensateList'
import equityCardList from './components/equityCardList'
export default {
	name: 'EquityCardList',
	components: {
		BasicContainer,
		compensateList,
		equityCardList,
	},
	data() {
		return {
			activeName: 'equityCardList',
		}
	},
}
</script>
