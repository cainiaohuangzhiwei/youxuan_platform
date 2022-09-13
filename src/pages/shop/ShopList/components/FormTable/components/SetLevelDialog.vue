<template>
	<div>
		<el-dialog
			width="30%"
			title="更新店铺等级"
			:close-on-click-modal="false"
			:visible.sync="localVisible"
			:before-close="resetForm"
			:destroy-on-close="true"
			@open="open"
		>
			<yx-form
				:inline="true"
				:data="formInline"
				:items="formCfg"
				:formAction="formAction"
			></yx-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="localVisible = false">取 消</el-button>
				<el-button type="primary" @click="confirm">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import YxForm from '@wg-vue-materials/yx-form'
// getLevelByCondition
import { updateOrganizationLevel } from '@/api/shopList'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		row: {
			type: Object,
			default: () => ({}),
		},
	},
	components: {
		YxForm,
	},
	data() {
		return {
			levelName: '',
			levelList: [],
			formInline: {
				remark: '',
				levelType: '0',
			},
			formCfg: [
				{
					title: '店铺等级',
					type: 'select',
					dataIndex: 'levelType',
					label: 'value',
					options: [],
				},
			],
		}
	},
	computed: {
		localVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			},
		},
	},
	created() {
		// this._getLevelByCondition()
	},
	methods: {
		confirm() {
			if (this.formInline.levelType == this.row.levelType) {
				this.$message.error('已经是当前选择的等级.')
				return
			}
			this.levelName = this.formCfg[0].options.find(
				(item) => item.levelType == this.formInline.levelType
			).value
			this.$confirm(`是否将店铺升级为${this.levelName}`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this._updateOrganizationLevel()
				})
				.catch(() => {
					this.localVisible = false
				})
		},
		// async _getLevelByCondition() {
		// 	let {
		// 		data: { resultCode, resultData },
		// 	} = await getLevelByCondition()
		// 	if (resultCode === 0) {
		// 		this.levelList = resultData.levelList
		// 	}
		// },
		async _updateOrganizationLevel() {
			let levelId = this.levelList.find((item) => {
				return item.levelType == this.formInline.levelType
			}).levelId
			let paramJson = {
				organizationId: this.row.organizationId,
				levelType: this.row.levelType ? this.row.levelType : 0,
				levelId: levelId,
				levelName: this.levelName,
			}
			if (paramJson.levelType == 0 && paramJson.levelName == '服务商') {
				this.$message({
					message: '请先升级店铺为VIP',
					type: 'warning',
				})
				return
			}
			let {
				data: { resultCode },
			} = await updateOrganizationLevel(paramJson)

			if (resultCode === 0) {
				this.$message({
					message: '成功！',
					type: 'success',
				})
				this.$emit('refreshList')
			}
			this.localVisible = false
		},
		open() {
			if (!this.row.levelType) {
				this.row.levelType = 0
			}
			let levelList = this.levelList.map((item) => {
				return { levelType: item.levelType, value: item.levelName }
			})
			let levelType = this.row.levelType ? this.row.levelType : 0
			if (levelType === 0) {
				this.formCfg[0].options = [
					{ levelType: 0, value: '普通店主' },
					...levelList,
				]
			} else {
				this.formCfg[0].options = levelList
			}
			this.formInline.levelType = levelType
		},
	},
}
</script>

<style lang="scss" scoped></style>
