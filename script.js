'use strict';

import prefectures from './prefectures.js';
import secsToTime from './secsToTime.js';
import makePuzzlePiece from './makePuzzlePiece.js';

const japanWhiteMap = document.getElementById('japan-white-map');
const japanWhiteMapInnerFrame = japanWhiteMap.getElementById('inner-frame');
const puzzlePiecesBox = document.getElementById('puzzle-pieces-box');
const modeSwitchBtns = document.getElementById('mode-switch-buttons');
const startBtn = document.getElementById('start-button');
const giveUpBtn = document.getElementById('give-up-button');
const timerLabel = document.getElementById('timer-label');
const [EASY, MEDIUM, HARD] = [0, 1, 2];
let gameMode = EASY;
let matchedPieces = 0;
let timer = 0;

/**
 * place and size the puzzle map according to current viewport
 */
const initPuzzleMap = function () {
  const { clientHeight } = document.documentElement;

  japanWhiteMap.style.height = clientHeight + 'px';
  japanWhiteMap.style.left = '0px';
};

/**
 * match all puzzle pieces to the map
 */
const matchAllPuzzlePieces = function () {
  prefectures.forEach((prefecture, index) => {
    const targetRect = japanWhiteMap
      .getElementById(prefecture)
      .getBoundingClientRect();
    const puzzlePiece = makePuzzlePiece(
      `mapResources/${prefecture}-jp.svg`,
      targetRect.left + window.pageXOffset,
      targetRect.top + window.pageYOffset,
      targetRect.left + window.pageXOffset,
      targetRect.top + window.pageYOffset,
      targetRect.width,
      targetRect.height
    );
    puzzlePiecesBox.append(puzzlePiece);
  });
};

/**
 * move out all puzzle pieces so that user can start playing
 * random their left and top
 */
const shuffleAllPuzzlePieces = function (prefectureNameHints = true) {
  while (puzzlePiecesBox.firstElementChild)
    puzzlePiecesBox.firstElementChild.remove();

  const srcFileNameSuffix = prefectureNameHints ? '-jp' : '';

  prefectures
    .sort(() => 0.5 - Math.random())
    .forEach((prefecture, index) => {
      const targetRect = japanWhiteMap
        .getElementById(prefecture)
        .getBoundingClientRect();
      const puzzlePiece = makePuzzlePiece(
        `mapResources/${prefecture}${srcFileNameSuffix}.svg`,
        japanWhiteMap.getBoundingClientRect().right + 70 * (index % 7),
        40 + 100 * Math.floor(index / 7),
        targetRect.left + window.pageXOffset,
        targetRect.top + window.pageYOffset,
        targetRect.width,
        targetRect.height
      );
      puzzlePiecesBox.append(puzzlePiece);
    });
};

const makePuzzlePiecesDraggable = function () {
  puzzlePiecesBox.addEventListener('mousedown', function (e) {
    e.preventDefault();

    const target = e.target.closest('.puzzle-piece');
    if (!target) return;
    if (target.isMatched()) return;

    const targetClientRect = target.getBoundingClientRect();
    const shiftX =
      e.clientX - targetClientRect.left - targetClientRect.width / 2;
    const shiftY =
      e.clientY - targetClientRect.top - targetClientRect.height / 2;

    target.style.zIndex = 1000;

    target.moveTo(e.clientX - shiftX, e.clientY - shiftY);

    const onMouseMove = function (e) {
      target.moveTo(e.clientX - shiftX, e.clientY - shiftY);
    };

    document.addEventListener('mousemove', onMouseMove);

    puzzlePiecesBox.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove);
      puzzlePiecesBox.onmouseup = null;

      if (target.isMatched()) {
        target.style.left = target.getExpectedLeft() + 'px';
        target.style.top = target.getExpectedTop() + 'px';
        target.style.zIndex = 500;
        matchedPieces++;
      } else {
        target.style.left = target.getInitialLeft() + 'px';
        target.style.top = target.getInitialTop() + 'px';
        target.style.zIndex = 0;
      }

      if (matchedPieces >= prefectures.length) {
        clearInterval(timer);
        timerLabel.textContent += ' 🥳COMPLETED!';
        giveUpBtn.textContent = '🏠BACK';
      }
    };
  });
};

const initModeSwitchBtns = function () {
  modeSwitchBtns.classList.remove('hidden');

  const japanWhiteMapRect = japanWhiteMap.getBoundingClientRect();
  modeSwitchBtns.style.top =
    document.documentElement.clientHeight / 2 - 150 + 'px';
  modeSwitchBtns.style.left =
    japanWhiteMapRect.right +
    (document.documentElement.clientWidth - japanWhiteMapRect.right) / 2 -
    100 +
    'px';

  modeSwitchBtns.addEventListener('click', function (e) {
    const target = e.target.closest('[data-mode]');
    if (!target) return;

    gameMode = Number(target.dataset.mode);

    modeSwitchBtns
      .querySelectorAll('button')
      .forEach(btn => (btn.style.backgroundColor = 'beige'));
    target.style.backgroundColor = 'lightgrey';
  });
};

const startGame = function () {
  matchedPieces = 0;
  // change map appearance according to gameMode
  switch (gameMode) {
    case EASY:
      // show prefecture name hints
      shuffleAllPuzzlePieces(true);
      // show inner frame
      japanWhiteMapInnerFrame.style.opacity = 1;
      break;
    case MEDIUM:
      // no prefecture name hints
      shuffleAllPuzzlePieces(false);
      // show inner frame
      japanWhiteMapInnerFrame.style.opacity = 1;
      break;
    case HARD:
      // no prefecture name hints
      shuffleAllPuzzlePieces(false);
      // hide inner frame
      japanWhiteMapInnerFrame.style.opacity = 0;
      break;
    default:
      break;
  }

  // hide mode switch buttons
  modeSwitchBtns.classList.add('hidden');
  // hide "start" button
  startBtn.classList.add('hidden');
  // show "give up" button
  giveUpBtn.classList.remove('hidden');
  giveUpBtn.textContent = '🤷‍️GIVE UP';

  // show timer label
  timerLabel.textContent = '00:00:00';
  timerLabel.classList.remove('hidden');
  // start timer
  let seconds = 0;
  timer = setInterval(() => {
    seconds++;
    timerLabel.textContent = secsToTime(seconds);
  }, 1000);
};

const endGame = function () {
  matchedPieces = 0;
  while (puzzlePiecesBox.firstElementChild)
    puzzlePiecesBox.firstElementChild.remove();

  matchAllPuzzlePieces();

  // show buttons
  modeSwitchBtns.classList.remove('hidden');
  startBtn.classList.remove('hidden');
  giveUpBtn.classList.add('hidden');

  // hide timer label
  timerLabel.classList.add('hidden');
  // stop timer
  clearInterval(timer);
};

const initStartBtn = function () {
  startBtn.classList.remove('hidden');

  const japanWhiteMapRect = japanWhiteMap.getBoundingClientRect();

  startBtn.style.top = document.documentElement.clientHeight / 2 + 'px';
  startBtn.style.left =
    japanWhiteMapRect.right +
    (document.documentElement.clientWidth - japanWhiteMapRect.right) / 2 -
    75 +
    'px';

  startBtn.addEventListener('click', startGame);
};

const initGiveUpBtn = function () {
  giveUpBtn.classList.add('hidden');

  giveUpBtn.addEventListener('click', endGame);
};

const initTimerLabel = function () {
  timerLabel.classList.add('hidden');
};

const initGame = function () {
  initPuzzleMap();
  matchAllPuzzlePieces();
  makePuzzlePiecesDraggable();
  initModeSwitchBtns();
  initStartBtn();
  initGiveUpBtn();
  initTimerLabel();
};
initGame();
