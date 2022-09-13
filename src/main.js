// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
// pwa
import './registerServiceWorker'
// 复制到粘贴板插件
import VueClipboard from 'vue-clipboard2'

// icon
import '@/utils/icons'
// vue.filters
import '@/utils/filters'
// vue.directives
import '@/utils/directives'

import moment from 'moment'
// 也很常见
moment.updateLocale('en', {
	week: {
		dow: 1, // 星期的第一天是星期一
		doy: 7, // 年份的第一周必须包含1月1日 (7 + 1 - 1)
	},
})
// 样式表，需严格按照顺序引入
import '@/style/format.scss'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/iconfont/iconfont.css'
import '@/style/index.scss'
// permission control
import './router/permission'

Vue.config.silent = true
Vue.config.productionTip = false
// elmentUI库引用
Vue.use(ElementUI, {
	size: 'small',
})
// 粘贴插件引用
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

Vue.prototype.$store = store
new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount('#app')
