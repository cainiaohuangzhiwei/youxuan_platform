<template>
	<planTab ref="planTabOld" :templateSn="templateSn"></planTab>
</template>

<script>
import planTab from './components/planTabOld'
export default {
	components: {
		planTab,
	},
	data() {
		return {
			activeName: 'planTabOld',
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
