import {define,meta,dec,errors,wrong} from './helpers.js?v=9a67f36b25';
export default define(meta('decimaladdsub','place',1,'calc',['01-13'],'소수 세 자리 자릿값'),{
  input:'number',answerKind:'decimal',back:'g3s1-fractions-decimals',
  texts:['〔{shown}〕{place}에 있는 {digit:은/는} 얼마를 나타낼까요?', '〔{shown}〕{place} 숫자 {digit:은/는} 얼마를 나타낼까요?'],
  draw(rng){const digits=rng.shuffle([1,2,3,4,5,6,7,8,9]).slice(0,3),p=rng.int(1,3),digit=digits[p-1],shown=`${rng.int(0,5)}.${digits.join('')}`;return {shown,digit,p,unitValue:['','0.1','0.01','0.001'][p],place:['','소수 첫째 자리','소수 둘째 자리','소수 셋째 자리'][p],...errors(wrong(dec(digit,p-1),'한 자리 앞 값으로 읽기',`${digit}을 ${["일의 자리","소수 첫째 자리","소수 둘째 자리"][p-1]} 숫자로 보아 ${dec(digit,p-1)}을 썼습니다. ${digit}은 ${["","소수 첫째 자리","소수 둘째 자리","소수 셋째 자리"][p]} 숫자이므로 ${dec(digit,p)}을 나타냅니다.`),wrong(p===3?String(digit):dec(digit,p+1),p===3?'숫자만 답하기':'한 자리 뒤 값으로 읽기',p===3?'소수 셋째 자리 숫자 {digit}만 썼습니다. {digit:은/는} 0.001이 {digit}개이므로 {answer:을/를} 나타냅니다.':`${digit}을 ${['','','소수 둘째 자리','소수 셋째 자리'][p+1]} 숫자로 보아 ${dec(digit,p+1)}을 썼습니다. 한 자리 높은 {place} 숫자이므로 ${dec(digit,p)}을 나타냅니다.`))};},
  answer:({digit,p})=>dec(digit,p),check:({shown,p})=>dec(Number(shown.split('.')[1][p-1]),p),
  solution:"{digit:은/는} {place} 숫자이므로 {unitValue:이/가} {digit}개입니다.\n따라서 {digit:이/가} 나타내는 값은 {answer:입니다}.",
});
