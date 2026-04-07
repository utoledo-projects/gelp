function calculateRatingAverage(ratings) {
  if (ratings.length === 0) return 0;

  const total = ratings.reduce((sum, r) => sum + r, 0);
  return total / ratings.length;
}

test("calculates average rating correctly", () => {
  const ratings = [8, 9, 10];
  const result = calculateRatingAverage(ratings);

  expect(result).toBe(9);
});

test("returns 0 for empty ratings", () => {
  const result = calculateRatingAverage([]);

  expect(result).toBe(0);
});