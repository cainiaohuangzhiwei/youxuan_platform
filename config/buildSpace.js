// environment：prod表示线上环境（默认） gray表示灰度环境 pre表示集成环境 daily表示测试环境 local表示本地环境
let buildSpace = {
	// 协议
	protocol: process.env.protocol || 'http',
	// arms环境变量
	environment: process.env.environment || 'local',
	// 域名
	domainName: process.env.domainName || '127.0.0.1:7001',
}

// 服务映射 key 服务接口关键词匹配 value 环境变量
let serviceMap = {
	'api/yhtplus/webImport': 'webImport',
	'api/yhtplus/upload_pictures': 'uploadProducts',
	'api/weeget-infinite-dot-rest': 'gatewayDotServer',
	'api/weeget-bullet-order-rest': 'backendGateway',
	'api/weeget-bullet-order-rest-fors': 'backendGateway',
	'api/weeget-infinite-abtest-rest': 'backendGateway',
	'api/upms/': 'shopkeeperServer',
	'api/weeget-genius-backend-fors-rest': 'backendGateway',
	'api/weeget-genius-backend-fors-service': 'backendGateway',
	'api/weeget-genius-backend-auth-rest': 'backendGateway',
	'api/weeget-genius-act-enliven-rest': 'backendGateway',
	'api/weeget-bullet-goods-rest-fors': 'backendGateway',
	'api/yhtplus/storekeeper': 'supplierServer',
	'api/yhtplus/monitorController': 'supplierServer',
	'api/weeget-bullet-marketing-rest-fors': 'backendGateway',
	'api/weeget-bullet-after-sale-rest-fors': 'backendGateway',
	'api/weeget-bullet-funds-rest-fors': 'backendGateway',
	'api/weeget-genius-luban-rest-fors': 'backendGateway',
	'api/weeget-genius-violation-rest-fors': 'backendGateway',
	'api/weeget-bullet-payment-rest': 'backendGateway',
	'api/weeget-genius-thirdparty-rest': 'backendGateway',
	'api/weeget-bullet-evaluation-rest-fors': 'backendGateway',
	'api/weeget-genius-supplier-service': 'backendGateway',
	'api/weeget-infinite-lightspeed-rest': 'backendGateway',
	'api/weeget-bullet-account-service': 'backendGateway',
	'api/weeget-bullet-rule-rest-fors': 'backendGateway',
	'api/weeget-bullet-user-rest-fors': 'backendGateway',
	'api/weeget-bullet-shopkeeper-upms': 'backendGateway',
	'api/weeget-bullet-user-operation-rest': 'backendGateway',
	'api/app': 'shopkeeperServer.bak',
	'api/weeget-bullet-payment-rest-fors': 'backendGateway',
}
// 读取环境变量，保存服务映射
for (let key in serviceMap) {
	if (process.env[serviceMap[key]]) {
		buildSpace[key] = process.env[serviceMap[key]]
	}
}

module.exports = {
	...buildSpace,
	serviceMap,
}
// module.exports = {
// 	'ali-egg-prod': {
// 		// 线上
// 		domainName: 'youxuan.yunhuotong.net',
// 		environment: 'prod',
// 	},
// 	'ali-egg-prod-v2': {
// 		// 灰度
// 		domainName: 'youxuan-v2.yunhuotong.net',
// 		environment: 'gray',
// 	},
// 	'ali-egg-pressure': {
// 		// 压测
// 		domainName: 'ali-pressure.yunhuotong.net',
// 		environment: 'daily',
// 	},
// 	'ali-egg-release': {
// 		// 阿里集成
// 		domainName: 'ali-release.yunhuotong.net',
// 		environment: 'pre',
// 	},
// 	'ali-egg-test': {
// 		// 压测2-大促
// 		domainName: 'aliyun-test.yunhuoyouxuan.com',
// 		environment: 'daily',
// 	},
// 	'ali-egg-finance': {
// 		// 阿里财务
// 		domainName: 'ali-finance.yunhuotong.net',
// 		environment: 'daily',
// 	},

// 	local: {
// 		// 测试
// 		domainName: 'ali-release.yunhuotong.net',
// 		environment: 'local',
// 	},
// }
