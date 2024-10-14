export function range(start: number, end: number, step: number = 1) {
    return Array.from({ length: Math.floor((end - start) / step) + 1 }, (_, i) => start + (i * step))
}
export function rangeFill(length: number, char: string = '0') {
    return Array.from({ length }, () => char)
}