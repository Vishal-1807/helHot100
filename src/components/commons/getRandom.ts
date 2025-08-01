export const getSecureRandomNumber = (min: number, max: number): number => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  // Get a uniformly distributed index in 0 ... arrayLength - 1
  return array[0] % (max - min + 1) + min;
}