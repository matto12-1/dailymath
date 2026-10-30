// 단원별 차시 순서의 유일한 원본. 틀의 level은 난도 정보이며 차시 번호가 아니다.
// 이름|틀의 끝 id. 같은 차시의 두 틀만 쉼표로 묶는다. 마지막 정리는 앞 차시 전체다.
// 차시 순서를 바꾸면 올린다. 옛 기록의 하던 단원은 처음부터, 익힌 단원은 그대로(state.js migrate).
// 2: 2026-10-23 1학년 몇째·10에서 빼기·0 알아보기 차례, 3학년 십의 자리에서 받아올리기.
export const STEPS_VERSION = 2;
const chapter = (prefix, text) => {
  const lessons = text.split(';').map((row, i) => {
    const [name, ids] = row.trim().split('|');
    return { number:i+1, name, templates:ids.split(',').map(id=>`${prefix}.${id}`) };
  });
  return [...lessons, { number:lessons.length+1, name:'단원 정리', templates:lessons.flatMap(s=>s.templates) }];
};

export const UNIT_STEPS = {
  'g1s1-numbers-nine': chapter('g1.nine', '5까지 수 세기|count5;9까지 수 세기|count9;1만큼 큰 수와 작은 수|next;0 알아보기|zero;몇째인지 알아보기|ordinal;수의 크기 비교하기|larger'),
  'g1s1-solid-shapes': chapter('g1.solid', '모양 이름 알아보기|name;여러 모습의 모양 찾기|find;쌓은 모양 살펴보기|stack;상자 모양 세기|countbox;둥근기둥 모양 세기|counttube'),
  'g1s1-addsub': chapter('g1.addsub1', '수를 가르기|split;덧셈 알아보기|add;뺄셈 알아보기|sub;10에서 빼기|from10;0을 더하고 빼기|zero;이야기로 덧셈하기|receive'),
  'g1s1-compare': chapter('g1.compare', '길이 비교하기|length;무거운 것 찾기|weight;가벼운 것 찾기|light;넓이 비교하기|area;들이 비교하기|capacity'),
  'g1s1-numbers-fifty': chapter('g1.fifty', '십몇 알아보기|teen;묶음과 낱개로 세기|bundles;10씩 세기|nextten;묶고 남은 수 구하기|splitstory;수의 크기 비교하기|compare'),
  'g1s2-numbers-hundred': chapter('g1.hundred', '60부터 90까지 세기|tens;100까지 수 알아보기|place;앞과 다음 수 알아보기|next;수의 크기 비교하기|larger;짝수와 홀수 알아보기|even'),
  'g1s2-addsub-one': chapter('g1.addsub2', '세 수 더하기|threeadd;세 수 빼기|threesub;10을 모으고 가르기|make10,drill;10을 먼저 만들어 더하기|first10;이야기로 세 수 더하기|story'),
  'g1s2-shapes-clock': chapter('g1.shapesclock', '모양 이름 알아보기|flat;모양 세기|count;몇 시 알아보기|hour;몇 시 30분 알아보기|half;같은 시각 찾기|match'),
  'g1s2-addsub-two': chapter('g1.addsub3', '몇십을 더하고 빼기|tens;몇십몇 가르기|split;몇십몇에 몇 더하기|add;몇십몇끼리 더하기|twodigit;몇십몇끼리 빼기|sub;이야기로 뺄셈하기|story'),
  'g1s2-patterns': chapter('g1.patterns', '두 모양의 규칙 찾기|ab;세 개씩 되풀이되는 규칙 찾기|aab;규칙대로 빈칸 채우기|own;수의 규칙 찾기|numbers;생활 속 규칙 찾기|steps'),
  'g1s2-addsub-three': chapter('g1.addsub4', '10을 만들어 더하기|bridge;십몇이 되는 덧셈하기|carry;십몇에서 몇 빼기|borrow;덧셈과 뺄셈의 관계|relation;모르는 수 구하기|missingstory;덧셈과 뺄셈 연습하기|drill'),
  'g2s1-numbers-three-digits': chapter('g2.three', '몇백 알아보기|hundreds;자릿값 알아보기|place;빈자리의 0 알아보기|zero;뛰어 세기|skip;수의 크기 비교하기|compare'),
  'g2s1-shapes': chapter('g2.shapes', '도형 이름 알아보기|triangle;꼭짓점 세기|vertices;변과 꼭짓점으로 찾기|circle;모양 조각 맞추기|build;쌓기나무 위치 알아보기|position'),
  'g2s1-addsub': chapter('g2', '받아올림 없는 덧셈|addsub.plain;받아올림 한 번 덧셈|add2.carry1;받아내림 없는 뺄셈|addsub.subtract;받아내림 한 번 뺄셈|addsub.borrow;덧셈과 뺄셈으로 수 찾기|addsub.inverse,addsub.missing;세 수 계산하기|addsub.three;이야기로 계산하기|addsub.story;두 자리와 한 자리 계산|addsub.drill'),
  'g2s1-length': chapter('g2.length1', '길이 비교하기|compare;같은 조각으로 재기|unit;0에서 길이 재기|zero;중간에서 길이 재기|offset;cm로 어림하기|estimate'),
  'g2s1-classify': chapter('g2.classify', '색깔로 분류하기|color;모양으로 분류하기|shape;분류 기준 알아보기|rule;기준에 맞는 그림 찾기|own;많고 적은 것 알아보기|most'),
  'g2s1-multiplication': chapter('g2.multiply', '같은 수를 여러 번 더하기|repeated;묶음으로 세기|groups;몇 배 알아보기|times;곱셈식으로 나타내기|expression;이야기로 곱셈하기|story'),
  'g2s2-numbers-four-digits': chapter('g2.four', '몇천 알아보기|thousands;자릿값 알아보기|place;빈자리의 0 알아보기|zero;뛰어 세기|skip;수의 크기 비교하기|compare'),
  'g2s2-times': chapter('g2.times', '2단과 5단 알아보기|twofive;3단·4단·6단·8단 알기|related;7단과 9단 알아보기|sevennine;0과 1의 곱 알아보기|zeroone;이야기로 구구 활용하기|story;곱셈구구 연습하기|drill'),
  'g2s2-length': chapter('g2.length2', 'm와 cm 알아보기|meter;m와 cm로 나타내기|mixed;m로 길이 어림하기|estimate;길이 더하기|sum;길이 빼기|story'),
  'g2s2-time': chapter('g2.time', '5분씩 시계 읽기|five;1분씩 시계 읽기|minute;시간을 분으로 바꾸기|hour;걸린 시간 구하기|elapsed;날짜 알아보기|calendar'),
  'g2s2-tables-graphs': chapter('g2.graphs', '표 읽기|table;조사한 표 살펴보기|survey;그래프 읽기|symbols;표와 그래프 연결하기|match;그래프에서 차 구하기|difference'),
  'g2s2-patterns': chapter('g2.patterns', '반복하는 무늬 찾기|repeat;늘어나는 모양 찾기|grow;빈 곳의 무늬 찾기|own;계산표의 규칙 찾기|table;생활 속 규칙 찾기|story'),
  'g3s1-addsub': chapter('g3.addsub', '받아올림 없는 덧셈|plain;받아올림 한 번 덧셈|carry1;여러 번 받아올리는 덧셈|carry2,carry3;받아내림 없는 뺄셈|subtract;받아내림 한 번 뺄셈|borrow1;받아내림 두 번 뺄셈|borrow2;덧셈 어림하기|estimate;이야기로 덧셈과 뺄셈|story'),
  'g3s1-plane-shapes': chapter('g3.plane', '선의 종류 알아보기|lines;직각 알아보기|right;직각삼각형 알아보기|triangle;사각형 이름 알아보기|rectangle;정사각형 세기|square'),
  'g3s1-div': chapter('g3.div1', '똑같이 나누기|share;몇 개씩 묶어 나누기|groups;곱셈과 나눗셈의 관계|relation;곱셈구구로 몫 구하기|quotient,drill;몫의 크기 어림하기|estimate'),
  'g3s1-multiplication': chapter('g3.mul1', '몇십과 한 자리 곱하기|tens;받아올림 없는 곱셈|plain;일의 자리에서 받아올리기|carry;십의 자리에서 받아올리기|carrytens;두 자리에서 받아올리기|carryboth;곱 어림하기|estimate;곱셈 이야기와 연습|story,drill'),
  'g3s1-length-time': chapter('g3.lengthtime', 'mm와 cm 알아보기|mm,cmconvert;km와 m 알아보기|kmconvert;길이 어림하기|estimate;초와 분 알아보기|seconds,clock;분과 초 더하기|sum;걸린 시간 구하기|story;단위 바꾸기 연습하기|drill'),
  'g3s1-fractions-decimals': chapter('g3.fracdec', '부분을 분수로 나타내기|part;단위분수 모으기|unit;같은 분모의 분수 비교|compare;단위분수 크기 비교하기|unitcompare;분수와 소수 연결하기|tenths;소수 크기 비교하기|decimalcompare'),
  'g3s2-multiplication': chapter('g3.mul2', '세 자리 곱셈 알아보기|three;받아올리는 세 자리 곱셈|threecarry;두 자리와 몇십 곱하기|tens;두 자리끼리 곱하기|twotwo;곱 어림하기|estimate;이야기로 곱셈하기|story'),
  'g3s2-circles': chapter('g3.circle', '중심·반지름·지름 알기|radius;반지름으로 지름 구하기|diameter;지름으로 반지름 구하기|half;컴퍼스 간격 알아보기|compass;이야기로 지름 구하기|story'),
  'g3s2-div': chapter('g3.div2', '나누어떨어지는 나눗셈|exact;몫과 나머지 구하기|remainder;나눗셈 확인하기|check;몫 가운데 0 알아보기|three;몫의 크기 어림하기|estimate;이야기로 나눗셈하기|story'),
  'g3s2-weight-capacity': chapter('g3.weightcup', 'mL와 L 알아보기|ml,lconvert;들이 더하기|cupsum;들이 빼기|story;g과 kg 알아보기|grams,kgconvert;t과 kg 알아보기|ton;무게 단위 어림하기|estimate;무게와 들이 어림하기|cupestimate;무게 더하기|sum;무게 빼기|subtract'),
  'g3s2-fractions': chapter('g3.fractions', '전체와 부분의 분수|wholepart;전체의 분수만큼 구하기|amount;분수의 종류 알아보기|types;가분수를 대분수로|mixed;대분수를 가분수로|improper;분수 크기 비교하기|compare'),
  'g3s2-picture-graphs': chapter('g3.pictograph', '그림 한 개의 뜻 알기|key;큰 그림과 작은 그림 읽기|mixed;그림 수로 나타내기|represent;그림그래프의 차 구하기|difference;생활 속 그림그래프 읽기|story'),
  'g4s1-large-numbers': chapter('g4.large', '큰 수의 자릿값 알기|place;억과 만 알아보기|hundredmillion,placeeok;조와 억 알아보기|trillion,placejo;큰 수 비교하기|compare;큰 수 뛰어 세기|story'),
  'g4s1-angles': chapter('g4.angles', '각도기 눈금 읽기|measure;예각·직각·둔각 알기|kind;각도 어림하기|estimate;각도의 합 구하기|sumstory;삼각형의 각 알아보기|triangle;사각형의 각 알아보기|quadrilateral'),
  'g4s1-multiply-divide': chapter('g4.muldiv', '몇백과 몇십 곱하기|drill;세 자리와 몇십 곱하기|tens;세 자리와 두 자리 곱하기|multiply;몫이 한 자리인 나눗셈|onequotient;몫이 두 자리인 나눗셈|divide;몫 어림하기|estimate;나머지까지 생각하기|story'),
  'g4s1-shape-movement': chapter('g4.movement', '도형 밀기|slide;점 옮기기|point;도형 뒤집기|reverse;도형 돌리기|turn;두 번 옮긴 점 찾기|direction'),
  'g4s1-fraction-addsub': chapter('g4.fracaddsub', '진분수 더하기|proper;진분수 빼기|subtract;1이 넘는 분수의 합|over;받아올림 없는 대분수 덧셈|mixed;받아올리는 대분수 덧셈|mixedcarry;받아내림 없는 대분수 뺄셈|mixedsubtract;받아내리는 분수 뺄셈|borrow,story;분수 계산 연습하기|drill'),
  'g4s1-bar-graphs': chapter('g4.bargraphs', '막대그래프 읽기|read;눈금의 크기 알아보기|scale;막대를 그릴 칸 구하기|draw;막대그래프의 차 구하기|difference;조사한 자료 해석하기|survey'),
  'g4s2-decimal-addsub': chapter('g4.decimaladdsub', '소수의 자릿값 알기|place;소수 크기 비교하기|compare;받아올림 없는 소수 덧셈|add;자릿수가 다른 소수 덧셈|align;받아내리는 소수 뺄셈|borrow;이야기로 소수 계산하기|story;소수 계산 연습하기|drill'),
  'g4s2-triangles': chapter('g4.triangles', '변의 길이로 분류하기|isosceles;같은 길이의 변 알아보기|equilateral;이등변삼각형의 각 알기|baseangle;각의 크기로 분류하기|acute;삼각형의 각 살펴보기|obtuse'),
  'g4s2-patterns-equations': chapter('g4.patterns', '늘어나는 수의 규칙|sequence;계산식 배열의 규칙|calculation;표의 규칙을 식으로|shapeformula;생활 속 규칙으로 수 구하기|story;같은 양을 등식으로|equal'),
  'g4s2-quadrilaterals': chapter('g4.quadrilaterals', '수직과 평행 알아보기|perpendicular;평행한 변 알아보기|parallel;마름모 알아보기|rhombus;사각형 이름 알아보기|trapezoid;사각형의 성질 알아보기|inclusion'),
  'g4s2-line-graphs': chapter('g4.linegraphs', '꺾은선그래프 읽기|read;생략한 눈금 읽기|scale;변화량 알아보기|change;가장 많이 오른 때 찾기|trend;생활 속 변화 살펴보기|survey'),
  'g4s2-polygons': chapter('g4.polygons', '다각형 이름 알아보기|name;정다각형 알아보기|regular;대각선 알아보기|diagonal;삼각형으로 모양 채우기|fill;두 조각으로 모양 채우기|compose'),
  'g5s1-mixed-operations': chapter('g5.mixed', '덧셈과 뺄셈의 순서|addsubleft;곱셈과 나눗셈의 순서|left;곱셈을 먼저 계산하기|precedence;나눗셈을 먼저 계산하기|division;괄호가 있는 식 계산|parentheses;이야기로 혼합 계산하기|story'),
  'g5s1-factors-multiples': chapter('g5.factors', '약수 알아보기|factor;배수 알아보기|multiple;최대공약수 구하기|gcd;최소공배수 구하기|lcm;생활 속 공약수 활용|story;공약수와 공배수 연습|drill'),
  'g5s1-reduce-common-denominators': chapter('g5.reduce', '크기가 같은 분수 만들기|equivalent;기약분수로 약분하기|reduce,drill;가장 작은 공통분모 찾기|common;다른 분모의 분수 비교|compare;분수를 소수로 나타내기|todecimal;분수와 소수 비교하기|decimal;생활 속 분수와 소수|story'),
  'g5s1-correspondence': chapter('g5.correspond', '표의 빈 수 찾기|table;곱셈의 대응 관계|multiply;덧셈의 대응 관계|addition;대응식에 수 넣기|value;생활 속 대응 관계|story'),
  'g5s1-fraction-addsub': chapter('g5.fracaddsub', '다른 분모의 분수 덧셈|proper;1이 넘는 분수의 합|over;분모가 다른 대분수 덧셈|mixedadd;다른 분모의 분수 뺄셈|subtract;받아내림 없는 대분수 뺄셈|mixed;받아내리는 대분수 뺄셈|borrow;이야기로 분수 계산하기|story'),
  'g5s1-perimeter-area': chapter('g5.area', '직사각형의 둘레 구하기|perimeter;직사각형의 넓이 구하기|rectangle;넓이 단위 바꾸기|unit;평행사변형의 넓이 구하기|parallelogram;삼각형의 넓이 구하기|triangle,story;사다리꼴의 넓이 구하기|trapezoid;마름모의 넓이 구하기|rhombus'),
  'g5s2-range-rounding': chapter('g5.range', '이상·이하·초과·미만|closed;두 끝이 있는 수의 범위|open;올림과 버림하기|updown;반올림하기|round;모두 타는 버스 수 구하기|buses;만들 수 있는 끈 수 구하기|cut'),
  'g5s2-fraction-multiply': chapter('g5.fracmul', '분수와 자연수 곱하기|timesint;자연수와 분수 곱하기|inttimes;분수끼리 곱하기|proper;대분수가 있는 곱셈|mixed;이야기로 분수 곱셈하기|story'),
  'g5s2-congruence-symmetry': chapter('g5.symmetry', '합동인 모양 찾기|congruent;합동인 도형의 대응변|correspond;선대칭도형 완성하기|line;점대칭도형 완성하기|point;대칭의 중심과 거리|centerdistance'),
  'g5s2-decimal-multiply': chapter('g5.decimalmul', '소수와 자연수 곱하기|timesint;자연수와 소수 곱하기|inttimes;한 자리 소수끼리 곱하기|proper;자릿수가 다른 소수 곱셈|mixed;이야기로 소수 곱셈하기|story;소수 곱셈 연습하기|drill'),
  'g5s2-cuboids': chapter('g5.cuboids', '직육면체와 정육면체|name;면·모서리·꼭짓점 알기|edges;모서리 길이의 합 구하기|faces;정육면체 전개도 찾기|net;접어서 맞은편 면 찾기|opposite'),
  'g5s2-average-likelihood': chapter('g5.average', '평균 구하기|mean;0이 있는 자료의 평균|zero;평균으로 빠진 수 찾기|use;생활 속 평균 구하기|storymean;가능성을 말로 나타내기|words;가능성을 수로 나타내기|numbers;자료로 가능성 예상하기|data'),
  'g6s1-fraction-divide': chapter('g6.fracdiv1', '자연수 나눗셈을 분수로|intfrac;가분수인 몫 알아보기|intover;분자가 나누어지는 나눗셈|divisible;분자가 안 나누어지는 나눗셈|notdivisible;대분수 나누기|mixed;이야기로 분수 나누기|story;분수 나눗셈 연습하기|drill'),
  'g6s1-prisms-pyramids': chapter('g6.prisms', '각기둥 이름 알아보기|name;각기둥의 면 알아보기|faces;꼭짓점과 모서리 알아보기|vertices;각기둥 전개도 알아보기|net;각뿔의 모서리 알아보기|pyramid'),
  'g6s1-decimal-divide': chapter('g6.decimaldiv1', '자연수 나눗셈의 소수 몫|intquotient;소수를 자연수로 나누기|exact;소수 둘째 자리까지 나누기|extend;몫 중간의 0 알아보기|zero;이야기로 소수 나누기|story;소수 나눗셈 연습하기|drill'),
  'g6s1-ratio-rate': chapter('g6.ratio', '두 양의 비 알아보기|ratio;비율을 분수로 나타내기|fraction;비율을 소수로 나타내기|decimal;백분율 알아보기|percent;생활 속 비율 구하기|story;백분율 연습하기|drill'),
  'g6s1-graphs': chapter('g6.graphs', '띠그래프 읽기|band;원그래프 읽기|pie;자료를 백분율로 나타내기|represent;목적에 맞는 그래프 찾기|choose;그래프로 학생 수 구하기|story'),
  'g6s1-cuboid-area-volume': chapter('g6.volume', '직육면체의 겉넓이|surface;단위 정육면체로 부피 재기|unitcube;직육면체의 부피|volume;부피 단위 바꾸기|convert;생활 속 부피 구하기|story'),
  'g6s2-fraction-divide': chapter('g6.fracdiv2', '같은 분모의 분수 나눗셈|same;다른 분모의 분수 나눗셈|different;자연수를 분수로 나누기|int;대분수를 분수로 나누기|mixed;이야기로 분수 나누기|story'),
  'g6s2-space-solids': chapter('g6.space', '한 층 쌓기나무 세기|visible;위에서 본 모양 알아보기|top;앞에서 본 모양 알아보기|front;숨은 쌓기나무 세기|hidden;세 방향으로 모양 찾기|infer'),
  'g6s2-decimal-divide': chapter('g6.decimaldiv2', '한 자리 소수끼리 나누기|sameplaces;자릿수가 다른 소수 나눗셈|different;자연수를 소수로 나누기|int;소수인 몫 반올림하기|round;이야기로 소수 나누기|story'),
  'g6s2-proportion-distribution': chapter('g6.proportion', '간단한 자연수 비 만들기|simplify;분수 비를 자연수 비로|fractionratio;비례식의 빈 수 찾기|missing;자연수가 아닌 배율의 비례식|product;비례배분 알아보기|distribution;생활 속 비례배분|story'),
  'g6s2-circle-perimeter-area': chapter('g6.circlearea', '원주와 지름의 비 알기|pi;지름으로 원주 구하기|perimeter;원주로 지름 구하기|diameter;원의 넓이 구하기|area;생활 속 원의 넓이|story'),
  'g6s2-cylinders-cones-spheres': chapter('g6.roundsolid', '둥근 입체 알아보기|name;밑면의 개수 알아보기|bases;원기둥 전개도 알아보기|net;원기둥 옆면의 가로|width;구의 반지름 구하기|radius'),
};

// 직접 그리기·조작 활동은 현재 답 입력으로 완전히 확인할 수 없다. 새 틀은 만들지 않았다.
export const MISSING_LESSONS = [
  ['g1s1-solid-shapes','모양으로 꾸미기','모양 이름·세기·배열을 고르는 틀만 있음'],
  ['g1s2-patterns','스스로 정한 규칙 만들기','[2수02-02] 창작 활동은 고정 정답으로 자동 평가하지 않음'],
  ['g2s2-patterns','스스로 정한 규칙 만들기','[2수02-02] 창작 활동은 고정 정답으로 자동 평가하지 않음'],
  ['g3s2-circles','컴퍼스로 원 그리기','컴퍼스 간격은 고르지만 원을 직접 그리는 틀은 없음'],
  ['g4s1-angles','주어진 크기의 각 그리기','각도기 읽기·어림·각의 합만 있음'],
  ['g6s1-graphs','띠그래프와 원그래프 그리기','읽기와 백분율 구하기는 있지만 그래프를 직접 그리는 틀은 없음'],
];
