import {define,meta,placeSpec} from './helpers.js?v=9a67f36b25';
// 3차시(조): 답은 「몇 조」로 받는다. 조의 자리는 숫자 그대로가 답이라 십조·백조·천조의 자리만 묻는다.
export default define(meta('large','placejo',2,'calc',['01-01'],'조 단위의 자릿값'),placeSpec({key:'large-placejo',base:12,first:13,last:15,maxLength:16,unit:'조'}));
