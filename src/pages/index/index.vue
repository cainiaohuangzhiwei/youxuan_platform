<template>
	<div class="container">
		<transition name="form-fade" mode="in-out">
			<div class="login_con_bg">
				<div class="login_con">
					<img src="../../assets/image/logo.png" />
					<h1 class="un-selected">欢迎使用云货优选后台系统</h1>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
export default {
	data() {
		return {}
	},

	methods: {},
}
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100%;
	background: url('../../assets/image/login_bg.jpg') no-repeat center;
	background-size: 100% 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}
.form-fade-enter-active,
.form-fade-leave-active {
	transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
	transform: translate3d(0, -50px, 0);
	opacity: 0;
}
.login_con_bg {
	background: url('../../assets/image/login_con.png') no-repeat center;
	background-size: 100% 100%;
	width: 900px;
	height: 510px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.login_con {
	flex: 1;
	padding: 20px;
	h1 {
		font-size: 24px;
		color: #666;
		font-weight: normal;
		// margin-bottom: 30px;
	}
}
::v-deep .input_txt .el-input__inner {
	width: 40%;
	height: 46px;
	line-height: 46px;
	border-radius: 46px;
	border: 1px solid #e6e6e6;
	box-sizing: border-box;
}
.submit_btn {
	width: 40%;
	font-size: 18px;
	height: 46px;
	border-radius: 46px;
	background: #f7544b;
	color: #fff;
}
</style>
