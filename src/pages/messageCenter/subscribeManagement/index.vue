<template>
	<packageTab ref="packageTab" @componentRow="componentRow"></packageTab>
</template>

<script>
import packageTab from './components/packageTab'
export default {
	components: {
		packageTab,
	},
	data() {
		return {
			activeName: 'packageTab',
		}
	},
	methods: {
		handleClick({ name }) {
			this.$refs[name].init(true)
		},
		componentRow(row) {
			// this.templateSn = row.templateSn
			this.$router.push({
				name: 'subscribePushTaskList',
				params: { templateSn: row.templateSn },
			})
		},
	},
}
</script>
