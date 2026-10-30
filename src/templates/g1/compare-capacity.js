import { until } from '../../engine/retry.js?v=9a67f36b25';
import { numberVars, options, panelNumbers, NAMES, SOLID, FLAT, NAME_ERRORS, nameVars, nameMistakes } from './helpers.js?v=9a67f36b25';

export default {
  id: 'g1.compare.capacity', grade: 1, unit: 'g1s1-compare', strand: 'life', level: 3,
  label: '그릇 들이 비교', std: ["[2수03-06]"],
  answerUnit: '번', input: 'choice', answerKind: 'int', maxDigits: 2,

  range: { min: 1, max: 4 }, operandRange: { min: 0, max: 99 },
  texts: ['그릇에 물을 가득 담아 모양과 크기가 같은 컵에 옮겼습니다. 물을 가장 {asked} 담을 수 있는 그릇은 어느 것일까요?'],
  make(rng) {
    const largest = rng.pick([true, false]);
    const measures = rng.shuffle(until(() => { const xs = Array.from({ length: 4 }, () => rng.int(1, 8)).sort((a, b) => a - b); return new Set(xs).size === 4 && xs[1] >= xs[0] * 1.5 && xs[3] >= xs[2] * 1.5 ? xs : null; }));
    let panels = measures.map((measure, i) => ({ number: i + 1, measure }));
    let bySize = panels.slice().sort((a, b) => a.measure - b.measure);
    const targetMeasure = largest ? bySize.at(-1).measure : bySize[0].measure;
    panels = panelNumbers(rng, panels, (p) => p.measure === targetMeasure);
    bySize = panels.slice().sort((a, b) => a.measure - b.measure);
    const apparent = bySize[1].number;
    panels.forEach((p) => {
      p.height = p.number === apparent ? (largest ? 78 : 32) : 55;
      p.width = 30 + p.measure * 6;
    });
    const correct = largest ? bySize.at(-1).number : bySize[0].number;
    const opposite = largest ? bySize[0].number : bySize.at(-1).number;
    const pairs = null;
    return { panels, largest, pairs, oppositeAsked: largest?'적게':'많이', heightWord:largest?'높은':'낮은', paper: '종이', asked: largest ? '많이' : '적게', wrong1: apparent, wrong2: opposite };
  },
  answer: ({ panels, largest }) => panels.reduce((best, p) => (largest ? p.measure > best.measure : p.measure < best.measure) ? p : best).number,
  check: ({ panels, largest }) => panels.slice().sort((a, b) => largest ? b.measure - a.measure : a.measure - b.measure)[0].number,
  choices: () => [1, 2, 3, 4],
  isCorrect: ({ panels, largest }, choice) => {
    const selected = panels.find((p) => p.number === choice);
    return !!selected && panels.every((p) => largest ? selected.measure >= p.measure : selected.measure <= p.measure);
  },
  mistakes: [
    { id: 'appearance', label: '높이만 보고 고르기', value: ({ wrong1 }) => wrong1, say: '{value}번 그릇의 높이만 보았습니다. 같은 컵으로 옮긴 물의 높이가 가장 {heightWord} 그릇은 {answer}번입니다.' },
    { id: 'opposite', label: '반대 뜻 고르기', value: ({ wrong2 }) => wrong2, say: '물을 가장 {oppositeAsked} 담는 그릇인 {value}번을 골랐습니다. 물의 높이가 반대인 컵을 찾아 비교하면 물을 가장 {asked} 담는 그릇은 {answer}번입니다.' },
  ],
  art: ({ panels, pairs }) => ({ kind: 'compare', type: 'capacity', panels, pairs: null }),
  solution: "컵에 옮긴 물의 높이를 비교합니다.\n컵의 물이 가장 {heightWord} 것을 찾습니다.\n따라서 물을 가장 {asked} 담을 수 있는 그릇은 {answer}번입니다.",

};
