// 선생님·관리 화면의 밝은 판·어두운 판(2026-10-22 결정). 모듈이 아닌 작은 스크립트로 <head>에서 CSS보다 먼저 읽어
// 그리기 전에 html[data-theme]를 단다(깜빡임 없게, 쪽 안 글은 CSP가 막는다). 색 값은 staff.css가 이 표시를 보고 갈아 낀다.
// 고른 판은 이 기기의 dailymath.staff.theme('light' | 'dark')에 남고, 없으면 컴퓨터 설정(prefers-color-scheme)을 따른다.
// 저장이 막힌 창(읽기·쓰기가 오류)이면 컴퓨터 설정대로 그린다. 밝기 단추는 staff-theme.js.
(function () {
  var KEY = 'dailymath.staff.theme';
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function saved() {
    try {
      var value = window.localStorage.getItem(KEY);
      return value === 'light' || value === 'dark' ? value : null;
    } catch (e) {
      return null;
    }
  }
  function system() {
    return media && media.matches ? 'dark' : 'light';
  }
  root.setAttribute('data-theme', saved() || system());
  // 고른 판이 없으면 컴퓨터 설정이 바뀔 때 따라간다
  if (media && media.addEventListener) {
    media.addEventListener('change', function () {
      if (!saved()) root.setAttribute('data-theme', system());
    });
  }
})();
