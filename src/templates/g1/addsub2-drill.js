// 10을 모으고 가르는 같은 꼴 훈련.
import base from './addsub2-make10.js?v=9a67f36b25';
import { fill } from '../../engine/korean.js?v=9a67f36b25';

export default {
  ...base, id: 'g1.addsub2.drill', level: 3, label: '10 모으기·가르기',
  texts: ['{question}'],
  // 훈련은 빨리 셈하는 연습이라 바탕 틀(10이 되는 수 찾기)의 그림을 두지 않는다.
  art: null,
  mistakes: base.mistakes.map(m=>({...m,say:m.id==='given'?'{a:을/를} 그대로 골랐습니다. 10에서 주어진 부분 {a:을/를} 가르면 남은 부분은 {answer}입니다.':m.id==='start-included'?'10에서 주어진 부분보다 하나 덜 갈라 {value:이/가} 나왔습니다. {a:과/와} 나머지로 정확히 가르면 나머지는 {answer}입니다.':'10에서 주어진 부분보다 하나 더 갈라 {value:이/가} 나왔습니다. 주어진 부분 {a}만큼만 가르면 나머지는 {answer}입니다.'})),
  solution: '{process}\n따라서 □에 알맞은 수는 {answer}입니다.',
  make(rng) {
    const v = base.make(rng), form = rng.pick(['join', 'split']);
    return { ...v, form, process:fill(form==='join'?'{a} 다음 수부터 10까지 이어 셉니다.':'10을 {a:과/와} 나머지로 가릅니다.',v), question: fill(form === 'join' ? '〔{a} + □ = 10〕□에 알맞은 수는 얼마일까요?' : '10은 {a:과/와} □로 가를 수 있습니다.□에 알맞은 수는 얼마일까요?', v) };
  },
};
