<template>
	<router-view></router-view>
</template>
<script>
async function handleKeepAlive(to) {
	if (to.matched && to.matched.length > 2) {
		for (let i = 0; i < to.matched.length; i++) {
			const element = to.matched[i]
			if (element.components.default.name === 'layout') {
				to.matched.splice(i, 1)
				await handleKeepAlive(to)
			}
		}
	}
}
export default {
	name: 'layout',
	beforeRouteEnter(to, from, next) {
		handleKeepAlive(to)
		next()
	},
}
</script>
