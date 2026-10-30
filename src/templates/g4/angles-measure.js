import {define,meta,seq,cycle,errors,wrong} from './helpers.js?v=9a67f36b25';
const angles=seq(10,170,5);
export default define(meta('angles','measure',1,'shape',['03-24'],'각도기 눈금 읽기'),{
  input:'number',answerUnit:'°',answerSpan:angles,errorCount:3,
  texts:['각도기로 잰 각은 몇 도일까요?','그림의 각도를 읽으면 몇 도일까요?'],
  draw(rng){const deg=cycle(rng,'angle-measure',angles),left=rng.int(0,1)===1;return {deg,left,...errors(wrong(180-deg,'바깥 눈금을 읽기',`0에서 시작하지 않는 쪽 눈금을 읽어 ${180-deg}°라고 했습니다. 밑금에 맞춘 변이 지나는 0에서 시작하는 눈금으로 읽으면 ${deg}°입니다.`),wrong(deg===170?160:Math.ceil(deg/10)*10+(deg%10===0?10:0),'큰 눈금으로 읽기',`작은 눈금 대신 가까운 큰 눈금 ${deg===170?160:Math.ceil(deg/10)*10+(deg%10===0?10:0)}°를 읽었습니다. 작은 눈금 한 칸이 5°이므로 바늘이 지나는 눈금까지 세면 ${deg}°입니다.`),wrong(deg===10?20:deg-5,'작은 눈금 한 칸 어긋나게 읽기',`다른 눈금 ${deg===10?20:deg-5}°를 읽었습니다. 0에서 시작하여 변이 지나는 눈금까지 작은 눈금을 세면 ${deg}°입니다.`))};},
  answer:v=>v.deg,check:v=>v.left?180-(180-v.deg):v.deg,
  // 각도기는 폰에서 카드 여백까지 넓힌다(검수 14번).
  art:v=>({kind:'angle',expand:true,deg:v.deg,protractor:true,tickStep:5,leftBase:v.left,wide:true,bleed:true}),
  solution:'각도기의 밑금에 맞춘 변이 지나는 눈금 0에서 시작하여 다른 변이 지나는 눈금을 읽습니다.\n따라서 그림의 각도는 {answer}°입니다.',
});
