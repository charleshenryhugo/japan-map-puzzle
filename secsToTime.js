/**
 * @param seconds
 * @returns {string} HH:MM:SS
 */
const secsToTime = function (seconds) {
  let leftSeconds = seconds;
  const hour = Math.floor(leftSeconds / 3600);
  leftSeconds -= hour * 3600;
  const minute = Math.floor(leftSeconds / 60);
  leftSeconds -= minute * 60;

  return [hour, minute, leftSeconds]
    .map(e => String(e).padStart(2, '0'))
    .join(':');
};

export default secsToTime;
