<template>
	<el-form ref="form" :model="form" :rules="rules" label-width="auto">
		<el-form-item label="小程序原始链接" prop="xcxLink">
			<el-input v-model="form.xcxLink"></el-input>
		</el-form-item>
		<el-form-item label="">
			<el-button type="primary" round @click="translate"
				>生成短信链接</el-button
			>
		</el-form-item>
		<el-form-item v-if="linkEn" label="短信链接">
			<el-button
				type="text"
				:loading="loading"
				v-clipboard:copy="linkEn"
				v-clipboard:success="onCopy"
			>
				{{ linkEn }}</el-button
			>
		</el-form-item>
	</el-form>
</template>

<script>
export default {
	name: 'marketingLink',
	data() {
		// const now = new Date()
		const linkValid = (rule, value, callback) => {
			if (!value) {
				return callback(new Error('请输入小程序链接'))
			}
			const xcxLink = String(value).split('?')
			if (xcxLink.length > 2) {
				return callback(new Error('小程序链接不合法，请确认'))
			} else if (xcxLink.length === 2) {
				if (/^http+/.test(xcxLink[0])) {
					return callback(new Error('小程序链接不合法，请确认'))
				}
			}
			if (/^http+/.test(value)) {
				return callback(new Error('小程序链接不合法，请确认'))
			}
			callback()
		}
		return {
			form: {
				xcxLink: '',
				link: '',
			},
			rules: {
				xcxLink: [{ validator: linkValid, required: true }],
			},
			loading: false,
			linkEn: '',
		}
	},
	methods: {
		translate() {
			if (this.loading) return
			this.$refs.form.validate((valid) => {
				if (valid) {
					const xcxLink = String(this.form.xcxLink).split('?')
					const data = {
						path: xcxLink[0],
						query: xcxLink[1],
					}
					this.linkEn = `https://pro-0gv4zqmd41990a5b-1251121443.tcloudbaseapp.com/h5/index.html?path=${encodeURIComponent(
						data.path
					)}&query=${encodeURIComponent(data.query)}`
					console.log(this.linkEn)
				}
			})
		},
		onCopy() {
			this.$message.success('复制成功')
		},
	},
}
</script>
