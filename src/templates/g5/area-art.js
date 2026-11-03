export function areaArt(points,sides=[],segments=[],marks={}){
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),w=maxX-minX,h=maxY-minY,s=7/Math.max(w,h);
  const at=([x,y])=>[5+(x-(minX+maxX)/2)*s,5+(y-(minY+maxY)/2)*s];
  return {kind:'polygon',points:points.map(at),labels:{sides},segments:segments.map(d=>({...d,a:at(d.a),b:at(d.b),labelAt:at(d.labelAt),measureOutside:true})),marks:{},uprightLabels:true,labelsOutside:true,fontSize:20,wide:true};
}
