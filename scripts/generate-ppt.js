import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import PPTX from 'pptxgenjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const mdPath = path.resolve(__dirname, '../docs/vue_interview_qas.md')
if (!fs.existsSync(mdPath)) {
    console.error('文档未找到:', mdPath)
    process.exit(1)
}
const md = fs.readFileSync(mdPath, 'utf8')

// 更智能的解析：按 '## ' 分节，节内提取说明段落和代码块。
const sections = md.split(/^##\s+/m).map(s => s.trim()).filter(Boolean)
const pptx = new PPTX()

// Title slide
const titleSlide = pptx.addSlide()
titleSlide.addText('Vue 面试详解 - 常见问答', { x: 0.5, y: 0.8, fontSize: 28, bold: true })

function splitSectionContent(sec) {
    // 返回 { heading, paragraphs: [], codeBlocks: [] }
    const lines = sec.split(/\r?\n/)
    let heading = ''
    const paragraphs = []
    const codeBlocks = []
    let inCode = false
    let currentCode = []
    let currentPara = []

    for (let i = 0; i < lines.length; i++) {
        const raw = lines[i]
        const line = raw.replace(/\t/g, '    ')
        if (i === 0) {
            heading = line.replace(/^#+\s*/, '').trim()
            continue
        }
        if (line.trim().startsWith('```')) {
            if (!inCode) {
                inCode = true
                currentCode = []
            } else {
                inCode = false
                codeBlocks.push(currentCode.join('\n'))
            }
            continue
        }
        if (inCode) {
            currentCode.push(line)
            continue
        }
        // 非空行加入段落缓冲
        if (line.trim() === '') {
            if (currentPara.length) {
                paragraphs.push(currentPara.join(' '))
                currentPara = []
            }
        } else {
            currentPara.push(line.trim())
        }
    }
    if (currentPara.length) paragraphs.push(currentPara.join(' '))
    return { heading, paragraphs, codeBlocks }
}

// For each section, create slides: heading, paragraphs (as bullets), and code slides
sections.forEach((sec) => {
    const { heading, paragraphs, codeBlocks } = splitSectionContent(sec)
    if (!heading) return

    // Heading slide (consistent title position)
    const hSlide = pptx.addSlide()
    hSlide.addText(heading, { x: 0.5, y: 0.4, fontSize: 24, bold: true })

    // Paragraphs -> bullets slide (group into up to 6 bullets per slide)
    const chunkSize = 6
    for (let i = 0; i < paragraphs.length; i += chunkSize) {
        const chunk = paragraphs.slice(i, i + chunkSize)
        const pSlide = pptx.addSlide()
        pSlide.addText(heading + ' — 说明', { x: 0.5, y: 0.4, fontSize: 18, bold: true })
        pSlide.addText(chunk.map(s => s.replace(/`/g, '')).join('\n'), {
            x: 0.6,
            y: 1.1,
            w: 8.0,
            h: 4.5,
            fontSize: 14,
            color: '333333',
            bullet: true,
            lineSpacing: 18
        })
    }

    // Code blocks -> each a code slide with gray background text box
    codeBlocks.forEach((code) => {
        const codeSlide = pptx.addSlide()
        codeSlide.addText(heading + ' — 示例代码', { x: 0.5, y: 0.4, fontSize: 18, bold: true })
        // Code box
        codeSlide.addText(code, {
            x: 0.5,
            y: 1.1,
            w: 9.0,
            h: 5.0,
            fontSize: 11,
            color: '111111',
            fontFace: 'Courier New',
            margin: 0.1,
            align: 'left',
            valign: 'top',
            isTextBox: true,
            fill: { color: 'f3f3f3' }
        })
    })
})

const outPath = path.resolve(__dirname, '../docs/vue_interview_qas_generated.pptx')
console.log('正在生成 PPTX 到:', outPath)
try {
    await pptx.writeFile({ fileName: outPath })
    console.log('生成完成:', outPath)
} catch (err) {
    console.error('生成失败:', err)
    process.exit(1)
}
