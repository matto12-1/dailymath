export function h(tag, props = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props ?? {})) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k === 'html') e.innerHTML = v; // src/art(문제 그림·보기 그림표)·app/icons.js가 만든 SVG만 넣는다
    else e.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false && kid !== '') e.append(kid instanceof Node ? kid : String(kid));
  return e;
}

export const STRAND_NAME = STRAND_NAMES;
export const VILLAGE_NAME = { cat: '고양이 마을', dog: '강아지 마을' };

export function placeProgress(info) {
  if (info.place === 'done') return '끝냈어요';
  const passed = info.steps.filter(step => step.passed).length;
  return passed ? `${info.steps.length}단계 중 ${passed}개 넘겼어요` : '아직 넘긴 단계가 없어요';
}

export const newId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
import { STRAND_NAMES } from '../src/engine/template.js?v=9a67f36b25';
