import {numeric,meta,seq,wrong,names} from './helpers.js?v=9a67f36b25';
export default numeric(meta('prisms','faces',2,'shape',['03-05'],'각기둥의 면'),{
 cases:seq(3,8).map(n=>({n})),texts:['{name}의 면은 {hidden}모두 몇 개일까요?','{name}에서 면을 모두 세면 몇 개일까요?'],back:'g5s2-cuboids',
 answer:v=>v.n+2,check:v=>Array(v.n).fill(1).reduce((s,n)=>s+n,2),
 decorate:(v,rng)=>({pointing:v.n<=6?'이 ':'',hidden:v.n<=6?'숨은 것까지 ':'',name:names[v.n]+'기둥',orientation:0}),
 errors:v=>[wrong(v.n+1,'밑면 하나 빠뜨리기','옆면 {n}개에 밑면을 하나만 더하여 {value:을/를} 썼습니다. 빠뜨린 밑면도 더하면 옆면 {n}개와 밑면 2개로 {answer}개입니다.'),wrong(v.n,'옆면만 세기','옆면 {n}개만 세어 {value:을/를} 썼습니다. 옆면 {n}개에 두 밑면을 더하면 {n} + 2 = {answer}개입니다.')],
 art:v=>v.n<=6?{kind:'solid',type:'prism',n:v.n,orientation:0,wide:true}:null,solution:'옆면 {n}개와 밑면 2개를 더하면 {n} + 2 = {answer}개입니다.\n따라서 면은 모두 {answer}개입니다.',
});
