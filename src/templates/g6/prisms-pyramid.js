import {numeric,meta,seq,wrong,names} from './helpers.js?v=9a67f36b25';
export default numeric(meta('prisms','pyramid',3,'shape',['03-05'],'각뿔의 모서리'),{
 cases:seq(3,8).map(n=>({n})),texts:['{pointing}{name}의 모서리는 {hidden}몇 개일까요?','{name}에서 모서리를 모두 세면 몇 개일까요?'],back:'g5s2-cuboids',
 answer:v=>2*v.n,check:v=>v.n+v.n,decorate:(v,rng)=>({pointing:v.n<=6?'이 ':'',hidden:v.n<=6?'숨은 것까지 ':'',name:names[v.n]+'뿔',orientation:0}),
 errors:v=>[wrong(v.n,'밑면의 모서리만 세기','밑면의 모서리 {n}개만 세어 {value:을/를} 썼습니다. 각뿔의 꼭짓점에 모이는 모서리 {n}개도 더하면 {n} + {n} = {answer}개입니다.'),wrong(v.n+1,'모서리 대신 꼭짓점 세기','밑면의 꼭짓점 {n}개에 각뿔의 꼭짓점 1개를 더해 꼭짓점의 수를 세어 {value:을/를} 썼습니다. 꼭짓점 대신 밑면의 모서리와 각뿔의 꼭짓점에 모이는 모서리를 세면 {answer}개입니다.')],
 art:v=>v.n<=6?{kind:'solid',type:'pyramid',n:v.n,orientation:0,wide:true}:null,solution:'밑면의 모서리 {n}개와 각뿔의 꼭짓점에 모이는 모서리 {n}개를 더하면 {n} + {n} = {answer:입니다}.\n따라서 모서리는 모두 {answer}개입니다.',
});
