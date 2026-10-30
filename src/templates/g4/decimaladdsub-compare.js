import {explain,j,comparisonSubjects} from '../solution-process.js?v=9a67f36b25';
import {define,meta,dec,errors,wrong,valueOf,until} from './helpers.js?v=9a67f36b25';
export default define(meta('decimaladdsub','compare',2,'calc',['01-14'],'소수 세 자리까지 비교'),{
  answerKind:'decimal',orderAsked:true,back:'g3s1-fractions-decimals',errorCount:2,
  choiceBox:true,texts:['가장 {direction} 수는 어느 것일까요?'],
  draw:explain(function(rng){
    const w=rng.int(0,5),large=rng.int(0,1)===1,places=rng.pick([[1,1,2,2],[2,2,3,3]]),longWins=rng.next()<.7;
    const {options,sort}=until(()=>{
      const options=rng.shuffle(places.map(p=>dec(w*10**p+rng.int(1,10**p-1),p)));
      if(new Set(options).size!==4||options.map(s=>(s.split('.')[1]??'').length).sort().join()!==[...places].sort().join())return null;
      const sort=[...options].sort((a,b)=>Number(a)-Number(b)),answer=sort[large?3:0];
      return (answer.split('.')[1].length===Math.max(...places))===longWins?{options,sort}:null;
    });
    const answer=sort[large?3:0],opposite=sort[large?0:3],near=sort[large?2:1],tail=[...options].sort((a,b)=>Number(a.split('.')[1])-Number(b.split('.')[1]))[large?3:0];
    return {options,large,direction:large?'큰':'작은',answer,...errors(
      wrong(opposite,'반대 크기 고르기',`가장 ${large?'작은':'큰'} 수 ${opposite}을 골랐습니다. 자연수 부분이 같으므로 소수 첫째 자리부터 비교하면 가장 ${large?'큰':'작은'} 수는 ${answer}입니다.`),
      tail!==answer&&tail!==opposite?wrong(tail,'소수 부분을 자연수로 비교하기',`소수점 아래를 자연수처럼 비교하여 ${tail}을 골랐습니다. 빈 자리에 0을 붙여 같은 자리끼리 비교하면 가장 ${large?'큰':'작은'} 수는 ${answer}입니다.`):wrong(near,'두 번째 크기 고르기',`둘째로 ${large?'큰':'작은'} 수 ${near}을 골랐습니다. ${near}과 ${answer}의 소수점을 맞추고 높은 자리부터 비교하면 ${answer}이 더 ${large?'큽니다':'작습니다'}.`))};
  },v=>{
    let xs=[...v.options];const lines=[];
    for(let k=0;k<3&&xs.length>1;k++){
      const ds=xs.map(n=>+(n.split('.')[1]??'').padEnd(3,'0')[k]),edge=(v.large?Math.max:Math.min)(...ds);
      lines.push((k===0?'자연수 부분은 모두 '+j(Math.floor(Number(v.options[0])),'입니다')+'. ':'')+comparisonSubjects(xs)+'의 소수 '+['첫째','둘째','셋째'][k]+' 자리 숫자는 '+j(ds.join(', '),'입니다')+'. '+(new Set(ds).size===1?'같으므로 다음 자리 숫자를 비교합니다.':j(edge,'이/가')+' '+(xs.length===2?'더 ':'가장 ')+(v.large?'큽니다.':'작습니다.')));
      xs=xs.filter((n,i)=>ds[i]===edge);
    }return lines;
  }),
  answer:v=>v.answer,check:v=>String((v.large?Math.max:Math.min)(...v.options.map(Number))),
  isCorrect:(v,c)=>v.options.includes(c)&&v.options.every(n=>v.large?valueOf('decimal',c)>=Number(n):valueOf('decimal',c)<=Number(n)),
  solution:'{process}\n따라서 가장 {direction} 수는 {answer:입니다}.',
});
