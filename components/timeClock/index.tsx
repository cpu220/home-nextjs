'use client'

import React, { useEffect, useRef } from 'react'
import './index.css'

class Particle {
    size: number
    x: number
    y: number
    targetX: number
    targetY: number
    ctx: CanvasRenderingContext2D
    canvasWidth: number
    canvasHeight: number

    constructor(canvasWidth: number, canvasHeight: number, ctx: CanvasRenderingContext2D) {
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.ctx = ctx
        this.size = this.getRandom(2, 5)
        const r = Math.min(canvasWidth, canvasHeight) / 2
        const rad = (this.getRandom(0, 360) * Math.PI) / 180
        const cx = canvasWidth / 2
        const cy = canvasHeight / 2
        this.x = cx + r * Math.cos(rad)
        this.y = cy + r * Math.sin(rad)
        this.targetX = this.x
        this.targetY = this.y
    }

    private getRandom(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    draw() {
        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
        this.ctx.fillStyle = 'rgba(255,255,255,0.9)'
        this.ctx.fill()
    }

    moveTo(tx: number, ty: number) {
        this.targetX = tx
        this.targetY = ty
    }

    update() {
        const easing = 0.1
        const dx = this.targetX - this.x
        const dy = this.targetY - this.y
        this.x += dx * easing
        this.y += dy * easing
    }
}

class ParticleClock {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private particles: Particle[] = []
    private text: string = ''
    private animationId: number = 0
    private container: HTMLElement
    private resizeObserver: ResizeObserver | null = null

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

    private init() {
        this.resize()
        this.resizeObserver = new ResizeObserver(() => {
            this.resize()
        })
        this.resizeObserver.observe(this.container)
    }

    private resize() {
        const dpr = window.devicePixelRatio || 1
        const rect = this.container.getBoundingClientRect()
        this.canvas.width = rect.width * dpr
        this.canvas.height = rect.height * dpr
        this.canvas.style.width = `${rect.width}px`
        this.canvas.style.height = `${rect.height}px`
    }

    private getRandom(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    private getText() {
        return new Date().toTimeString().substring(0, 8)
    }

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

    start() {
        this.draw()
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId)
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect()
        }
    }
}

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
