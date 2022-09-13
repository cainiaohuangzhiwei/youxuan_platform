<template>
	<div class="nps-item">
		<el-tag
			class="nps-item_btn"
			v-for="(item, index) in list"
			:key="index"
			:effect="currentIndex >= index ? 'dark' : 'plain'"
			@click="() => chooseTag(index)"
		>
			{{ index }}
		</el-tag>
	</div>
</template>

<script>
export default {
	data() {
		return {
			list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			currentIndex: 0,
		}
	},

	methods: {
		chooseTag(i) {
			this.currentIndex = i
		},
	},
}
</script>

<style lang="scss" scoped>
.nps-item {
	display: flex;
	justify-content: space-between;

	.nps-item_btn {
		padding: 6px 14px;
		height: auto;
		cursor: pointer;
	}

	.nps-item_btn + .nps-item_btn {
		margin-left: 10px;
	}
}
</style>
