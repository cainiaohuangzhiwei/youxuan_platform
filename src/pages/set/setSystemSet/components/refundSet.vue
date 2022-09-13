<template>
	<div v-loading="showLoading">
		<div class="item-box">
			<p class="property-title">退款单标签</p>
			<div class="tag-list">
				<span>标签：</span>
				<template v-for="(item, index) in groupTagList">
					<div class="tag-item" :key="index">
						<el-button-group v-if="!item.edit" :key="index">
							<el-button type="warning">{{ item.tagName }}</el-button>
							<el-button
								type="warning"
								icon="el-icon-edit"
								@click="editItem(item, index, 'groupTagList', 'tagName')"
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
									@click="deleteItem(index, 'groupTagList')"
									type="danger"
									icon="el-icon-delete-solid"
								></el-button
							></template>
						</el-input>
					</div>
				</template>
				<el-input
					class="input-new-tag"
					v-if="inputVisible && saveKey == 'groupTagList'"
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
					@click="showInput('groupTagList', 'tagName')"
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
import { getRefundTag, updateRefundTag } from '@/api/systemConfiguration'
export default {
	props: {},

	data() {
		return {
			groupTagList: [],
			showLoading: false,
			inputVisible: false,
			inputValue: '',
			saveIndex: null,
			skuName: '',
			skuValue: '',
			addItem: {},
			oldValue: '',
			isShow: false,
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
			if (this.loading) {
				return
			}
			this.loading = true
			this.showLoading = true
			let {
				data: { resultCode, resultMsg },
			} = await updateRefundTag({
				groupTagList: this.groupTagList,
			})
			this.showLoading = false
			this.loading = false
			if (resultCode == 0) {
				this.$message.success(resultMsg)
				this.init()
			}
		},
		deleteItem(index, key) {
			this.$delete(this[key], index)
		},
		editItem(item, index, key, name) {
			if (this.saveIndex != null) {
				let oldItem = this[this.saveKey][this.saveIndex]
				oldItem.edit = false
				this.$set(this[this.saveKey], this.saveIndex, oldItem)
			}
			item.edit = true
			this.$set(this[key], index, item)
			this.inputValue = item[name]
			this.saveIndex = index
			this.saveKey = key
			this.saveName = name
			this.oldValue = item[name]
			this.$nextTick(() => {
				this.$refs.saveTagInput[0].$refs.input.focus()
			})
		},
		handleInputConfirm() {
			let inputValue = this.inputValue
			let item = {}
			let flag = this[this.saveKey].some(
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
						confirmText = '退款单标签'
						break
				}
				this.$message.warning(`已经存在相同的${confirmText}`)
				this.$nextTick(() => {
					if (this.saveIndex == null) {
						this.$refs.saveTagInput.$refs.input.focus()
					} else {
						this.$refs.saveTagInput[0].$refs.input.focus()
					}
				})
				return
			}
			if (this.saveIndex != null) {
				item = this[this.saveKey][this.saveIndex]
				item.edit = false
			} else {
				item = this.addItem
				this.inputVisible = false
			}
			if (
				this.saveIndex != null &&
				inputValue &&
				this[this.saveKey][this.saveIndex][this.saveName] != inputValue
			) {
				item[this.saveName] = inputValue
				this.$set(this[this.saveKey], this.saveIndex, item)
			} else if (this.saveIndex == null && inputValue) {
				item[this.saveName] = inputValue
				this.$set(this[this.saveKey], this[this.saveKey].length, item)
			} else if (!inputValue && this.saveIndex != null) {
				this.$set(this[this.saveKey], this.saveIndex, item)
			}
			this.inputValue = ''
		},
		initEdit() {
			this.groupTagList.map((item) => {
				item.edit = false
			})
		},
		showInput(key, name) {
			this.initEdit()
			this.saveIndex = null
			this.saveKey = key
			this.saveName = name
			this.addItem = { type: '' }
			this.addItem[name] = ''
			this.inputVisible = true
			this.inputValue = ''
			this.$nextTick(() => {
				this.$refs.saveTagInput.$refs.input.focus()
			})
		},
		init: async function () {
			this.showLoading = true
			let {
				data: { resultCode, resultData },
			} = await getRefundTag()
			this.showLoading = false
			if (resultCode == 0) {
				this.isShow = true
				this.groupTagList = resultData.groupTagList || []
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
