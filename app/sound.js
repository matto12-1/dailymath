import { h } from './ui.js?v=47133803ae';
import { makeSound } from '../src/game/sound.js?v=47133803ae';
import { browserStorage } from '../src/game/store.js?v=47133803ae';
import { SOUNDS } from './sounds/sounds.js?v=47133803ae';
import { icon } from './icons.js?v=47133803ae';

const load = async (file) => {
  const response = await fetch(new URL(`./sounds/${file}`, import.meta.url));
  if (!response.ok) throw new Error(`소리 파일을 못 받았어요: ${file}`);
  return response.arrayBuffer();
};
export const sound = makeSound({ storage: browserStorage(), files: SOUNDS, load });
// 앱을 열 때 받아 두고(늦지 않게), 처음 누를 때 깨운다.
sound.prepare();
for (const type of ['pointerdown', 'touchend', 'keydown']) addEventListener(type, () => sound.wake(), { capture: true, passive: true });

export function soundButton() {
  const update = () => {
    const label = sound.enabled ? '소리 켜짐' : '소리 꺼짐';
    button.replaceChildren(h('span', { class: 'sound-label' }, label),
      h('span', { class: 'sound-icon', 'aria-hidden': 'true' }, icon(sound.enabled ? 'speaker' : 'mute')));
    button.setAttribute('aria-pressed', String(sound.enabled));
    button.setAttribute('aria-label', label);
  };
  const button = h('button', { class: 'link small pill sound-toggle', onclick: () => { sound.setEnabled(!sound.enabled); update(); } });
  update();
  return button;
}
