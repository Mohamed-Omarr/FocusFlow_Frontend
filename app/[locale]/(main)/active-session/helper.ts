export const getBreakInfo = (duration: number) => {
  let breakDuration = 0;
  let numBreaks = 0;

  if (duration < 25) return { breakDuration, numBreaks };
  else if (duration <= 60) {
    breakDuration = 5;
    numBreaks = duration <= 40 ? 1 : 2;
  } else if (duration <= 120) {
    breakDuration = 10;
    numBreaks = 2;
  } else if (duration <= 180) {
    breakDuration = 15;
    numBreaks = 3;
  } else if (duration <= 240) {
    breakDuration = 20;
    numBreaks = 4;
  } else if (duration <= 300) {
    breakDuration = 25;
    numBreaks = 5;
  } else {
    breakDuration = 25;
    numBreaks = 6;
  }

  return { breakDuration, numBreaks };
};