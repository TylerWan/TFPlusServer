export function testBit(num: number, bit: number) {
    return ((num >> bit) % 2 !== 0);
}
export function setBit(num: number, bit: number) {
    return num | 1 << bit;
}
export function clearBit(num: number, bit: number) {
    return num & ~(1<<bit);
}
export function toggleBit(num: number, bit: number) {
    return testBit(num, bit) ? clearBit(num, bit) : setBit(num, bit);
}
