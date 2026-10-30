import {josa} from '../../engine/korean.js?v=9a67f36b25';
// 소수의 빈 자리도 0과 더하는 계산을 보인다.
export function decimalAddLines(a,b){
  const lines=[];let carry=0;
  for(let k=0;k<4;k++){
    const x=Math.floor(a/10**k)%10,y=Math.floor(b/10**k)%10;
    if(k===3&&!x&&!y&&!carry)break;
    const name=k===0?'소수 둘째 자리':k===1?'소수 첫째 자리':k===2?'일의 자리':'십의 자리',total=x+y+carry;
    lines.push(name+'는 '+x+' + '+y+(carry?' + '+carry:'')+' = '+total+'입니다.'+(total>=10&&k<3?' '+Math.floor(total/10)+'을 다음 자리로 받아올리고 '+josa(total%10,'을/를')+' 씁니다.':''));
    carry=Math.floor(total/10);
  }
  return lines;
}
