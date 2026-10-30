import {define,errors,wrong,seq} from './helpers.js?v=9a67f36b25';
import {meta,rect,isSquare} from './shape-helpers.js?v=9a67f36b25';
export default define(meta('plane','square',3,['10'],'정사각형 세기'),{
  range:{min:1,max:6},operandRange:{min:0,max:9999},answerSpan:[1,2,3,4],errorCount:3,back:'g2s1-shapes',
  texts:['그림에서 정사각형은 모두 몇 개일까요?','그림에서 정사각형은 모두 몇 개일까요?'],
  draw(rng){const n=rng.pick([1,1,1,2,2,3,3,4,4,4]),m=rng.int(n===1?2:1,n===4?1:2),panels=rng.shuffle([
    ...Array.from({length:n},()=>{const s=rng.int(4,7);return {points:rect(s,s),marks:{right:[0,1,2,3],equal:[[0,1,2,3]]},rotation:rng.int(0,17)*10};}),
    ...Array.from({length:m},()=>({points:rect(...rng.pick([[4,3],[5,3],[6,4],[7,5]])),marks:{right:[0,1,2,3],equal:[[0,2],[1,3]]},rotation:rng.int(0,17)*10})),
    {points:[[1,3],[6,3],[8,6],[3,6]],marks:{equal:[[0,2],[1,3]]},rotation:rng.int(0,17)*10}
  ]).map((p,i)=>({...p,number:'가나다라마바'[i]}));
    // 보기는 늘 1~4개이고 정답도 1~4개라 어느 보기든 정답이 될 수 있다. 오답마다 어떤 도형을 잘못 셌는지 말한다.
    // 2·3은 두 보기의 한가운데라 끝 수(1·4)를 더 자주 낸다(가운데 둘 합 40%).
    // 전엔 정답이 1~3개라 4가, 모두 센 수(5·6)가 늘 오답으로만 나왔고 보기도 셋이었다(검수 2·3번).
    const squares=panels.filter(p=>isSquare(p.points)).map(p=>p.number).join(', '),rectangles=panels.filter(p=>!isSquare(p.points)&&p.marks.right).map(p=>p.number).join(', ');
    const tilted=panels.filter(p=>isSquare(p.points)&&p.rotation%90!==0).length;
    const why=v=>v<n?(tilted>0&&v===n-tilted?wrong(v,'기울어진 정사각형 빠뜨리기',`돌려 놓인 정사각형 ${tilted}개를 빠뜨려 ${v}개라고 했습니다. 돌려 놓아도 네 변의 길이가 같고 네 각이 모두 직각이면 정사각형이므로 빠뜨린 ${tilted}개도 세면 ${n}개입니다.`):wrong(v,`정사각형 ${n-v}개 빠뜨리기`,`정사각형을 ${v}개만 세었습니다. 빠뜨린 정사각형 ${n-v}개까지, 네 변의 길이가 같고 네 각이 모두 직각인 ${squares}의 도형을 모두 세면 ${n}개입니다.`))
      :v===n+m?wrong(v,'직사각형까지 같이 세기',`${rectangles}처럼 이웃한 두 변의 길이가 다른 직사각형도 세어 ${v}개라고 했습니다. 네 변의 길이까지 모두 같은 것은 ${squares}이므로 정사각형은 ${n}개입니다.`)
      :v===panels.length?wrong(v,'네 변 도형을 모두 세기',`변이 4개인 도형을 모두 세어 ${v}개라고 했습니다. 네 각이 모두 직각이고 네 변의 길이가 같은 사각형은 ${squares}이므로 ${n}개입니다.`)
      :wrong(v,'정사각형이 아닌 도형 세기',`정사각형이 아닌 도형도 세어 ${v}개라고 했습니다. 네 변의 길이가 같고 네 각이 모두 직각인 사각형은 ${squares}이므로 ${n}개입니다.`);
    return {n,m,panels,squares,options:[1,2,3,4],...errors(...[1,2,3,4].filter(v=>v!==n).map(why))};},
  answer:v=>v.panels.filter(p=>isSquare(p.points)).length,check:v=>v.n,
  isCorrect:(v,c)=>v.panels.filter(p=>isSquare(p.points)).length===c,
  // 칸 이름은 가·나·다로 쓴다. 1·2·3이면 답(몇 개) 보기와 헷갈리고, 칸이 넷이면 보기 1~4가 그림 단추로 바뀌었다.
  // 다섯·여섯 칸은 세 칸씩 두 줄로 낮게 놓는다(검수 12번). 칸이 작아지는 만큼 도형을 키웠다(한 변 4~7).
  art:v=>({kind:'polygon',panels:v.panels.map(p=>({...p,uprightLabels:true,markScale:1.3})),largePanels:'full',panelColumns:v.panels.length>4?3:2}),solution:"네 변의 길이가 같고 네 각이 모두 직각인 사각형은 {squares}입니다.\n따라서 정사각형은 {answer}개입니다.",
});
