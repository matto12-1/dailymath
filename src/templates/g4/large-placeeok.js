import {define,meta,placeSpec} from './helpers.js?v=9a67f36b25';
// 2차시(억): 답은 「몇 억」으로 받는다. 억의 자리는 숫자 그대로가 답이라 십억·백억·천억의 자리만 묻는다.
export default define(meta('large','placeeok',2,'calc',['01-01'],'억 단위의 자릿값'),placeSpec({key:'large-placeeok',base:8,first:9,last:11,maxLength:12,unit:'억'}));
