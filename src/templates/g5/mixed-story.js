import {define,meta,casesSpec,errors,wrong} from './helpers.js?v=9a67f36b25';
const cases=[];for(let a=2;a<=9;a++)for(let b=2;b<=9;b++)for(let d=2;d<=6;d++)for(let k=1;k<=5;k++)if(a*b%d===0&&d*k<a)cases.push({a,b,c:d*k,d});
const answer=v=>(v.a*v.b+v.c)/v.d;
export default define(meta('mixed','story',3,'word',['01-01'],'연필을 모아 나누기'),{
 input:'number',answerUnit:'개',texts:['연필 {a}개씩 {b}묶음과 낱개 {c}개가 있습니다. {d}명에게 똑같이 나누면 한 명은 몇 개를 받을까요?','연필 한 묶음은 {a}개입니다. {b}묶음과 낱개 {c}개를 {d}명이 똑같이 나누면 한 명은 몇 개를 받을까요?'],
 ...casesSpec(cases,answer,v=>v.a*v.b/v.d+v.c/v.d,v=>({...v,bundled:v.a*v.b,total:v.a*v.b+v.c,...errors(wrong(v.a*v.b+v.c/v.d,'낱개만 나누기','낱개 {c}개만 {d}명에게 나누고 {bundled}개는 나누지 않았습니다. 모은 연필을 모두 나누면 ({bundled} + {c}) ÷ {d} = {answer}개입니다.'),wrong(v.a*v.b/v.d,'낱개 빠뜨리기','낱개 {c}개를 빼고 {bundled}개만 나누었습니다. 낱개도 넣은 전체 {total}개를 나누면 {total} ÷ {d} = {answer}개입니다.'))})),
 art:()=>({scene:'pencil-sharing'}),solution:'묶인 연필은 {a} × {b} = {bundled}개입니다. ({bundled} + {c}) ÷ {d} = {answer}개입니다.\n따라서 한 명이 받는 연필은 {answer}개입니다.',
});
