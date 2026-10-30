// 묻는 줄을 다른 자료 사이에서 찾도록 세 줄을 서로 다른 차례로 놓는다.
export function pictureRows(rng,label,value,unit,small=0){
  const labels=rng.shuffle(['사과','배','귤','감'].filter(s=>s!==label)).slice(0,2).concat(label);
  const rows=rng.shuffle(labels.map(name=>({name,value:name===label?value:rng.int(2,8)*unit+(small?rng.int(1,8)*small:0)})));
  return {labels:rows.map(r=>r.name),values:rows.map(r=>r.value)};
}
