import {define,meta,casesSpec,errors,wrong,pairs} from './helpers.js?v=9a67f36b25';
const cases=pairs(3,20,2,14,(a,b)=>a*b%2===0&&a*b/2!==a+b).map(({a,b:h})=>({a,h})),answer=v=>v.a*v.h/2;
export default define(meta('area','story',5,'word',['03-14'],'삼각형 텃밭의 넓이'),{
 input:'number',answerUnit:' m²',texts:['삼각형 텃밭의 밑변은 {a} m, 높이는 {h} m입니다. 넓이는 몇 m²일까요?','밑변이 {a} m이고 높이가 {h} m인 삼각형 텃밭의 넓이는 몇 m²일까요?'],
 ...casesSpec(cases,answer,v=>Number(BigInt(v.a)*BigInt(v.h)/2n),v=>({...v,...errors(wrong(v.a*v.h,'2로 나누지 않기','밑변 {a:과/와} 높이 {h:을/를} 곱한 뒤 2로 나누지 않았습니다. 빠뜨린 나눗셈까지 하면 {a} × {h} ÷ 2 = {answer} m²입니다.'),wrong(v.a+v.h,'밑변과 높이 더하기','밑변 {a} m와 높이 {h} m를 더했습니다. 두 길이를 더하는 대신 곱한 뒤 2로 나누면 {a} × {h} ÷ 2 = {answer} m²입니다.'))})),
 art:()=>({scene:'garden-triangle'}),solution:'삼각형의 넓이는 (밑변) × (높이) ÷ 2이므로 {a} × {h} ÷ 2 = {answer:입니다}.\n따라서 삼각형 텃밭의 넓이는 {answer} m²입니다.',
});
