<template>
	<el-select
		value-key="userTagId"
		v-model="selectedUserTags"
		clearable
		multiple
		filterable
		default-first-option
		placeholder="请选择分群"
		:disabled="disabled || false"
	>
		<el-option
			v-for="item in userTagList"
			:key="item.userTagId"
			:label="item.tagName"
			:value="item"
		>
		</el-option>
	</el-select>
</template>

<script>
import { getUserTagList } from '@/api/platformUserGroupTag'
export default {
	props: {
		disabled: Boolean,
		defaultSelectList: Array,
	},
	data() {
		return {
			userTagList: [],
			selectedUserTags: [],
		}
	},
	watch: {
		selectedUserTags(val) {
			this.$emit('change', val)
		},
		defaultSelectList() {
			this.setDefaultSelect()
		},
	},
	mounted() {
		this._getUserTagList()
	},
	methods: {
		async _getUserTagList() {
			const params = {
				startCreateTime: new Date('2021-01-01 00:00:00').getTime(),
				userTagId: '',
				tagType: '',
				tagName: '',
				status: 1, //启用
				creatorName: '',
				pageSize: 99999999,
				currentPage: 1,
			}
			let {
				data: { resultData },
			} = await getUserTagList(params)
			this.userTagList = Object.freeze(resultData.records)
			this.setDefaultSelect()
		},
		// 设置回显
		setDefaultSelect() {
			const selecteds = []
			this.defaultSelectList?.forEach((userTagId) => {
				const target = this.userTagList.find((i) => i.userTagId === userTagId)
				if (target) {
					selecteds.push(target)
				}
			})
			this.selectedUserTags = selecteds
		},
	},
}
</script>

<style></style>
