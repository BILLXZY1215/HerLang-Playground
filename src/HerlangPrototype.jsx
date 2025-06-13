import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Button, Card, Typography, Menu, Layout, Radio, Space } from 'antd'
import { transpileHerLang } from './lib/transpiler.js'

const { Title, Paragraph } = Typography
const { Sider, Content } = Layout

const chapters = [
	{
		title: 'Chapter 1：变量与赋值',
		example: `宝宝你是一个 分数 我接受 85
姐妹们觉得呢 分数 > 60:
  小作文("及格啦")
我接受不等于我同意:
  小作文("不及格～")`,
	},
	{
		title: 'Chapter 2：数据类型与表达式',
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

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider width={260} style={{ background: '#fff', padding: '1rem' }}>
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
				<Content style={{ padding: '2rem' }}>
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
				</Content>
			</Layout>
		</Layout>
	)
}
