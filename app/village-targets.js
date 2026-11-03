// Visible painted bounds are the input to the shared point picker.
export function villageTargets(root) {
  return [...root.querySelectorAll('.stage > .thing')].filter(node=>node.dataset.imageMissing!=='true').map((node,order)=>{
    const image=node.querySelector('.thing-art'),r=image.getBoundingClientRect(),box=JSON.parse(node.dataset.artBox);
    return {id:node.dataset.target,node,type:node.dataset.target.split(':')[0],baby:node.dataset.baby==='true',
      left:r.left+r.width*box.l/100,right:r.left+r.width*box.r/100,top:r.top+r.height*box.t/100,bottom:r.top+r.height*box.b/100,
      depth:Number(getComputedStyle(node).zIndex),order};
  });
}
