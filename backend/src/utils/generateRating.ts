export default function getRandomRating(min: number = 3.5, max: number = 5.0, decimalPlaces: number = 1): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round((Math.random() * (max - min) + min) * factor) / factor;
}

