// 화면의 줄바꿈만 정한다. 원래 묻는 글과 읽어 주는 글은 그대로 둔다.
const NUMBER = /(?:\d+(?:[.,]\d+)*|(?:열|스물|서른|마흔|쉰|예순|일흔|여든|아흔)?(?:한|두|세|네|다섯|여섯|일곱|여덟|아홉)|열|스무|스물|서른|마흔|쉰|예순|일흔|여든|아흔|첫째|둘째|셋째|넷째|다섯째|여섯째|일곱째|여덟째|아홉째|열째)$/;
const COUNTER = /^(?:번째|째|개|명|번|권|장|마리|송이|자루|대|살|원|시간|시|분|초|학년|반|모둠|조|묶음|줄|곳|칸|쌍|가지|배|통|병|상자|봉지|점|일|주|달|개월|년|차례|층|호|쪽|회|수|km|cm|mm|mL|kg|m|g|t|L)(?:[²³])?/;

export function numberUnitBoundary(left, right) {
  if (/\d+(?:이|가)$/.test(left) && /^\d+개/.test(right)) return true;
  if (/\d(?:시간|시|분)$/.test(left) && /^\d+(?:분|초)/.test(right)) return true;
  if (/\d\s*(?:km|cm|mm|mL|kg|m|g|t|L)[²³]?$/.test(left) && /^\d/.test(right)) return true;
  const word = left.trim().split(/\s+/).at(-1) ?? '';
  const match = word.match(NUMBER);
  return !!match && (match.index === 0 || !/[가-힣]/.test(word[match.index - 1])) && COUNTER.test(right.trimStart());
}

export const splitNumberCount = lines => lines.slice(1).reduce((n, line, i) => n + Number(numberUnitBoundary(lines[i], line)), 0);

export function promptSentences(text) {
  return String(text).split(/(?<=[^\s(][.?!])(?=\s+\S)/).map((text, i) => {
    const space = i ? text.match(/^\s*/)[0] : '';
    return { space, text: text.slice(space.length) };
  });
}

// 분수는 한 덩어리로 세고, 글자는 실제 자리로 모아 줄을 읽는다.
export function promptLineInfo(prompt) {
  const units = [];
  const walk = node => {
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        for (let i = 0; i < child.length; i++) {
          const text = child.data[i];
          if (/\s/.test(text)) { units.push({ text: ' ' }); continue; }
          const range = document.createRange(); range.setStart(child, i); range.setEnd(child, i + 1);
          const r = range.getBoundingClientRect();
          if (r.width || r.height) units.push({ text, r });
        }
      } else if (child.classList?.contains('fraction')) {
        const r = child.getBoundingClientRect(), [n, d] = [...child.querySelectorAll('.stack > span')].map(s => s.textContent), whole = child.querySelector('.whole')?.textContent;
        units.push({ text: `${whole ? whole + ' ' : ''}${n}/${d}`, r });
      } else if (child.nodeType === Node.ELEMENT_NODE) walk(child);
    }
  };
  if (prompt) walk(prompt);
  const lines = [];
  let prev = null;
  for (const u of units) {
    if (!u.r) { if (lines.length) lines.at(-1).text += ' '; continue; }
    if (!prev || u.r.left < prev.left - 1) lines.push({ text: '', rects: [] });
    lines.at(-1).text += u.text; lines.at(-1).rects.push(u.r); prev = u.r;
  }
  return lines;
}

// 문장별 줄바꿈을 잠깐 적용해, 현재 그림 크기에서 첫 화면 안에 드는지 직접 잰다.
export function sentencesFit(prompt) {
  const active = prompt.classList.contains('sentence-lines');
  prompt.classList.add('sentence-lines');
  const card = prompt.closest('.card'), q = card.querySelector(':scope > .q'), body = q.querySelector('.question-body');
  const shown = body ? [...body.children].filter(e => e.getClientRects().length) : [];
  const used = shown.length ? shown.at(-1).getBoundingClientRect().bottom - shown[0].getBoundingClientRect().top : 0;
  const cs = getComputedStyle(q), contentBottom = q.getBoundingClientRect().top + parseFloat(cs.paddingTop) + used + parseFloat(cs.paddingBottom);
  const bottom = Math.max(contentBottom, shown.at(-1)?.getBoundingClientRect().bottom + parseFloat(cs.paddingBottom) || 0, ...[q, card.querySelector(':scope > .a')].filter(Boolean).map(e => e.getBoundingClientRect().bottom));
  const fits = bottom + scrollY <= innerHeight + .5 && document.documentElement.scrollHeight <= innerHeight;
  prompt.classList.toggle('sentence-lines', active);
  return fits;
}
