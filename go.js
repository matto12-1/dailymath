// 줄임 주소(맨 위·teacher/·admin/)가 받은 물음과 #을 지닌 채 data-to로 보낸다(tools/build-site.mjs가 만든다).
const to = document.currentScript && document.currentScript.dataset.to;
if (to) location.replace(to + location.search + location.hash);
