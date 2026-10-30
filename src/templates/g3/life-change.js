// 3학년 1학기 덧셈과 뺄셈: 1000원을 내고 거스름돈 구하기
const ITEMS = ['공책', '지우개', '풀', '자', '색연필', '필통'];

export default {
  id: 'g3.life.change', grade: 3, unit: 'g3s1-addsub', strand: 'life', level: 1,
  std: ['[4수01-03]'],
  label: '1000원 거스름돈', input: 'number', answerUnit: '원',
  range: { min: 110, max: 1000 },
  texts: [
    '{paid}원을 내고 {price}원짜리 {item:을/를} 샀어요. 거스름돈은 얼마일까요?',
    '{item:은/는} {price}원이에요. {paid}원짜리 지폐를 내면 얼마를 거슬러 받을까요?',
  ],
  make: (rng) => ({ paid: 1000, price: rng.int(11, 99) * 10, item: rng.pick(ITEMS) }),
  answer: ({ paid, price }) => paid - price,
  check: ({ paid, price }) => { let n = 0; for (let x = price; x < paid; x += 10) n += 10; return n; },
  mistakes: [
    { id: 'added', label: '거스름돈을 더해서 구하기', say: '거스름돈은 낸 돈에서 물건값을 빼서 구해요. 더해서 {value}원이 나왔어요.', value: ({ paid, price }) => paid + price },
    // 1000 − 380에서 백의 자리를 10 − 3으로 계산해 720을 낸다(십의 자리에 빌려 준 1을 안 뺌). 380처럼 십의 자리가 있을 때만 생긴다.
    { id: 'hundreds-not-reduced', label: '빌려 준 1을 안 빼기', say: '1000에서 빼려면 백의 자리, 십의 자리로 차례차례 빌려 와야 해요. 백의 자리 수가 1 작아지는 걸 깜빡해서 {value}원이 나왔어요.', value: ({ paid, price }) => (price % 100 === 0 ? null : paid - price + 100) },
  ],
  art: ({ price }) => ({ kind: 'money', bills: [1000], coins: [], tag: price }),
  solution: '{paid} − {price} = {answer}. 거스름돈은 {answer}원이에요.',
};
