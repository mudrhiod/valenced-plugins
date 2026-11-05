import { Tokens } from '@valenced/discord/common/tokens'

// ps: give bettuh name for this function <3
export function accentGradient(...prefixes: string[]): Record<string, string> {
    return Object.fromEntries(
        prefixes.flatMap((prefix) => {
            const names = Object.keys(Tokens.RawColor)
                .filter(name => name.startsWith(prefix))
                .sort((a, b) => Number(a.slice(prefix.length)) - Number(b.slice(prefix.length)))

            const variants = generateHexVariants('9ec1ff', names.length)
            return names.map((name, i) => [name, variants[i]] as [string, string])
        })
    )
}

function generateHexVariants(hex: string, count: number): string[] {
    const { h, s, v: baseV } = hexToHsv(hex)
    
    const dropPattern = [4, 3, 2, 1]
    const totalDrop = Array.from({ length: Math.max(0, count - 1) }, (_, i) => dropPattern[i % dropPattern.length])
        .reduce((sum, drop) => sum + drop, 0)
    const dropScale = totalDrop > 0 ? Math.min(1, 80 / totalDrop) : 1

    let currentV = baseV
    return Array.from({ length: count }, (_, i) => {
        const variant = i === 0 ? `#${hex}` : hsvToHex(h, s, currentV)
        currentV -= dropPattern[i % dropPattern.length] * dropScale
        return variant
    })
}

function hexToHsv(hex: string): { h: number; s: number; v: number } {
    const [r, g, b] = hex.match(/.{2}/g)!.map(x => parseInt(x, 16) / 255)
    const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min

    let h = 0
    if (delta !== 0) {
        if (max === r) h = ((g - b) / delta) % 6
        else if (max === g) h = (b - r) / delta + 2
        else h = (r - g) / delta + 4
    }

    return {
        h: Math.round(((h * 60) + 360) % 360),
        s: Math.round((max === 0 ? 0 : delta / max) * 100),
        v: Math.round(max * 100),
    }
}

function hsvToHex(h: number, s: number, v: number): string {
    const [sc, vc] = [s / 100, v / 100]
    const c = vc * sc
    const x = c * (1 - Math.abs((h / 60) % 2 - 1))
    const m = vc - c
    
    let [r, g, b] = 
        h < 60 ? [c, x, 0] :
        h < 120 ? [x, c, 0] :
        h < 180 ? [0, c, x] :
        h < 240 ? [0, x, c] :
        h < 300 ? [x, 0, c] : [c, 0, x]

    const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0')
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}