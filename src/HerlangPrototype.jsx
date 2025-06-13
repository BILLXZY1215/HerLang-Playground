import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Button, Card, Typography, Menu, Layout, Radio, Space } from 'antd'
import { transpileHerLang } from './lib/transpiler.js'

const { Title, Paragraph } = Typography
const { Sider, Content } = Layout

// 语法对照表数据
const syntaxGuide = [
	{
		category: '🏷️ 变量声明',
		items: [
			{
				herlang: '宝宝你是一个 名字 我接受 "小仙女"',
				js: 'let 名字 = "小仙女"',
			},
			{ herlang: '我宝宝是一个 年龄 我接受 18', js: 'const 年龄 = 18' },
		],
	},
	{
		category: '🔢 运算符对照表',
		items: [
			{ herlang: '拼单, 接, 买买买, 暴富', js: '+' },
			{ herlang: '差异, 差距, 扣掉, 塑料姐妹花, 吃土', js: '-' },
			{ herlang: '种草, 渣男, 暴富', js: '*' },
			{ herlang: '避雷, 踩雷, 扫雷, 绿茶, 破产', js: '/' },
			{ herlang: '备胎, 劈腿', js: '%' },
		],
	},
	{
		category: '🤔 比较运算符对照表',
		items: [
			{ herlang: '是不是', js: '===' },
			{ herlang: '不是吧, 绿茶', js: '!==' },
			{ herlang: '比我大', js: '>' },
			{ herlang: '比我小', js: '<' },
			{ herlang: '不比我小', js: '>=' },
			{ herlang: '不比我大', js: '<=' },
		],
	},
	{
		category: '🎯 控制流对照表',
		items: [
			{ herlang: '姐妹们觉得呢, 抛开事实不谈', js: 'if' },
			{ herlang: '我接受不等于我同意, 那能一样吗', js: 'else' },
			{ herlang: '你再说一遍', js: 'while' },
			{ herlang: '一直一直', js: 'for' },
			{ herlang: '下头', js: 'break' },
			{ herlang: '没事继续', js: 'continue' },
		],
	},
	{
		category: '🎭 布尔值与逻辑运算符',
		items: [
			{ herlang: '那么普通却那么自信', js: 'true' },
			{ herlang: '那咋了', js: 'false' },
			{ herlang: '非得要', js: '&&' },
			{ herlang: '要不然就, 海王', js: '||' },
			{ herlang: '不是这样的, 绝了', js: '!' },
		],
	},
	{
		category: '📝 函数与输出对照表',
		items: [
			{ herlang: '宝宝你是一个', js: 'let' },
			{ herlang: '我宝宝是一个', js: 'const' },
			{ herlang: '我接受, 我同意', js: '=' },
			{ herlang: '想要你一个态度', js: 'function' },
			{ herlang: '反手举报', js: 'return' },
			{ herlang: '小作文, 家人们', js: 'console.log' },
		],
	},
]

const TutorialContent = () => {
	return (
		<div style={{ marginBottom: '1rem' }}>
			<Card style={{ marginBottom: '1rem' }}>
				<Title level={4} style={{ color: '#ff69b4', marginTop: 0 }}>
					📚 HerLang 语法速查表
				</Title>
				<Paragraph style={{ color: '#666', marginBottom: '1rem' }}>
					学会这些语法，你就可以开始写 HerLang 代码啦～
				</Paragraph>
			</Card>

			{syntaxGuide.map((section, index) => (
				<Card key={index} style={{ marginBottom: '1rem' }}>
					<Title level={5} style={{ color: '#333', marginTop: 0 }}>
						{section.category}
					</Title>
					<div style={{ display: 'grid', gap: '12px' }}>
						{section.items.map((item, itemIndex) => (
							<div
								key={itemIndex}
								style={{
									display: 'grid',
									gridTemplateColumns: '1fr 1fr',
									gap: '16px',
									padding: '12px',
									backgroundColor: '#f8f9fa',
									borderRadius: '6px',
									border: '1px solid #e9ecef',
								}}
							>
								<div>
									<div
										style={{
											fontSize: '12px',
											color: '#ff69b4',
											fontWeight: 'bold',
											marginBottom: '4px',
										}}
									>
										HerLang 🧚‍♀️
									</div>
									<code
										style={{
											backgroundColor: '#fff',
											padding: '4px 8px',
											borderRadius: '4px',
											border: '1px solid #ddd',
											fontSize: '13px',
											color: '#d63384',
										}}
									>
										{item.herlang}
									</code>
								</div>
								<div>
									<div
										style={{
											fontSize: '12px',
											color: '#0969da',
											fontWeight: 'bold',
											marginBottom: '4px',
										}}
									>
										JavaScript 💻
									</div>
									<code
										style={{
											backgroundColor: '#fff',
											padding: '4px 8px',
											borderRadius: '4px',
											border: '1px solid #ddd',
											fontSize: '13px',
											color: '#0969da',
										}}
									>
										{item.js}
									</code>
								</div>
							</div>
						))}
					</div>
				</Card>
			))}

			<Card>
				<Title level={5} style={{ color: '#333', marginTop: 0 }}>
					💡 小贴士
				</Title>
				<ul style={{ color: '#666', lineHeight: '1.6' }}>
					<li>所有中文变量名会自动转换为合法的 JavaScript 变量名</li>
					<li>缩进表示代码块，就像 Python 一样</li>
					<li>
						冒号 <code>:</code> 表示代码块开始
					</li>
					<li>试试在左边的代码编辑器中写一些 HerLang 代码吧！</li>
				</ul>
			</Card>
		</div>
	)
}

const chapters = [
	{
		title: 'Chapter 0：语法教程',
		example: `// HerLang 语法对照表
// 点击运行查看转译结果

// 变量声明
宝宝你是一个 名字 我接受 "小仙女"

// 条件语句
姐妹们觉得呢 名字 是不是 "小仙女":
  小作文("你好，小仙女！")
我接受不等于我同意:
  小作文("你好，陌生人")`,
		isTutorial: true,
	},
	{
		title: 'Chapter 1：变量与赋值',
		example: `宝宝你是一个 分数 我接受 85
姐妹们觉得呢 分数 > 60:
  小作文("及格啦")
我接受不等于我同意:
  小作文("不及格～")`,
	},
	{
		title: 'Chapter 2：小仙女数学课',
		example: `// 小仙女的特色运算符
宝宝你是一个 工资 我接受 10000
宝宝你是一个 购物车 我接受 2000

// 买买买让快乐加倍！
宝宝你是一个 快乐 我接受 工资 买买买 购物车
小作文("买买买后的快乐值：" 拼单 快乐)

// 吃土让钱包减少
宝宝你是一个 余额 我接受 工资 吃土 购物车  
小作文("吃土后的余额：" 拼单 余额)

// 渣男让痛苦翻倍
宝宝你是一个 痛苦 我接受 5 渣男 2
小作文("遇到渣男的痛苦值：" 拼单 痛苦)

// 绿茶分裂友谊
宝宝你是一个 友谊 我接受 100 绿茶 10
小作文("遇到绿茶后的友谊值：" 拼单 友谊)`,
	},
	{
		title: 'Chapter 3：数据类型与表达式',
		example: `宝宝你是一个 姐妹数 我接受 3 拼单 2
小作文("你有姐妹" 拼单 姐妹数 拼单 "个")`,
	},
	{
		title: 'Chapter 3：控制流程',
		example: `宝宝你是一个 年龄 我接受 20
抛开事实不谈 年龄 > 18:
  小作文("成年了")
我接受不等于我同意:
  小作文("未成年")`,
	},
	{
		title: 'Chapter 4：循环结构',
		example: `宝宝你是一个 数 我接受 0
你再说一遍 数 < 3:
  小作文("数是" 拼单 数)
  数 我同意 数 拼单 1`,
	},
	{
		title: 'Chapter 5：函数 Function',
		example: `宝宝你是一个 打招呼 我接受 想要你一个态度(名字) {
  反手举报 "你好啊，" 拼单 名字
}

小作文(打招呼("小仙女"))`,
	},
	{
		title: 'Chapter 6：数据结构',
		example: `宝宝你是一个 爱好 我接受 ["唱歌", "跳舞", "编程"]
小作文("我喜欢的第一个爱好是" 拼单 爱好[0])`,
	},
	{
		title: 'Chapter 7：面向对象编程',
		example: `宝宝你是一个 小仙女 我接受 {
  "名字": "仙儿",
  "闪耀": 想要你一个态度() {
    反手举报 "我是" 拼单 小仙女.名字
  }
}
小作文(小仙女.闪耀())`,
	},
	{
		title: 'Chapter 8：布尔值处理',
		example: `宝宝你是一个 开心 我接受 那么普通却那么自信
宝宝你是一个 难过 我接受 那咋了

抛开事实不谈 开心:
  小作文("心情很好")
我接受不等于我同意:
  小作文("心情不好")`,
	},
	{
		title: 'Chapter 9：期末项目',
		example: `宝宝你是一个 打卡记录 我接受 []
宝宝你是一个 添加记录 我接受 想要你一个态度(内容) {
  打卡记录.push(内容)
  反手举报 "添加成功"
}

小作文(添加记录("小仙女上线"))
小作文(添加记录("HerLang 太好玩了！"))
小作文("所有记录:", 打卡记录)`,
	},
]

export default function HerlangPrototype() {
	const [selectedChapterIndex, setSelectedChapterIndex] = useState(0)
	const [code, setCode] = useState(chapters[0].example)
	const [output, setOutput] = useState('')
	const [jsCode, setJsCode] = useState('')
	const [tone, setTone] = useState('温柔')

	function runCode() {
		try {
			// 使用独立的 transpiler
			const js = transpileHerLang(code)
			setJsCode(js)

			let outputContent = ''

			// 创建 mock console
			const mockConsole = {
				log: (...args) => {
					const formatted = args
						.map((arg) => {
							if (typeof arg === 'object') {
								return JSON.stringify(arg, null, 2)
							}
							return String(arg)
						})
						.join(' ')
					outputContent += formatted + '\n'
				},
			}

			// 使用 eval 在受控环境中执行代码
			const safeEval = (code) => {
				// 创建一个隔离的作用域
				const func = new Function(
					'console',
					'Array',
					'Object',
					'JSON',
					'Math',
					`
					"use strict";
					${code}
				`
				)
				return func(mockConsole, Array, Object, JSON, Math)
			}

			safeEval(js)

			setOutput(outputContent || '（无输出）')
		} catch (e) {
			setOutput(`💥 小仙女爆炸啦：${e.message}\n\n🔍 调试信息：\n${js}`)
		}
	}

	const selectedChapter = chapters[selectedChapterIndex]
	const isTutorialPage = selectedChapter.isTutorial

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider
				width={260}
				style={{
					background: '#fff',
					padding: '1rem',
					position: 'fixed',
					height: '100vh',
					overflow: 'auto',
				}}
			>
				<Title level={4} style={{ color: '#ff69b4' }}>
					📚 HerLang 学习章节
				</Title>
				<Menu
					mode='inline'
					selectedKeys={[String(selectedChapterIndex)]}
					onClick={({ key }) => {
						const index = Number(key)
						setSelectedChapterIndex(index)
						setCode(chapters[index].example)
						setOutput('')
						setJsCode('')
					}}
					items={chapters.map((ch, idx) => ({
						key: String(idx),
						label: ch.title,
					}))}
					style={{ border: 'none' }}
				/>
			</Sider>

			<Layout>
				<Content
					style={{
						padding: '2rem',
						marginLeft: '260px', // 添加这行
					}}
				>
					{isTutorialPage ? (
						// 显示教程内容
						<>
							<TutorialContent />

							<Card style={{ marginBottom: '1rem' }}>
								<Title level={5} style={{ marginTop: 0, color: '#333' }}>
									🧪 试试这个例子
								</Title>
								<Editor
									height='200px'
									defaultLanguage='javascript'
									value={code}
									onChange={(val) => setCode(val || '')}
									options={{
										minimap: { enabled: false },
										fontSize: 14,
										wordWrap: 'on',
										lineNumbers: 'on',
										scrollBeyondLastLine: false,
										automaticLayout: true,
										theme: 'vs',
									}}
								/>
							</Card>

							<Space style={{ marginBottom: '1rem' }}>
								<Button
									type='primary'
									onClick={runCode}
									style={{
										background: '#ff69b4',
										borderColor: '#ff69b4',
									}}
									size='large'
								>
									🚀 运行示例
								</Button>
								<Button
									onClick={() => {
										setOutput('')
										setJsCode('')
									}}
									size='large'
								>
									🧹 清空输出
								</Button>
							</Space>

							<Card style={{ marginBottom: '1rem' }}>
								<Title level={5} style={{ marginTop: 0, color: '#333' }}>
									📣 运行结果
								</Title>
								<pre
									style={{
										whiteSpace: 'pre-wrap',
										backgroundColor: '#f8f9fa',
										padding: '16px',
										borderRadius: '6px',
										minHeight: '60px',
										border: '1px solid #e9ecef',
										fontSize: '14px',
										lineHeight: '1.5',
										margin: 0,
									}}
								>
									{output}
								</pre>
							</Card>

							{jsCode && (
								<Card>
									<Title level={5} style={{ marginTop: 0, color: '#333' }}>
										🔍 编译后的 JavaScript
									</Title>
									<pre
										style={{
											whiteSpace: 'pre-wrap',
											fontSize: '12px',
											color: '#666',
											backgroundColor: '#f1f3f4',
											padding: '12px',
											borderRadius: '4px',
											maxHeight: '200px',
											overflow: 'auto',
											border: '1px solid #dadce0',
											margin: 0,
										}}
									>
										{jsCode}
									</pre>
								</Card>
							)}
						</>
					) : (
						// 显示正常章节内容
						<>
							<Card style={{ marginBottom: '1rem' }}>
								<Typography>
									<Title level={3} style={{ color: '#ff69b4', margin: 0 }}>
										🧚 欢迎来到 {selectedChapter.title}
									</Title>
									<Paragraph style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
										快来写点 HerLang 情绪代码吧～
									</Paragraph>
								</Typography>
							</Card>

							<Card style={{ marginBottom: '1rem' }}>
								<Title level={5} style={{ marginTop: 0, color: '#333' }}>
									💻 代码编辑器
								</Title>
								<Editor
									height='300px'
									defaultLanguage='javascript'
									value={code}
									onChange={(val) => setCode(val || '')}
									options={{
										minimap: { enabled: false },
										fontSize: 14,
										wordWrap: 'on',
										lineNumbers: 'on',
										scrollBeyondLastLine: false,
										automaticLayout: true,
										theme: 'vs',
									}}
								/>
							</Card>

							<Space style={{ marginBottom: '1rem' }}>
								<Button
									type='primary'
									onClick={runCode}
									style={{
										background: '#ff69b4',
										borderColor: '#ff69b4',
									}}
									size='large'
								>
									🚀 运行代码
								</Button>
								<Button
									onClick={() => {
										setOutput('')
										setJsCode('')
									}}
									size='large'
								>
									🧹 清空输出
								</Button>
							</Space>

							<Card style={{ marginBottom: '1rem' }}>
								<Title level={5} style={{ marginTop: 0, color: '#333' }}>
									📣 小作文输出
								</Title>
								<pre
									style={{
										whiteSpace: 'pre-wrap',
										backgroundColor: '#f8f9fa',
										padding: '16px',
										borderRadius: '6px',
										minHeight: '80px',
										border: '1px solid #e9ecef',
										fontSize: '14px',
										lineHeight: '1.5',
										margin: 0,
									}}
								>
									{output}
								</pre>
							</Card>

							{jsCode && (
								<Card>
									<Title level={5} style={{ marginTop: 0, color: '#333' }}>
										🔍 编译后的 JavaScript
									</Title>
									<pre
										style={{
											whiteSpace: 'pre-wrap',
											fontSize: '12px',
											color: '#666',
											backgroundColor: '#f1f3f4',
											padding: '12px',
											borderRadius: '4px',
											maxHeight: '200px',
											overflow: 'auto',
											border: '1px solid #dadce0',
											margin: 0,
										}}
									>
										{jsCode}
									</pre>
								</Card>
							)}
						</>
					)}
				</Content>
			</Layout>
		</Layout>
	)
}
