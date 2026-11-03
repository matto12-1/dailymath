// dx and dy use the same screen scale. Sideways wins a diagonal tie.
export function walkDirection(dx,dy,groups) {
  const desired=Math.abs(dx)>=Math.abs(dy)?'walk':dy>0?'front':'back';
  const name=groups.includes(desired)?desired:'walk';
  return {name,flip:name==='walk'&&dx>0};
}
