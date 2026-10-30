import { g1 } from './g1/index.js?v=9a67f36b25';
import { g2 } from './g2/index.js?v=9a67f36b25';
import { g3 } from './g3/index.js?v=9a67f36b25';
import { g4 } from './g4/index.js?v=9a67f36b25';
import { g5 } from './g5/index.js?v=9a67f36b25';
import { g6 } from './g6/index.js?v=9a67f36b25';
import { pictureHints, alignedPointHints, numberedPictureHints } from '../engine/guess.js?v=9a67f36b25';
export const templates = [...g1, ...g2, ...g3, ...g4, ...g5, ...g6];
// All picture choices declare the shared drawing-feature audit. Specific
// families can add visible-feature strategies here without using answers.
for (const t of templates.filter(t=>t.grade<=4&&t.input==='choice'&&t.art)) {
  t.guessHints ??= [pictureHints];
  if(/^g1\.(solid\.(find|stack)|compare\.)/.test(t.id))t.guessHints=[numberedPictureHints];
  if(t.id==='g4.movement.direction')t.guessHints.push(alignedPointHints);
}
