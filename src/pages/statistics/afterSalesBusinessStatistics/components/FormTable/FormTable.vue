<template>
	<div>
		<basicContainer>
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="状态统计" name="first">
					<partOne v-if="activeName == 'first'"
				/></el-tab-pane>
				<el-tab-pane label="超时统计" name="second">
					<partTwo v-if="activeName == 'second'" />
				</el-tab-pane>
			</el-tabs>
		</basicContainer>
	</div>
</template>

<script>
import partOne from './partOne'
import partTwo from './partTwo'
import BasicContainer from '@wg-vue-materials/basic-container'
export default {
	components: {
		partOne,
		BasicContainer,
		partTwo,
	},
	data() {
		return {
			activeName: 'first',
		}
	},
	methods: {
		handleClick(e) {
			this.activeName = e.paneName
		},
	},
}
</script>
