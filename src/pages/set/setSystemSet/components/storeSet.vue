<template>
	<div v-loading="showLoading">
		<div class="item-box" v-for="(info, i) in allList" :key="i">
			<p class="property-title">{{ info.title }}</p>
			<div class="tag-list">
				<span>{{ info.minTitle }}：</span>
				<template v-for="(item, index) in info.list">
					<div class="tag-item" :key="index">
						<el-button-group v-if="!item.edit" :key="index">
							<el-button type="warning">{{ item.tagName }}</el-button>
							<el-button
								type="warning"
								icon="el-icon-edit"
								@click="editItem(item, index, info.key, 'tagName', i)"
							></el-button>
						</el-button-group>
						<el-input
							v-else
							ref="saveTagInput"
							class="input-new-tag"
							placeholder="请输入内容"
							:key="index"
							v-model.trim="inputValue"
							@keyup.enter.native="handleInputConfirm"
						>
							<template slot="append"
								><el-button
									@click="deleteItem(index, info.key, i)"
									type="danger"
									icon="el-icon-delete-solid"
								></el-button
							></template>
						</el-input>
					</div>
				</template>
				<el-input
					class="input-new-tag"
					v-if="inputVisible && saveKey == info.key"
					v-model="inputValue"
					ref="saveTagInput"
					size="small"
					@keyup.enter.native="handleInputConfirm"
					@blur="handleInputConfirm"
				>
				</el-input>
				<el-button
					v-else
					class="button-new-tag"
					icon="el-icon-plus"
					size="small"
					@click="showInput(info.key, 'tagName', i)"
					>新增</el-button
				>
			</div>
		</div>
		<div class="save_button">
			<el-button v-loading="loading" type="primary" @click="submitForm"
				>保存</el-button
			>
			<el-button @click="goBack">取消</el-button>
		</div>
	</div>
</template>

<script>
import {
	getOrganizationTag,
	updateOrganizationTag,
} from '@/api/systemConfiguration'
export default {
	props: {},

	data() {
		return {
			isShow: false,
			allList: [
				{
					key: 'groupTagList',
					title: '店铺标签',
					minTitle: '标签',
					list: [],
				},
				{
					key: 'crowdList',
					title: '群标签',
					minTitle: '标签',
					list: [],
				},
				{
					key: 'littleCList',
					title: '小C标签',
					minTitle: '标签',
					list: [],
				},
				{
					key: 'groupBadgeList',
					title: '店铺徽章',
					minTitle: '店铺徽章',
					list: [],
				},
			],
			showLoading: false,
			inputVisible: false,
			inputValue: '',
			saveIndex: null,
			skuName: '',
			skuValue: '',
			addItem: {},
			oldValue: '',
			aIndex: null,
			loading: false,
		}
	},
	methods: {
		// 返回上一个路由
		goBack() {
			this.$store.dispatch('tagsView/delVisitedView', this.$route).then(() => {
				this.$router.go(-1)
			})
		},
		submitForm: async function () {
			let paramJson = {
				groupTagList: this.allList[0].list,
				crowdList: this.allList[1].list,
				littleCList: this.allList[2].list,
				groupBadgeList: this.allList[3].list,
			}
			if (this.loading) {
				return
			}
			this.loading = true
			this.showLoading = true
			let {
				data: { resultCode, resultMsg },
			} = await updateOrganizationTag(paramJson)
			this.showLoading = false
			this.loading = false
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.init()
			}
		},
		deleteItem(index, key, i) {
			this.$delete(this.allList[i].list, index)
		},
		editItem(item, index, key, name, i) {
			if (this.saveIndex != null) {
				let oldItem = this.allList[this.aIndex].list[this.saveIndex]
				oldItem.edit = false
				this.$set(
					this.allList[this.aIndex].list[this.saveIndex],
					this.saveIndex,
					oldItem
				)
			}
			item.edit = true
			this.$set(this.allList[i].list, index, item)
			this.inputValue = item[name]
			this.saveIndex = index
			this.saveKey = key
			this.saveName = name
			this.aIndex = i
			this.oldValue = item[name]
			this.$nextTick(() => {
				this.$refs.saveTagInput[0].$refs.input.focus()
			})
		},
		handleInputConfirm() {
			let inputValue = this.inputValue
			let item = {}
			let flag = this.allList[this.aIndex].list.some(
				(oldItem) => oldItem[this.saveName] === inputValue
			)
			if (
				inputValue &&
				flag &&
				(this.saveIndex == null || this.oldValue != inputValue)
			) {
				let confirmText = ''
				switch (this.saveKey) {
					case 'groupTagList':
						confirmText = '店铺标签'
						break
					case 'crowdList':
						confirmText = '群标签'
						break
					case 'littleCList':
						confirmText = '小C标签'
						break
					case 'groupBadgeList':
						confirmText = '店铺徽章'
						break
				}
				this.$message.warning(`已经存在相同的${confirmText}`)
				this.$nextTick(() => {
					if (this.saveIndex == null) {
						this.$refs.saveTagInput[0].$refs.input.focus()
					} else {
						this.$refs.saveTagInput[0].$refs.input.focus()
					}
				})
				return
			}
			if (this.saveIndex != null) {
				item = this.allList[this.aIndex].list[this.saveIndex]
				item.edit = false
			} else {
				item = this.addItem
				this.inputVisible = false
			}
			if (
				this.saveIndex != null &&
				inputValue &&
				this.allList[this.aIndex].list[this.saveIndex][this.saveName] !=
					inputValue
			) {
				item[this.saveName] = inputValue
				this.$set(this.allList[this.aIndex].list, this.saveIndex, item)
			} else if (this.saveIndex == null && inputValue) {
				item[this.saveName] = inputValue
				this.$set(
					this.allList[this.aIndex].list,
					this.allList[this.aIndex].list.length,
					item
				)
			} else if (!inputValue && this.saveIndex != null) {
				this.$set(this.allList[this.aIndex].list, this.saveIndex, item)
			}
			this.inputValue = ''
		},
		// 初始化编辑状态
		initEdit() {
			this.allList.map((item) => {
				item.list.map((c) => {
					c.edit = false
				})
			})
		},
		showInput(key, name, i) {
			this.initEdit()
			this.saveIndex = null
			this.saveKey = key
			this.saveName = name
			this.addItem = { type: '' }
			this.addItem[name] = ''
			this.inputVisible = true
			this.inputValue = ''
			this.aIndex = i
			this.$nextTick(() => {
				this.$refs.saveTagInput[0].$refs.input.focus()
			})
		},
		init: async function () {
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await getOrganizationTag()
			this.showLoading = false
			if (resultCode == 0) {
				this.isShow = true
				this.allList.map((item) => {
					if (resultData[item.key]) {
						item.list = resultData[item.key]
					}
				})
			}
		},
	},
}
</script>

<style scoped>
.item-box {
	padding-bottom: 20px;
	margin-bottom: 20px;
	border-bottom: 1px solid #e7e7e7;
}
.property-title {
	font-size: 14px;
	font-weight: 600;
}
.tag-list {
	padding-left: 40px;
}
.sku-list {
	display: flex;
}
.tag-item {
	margin: 5px;
	display: inline-block;
}
.input-new-tag {
	width: 180px;
}
.sku-box {
	margin-left: 20px;
}
.sku-box p:nth-of-type(1) {
	margin-top: 0;
}
.save_button {
	width: 100vw;
	padding: 20px 0px 20px 50px;
	z-index: 120;
	margin-left: -20px;
	box-sizing: border-box;
	position: fixed;
	bottom: 20px;
	background: rgba(0, 0, 0, 0.3);
}
</style>
