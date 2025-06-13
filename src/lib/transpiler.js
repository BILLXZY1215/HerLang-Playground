export function transpileHerLang(code) {
	// 基于 justjavac/herlang 的关键词映射
	const keywordMap = {
		// 变量声明
		宝宝你是一个: 'let',
		我宝宝是一个: 'const',
		变来变去的宝宝是一个: 'var',

		// 赋值
		我接受: '=',
		我同意: '=',

		// 运算符
		拼单: '+',
		接: '+',
		差异: '-',
		避雷: '/',
		踩雷: '/',
		扫雷: '/',
		种草: '*',
		种草草: '**',
		备胎: '%',

		// 比较运算符
		是不是: '===',
		不是吧: '!==',
		比我大: '>',
		比我小: '<',
		不比我小: '>=',
		不比我大: '<=',

		// 控制流
		姐妹们觉得呢: 'if',
		抛开事实不谈: 'if',
		我接受不等于我同意: 'else',
		那能一样吗: 'else',
		你再说一遍: 'while',
		一直一直: 'for',
		下头: 'break',
		没事继续: 'continue',

		// 函数
		想要你一个态度: 'function',
		反手举报: 'return',

		// 输出
		小作文: 'console.log',
		家人们: 'console.log',

		// 输入
		你说一句: 'prompt',

		// 逻辑运算符
		非得要: '&&',
		要不然就: '||',
		不是这样的: '!',
		绝了: '!',

		// 布尔值
		那么普通却那么自信: 'true',
		那咋了: 'false',

		// 其他
		从里面拿: '.',
		我的第几个: '[',
		哼: 'exit',
		哈: 'exit',

		// 特殊值
		微胖: '180',
	}

	// 预处理：标准化换行符和空格
	let result = code.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()

	console.log('Step 0 - Original:', result)

	// 步骤1：替换关键词（按长度排序，长的先替换）
	const keywords = Object.keys(keywordMap).sort((a, b) => b.length - a.length)
	keywords.forEach((keyword) => {
		if (result.includes(keyword)) {
			console.log(`Replacing keyword: "${keyword}" -> "${keywordMap[keyword]}"`)
			result = result.split(keyword).join(keywordMap[keyword])
		}
	})

	console.log('Step 1 - After keywords:', result)

	// 步骤2：收集中文变量名
	const chineseVars = new Set()
	// 修复正则表达式，确保能匹配所有中文字符
	const chineseVarPattern = /[\u4e00-\u9fa5]+/g
	let match
	while ((match = chineseVarPattern.exec(result)) !== null) {
		const identifier = match[0]
		// 确保不是已经被替换的关键词
		if (!Object.values(keywordMap).includes(identifier)) {
			chineseVars.add(identifier)
		}
	}

	console.log('Step 2 - Chinese vars found:', Array.from(chineseVars))

	// 步骤3：替换中文变量名
	let varCounter = 1
	const varMap = new Map()

	// 按长度排序，长的先替换
	const sortedVars = Array.from(chineseVars).sort((a, b) => b.length - a.length)

	sortedVars.forEach((chineseVar) => {
		const jsVar = `var${varCounter++}`
		varMap.set(chineseVar, jsVar)
		console.log(`Replacing var: "${chineseVar}" -> "${jsVar}"`)

		// 使用更精确的替换，确保完整单词匹配
		const regex = new RegExp(`\\b${escapeRegExp(chineseVar)}\\b`, 'g')
		result = result.replace(regex, jsVar)
	})

	console.log('Step 3 - After var replacement:', result)

	// 步骤4：处理语法结构（冒号转大括号）
	result = processSyntax(result)

	console.log('Step 4 - Final result:', result)

	return result
}

// 转义正则表达式特殊字符
function escapeRegExp(string) {
	return string.replace(
		/[.*+?^${}()|[\]\\]/g,
		'\\// 处理语法结构：缩进转大括号'
	)
}

// 处理语法结构：缩进转大括号
function processSyntax(code) {
	const lines = code.split('\n')
	const result = []
	const indentStack = [0] // 缩进栈

	for (let i = 0; i < lines.length; i++) {
		let line = lines[i]

		if (!line.trim()) {
			continue // 跳过空行
		}

		const currentIndent = getIndentLevel(line)
		const trimmedLine = line.trim()

		// 处理缩进减少的情况 - 关闭代码块
		while (currentIndent < indentStack[indentStack.length - 1]) {
			indentStack.pop()
			// 检查下一行是否是 else，如果是，则不换行
			const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : ''
			if (nextLine.startsWith('else')) {
				result.push('} ')
			} else {
				result.push('}')
			}
		}

		// 检查是否需要添加大括号和括号
		if (trimmedLine.endsWith(':')) {
			// 处理 if/while 等需要条件括号的语句
			if (trimmedLine.startsWith('if ') || trimmedLine.startsWith('while ')) {
				// 提取条件部分
				const keyword = trimmedLine.split(' ')[0]
				const condition = trimmedLine.slice(keyword.length, -1).trim()
				line = ' '.repeat(currentIndent) + `${keyword} (${condition}) {`
			} else if (trimmedLine.startsWith('else')) {
				// 处理 else
				line = 'else {'
			} else {
				// 其他情况直接替换冒号
				line = line.replace(/:\s*$/, ' {')
			}
			// 推入新的缩进级别
			indentStack.push(currentIndent + 2)
		}

		result.push(line)
	}

	// 关闭所有剩余的代码块
	while (indentStack.length > 1) {
		indentStack.pop()
		result.push('}')
	}

	return result.join('\n')
}

// 获取行的缩进级别
function getIndentLevel(line) {
	let count = 0
	for (let i = 0; i < line.length; i++) {
		if (line[i] === ' ') {
			count++
		} else if (line[i] === '\t') {
			count += 4 // 制表符当作4个空格
		} else {
			break
		}
	}
	return count
}

// 判断是否需要大括号
function needsBraces(line) {
	// 简化判断逻辑：只要以冒号结尾就需要大括号
	return line.endsWith(':')
}
