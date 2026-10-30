import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.time.calendar","unit":"g2s2-time","strand":"life","level":3,"label":"한 주 뒤 날짜","std":["[2수03-09]"]}, {


  range:{min:1,max:31},operandRange:{min:0,max:2030},answerSpan:seq(8,31),errorCount:3,
  texts:['{month}월 {d}일은 {weekday}요일입니다. 바로 다음 {weekday}요일은 며칠일까요?'],
  draw(rng){const year=2026,month=rng.int(1,12),last=new Date(Date.UTC(year,month,0)).getUTCDate(),d=rng.int(1,last-7),weekday=['일','월','화','수','목','금','토'][new Date(Date.UTC(year,month-1,d)).getUTCDay()];
    return {year,month,last,d,weekday,...errors(wrong(d+6,'처음 날도 모두 세기',`${d}일을 첫째 날로 세어 하루 적게 갔습니다. 다음 ${weekday}요일은 ${d}일에 7일을 더한 ${d+7}일입니다.`),
      wrong(d+8,'하루 더 세기',`한 주를 세면서 하루를 더 갔습니다. 한 주를 7일로 세면 다음 ${weekday}요일은 ${d+7}일입니다.`),
      (d+7<10||d+7>=last-1||rng.pick([true,false]))?wrong(d+5,'요일 칸 두 칸 덜 가기',`다음 주 같은 요일까지 가면서 두 칸을 덜 갔습니다. 빠뜨린 두 칸까지 가면 다음 ${weekday}요일은 ${d+7}일입니다.`):wrong(d+14,'두 주 뒤로 가기',`한 주 대신 두 주 뒤의 날짜를 골랐습니다. 14일 대신 7일만 더하면 다음 ${weekday}요일은 ${d+7}일입니다.`))};},
  candidates:({last})=>seq(1,last),answer:({d})=>d+7,
  check:({year,month,d})=>new Date(Date.UTC(year,month-1,d+7)).getUTCDate(),
  art:({year,month,d})=>({kind:'calendar',year,month,marks:[d]}),
  solution: "1주일은 7일이므로 같은 요일은 7일마다 돌아옵니다.\n{d} + 7 = {answer}입니다.\n따라서 다음 {weekday}요일은 {answer}일입니다.",
});
