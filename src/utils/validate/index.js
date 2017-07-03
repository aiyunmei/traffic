const va = {
  telephone: /^0?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/, // 手机号
  string: /^[0-9a-zA-Z-_/]*$/,  // 字符串 可使用过 - _ / 符号
  number: /^[0-9]*$/, // 纯数字
  cn: /^[\u4e00-\u9fa5]+$/, // 中文
  url: /^0?(https|http|ftp|rtsp|mms)/, // url
  pattern: /^\w+$/, // 字符串检测是否含有特殊字符
  allpattern: /^[0-9a-zA-Z\u4e00-\u9fa5]*$/, // 包含特殊字符
  num: /^\d+(\.\d+)?$/, // 匹配整数或者小数
  idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, // 身份证号
  cnPattern: /^[0-9a-zA-Z\u4e00-\u9fa5-_/—.]+$/ // 中文带 - _ / — .符号验证
}

export default va
