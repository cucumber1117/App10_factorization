export const factorQuestions = [
  {
    id: 1,
    level: "easy",
    question: "x^2 + 5x + 6",
    answer: "(x + 2)(x + 3)",
    hint: "足して5、かけて6になる2つの数を考える",
    explanation: "2と3は、2 + 3 = 5、2 × 3 = 6なので、(x + 2)(x + 3)となる。",
  },
  {
    id: 2,
    level: "normal",
    question: "x^2 - 9",
    answer: "(x + 3)(x - 3)",
    hint: "平方の差を使う",
    explanation: "x^2 - 9 は x^2 - 3^2 なので、(x + 3)(x - 3)となる。",
  },
  {
    id: 3,
    level: "hard",
    question: "2x^2 + 7x + 3",
    answer: "(2x + 1)(x + 3)",
    hint: "たすきがけを使う",
    explanation: "2x^2 + 7x + 3 は、たすきがけで (2x + 1)(x + 3)となる。",
  },
];