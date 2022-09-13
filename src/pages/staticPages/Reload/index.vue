<template>
	<div></div>
</template>
<script>
export default {
	name: 'Reload',
	beforeCreate() {
		this.$router.replace(this.$route.query.redirect)
	},
}
</script>
<style lang="scss" scoped>
div {
	background: transparent;
}
</style>
