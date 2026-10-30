import { explain } from '../solution-process.js?v=9a67f36b25';
import { until } from '../../engine/retry.js?v=9a67f36b25';
import { numberVars, options, NAMES, SOLID, FLAT, NAME_ERRORS, nameVars, nameMistakes } from './helpers.js?v=9a67f36b25';

export default {
  id: 'g1.compare.weight', grade: 1, unit: 'g1s1-compare', strand: 'life', level: 2,
  label: '무거운 물건 찾기', std: ["[2수03-06]"],
  answerUnit: '번', input: 'choice', answerKind: 'int', maxDigits: 2,

  range: { min: 1, max: 3 }, operandRange: { min: 0, max: 99 },
  texts: ['가장 무거운 물건은 어느 것일까요?'],
  make: explain(function(rng) {
    const largest = true;
    const measures = rng.shuffle(until(() => { const xs = Array.from({ length: 3 }, () => rng.int(1, 9)).sort((a, b) => a - b); return xs[1] >= xs[0] * 1.5 && xs[2] >= xs[1] * 1.5 ? xs : null; }));
    const panels = measures.map((measure, i) => ({ number: i + 1, measure }));
    const bySize = panels.slice().sort((a, b) => a.measure - b.measure);
    const apparent = bySize[1].number;
    panels.forEach((p) => {
      p.size = p.number === apparent ? (28) : 20;
    });
    const correct = largest ? bySize.at(-1).number : bySize[0].number;
    const opposite = largest ? bySize[0].number : bySize.at(-1).number;
    const pairs = rng.shuffle([[bySize[1].number, bySize[0].number], [bySize[1].number, bySize[2].number]].map(pair=>rng.shuffle(pair)));
    return { panels, largest, pairs, paper: '종이', asked: largest ? '많이' : '적게', wrong1: apparent, wrong2: opposite };
  }, v => v.pairs.map(pair => { const ps=pair.map(n=>v.panels.find(p=>p.number===n)); const best=ps.reduce((a,b)=>(v.largest?a.measure>b.measure:a.measure<b.measure)?a:b); return pair.join('번과 ')+'번을 올린 저울에서는 '+best.number+'번이 더 '+(v.largest?'무겁습니다.':'가볍습니다.'); })),
  answer: ({ panels, largest }) => panels.reduce((best, p) => (largest ? p.measure > best.measure : p.measure < best.measure) ? p : best).number,
  check: ({ panels, largest }) => panels.slice().sort((a, b) => largest ? b.measure - a.measure : a.measure - b.measure)[0].number,
  choices: () => [1, 2, 3],
  isCorrect: ({ panels, largest }, choice) => {
    const selected = panels.find((p) => p.number === choice);
    return !!selected && panels.every((p) => largest ? selected.measure >= p.measure : selected.measure <= p.measure);
  },
  mistakes: [
    { id: 'appearance', label: '겉크기만 보고 고르기', value: ({ wrong1 }) => wrong1, say: '{value}번 물건의 크기만 보고 골랐습니다. 두 저울에서 내려간 접시의 물건을 비교하면 가장 무거운 물건은 {answer}번입니다.' },
    { id: 'opposite', label: '반대 뜻 고르기', value: ({ wrong2 }) => wrong2, say: '가장 가벼운 {value}번 물건을 골랐습니다. 올라간 접시보다 내려간 접시의 물건이 무거우므로 가장 무거운 물건은 {answer}번입니다.' },
  ],
  art: ({ panels, pairs }) => ({ kind: 'compare', type: 'weight', panels, pairs }),
  solution: "저울에서 내려간 쪽이 더 무겁습니다. \n{process}\n따라서 가장 무거운 물건은 {answer}번입니다.",

};
