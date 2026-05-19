'use client'

import React, { useEffect, useRef } from 'react'
import './index.css'

/**
 * 粒子类 - 表示时钟中的一个粒子
 * 每个粒子有自己的位置、目标位置和绘制逻辑
 */
class Particle {
    size: number
    x: number
    y: number
    targetX: number
    targetY: number
    ctx: CanvasRenderingContext2D
    canvasWidth: number
    canvasHeight: number

    /**
     * 创建粒子实例
     * @param canvasWidth - Canvas 宽度
     * @param canvasHeight - Canvas 高度
     * @param ctx - Canvas 2D 渲染上下文
     */
    constructor(canvasWidth: number, canvasHeight: number, ctx: CanvasRenderingContext2D) {
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.ctx = ctx
        // 随机粒子大小，范围 1-3 像素
        this.size = this.getRandom(1, 3)
        // 粒子初始位置：随机分布在圆形区域内
        const r = Math.min(canvasWidth, canvasHeight) / 2
        const rad = (this.getRandom(0, 360) * Math.PI) / 180
        const cx = canvasWidth / 2
        const cy = canvasHeight / 2
        this.x = cx + r * Math.cos(rad)
        this.y = cy + r * Math.sin(rad)
        this.targetX = this.x
        this.targetY = this.y
    }

    /**
     * 生成指定范围内的随机整数
     * @param min - 最小值
     * @param max - 最大值
     * @returns 随机整数
     */
    private getRandom(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    /**
     * 绘制粒子
     * 使用圆形表示粒子，颜色为半透明白色
     */
    draw() {
        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
        this.ctx.fillStyle = 'rgba(255,255,255,0.5)'
        this.ctx.fill()
    }

    /**
     * 设置粒子的目标位置
     * @param tx - 目标 X 坐标
     * @param ty - 目标 Y 坐标
     */
    moveTo(tx: number, ty: number) {
        this.targetX = tx
        this.targetY = ty
    }

    /**
     * 更新粒子位置
     * 使用缓动动画让粒子平滑移动到目标位置
     */
    update() {
        const easing = 0.1
        const dx = this.targetX - this.x
        const dy = this.targetY - this.y
        this.x += dx * easing
        this.y += dy * easing
    }
}

/**
 * 粒子时钟类 - 管理整个粒子时钟的渲染和动画
 */
class ParticleClock {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private particles: Particle[] = []
    private text: string = ''
    private animationId: number = 0
    private container: HTMLElement
    private resizeObserver: ResizeObserver | null = null

    /**
     * 创建粒子时钟实例
     * @param canvas - Canvas 元素
     * @param container - 父容器元素，用于监听尺寸变化
     */
    constructor(canvas: HTMLCanvasElement, container: HTMLElement) {
        this.canvas = canvas
        const ctx = canvas.getContext('2d')
        if (!ctx) {
            throw new Error('Failed to get canvas context')
        }
        this.ctx = ctx
        this.container = container
        this.init()
    }

    /**
     * 初始化时钟
     * 设置初始尺寸并监听容器尺寸变化
     */
    private init() {
        this.resize()
        this.resizeObserver = new ResizeObserver(() => {
            this.resize()
        })
        this.resizeObserver.observe(this.container)
    }

    /**
     * 调整 Canvas 尺寸以适应容器
     * 考虑设备像素比（DPR）实现高清显示
     */
    private resize() {
        const dpr = window.devicePixelRatio || 1
        const rect = this.container.getBoundingClientRect()
        this.canvas.width = rect.width * dpr
        this.canvas.height = rect.height * dpr
        this.canvas.style.width = `${rect.width}px`
        this.canvas.style.height = `${rect.height}px`
    }

    /**
     * 获取当前时间字符串（格式：HH:MM:SS）
     * @returns 时间字符串
     */
    private getText() {
        return new Date().toTimeString().substring(0, 8)
    }

    /**
     * 获取文字像素点坐标
     * 在 Canvas 上绘制黑色文字，然后扫描像素数据获取非透明像素的位置
     * @returns 像素点坐标数组 [x, y][]
     */
    private getPoints() {
        const points: [number, number][] = []
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        const data = imageData.data
        const gap = 4

        for (let i = 0; i < this.canvas.width; i += gap) {
            for (let j = 0; j < this.canvas.height; j += gap) {
                const index = (j * this.canvas.width + i) * 4
                const r = data[index]
                const g = data[index + 1]
                const b = data[index + 2]
                const a = data[index + 3]
                if (r === 0 && g === 0 && b === 0 && a === 255) {
                    points.push([i, j])
                }
            }
        }
        return points
    }

    /**
     * 更新时钟状态
     * 如果时间变化，重新绘制文字并更新粒子目标位置
     */
    private update() {
        const curText = this.getText()
        if (this.text === curText) {
            return
        }

        this.text = curText

        const { width, height } = this.canvas
        this.ctx.fillStyle = '#000'
        this.ctx.textBaseline = 'middle'
        this.ctx.font = `bold ${height / 2}px 'Courier New', Courier, monospace`
        this.ctx.textAlign = 'center'
        this.ctx.fillText(this.text, width / 2, height / 2)

        const points = this.getPoints()
        this.ctx.clearRect(0, 0, width, height)

        for (let i = 0; i < points.length; i++) {
            const [x, y] = points[i]
            let p = this.particles[i]
            if (!p) {
                p = new Particle(width, height, this.ctx)
                this.particles.push(p)
            }
            p.moveTo(x, y)
        }

        if (points.length < this.particles.length) {
            this.particles.splice(points.length)
        }
    }

    /**
     * 绘制动画帧
     * 清空画布、更新状态、绘制所有粒子
     */
    private draw() {
        const { width, height } = this.canvas
        this.ctx.clearRect(0, 0, width, height)
        this.update()

        for (const p of this.particles) {
            p.update()
            p.draw()
        }

        this.animationId = requestAnimationFrame(() => this.draw())
    }

    /**
     * 启动时钟动画
     */
    start() {
        this.draw()
    }

    /**
     * 停止时钟动画并清理资源
     */
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId)
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect()
        }
    }
}

/**
 * 粒子时钟 React 组件
 * 封装 ParticleClock 类，提供 React 接口
 */
const TimeClock: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const clockRef = useRef<ParticleClock | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        clockRef.current = new ParticleClock(canvas, container)
        clockRef.current.start()

        return () => {
            clockRef.current?.stop()
        }
    }, [])

    return (
        <div ref={containerRef} className="timeClock">
            <canvas ref={canvasRef} className="timeClock__canvas" />
        </div>
    )
}

export default TimeClock
