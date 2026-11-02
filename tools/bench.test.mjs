// Run: node tools/bench.test.mjs
import { chart } from './bench.mjs';

const eq = (x, y, what) => { if (Math.abs(x - y) > 0.11) throw new Error(`${what}: ${x} != ${y}`); };
const points = (svg, cls) => svg.match(new RegExp(`path class="${cls}" d="([^"]+)"`))[1]
  .split(/(?=[ML])/).map(s => s.slice(1).split(' ').map(Number));
const labelY = (svg, cls) => Number(svg.match(new RegExp(`text class="${cls}" x="350" y="([\\d.]+)"`))[1]);

// Scale: highest value 12 ms rounds up to 15, ticks every 5.
let svg = chart([12, 0, 6, 3], [3.5, 3.5]);
const ticks = [...svg.matchAll(/text-anchor="end">(\d+)</g)].map(m => m[1]).join();
if (ticks !== '0,5,10,15') throw new Error('ticks ' + ticks);
const b = points(svg, 'before'), a = points(svg, 'after');
eq(b[0][0], 30, 'first x'); eq(b[0][1], 45.6, '12 ms');
eq(b[1][1], 180, '0 ms sits on the axis');
eq(b[2][0], 30 + 2 * 314 / 3, 'x spacing'); eq(b[2][1], 112.8, '6 ms');
eq(b[3][0], 344, 'last x'); eq(a[1][0], 344, 'after spans the plot'); eq(a[0][1], 140.8, '3.5 ms');
eq(labelY(svg, 'before'), 125.2, 'before label at its average');
eq(labelY(svg, 'after'), 144.8, 'after label at its average');

// Labels never overlap when the lines are close.
svg = chart([4, 4], [3.9, 3.9]);
eq(labelY(svg, 'after') - labelY(svg, 'before'), 18, 'label gap');

console.log('bench ok');
