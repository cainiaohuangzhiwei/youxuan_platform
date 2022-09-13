<template>
	<basicContainer>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="品牌营销" name="goodsGroupTab">
				<span slot="label"
					>品牌营销
					<a :href="oldLink + 'goodsGroupTab'" target="_blank"
						><i class="wg-mr6 el-icon-right" /></a
				></span>
				<goods-group
					:sensitiveWordMap.sync="sensitiveWordMap"
					:campaignsList.sync="campaignsList"
					ref="goodsGroupTab"
				></goods-group>
			</el-tab-pane>
			<el-tab-pane label="小程序首页标题" name="xcxTitleTab">
				<span slot="label"
					>小程序首页标题
					<a :href="oldLink + 'xcxTitleTab'" target="_blank"
						><i class="wg-mr6 el-icon-right" /></a
				></span>
				<xcx-title ref="xcxTitleTab"></xcx-title
			></el-tab-pane>
			<el-tab-pane label="专享营销" name="channelGroupTab">
				<span slot="label"
					>专享营销
					<a :href="oldLink + 'channelGroupTab'" target="_blank"
						><i class="wg-mr6 el-icon-right" /></a
				></span>
				<channel-group-tab
					:campaignsList.sync="campaignsList"
					:sensitiveWordMap.sync="sensitiveWordMap"
					ref="channelGroupTab"
				></channel-group-tab>
			</el-tab-pane>
		</el-tabs>
	</basicContainer>
</template>

<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import goodsGroup from './components/goodsGroup'
import xcxTitle from './components/xcxTitle'
import channelGroupTab from './components/channelGroupTab'
import { getSensitiveWordFilteringList } from '@/api/systemConfiguration'
import { getCampaigns } from '@/api/goodsGroup'
export default {
	name: 'goodsGroupList',
	components: {
		BasicContainer,
		goodsGroup,
		xcxTitle,
		channelGroupTab,
	},
	data() {
		return {
			oldLink: `/yhtplus/web/goodsGroupList.html?type=`,
			activeName: 'goodsGroupTab',
			sensitiveWordMap: {},
			campaignsList: [],
		}
	},
	created() {
		this._getSensitiveWordFilteringList()
		this._getCampaigns()
	},
	methods: {
		async _getCampaigns() {
			let {
				data: { resultCode, resultData = [] },
			} = await getCampaigns()
			if (resultCode == 0) {
				this.campaignsList = resultData
			}
		},
		_getSensitiveWordFilteringList: async function () {
			let {
				data: { resultCode, resultData },
			} = await getSensitiveWordFilteringList()
			if (resultCode == 0) {
				resultData.list.map((item) => {
					if (item.filterWord) {
						this.sensitiveWordMap[item.detection] = item.filterWord.split(',')
					}
				})
			}
		},
		handleClick({ name }) {
			if (this.$refs[name] && !this.$refs[name].isShow) {
				this.$refs[name].init(true)
			}
		},
	},
}
</script>

<style lang="scss">
.group-name-tag {
	margin-left: 5px;
	margin-bottom: 5px;
}
.group-row-bg-red {
	background-color: red;
	border-radius: 4px;
	color: #fff;
}
.el-table .ffc94b-row {
	background: #ffc94b;
}
.goods-group-btn-box {
	margin-bottom: 10px;
}
.goods-info-box {
	display: flex;
	align-items: center;
	.c_image {
		width: 50px;
		height: 50px;
	}
	.goods-info-right {
		width: 218px;
		margin-left: 10px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		button {
			margin-left: 0;
			padding: 0;
		}
	}
}
.presale-timer {
	margin: 0 10px;
}
.limit-buy-count-box {
	display: flex;
	align-items: center;
	span {
		margin-right: 20px;
	}
	.limit-buy-count-input {
		width: 120px;
	}
	.expect-delivery-time {
		width: 80px;
		margin: 0 10px;
	}
}
.change-img {
	margin: 0;
	span {
		margin-right: 10px;
	}
}
.composite-image {
	width: 180px;
	height: 180px;
	margin-top: 20px;
}
.code-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	.c_image {
		height: 200px;
		width: 200px;
	}
	.groupName {
		text-align: center;
	}
}
.xcx__goods_group__list {
	.el-button--small {
		font-size: 14px;
	}
	.el-table__body .el-table__row.hover-row td {
		background-color: initial;
	}
}
.goods-group-input-with-select {
	width: 100%;
}
.area-box .el-tree-node__content {
	height: 40px !important;
}

.goodsName {
	width: 100%;
	text-align: left;
	color: #1890ff;
	margin: 10px 0 0;
}

.operate-goods-dialog .el-dialog__body {
	max-height: 815px;
	padding: 15px 20px;
}
.notGoodsNumber {
	// width: 380px;
	height: 60px;
	overflow-y: scroll;
	margin: 0;
	padding: 0;
}
</style>
