/*
 * @Description: 数据过滤
 * @Author: Navi
 * @Email: 1592193221@qq.com
 * @Date: 2020-08-06 11:14:57
 * @LastEditTime: 2020-08-07 10:13:00
 * @LastEditors: Navi
 */
import Vue from 'vue'
import numeral from 'numeral'
import moment from 'moment'

Vue.filter('numeral', function (payload, pattren = ',') {
	if (!payload) {
		return '0'
	}
	const formatString = numeral(payload).format(pattren)
	return formatString
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
	return moment(dataStr).format(pattern)
})
