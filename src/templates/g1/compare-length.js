import { until } from '../../engine/retry.js?v=9a67f36b25';
import { numberVars, options, panelNumbers, NAMES, SOLID, FLAT, NAME_ERRORS, nameVars, nameMistakes } from './helpers.js?v=9a67f36b25';

export default {
  id: 'g1.compare.length', grade: 1, unit: 'g1s1-compare', strand: 'life', level: 1,
  label: '끈 길이 비교', std: ["[2수03-06]"],
  answerUnit: '번', input: 'choice', answerKind: 'int', maxDigits: 2,

  range: { min: 1, max: 4 }, operandRange: { min: 0, max: 99 },
  texts: ['가장 {asked} 끈은 어느 것일까요?'],
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
      p.thickness = 14;
    });
    const correct = largest ? bySize.at(-1).number : bySize[0].number;
    const opposite = largest ? bySize[0].number : bySize.at(-1).number;
    const pairs = null;
    return { panels, largest, pairs, oppositeAsked: largest?'짧은':'긴', extent: largest?'많이':'적게', paper: '종이', asked: largest ? '긴' : '짧은', wrong1: apparent, wrong2: opposite };
  },
  answer: ({ panels, largest }) => panels.reduce((best, p) => (largest ? p.measure > best.measure : p.measure < best.measure) ? p : best).number,
  check: ({ panels, largest }) => panels.slice().sort((a, b) => largest ? b.measure - a.measure : a.measure - b.measure)[0].number,
  choices: () => [1, 2, 3, 4],
  isCorrect: ({ panels, largest }, choice) => {
    const selected = panels.find((p) => p.number === choice);
    return !!selected && panels.every((p) => largest ? selected.measure >= p.measure : selected.measure <= p.measure);
  },
  mistakes: [
    {id:'middle',label:'끝까지 비교하지 않기',value:({wrong1})=>wrong1,say:'가운데 길이인 {value}번 끈을 골랐습니다. 네 끈의 오른쪽 끝을 모두 비교하면 가장 {asked} 끈은 {answer}번입니다.'},
    { id: 'opposite', label: '반대 뜻 고르기', value: ({ wrong2 }) => wrong2, say: '가장 {oppositeAsked} 끈인 {value}번을 골랐습니다. 왼쪽 끝을 맞추었을 때 오른쪽 끝이 가장 {extent} 나온 끈은 {answer}번입니다.' },
  ],
  art: ({ panels, pairs }) => ({ kind: 'compare', type: 'length', panels, pairs: null }),
  solution: "끈의 왼쪽 끝이 모두 맞추어져 있습니다.\n오른쪽 끝이 가장 {extent} 나온 끈을 찾습니다.\n따라서 가장 {asked} 끈은 {answer}번입니다.",

};
