// Builds the hero benchmark from bench.json and writes it into index.html between the bench markers.
// Run: node tools/bench.mjs
import fs from 'fs';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

// Frametime chart. viewBox 400x200, plot x 30..344, y 12..180, line labels right of the plot.
export function chart(before, after) {
  const top = Math.max(...before, ...after);
  const max = Math.max(5, Math.ceil(top / 5) * 5);
  const tick = max > 30 ? 10 : 5;
  const y = ms => +(12 + (max - Math.min(ms, max)) / max * 168).toFixed(1);
  const path = s => s.map((v, i) => `${i ? 'L' : 'M'}${+(30 + i * 314 / Math.max(1, s.length - 1)).toFixed(1)} ${y(v)}`).join('');
  const avg = s => s.reduce((a, b) => a + b, 0) / s.length;
  const afterY = y(avg(after)) + 4;
  const beforeY = Math.min(y(avg(before)) + 4, afterY - 18); // labels never overlap; before (slower) sits above
  let out = '<svg class="bench__chart" viewBox="0 0 400 200" role="img" aria-label="Frametime in milliseconds, before and after. Lower is smoother.">';
  for (let ms = 0; ms <= max; ms += tick) {
    out += `<line class="grid" x1="30" x2="344" y1="${y(ms)}" y2="${y(ms)}"/><text x="24" y="${y(ms) + 4}" text-anchor="end">${ms}</text>`;
  }
  out += '<text x="24" y="196" text-anchor="end">ms</text>';
  out += `<path class="before" d="${path(before)}"/><path class="after" d="${path(after)}"/>`;
  out += `<text class="before" x="350" y="${+beforeY.toFixed(1)}">Before</text><text class="after" x="350" y="${+afterY.toFixed(1)}">After</text>`;
  return out + '</svg>';
}

const readout = (name, [from, to]) => {
  const delta = Math.round((to - from) / Math.max(1, from) * 100);
  return `<div class="readout"><div class="readout__label">${name}</div><div class="readout__value"><span class="readout__from">${from}</span><span class="readout__to">${to}</span></div><div class="readout__delta">${delta > 0 ? '+' : ''}${delta}%</div></div>`;
};

export function figure(b) {
  return `<figure class="bench">
          <figcaption class="bench__title">${esc(b.title)}</figcaption>
          ${chart(b.before, b.after)}
          <div class="readouts">${readout('Average FPS', b.avg)}${readout('1% low FPS', b.low)}</div>
          <p class="bench__method">${esc(b.method)}</p>
        </figure>`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = new URL('..', import.meta.url).pathname;
  const html = fs.readFileSync(root + 'index.html', 'utf8');
  const b = JSON.parse(fs.readFileSync(root + 'bench.json', 'utf8'));
  const next = html.replace(/(<!-- bench -->)[\s\S]*?(<!-- \/bench -->)/, `$1\n        ${figure(b)}\n        $2`);
  if (next === html && !html.includes('<!-- bench -->')) throw new Error('bench markers missing in index.html');
  fs.writeFileSync(root + 'index.html', next);
  console.log('bench updated');
}
