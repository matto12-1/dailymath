import { j } from '../solution-process.js?v=9a67f36b25';
// 길이와 시간을 작은 단위로 바꾸거나 큰 단위로 되돌리는 훈련.
import { define, errors, wrong } from './helpers.js?v=9a67f36b25';

const answer = ({ form, a, b }) => ({ 'cm-mm': 10 * a + b, 'mm-cm': a / 10, 'min-sec': 60 * a + b, 'sec-min': a / 60 })[form];
// 실수 값은 숫자판으로 쓸 수 있는 자연수만 둔다(검수 A2-16). 숫자판은 가장 긴 값(네 자리)보다 한 자리 넉넉히.
// 실수 말은 아이가 한 일을 말한다(「1 cm를 100 mm로 보고 바꾸었습니다」).
const proper = ({form,a,b}) => {
  if(form==='cm-mm')return a+' cm는 '+a*10+' mm이므로 '+a*10+' + '+b+' = '+(a*10+b)+' mm입니다.';
  if(form==='min-sec')return a+'분은 '+a*60+'초이므로 '+a*60+' + '+b+' = '+(a*60+b)+'초입니다.';
  if(form==='mm-cm')return a+' mm는 10 mm가 '+a/10+'개이므로 '+a/10+' cm입니다.';
  return '60 × '+a/60+' = '+a+'이므로 '+a+'초는 '+a/60+'분입니다.';
};
const slip = {
  'cm-mm': v => wrong(100*v.a+v.b,'1 cm를 100 mm로 보기','1 cm를 100 mm로 보아 '+(100*v.a+v.b)+'이라고 했습니다. '+proper(v)),
  'mm-cm': v => wrong(v.a*10,'나누지 않고 곱하기',v.a+' mm를 cm로 바꿀 때 10을 곱해 '+v.a*10+'이라고 했습니다. '+proper(v)),
  'min-sec': v => wrong(100*v.a+v.b,'1분을 100초로 보기','1분을 100초로 보아 '+(100*v.a+v.b)+'이라고 했습니다. '+proper(v)),
  'sec-min': v => wrong(v.a/6,'60초를 6초로 보기','1분을 6초로 보아 '+v.a/6+'분이라고 했습니다. 1분은 60초이고 '+v.a+'초는 60초가 '+v.a/60+'개인 수이므로 '+v.a/60+'분입니다.'),
};
export default define({ id: 'g3.lengthtime.drill', unit: 'g3s1-length-time', strand: 'calc', level: 3, label: '단위 바꾸기', std: ['[4수03-16]', '[4수03-13]'] }, {
  input: 'number', speedBonus: true, maxDigits: 5, errorCount: 2, back: 'g2s2-length',
  texts: ['{question}'], answerUnit: ({ form }) => ({ 'cm-mm': 'mm', 'mm-cm': 'cm', 'min-sec': '초', 'sec-min': '분' })[form],
  draw(rng) {
    const form = rng.pick(['cm-mm', 'mm-cm', 'min-sec', 'sec-min']);
    const a = form === 'cm-mm' ? rng.int(1, 20) : form === 'mm-cm' ? 10 * rng.int(2, 30) : form === 'min-sec' ? rng.int(1, 5) : 60 * rng.int(2, 10);
    const b = form === 'cm-mm' ? rng.int(1, 9) : form === 'min-sec' ? rng.int(1, 59) : 0;
    const length = form === 'cm-mm' || form === 'mm-cm', base = length ? 10 : 60, small = form === 'cm-mm' || form === 'min-sec';
    const question = ({ 'cm-mm': `〔${a} cm ${b} mm = ? mm〕빈칸에 알맞은 수는 얼마일까요?`, 'mm-cm': `〔${a} mm = ? cm〕빈칸에 알맞은 수는 얼마일까요?`, 'min-sec': `〔${a}분 ${b}초 = ? 초〕빈칸에 알맞은 수는 얼마일까요?`, 'sec-min': `〔${a}초 = ? 분〕빈칸에 알맞은 수는 얼마일까요?` })[form];
    return { form, a, b, question, base, rule: length ? '1 cm는 10 mm입니다.' : '1분은 60초입니다.',
      calculation:proper({form,a,b}), ...errors(
        slip[form]({ form, a, b }),
        wrong(small ? a + b : a, '단위를 바꾸지 않기', small?`${j(a+(length?" cm":"분"),"을/를")} 바꾸지 않고 ${a} + ${b} = ${a+b}로 계산했습니다. ${length?`바꾸지 않은 ${a} cm를 먼저 ${a*10} mm로 바꾸면 ${a*10} + ${b} = ${a*10+b} mm입니다`:`바꾸지 않은 ${a}분을 먼저 ${a*60}초로 바꾸면 ${a*60} + ${b} = ${a*60+b}초입니다`}.`:`단위를 바꾸지 않고 ${a}을 그대로 썼습니다. ${length?`10 mm가 1 cm이므로 ${a} mm는 ${a/10} cm입니다`:`60초가 1분이므로 ${a}초는 ${a/60}분입니다`}.`)) };
  },
  answer, check: (v) => ['cm-mm', 'min-sec'].includes(v.form) ? Array(v.a).fill(v.base).reduce((s, n) => s + n, v.b) : Array.from({ length: v.a }, (_, i) => i + 1).filter((n) => n % v.base === 0).length,
  solution: "{rule}\n{calculation}\n따라서 빈칸에 알맞은 수는 {answer:입니다}.",
});
