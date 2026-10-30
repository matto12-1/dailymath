import {numeric,meta,seq,wrong,names} from './helpers.js?v=9a67f36b25';
export default numeric(meta('prisms','vertices',2,'shape',['03-05'],'각기둥의 꼭짓점과 모서리'),{
 cases:seq(3,8).flatMap(n=>[false,true].map(edge=>({n,edge}))),texts:['{name}의 {part:은/는} {hidden}모두 몇 개일까요?','{name}에서 {part:을/를} 모두 세면 몇 개일까요?'],back:'g5s2-cuboids',
 answer:v=>(v.edge?3:2)*v.n,check:v=>v.n+v.n+(v.edge?v.n:0),decorate:v=>({pointing:v.n<=6?'이 ':'',hidden:v.n<=6?'숨은 것까지 ':'',name:names[v.n]+'기둥',part:v.edge?'모서리':'꼭짓점',explanation:v.edge?'{n}개의 모서리가 있는 밑면이 2개이고, 두 밑면을 잇는 모서리가 {n}개입니다.':'두 밑면의 꼭짓점을 합합니다.',counting:v.edge?`${v.n} + ${v.n} + ${v.n}`:`${v.n} + ${v.n}`,factor:v.edge?3:2}),
 errors:v=>v.edge?[wrong(2*v.n,'밑면의 모서리만 세기','두 밑면의 모서리만 세어 {value:을/를} 썼습니다. 두 밑면을 잇는 모서리 {n}개도 더하면 {n} + {n} + {n} = {answer}개입니다.'),wrong(v.n,'한 밑면의 모서리만 세기','한 밑면의 모서리 {n}개만 세어 {value:을/를} 썼습니다. 다른 밑면 {n}개와 두 밑면을 잇는 모서리 {n}개도 더하면 {answer}개입니다.')]:[wrong(v.n,'한 밑면만 세기','한 밑면의 꼭짓점 {n}개만 세어 {value:을/를} 썼습니다. 다른 밑면의 꼭짓점 {n}개도 더하면 {n} + {n} = {answer}개입니다.'),wrong(3*v.n,'모서리 수와 혼동','꼭짓점 대신 모서리를 세어 {value:을/를} 썼습니다. 모서리 대신 두 밑면의 꼭짓점을 {n}개씩 세면 {answer}개입니다.')],
 art:v=>v.n<=6?{kind:'solid',type:'prism',n:v.n,orientation:0,wide:true}:null,solution:'{explanation} {counting} = {answer}개입니다.\n따라서 {part:은/는} 모두 {answer}개입니다.',
});
