"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mersenneTwister(seed) {
    const N = 624;
    const M = 397;
    const MATRIX_A = 0x9908b0df;
    const UPPER_MASK = 0x80000000;
    const LOWER_MASK = 0x7fffffff;
    const MAG01 = [0, MATRIX_A];
    const mt = new Uint32Array(N);
    let mti = 0;
    mt[0] = seed >>> 0;
    for (mti = 1; mti < N; mti++) {
        mt[mti] = (1812433253 * (mt[mti - 1] ^ (mt[mti - 1] >>> 30)) + mti) >>> 0;
    }
    function int32() {
        let y;
        if (mti >= N) {
            let kk = 0;
            for (; kk < N - M; kk++) {
                y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK);
                mt[kk] = mt[kk + M] ^ (y >>> 1) ^ MAG01[y & 1];
            }
            for (; kk < N - 1; kk++) {
                y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK);
                mt[kk] = mt[kk + (M - N)] ^ (y >>> 1) ^ MAG01[y & 1];
            }
            y = (mt[N - 1] & UPPER_MASK) | (mt[0] & LOWER_MASK);
            mt[N - 1] = mt[M - 1] ^ (y >>> 1) ^ MAG01[y & 1];
            mti = 0;
        }
        y = mt[mti++];
        y ^= y >>> 11;
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= y >>> 18;
        return y >>> 0;
    }
    function real1() {
        return int32() * (1.0 / 4294967295.0);
    }
    function random() {
        return int32() * (1.0 / 4294967296.0);
    }
    function real3() {
        return (int32() + 0.5) * (1.0 / 4294967296.0);
    }
    function res53() {
        const a = int32() >>> 5;
        const b = int32() >>> 6;
        return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    }
    return { int32, real1, random, real3, res53 };
}
exports.default = mersenneTwister(Date.now());
