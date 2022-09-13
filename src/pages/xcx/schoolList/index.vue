<template>
	<div class="schoolList">
		<basicContainer>
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="课程" name="businessSchoolStatistics">
					<span slot="label">课程</span>
					<businessSchoolStatistics
						ref="businessSchoolStatistics"
					></businessSchoolStatistics>
				</el-tab-pane>
				<el-tab-pane label="商学院banner" name="bannerStatistics">
					<span slot="label">商学院banner</span>
					<bannerStatistics ref="bannerStatistics"></bannerStatistics>
				</el-tab-pane>
				<el-tab-pane label="课程分类" name="curriculumClassifyStatistics">
					<span slot="label">课程分类</span>
					<curriculumClassifyStatistics
						ref="curriculumClassifyStatistics"
					></curriculumClassifyStatistics>
				</el-tab-pane>
				<el-tab-pane label="每日分享" name="bsDayShareStatistics">
					<span slot="label">每日分享</span>
					<bsDayShareStatistics
						ref="bsDayShareStatistics"
					></bsDayShareStatistics>
				</el-tab-pane>
			</el-tabs>
		</basicContainer>
	</div>
</template>
<script>
import BasicContainer from '@wg-vue-materials/basic-container'
import businessSchoolStatistics from './components/businessSchoolStatistics'
import bannerStatistics from './components/bannerStatistics'
import curriculumClassifyStatistics from './components/curriculumClassifyStatistics'
import bsDayShareStatistics from './components/bsDayShareStatistics'

export default {
	components: {
		BasicContainer,
		businessSchoolStatistics,
		bannerStatistics,
		curriculumClassifyStatistics,
		bsDayShareStatistics,
	},
	props: [],
	data() {
		return {
			activeName: 'businessSchoolStatistics',
		}
	},

	created() {
		this.$nextTick(() => {
			this.$refs.businessSchoolStatistics.init(true)
		})
	},

	methods: {
		handleClick({ name }) {
			if (this.$refs[name] && !this.$refs[name].isShow) {
				this.$refs[name].init(true)
			}
			this.activeName = name
		},
	},
}
</script>
