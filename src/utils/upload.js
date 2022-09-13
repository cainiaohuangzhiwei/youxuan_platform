import COS from 'cos-js-sdk-v5'
import BMF from 'browser-md5-file'
import { getCosToken } from '@/api/cos'

// 配置
const config = {
	bucket: 'prod-youxuan-1305619815',
	region: 'ap-guangzhou',
	originPath: getFolderName(),
}

// cdn地址
const COSHOST = 'https://imagecos.yunhuotong.net'

// 获取文件名：规则为年_月
function getFolderName() {
	const date = new Date()
	const year = date.getFullYear()
	let month = date.getMonth() + 1
	if (month.toString().length === 1) {
		month = `0${month}`
	}
	return `${year}_${month}`
}

// 获取临时秘钥
async function getAuthorization(option, callback) {
	const result = await getCosToken()
	const { credentials } = result.data
	if (credentials) {
		return callback({
			TmpSecretId: credentials.tmpSecretId,
			TmpSecretKey: credentials.tmpSecretKey,
			XCosSecurityToken: credentials.sessionToken,
			StartTime: result.data.startTime,
			ExpiredTime: result.data.expiredTime,
		})
	}
	return false
}

// 获取文件的MD5值
function getFileMD5(file) {
	return new Promise((resolve) => {
		const bmf = new BMF()
		bmf.md5(file, (err, res) => {
			resolve(res)
		})
	})
}

// 上传文件(日期为目录，md5命名)
function uploadFile(file, filename, callback) {
	const key = `${config.originPath}/${filename}` // getFolderName() + '/' + filename // 这里指定上传目录和文件名
	const cos = new COS({
		getAuthorization,
	})
	const blob = new Blob([file])
	let fileid = '/' + key
	let headers = {}
	if (!/\.(mp4|MP4)$/.test(file.name)) {
		headers = {
			// 通过 imageMogr2 接口使用图片缩放功能：指定图片宽度为 200，宽度等比压缩
			'Pic-Operations':
				'{ "rules": [{"fileid":"' +
				fileid +
				'", "rule": "imageMogr2/quality/80!"}]}',
		}
	}

	cos.putObject(
		{
			Bucket: config.bucket,
			Region: config.region,
			Key: key,
			Body: blob,
			Headers: headers,
		},
		(err, data) => {
			callback(err, data)
		}
	)
}

// 上传-覆盖element upload的before-upload
export async function uploadImgToCos(file, folerName = '') {
	const fileName = await getFileMD5(file)
	const tagArray = file.name && file.name.split('.')
	const suffix = (tagArray.length > 0 && tagArray[tagArray.length - 1]) || 'png' // 文件后缀名
	const path = `${folerName + fileName}.${suffix}`
	return new Promise((resolve, reject) => {
		let fileList = {}
		if (file) {
			uploadFile(file, path, (err, data) => {
				if (err) {
					reject(err)
				}
				const prePath = COSHOST
				const oriPath = data.Location.slice(
					data.Location.indexOf('/'),
					data.Location.length
				)
				fileList = {
					name: `${fileName}.${suffix}`,
					url: prePath + oriPath,
					origin: file.name,
					type: suffix,
				}
				resolve(fileList)
			})
		}
	})
}
