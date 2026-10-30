import { define, seq, unique, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.three.place","unit":"g2s1-numbers-three-digits","strand":"calc","level":2,"label":"자릿값 읽기","std":["[2수01-02]"]}, {

  range: { min: 0, max: 999 }, operandRange: { min: 0, max: 999 }, differentDigits: true,errorCount:2,
  // 세 자릿값의 간격이 10배씩이므로 가운데 답은 평균에 가장 가깝다. 자리별 문제를 고르게 섞어 전체 쏠림을 막는다.
  choiceRiskCaps:[.5,.5,1],
  answerSpan: unique(seq(0, 2).flatMap((p) => seq(1,9).map((d) => d * 10 ** p))),
  texts: ['〔{n}〕{position} 자리의 숫자 {d:은/는} 얼마를 나타낼까요?'],
  draw(rng) {
    const ds = Array.from({length:3},()=>rng.int(1,9)), p = rng.int(0,2);
    const n = ds.reduce((n,d,i) => n + d * 10 ** i, 0), d = ds[p], place = 10 ** p;
    const positionName=['일','십','백','천'][p];
    const powers=seq(0,2).filter(k=>k!==p);
    return {n,d,p,position:['일의','십의','백의','천의'][p],...errors(...powers.map(k=>wrong(d*10**k,positionName+'의 값을 '+['일','십','백','천'][k]+'의 값으로 읽기',d+'을 '+(d*10**k)+'으로 읽었습니다. '+['일','십','백','천'][k]+'의 값 대신 '+positionName+'의 값으로 읽으면 '+place+'이 '+d+'개이므로 '+(d*place)+'입니다.')))};
  },
  candidates: ({ n }) => unique(seq(1,9).flatMap((d) => seq(0,2).map((p) => d*10**p))),
  answer: ({ n, p }) => Math.floor(n / 10 ** p) % 10 * 10 ** p,
  check: ({ n, p }) => Number(String(n).at(-p-1)) * Number('1'+'0'.repeat(p)),
  solution: "{d:은/는} {position} 자리에 있습니다.\n따라서 {d:이/가} 나타내는 수는 {answer}입니다.",
});
