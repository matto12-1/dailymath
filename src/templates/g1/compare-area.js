import { explain } from '../solution-process.js?v=9a67f36b25';
import { until } from '../../engine/retry.js?v=9a67f36b25';
import { numberVars, options, panelNumbers, NAMES, SOLID, FLAT, NAME_ERRORS, nameVars, nameMistakes } from './helpers.js?v=9a67f36b25';

export default {
  id: 'g1.compare.area', grade: 1, unit: 'g1s1-compare', strand: 'life', level: 3,
  label: '종이 넓이 비교', std: ["[2수03-06]"],
  answerUnit: '번', input: 'choice', answerKind: 'int', maxDigits: 2,

  range: { min: 1, max: 4 }, operandRange: { min: 0, max: 99 },
  texts: ['가장 {asked} {paper:은/는} 어느 것일까요?'],
  make: explain(function(rng) {
    const largest = rng.pick([true, false]);
    const layouts = until(() => {
      const xs = Array.from({ length: 4 }, () => [rng.int(1, 7), rng.int(1, 5)]);
      const areas = xs.map(([w, h]) => w * h).sort((a, b) => a - b);
      if (new Set(areas).size !== 4 || areas[1] < areas[0] * 1.5 || areas[3] < areas[2] * 1.5) return null;
      const correct = largest ? areas[3] : areas[0], opposite = largest ? areas[0] : areas[3];
      const sides = xs.map(([w, h]) => Math.max(w, h)), edge = (largest ? Math.max : Math.min)(...sides);
      if (sides.filter((n) => n === edge).length !== 1) return null;
      const [w, h] = xs[sides.indexOf(edge)];
      return [correct, opposite].includes(w * h) ? null : xs;
    });
    let panels = rng.shuffle(layouts.map(([w, h]) => ({ w, h, measure: w * h }))).map((p, i) => ({ ...p, number: i + 1 }));
    let bySize = panels.slice().sort((a, b) => a.measure - b.measure);
    const targetMeasure = largest ? bySize.at(-1).measure : bySize[0].measure;
    panels = panelNumbers(rng, panels, (p) => p.measure === targetMeasure);
    bySize = panels.slice().sort((a, b) => a.measure - b.measure);
    // 긴 변의 길이만 비교하면 실제 넓이와 다른 물건을 고르게 된다.
    const side = (largest ? Math.max : Math.min)(...panels.map((p) => Math.max(p.w, p.h)));
    const apparent = panels.find((p) => Math.max(p.w, p.h) === side).number;
    const correct = largest ? bySize.at(-1).number : bySize[0].number;
    const opposite = largest ? bySize[0].number : bySize.at(-1).number;
    const pairs = null;
    return { panels, largest, pairs, oppositeAsked: largest?'좁은':'넓은', paper: '종이', asked: largest ? '넓은' : '좁은', wrong1: apparent, wrong2: opposite };
  }, v => {
    const target=v.panels.reduce((best,p)=>(v.largest?p.measure>best.measure:p.measure<best.measure)?p:best);
    const contained=[], lines=[];
    for(const p of v.panels.filter(p=>p!==target)){
      const small=target.measure<p.measure?target:p, big=small===target?p:target;
      if(small.w<=big.w&&small.h<=big.h)contained.push(p.number+'번');
      else lines.push(target.number+'번과 '+p.number+'번을 포개면 '+big.number+'번에 남는 부분이 더 큽니다.');
    }
    if(contained.length)lines.unshift(contained.join('과 ')+(v.largest?'은 '+target.number+'번에 포개면 그 안에 쏙 들어갑니다.':'에 '+target.number+'번을 포개면 그 안에 쏙 들어갑니다.'));
    return lines;
  }),
  answer: ({ panels, largest }) => panels.reduce((best, p) => (largest ? p.measure > best.measure : p.measure < best.measure) ? p : best).number,
  check: ({ panels, largest }) => panels.slice().sort((a, b) => largest ? b.measure - a.measure : a.measure - b.measure)[0].number,
  choices: () => [1, 2, 3, 4],
  isCorrect: ({ panels, largest }, choice) => {
    const selected = panels.find((p) => p.number === choice);
    return !!selected && panels.every((p) => largest ? selected.measure >= p.measure : selected.measure <= p.measure);
  },
  mistakes: [
    { id: 'appearance', label: '긴 변만 보고 고르기', value: ({ wrong1 }) => wrong1, say: '종이의 긴 쪽만 보고 {value}번을 골랐습니다. 다른 종이와 포개어 긴 변뿐 아니라 남는 부분도 비교하면 가장 {asked} 종이는 {answer}번입니다.' },
    { id: 'opposite', label: '반대 뜻 고르기', value: ({ wrong2 }) => wrong2, say: '가장 {oppositeAsked} 종이인 {value}번을 골랐습니다. 다른 종이와 포개어 남는 부분의 크기를 비교하면 가장 {asked} 종이는 {answer}번입니다.' },
  ],
  art: ({ panels, pairs }) => ({ kind: 'compare', type: 'area', panels, pairs: null }),
  solution: "{process}\n따라서 가장 {asked} 종이는 {answer}번입니다.",

};
