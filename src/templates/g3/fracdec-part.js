import { define, wrong, errors } from './helpers.js?v=9a67f36b25';
import { frac } from '../../engine/answer.js?v=9a67f36b25';

export default define({ id:'g3.fracdec.part', unit:'g3s1-fractions-decimals', strand:'life', level:1, label:'색칠한 부분의 분수', std:['[4수01-09]'] }, {
  input:'number', answerKind:'fraction', errorCount:2,
  texts:["색칠한 부분을 분수로 나타내면 얼마일까요?","색칠한 부분을 분수로 나타내면 얼마일까요?"],
  draw(rng) {
    const d=rng.int(3,9), n=rng.int(1,d-1);
    if(n*2===d) return null;
    const start=rng.int(0,d-1),cells=Array.from({length:d},(_,i)=>(i-start+d)%d<n);
    return {d,n,start,cells,orientation:'horizontal',
      ...errors(wrong(frac(0,n,d-n),'남은 칸을 분모로 쓰기',`색칠하지 않은 ${d-n}칸을 분모로 써서 ${n}/${d-n}을 썼습니다. 전체를 나눈 칸은 ${d}칸이므로 색칠한 부분은 ${n}/${d}입니다.`),
        wrong(frac(0,d,n),'전체와 부분 뒤바꾸기','전체와 부분을 뒤바꾸어 {d}/{n:을/를} 썼습니다. 전체 {d}칸 중 {n}칸에 색칠했으므로 {n}/{d}입니다.')),rest:d-n};
  },
  answer:({n,d})=>frac(0,n,d),check:({cells})=>`${cells.filter(Boolean).length}/${cells.length}`,
  // 띠는 가로로만 그린다. 세로 띠는 폰에서 답 칸을 한참 아래로 밀었다(검수 12번).
  art:({d,n,start,orientation})=>({kind:'band',parts:d,shaded:n,start,orientation}),
  solution:"전체를 똑같이 나눈 {d}칸 중 {n}칸에 색칠했습니다.\n따라서 색칠한 부분은 전체의 {answer:입니다}.",
});
