function calculateAverage(ratings) {
  let sum = 0;
  for (let i = 0; i < ratings.length; i++) {
    sum += ratings[i];
  }
  return sum / ratings.length;
}

test("average rating is correct", () => {
  const result = calculateAverage([8, 9, 10]);
  expect(result).toBe(9);
});