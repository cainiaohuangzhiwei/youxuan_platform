<template>
	<planTab ref="planTab" :templateSn="templateSn"></planTab>
</template>

<script>
import planTab from './components/planTab'
export default {
	components: {
		planTab,
	},
	data() {
		return {
			activeName: 'planTab',
			templateSn: '',
		}
	},
	created() {
		this.templateSn = this.$route.params.templateSn
		console.log('templateSn', this.templateSn)
	},
	methods: {
		handleClick({ name }) {
			this.$refs[name].init(true)
		},
	},
}
</script>
