export function KeyboardInput(keyCode, multi = 1.0) {
  if (keyCode === 87) return -1 * multi;
  if (keyCode === 83) return 1 * multi;
  if (keyCode === 65) return -1 * multi;
  if (keyCode === 68) return 1 * multi;
}
