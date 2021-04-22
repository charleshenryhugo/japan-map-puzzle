/**
 *
 * @param src image src
 * @param initialLeft initial absolute left in px
 * @param initialTop initial absolute top in px
 * @param expectedLeft expected absolute left in px, where you want the puzzle piece to match
 * @param expectedTop expected absolute top in px, where you want the puzzle piece to match
 * @param width absolute width in px
 * @param height absolute height in px
 * @param sensitivity
 * @returns {HTMLImageElement}
 */
const makePuzzlePiece = function (
  src,
  initialLeft = '0',
  initialTop = '0',
  expectedLeft = '0',
  expectedTop = '0',
  width = '0',
  height = '0',
  sensitivity = 30
) {
  const piece = document.createElement('img');

  piece.src = src;
  piece.style.width = Number.parseFloat(width) + 'px';
  piece.style.height = Number.parseFloat(height) + 'px';
  piece.style.left = Number.parseFloat(initialLeft) + 'px';
  piece.style.top = Number.parseFloat(initialTop) + 'px';

  piece.classList.add('puzzle-piece');

  piece.moveTo = function (clientX, clientY) {
    const clientRect = this.getBoundingClientRect();
    this.style.left =
      clientX - clientRect.width / 2 + window.pageXOffset + 'px';
    this.style.top =
      clientY - clientRect.height / 2 + window.pageYOffset + 'px';
  };

  piece.isMatched = function () {
    const clientRect = this.getBoundingClientRect();
    return (
      clientRect.left + window.pageXOffset >=
        Number.parseFloat(expectedLeft) - sensitivity &&
      clientRect.left + window.pageXOffset <=
        Number.parseFloat(expectedLeft) + sensitivity &&
      clientRect.top + window.pageYOffset >=
        Number.parseFloat(expectedTop) - sensitivity &&
      clientRect.top + window.pageYOffset <=
        Number.parseFloat(expectedTop) + sensitivity
    );
  };

  piece.getExpectedLeft = function () {
    return Number.parseFloat(expectedLeft);
  };
  piece.getExpectedTop = function () {
    return Number.parseFloat(expectedTop);
  };

  piece.getInitialLeft = function () {
    return Number.parseFloat(initialLeft);
  };
  piece.getInitialTop = function () {
    return Number.parseFloat(initialTop);
  };

  return piece;
};

export default makePuzzlePiece;
