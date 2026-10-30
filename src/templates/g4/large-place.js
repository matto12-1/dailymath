import {define,meta,placeSpec} from './helpers.js?v=9a67f36b25';
// 1차시는 교과서 차례대로 만·십만·백만·천만의 자리까지만 묻는다(5~8자리 수). 억은 2차시, 조는 3차시 틀이 맡는다.
export default define(meta('large','place',1,'calc',['01-01'],'큰 수의 자릿값'),placeSpec({key:'large-place',base:0,first:4,last:7,maxLength:8}));
