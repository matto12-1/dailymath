// 주민 할 일 표 2판과 하루 자리. 화면은 다루지 않는다.
// 학교 태블릿 사파리를 위해 표를 JS로 옮겼다. 시험에서 원본과 맞춘다.
import { whereToday, worksAtShop } from './village.js?v=9a67f36b25';
import { SHOPS, shopLevel, lotOpen } from './shops.js?v=9a67f36b25';
import { masteredUnits } from './looks.js?v=9a67f36b25';
import { josa } from '../engine/korean.js?v=9a67f36b25';

export const ACTIVITY = {
  cat: [
    { role: 'worker', shop: 'icecream', seat: 1, what: '아이스크림 콘 들고 폴짝 손님 부르기', motion: '', ms: 300, big: 3 },
    { role: 'plaza', what: '털실 뭉치를 굴리며 덮치기', motion: '', ms: 300 },
    { role: 'worker', shop: 'fish', seat: 1, what: '쪼그려 얼음 접시에 생선 놓기', motion: '', ms: 420, big: 3 },
    { role: 'plaza', what: '네모난 상자에 쏙 들어갔다 빼꼼', motion: '', ms: 420 },
    { role: 'worker', shop: 'bakery', seat: 2, what: '피자 반죽을 머리 위로 빙글빙글', motion: '', ms: 300, big: 3 },
    { role: 'worker', shop: 'bakery', seat: 3, what: '나무망치로 호두 껍데기 두드리기', motion: '', ms: 340, big: 1 },
    { role: 'worker', shop: 'fish', seat: 3, what: '생선 그림 깃발 흔들어 손님 부르기', motion: '', ms: 340, big: 3 },
    { role: 'worker', shop: 'books', seat: 1, what: '그림책 높이 펼쳐 이야기 들려주기', motion: '', ms: 540, big: 3 },
    { role: 'worker', shop: 'groom', seat: 1, what: '쪼그려 앉아 볼 털 빗기', motion: '', ms: 400, big: 3 },
    { role: 'plaza', what: '훌라후프 돌리기', motion: '', ms: 220 },
    { role: 'worker', shop: 'bakery', seat: 1, what: '밀대로 쿠키 반죽 밀기', motion: '', ms: 340, big: 3 },
    { role: 'worker', shop: 'cafe', seat: 1, what: '찻주전자로 차 높이 따르기', motion: '', ms: 420, big: 3 },
    { role: 'worker', shop: 'post', seat: 2, what: '하트 편지를 받고 기뻐서 폴짝', motion: '', ms: 340, big: 3 },
    { role: 'worker', shop: 'post', seat: 3, what: '작은 소포에 그림 도장 쿵 찍기', motion: '', ms: 380, big: 1 },
    { role: 'worker', shop: 'books', seat: 2, what: '노래로 책방 손님 부르기', motion: '', ms: 300, big: 3 },
    { role: 'worker', shop: 'flower', seat: 2, what: '꽃 화관 들고 반 바퀴 춤추기', motion: '', ms: 400, big: 3 },
    { role: 'worker', shop: 'post', seat: 1, what: '가방에서 편지 꺼내 높이 흔들기', motion: '', ms: 380, big: 3 },
    { role: 'plaza', what: '제기차기', motion: '', ms: 280 },
    { role: 'plaza', what: '사자 흉내 「어흥」', motion: '', ms: 380 },
    { role: 'worker', shop: 'fruit', seat: 1, what: '천으로 사과를 좌우로 크게 닦기', motion: '', ms: 380, big: 1 },
    { role: 'worker', shop: 'cafe', seat: 3, what: '찻잔 받침 들어 뒤뚱 인사하기', motion: '', ms: 400, big: 3 },
    { role: 'worker', shop: 'fish', seat: 2, what: '얼음 통 안고 제자리걸음', motion: '', ms: 360, big: 1 },
    { role: 'plaza', what: '줄넘기', motion: '', ms: 240 },
    { role: 'worker', shop: 'groom', seat: 3, what: '방석을 앞발로 번갈아 꾹꾹', motion: '', ms: 360, big: 1 },
    { role: 'worker', shop: 'groom', seat: 2, what: '리본 들어 보여 주다 간지러워 에취', motion: '', ms: 420, big: 3 },
    { role: 'plaza', what: '사진기로 찰칵', motion: '', ms: 420 },
    { role: 'plaza', what: '큰 공 위에서 균형 잡기', motion: '', ms: 380 },
    { role: 'worker', shop: 'icecream', seat: 2, what: '분홍 아이스크림 맛보며 반 바퀴 춤추기', motion: '', ms: 380, big: 3 },
    { role: 'plaza', what: '줄기를 잡아당겨 고구마 캐기', motion: '', ms: 360 },
    { role: 'worker', shop: 'yarn', seat: 3, what: '큰 단추의 리본을 앞발 번갈아 당기기', motion: '', ms: 420, big: 3 },
    { role: 'plaza', what: '비눗방울 불기', motion: '', ms: 360 },
    { role: 'worker', shop: 'yarn', seat: 2, what: '목도리 두르고 반 바퀴 춤추기', motion: '', ms: 340, big: 3 },
    { role: 'worker', shop: 'flower', seat: 1, what: '물뿌리개로 꽃 화분에 크게 물 주기', motion: '', ms: 380, big: 3 },
    { role: 'worker', shop: 'fruit', seat: 3, what: '과일 바구니 안고 제자리걸음', motion: '', ms: 360, big: 1 },
    { role: 'worker', shop: 'fruit', seat: 2, what: '귤 한 개 높이 던지고 받기', motion: '', ms: 280, big: 3 },
    { role: 'worker', shop: 'cafe', seat: 2, what: '찻잔 닦는 천 뒤집어 펼치기', motion: '', ms: 400, big: 3 },
    { role: 'worker', shop: 'icecream', seat: 3, what: '아이스크림 위에 과자 가루 크게 뿌리기', motion: '', ms: 420, big: 3 },
    { role: 'worker', shop: 'flower', seat: 3, what: '화분 안고 제자리걸음', motion: '', ms: 360, big: 1 },
    { role: 'worker', shop: 'books', seat: 3, what: '꽃 그림 책갈피에 도장 쿵 찍기', motion: '', ms: 400, big: 1 },
    { role: 'worker', shop: 'yarn', seat: 1, what: '앞발 번갈아 큰 털실 고리 뜨기', motion: '', ms: 460, big: 3 },
  ],
  dog: [
    { role: 'plaza', what: '원반을 폴짝 뛰어 입으로 받기', motion: '', ms: 300 },
    { role: 'worker', shop: 'icecream', seat: 1, what: '큰 주걱으로 아이스크림 크게 섞기', motion: '', ms: 360, big: 1 },
    { role: 'plaza', what: '꼬리를 쫓아 빙글빙글', motion: '', ms: 220 },
    { role: 'plaza', what: '풀밭에서 등 대고 뒹굴뒹굴', motion: '', ms: 340 },
    { role: 'worker', shop: 'snack', seat: 1, what: '뼈 모양 틀로 과자 반죽 쿵 찍기', motion: '', ms: 360, big: 1 },
    { role: 'worker', shop: 'snack', seat: 3, what: '아우우 노래로 간식 가게 손님 부르기', motion: '', ms: 360, big: 3 },
    { role: 'plaza', what: '돋보기 들고 냄새 탐정', motion: '', ms: 380 },
    { role: 'plaza', what: '비눗방울 쫓아 덥석', motion: '', ms: 300 },
    { role: 'worker', shop: 'flower', seat: 3, what: '쪼그려 앉아 꽃 모종 토닥토닥', motion: '', ms: 400, big: 3 },
    { role: 'plaza', what: '가로등 아래서 망원경으로 하늘 보기', motion: '', ms: 520 },
    { role: 'plaza', what: '앞발로 땅 파서 감자 캐기', motion: '', ms: 300 },
    { role: 'worker', shop: 'toy', seat: 1, what: '코끝으로 줄무늬 공 통통 띄워 받기', motion: '', ms: 280, big: 3 },
    { role: 'worker', shop: 'fruit', seat: 1, what: '호스로 과일 바구니 씻기', motion: '', ms: 360, big: 1 },
    { role: 'worker', shop: 'books', seat: 3, what: '발끝 서서 책 고리에 책갈피 걸기', motion: '', ms: 440, big: 3 },
    { role: 'worker', shop: 'books', seat: 1, what: '그림책 높이 펼쳐 읽어 주기', motion: '', ms: 540, big: 3 },
    { role: 'worker', shop: 'flower', seat: 2, what: '꽃다발 높이 들어 인사하기', motion: '', ms: 400, big: 3 },
    { role: 'worker', shop: 'post', seat: 1, what: '소포 안고 제자리 배달 걸음', motion: '', ms: 360, big: 1 },
    { role: 'worker', shop: 'fruit', seat: 2, what: '바구니로 열매 통통 띄워 받기', motion: '', ms: 340, big: 3 },
    { role: 'worker', shop: 'post', seat: 2, what: '편지 물고 꼬리 흔들며 반 바퀴 돌기', motion: '', ms: 320, big: 3 },
    { role: 'worker', shop: 'bakery', seat: 2, what: '케이크에 생크림 크게 둘러 짜기', motion: '', ms: 420, big: 1 },
    { role: 'worker', shop: 'snack', seat: 2, what: '과자 통을 머리 위로 번쩍 들기', motion: '', ms: 400, big: 3 },
    { role: 'worker', shop: 'books', seat: 2, what: '책 두 권 받쳐 가지런히 놓기', motion: '', ms: 420, big: 3 },
    { role: 'worker', shop: 'bakery', seat: 3, what: '둥근 빵 안고 폴짝 손님 반기기', motion: '', ms: 320, big: 3 },
    { role: 'worker', shop: 'toy', seat: 3, what: '아코디언 펼치며 반 바퀴 춤추기', motion: '', ms: 360, big: 3 },
    { role: 'worker', shop: 'groom', seat: 2, what: '수건 두른 채 좌우로 돌아 물 털기', motion: '', ms: 300, big: 1 },
    { role: 'worker', shop: 'cafe', seat: 2, what: '찻잔 받침 안고 제자리걸음', motion: '', ms: 380, big: 1 },
    { role: 'worker', shop: 'post', seat: 3, what: '경례하며 우체국 손님 맞기', motion: '', ms: 380, big: 3 },
    { role: 'worker', shop: 'cafe', seat: 3, what: '작은 프라이팬으로 유자 팬케이크 뒤집기', motion: '', ms: 380, big: 3 },
    { role: 'worker', shop: 'groom', seat: 3, what: '리본 양끝 번갈아 당겨 매듭 조이기', motion: '', ms: 340, big: 3 },
    { role: 'worker', shop: 'toy', seat: 2, what: '쪼그려 색색 블록 쌓기', motion: '', ms: 400, big: 3 },
    { role: 'worker', shop: 'bakery', seat: 1, what: '빵집 앞에서 나팔로 손님 부르기', motion: '', ms: 340, big: 3 },
    { role: 'worker', shop: 'icecream', seat: 2, what: '발끝 서서 아이스크림 컵 고리에 별 장식 걸기', motion: '', ms: 440, big: 3 },
    { role: 'worker', shop: 'flower', seat: 1, what: '민들레 홀씨를 큰 호로 후 불기', motion: '', ms: 400, big: 3 },
    { role: 'plaza', what: '작은 북 둥둥', motion: '', ms: 260 },
    { role: 'worker', shop: 'groom', seat: 1, what: '둥근 빗으로 머리부터 볼까지 쓱 빗기', motion: '', ms: 400, big: 1 },
    { role: 'worker', shop: 'icecream', seat: 3, what: '아이스크림 위에 망고 조각 뿌리기', motion: '', ms: 380, big: 3 },
    { role: 'worker', shop: 'cafe', seat: 1, what: '큰 스푼으로 코코아 크게 젓기', motion: '', ms: 440, big: 1 },
    { role: 'worker', shop: 'fruit', seat: 3, what: '쪼그려 과일 포장 잎 영차 당기기', motion: '', ms: 400, big: 1 },
    { role: 'plaza', what: '줄넘기', motion: '', ms: 240 },
    { role: 'plaza', what: '연 날리기', motion: '', ms: 420 },
  ],
};

export function dayPlan(state, units, today) {
  const day = whereToday(state, units, today);
  const kind = state.town.kind;
  const brief = r => ({ id: r.id, variant: r.look.variant });
  return {
    working: day.working.map(r => {
      const { shop, seat } = ACTIVITY[kind][r.look.variant];
      return { ...brief(r), shop, seat };
    }),
    plaza: day.yard.map((r, spot) => ({ ...brief(r), spot, mode: ACTIVITY[kind][r.look.variant].role === 'plaza' ? 'play' : 'rest' })),
    home: day.houses.flatMap(h => h.home.map(r => ({ ...brief(r), house: h.id, seat: h.residents.indexOf(r) + 1 }))),
    walking: day.walking.map(r => r.id),
  };
}

export function residentLine(state, units, resident) {
  const activity = ACTIVITY[state.town.kind][resident.look.variant];
  if (activity.role === 'plaza') return { text: '광장에서 놀아요', action: null };
  if (resident.look.baby) return { text: '아직 아기라서 일은 안 해요', action: null };
  const name = SHOPS.find(s => s.id === activity.shop).name;
  if (!lotOpen(state, activity.shop)) {
    const remaining = SHOPS.find(s => s.id === activity.shop).plot - masteredUnits(state).length;
    return { text: name + ' 땅은 아직 안개 속이에요. 단원을 ' + remaining + '개 더 끝내면 열려요', action: null };
  }
  if (worksAtShop(state, resident)) return { text: name + '에서 일해요', action: null };
  if (shopLevel(state, activity.shop) === 0) return { text: name + '에서 일하고 싶어요', action: { type: 'build', shop: activity.shop } };
  return { text: josa(name, '을/를') + ' 키우면 여기서 일해요', action: { type: 'shop', shop: activity.shop } };
}

// 이사 온 날 주민은 마당 맨 앞에 선다(홈·마을 설계 4.4: 「마을에 가 보기」에서 새 주민이 바로 보이게).
// 마당에 선 주민들이 쓰는 마당 자리 가운데 앞(y가 큰) 자리부터 오늘 이사 온 주민에게 준다. 늦게 온 주민(placed에서 뒤)이 가장 앞.
// 자리를 맞바꾸기만 하므로 쓰는 마당 자리 묶음은 그대로다. spots는 마당 자리 좌표(%). 입력은 바꾸지 않는다.
export function frontArrivals(placed, today, spots) {
  const out = placed.map((p) => ({ ...p }));
  const yard = out.filter((p) => p.yard !== undefined);
  const fronts = yard.map((p) => p.yard).sort((a, b) => spots[b].y - spots[a].y || a - b);
  yard.filter((p) => p.resident.date === today).reverse().forEach((p, k) => {
    const holder = yard.find((q) => q.yard === fronts[k]);
    [holder.yard, p.yard] = [p.yard, fronts[k]];
  });
  return out;
}
