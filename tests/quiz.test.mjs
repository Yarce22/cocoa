// Quiz behavior on the built contact page. Run after `npm run build`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const PAGE = 'dist/contacto/index.html';
const skip = !existsSync(PAGE) && 'run astro build first';
const SRC = existsSync('public/assets/js/quiz.js') ? readFileSync('public/assets/js/quiz.js', 'utf8') : '';

// Boots the quiz in a fresh window; `storage` carries localStorage across visits.
const boot = (storage = {}) => {
  const html = readFileSync(PAGE, 'utf8').replace(/<script[^>]*src=[^>]*><\/script>/g, '');
  const dom = new JSDOM(html, { url: 'https://cocoa.test/contacto', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  for (const [k, v] of Object.entries(storage)) w.localStorage.setItem(k, v);
  w.matchMedia = () => ({ matches: false, addEventListener() {} });
  w.scrollTo = () => {};
  w.eval(SRC);
  const $ = (s) => w.document.querySelector(s);
  const dump = () => Object.fromEntries(Object.keys(w.localStorage).map((k) => [k, w.localStorage.getItem(k)]));
  const pick = (i = 0) => $(`#q-step .opt:nth-of-type(${i + 1})`).click();
  const type = (sel, value) => { const el = $(sel); el.value = value; el.dispatchEvent(new w.Event('input', { bubbles: true })); };
  const next = () => $('[data-act="next"]').click();
  const wait = () => new Promise((r) => setTimeout(r, 450)); // pick auto-advances after 380ms
  return { w, $, dump, pick, type, next, wait };
};

// Answers the three choice questions and the date, leaving the quiz on the place question.
const toPlace = async (q) => {
  for (let i = 0; i < 3; i++) { q.pick(0); await q.wait(); }
  q.$('[data-act="nodate"]').click();
  q.next();
};

test('typing in a text answer does not re-render the event chips', { skip }, async () => {
  const q = boot();
  await toPlace(q);
  const before = [...q.$('#q-chips').children];
  assert.ok(before.length >= 3);
  q.type('#q-lugar', 'P');
  q.type('#q-lugar', 'Pe');
  const after = [...q.$('#q-chips').children];
  assert.equal(after.length, before.length);
  after.forEach((el, i) => assert.equal(el, before[i], `chip ${i} was replaced`));
});

test('chips still update when an answer changes them', { skip }, async () => {
  const q = boot();
  q.pick(0);
  assert.equal(q.$('#q-chips .chip').textContent, q.$('#q-step .opt b').textContent);
});

test('leaving and coming back restores answers and step', { skip }, async () => {
  const q1 = boot();
  await toPlace(q1);
  q1.type('#q-lugar', 'Pereira');
  const label = q1.$('#q-label').textContent;
  const chips = q1.$('#q-chips').textContent;

  const q2 = boot(q1.dump());
  assert.equal(q2.$('#q-label').textContent, label);
  assert.equal(q2.$('#q-lugar').value, 'Pereira');
  assert.equal(q2.$('#q-chips').textContent, chips);
});

test('corrupt saved data starts a clean quiz', { skip }, () => {
  const q = boot({ cocoaQuiz: '{not json' });
  assert.equal(q.$('#q-step .opt.sel'), null);
  assert.ok(q.$('#q-back').disabled);
});

test('a saved step past an unanswered question falls back to that question', { skip }, () => {
  const q = boot({ cocoaQuiz: JSON.stringify({ v: 1, step: 6, a: { servicio: 'Catering' } }) });
  assert.ok(q.$('#q-step [role=radiogroup]'), 'should show a choice question');
  assert.equal(q.$('#q-step .opt[data-pick="Catering"]'), null, 'should not be on the first question');
  assert.equal(q.$('#q-step .opt.sel'), null, 'second question has no answer yet');
});

test('sending the quote by WhatsApp clears the saved quiz', { skip }, async () => {
  const q = boot();
  await toPlace(q);
  q.type('#q-lugar', 'Pereira'); q.next();
  q.$('[data-act="skip"]').click();
  q.type('#q-nombre', 'Ana'); q.next();
  assert.ok(Object.keys(q.dump()).length > 0, 'quiz should be saved before sending');
  const send = q.$('a.wa');
  send.addEventListener('click', (e) => e.preventDefault());
  send.click();
  assert.deepEqual(q.dump(), {});
});
