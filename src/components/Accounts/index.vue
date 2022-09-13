<template>
	<div class="box">
		<div
			class="header"
			:style="{ width: `${handleWidth}` }"
			v-for="(item, index) in items"
			:key="index"
		>
			<p>{{ item.title }}</p>
			<p class="header__money" v-if="item.type == 'money'">
				￥{{ retainDecimalPoint(item.value, 2) }}
			</p>
			<p :class="['header__money', item.class]" v-if="item.type == 'amount'">
				￥{{ numberFormat(item.value, 2) }}
			</p>
			<p class="header__money" v-if="item.type == 'order'">{{ item.value }}</p>
		</div>
	</div>
</template>

<script>
import { retainDecimalPoint, numberFormat } from '@/utils/helper/common'

export default {
	props: {
		items: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			retainDecimalPoint: retainDecimalPoint,
			numberFormat: numberFormat,
		}
	},
	computed: {
		handleWidth() {
			let width = 0
			const len = Object.keys(this.items).length

			if (len) {
				width = 100 / len
			}

			return `${width}%`
		},
	},
}
</script>

<style lang="scss" scoped>
.box {
	display: flex;
	margin-bottom: 20px;
	border: 1px solid #ddd;

	.header {
		border-right: none;

		p {
			text-align: center;
			margin: 10px 0;
		}

		&__money {
			font-weight: bold;
			font-size: 18px;
		}
	}
	.header + .header {
		border-left: 1px solid #ddd;
	}
}
</style>
