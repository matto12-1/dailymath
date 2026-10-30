import { explain, say, reduction, mixedStep } from './solution-text.js?v=9a67f36b25';
import {define,meta,errors,wrong,f,frac,multiplyF,gcd} from './helpers.js?v=9a67f36b25';
export default define(meta('fracmul','story',3,'word',['01-09'],'여러 번 쓴 밀가루'),{
 input:'number',answerKind:'fraction',mixedInput:true,minMistakes:2,errorCount:2,answerUnit:'kg',
 texts:['빵을 한 번 구울 때 밀가루 {left} kg을 씁니다. {n}번 구우면 밀가루를 모두 몇 kg 쓸까요?','빵을 한 번 구울 때 밀가루 {left} kg을 씁니다. {n}번 구울 때 쓰는 밀가루는 모두 몇 kg일까요?'],
 draw: explain(function(rng) {const d=rng.int(2,12),a=rng.int(1,d-1),n=rng.int(2,5);if(gcd(a,d)!==1)return null;return {a,d,n,left:frac(0,a,d),...errors(wrong(frac(0,a*n,d*n),'분모에도 횟수 곱하기','분자 {a}뿐 아니라 분모 {d}에도 횟수 {n:을/를} 곱했습니다. 분모 {d:은/는} 그대로 두고 분자에 횟수 {n:을/를} 곱하면 {answer} kg입니다.'),wrong(f(a+n*d,d),'곱셈을 덧셈으로 읽기','한 번의 양 {left}에 횟수 {n:을/를} 더했습니다. {left} kg씩 {n}번 쓴 양은 {left} × {n} = {answer} kg입니다.'))};}, v => {const product=v.a*v.n,r=reduction(product,v.d);return ['한 번에 '+v.left+' kg씩 '+v.n+'번이므로 '+v.left+' × '+v.n+' = '+say(product+'/'+v.d), r.text,mixedStep(r.n,r.d)];}),
 answer:v=>f(v.a*v.n,v.d),check:v=>multiplyF(v.left,String(v.n)),art:()=>({scene:'flour-baking'}),
 solution: "{process}\n따라서 밀가루는 모두 {answer} kg입니다.",
});
