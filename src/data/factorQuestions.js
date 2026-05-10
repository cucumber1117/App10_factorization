function formatQuadratic(a, b, c) {
  const firstTerm = a === 1 ? "x^2" : `${a}x^2`;
  const terms = [firstTerm];

  if (b !== 0) {
    const absB = Math.abs(b);
    const xTerm = absB === 1 ? "x" : `${absB}x`;
    terms.push(`${b > 0 ? "+" : "-"} ${xTerm}`);
  }

  if (c !== 0) {
    terms.push(`${c > 0 ? "+" : "-"} ${Math.abs(c)}`);
  }

  return terms.join(" ");
}

function formatFactor(coef, constant) {
  const xTerm = coef === 1 ? "x" : `${coef}x`;
  return `(${xTerm} ${constant > 0 ? "+" : "-"} ${Math.abs(constant)})`;
}

function makeMonicQuestion(id, level, p, q) {
  const sum = p + q;
  const product = p * q;
  const answer = `${formatFactor(1, p)}${formatFactor(1, q)}`;
  const question = formatQuadratic(1, sum, product);
  const isSquareDifference = sum === 0 && product < 0;

  return {
    id,
    level,
    question,
    answer,
    hint: isSquareDifference
      ? "平方の差を使う"
      : `和が${sum}、積が${product}になる2つの数を考える`,
    explanation: `${answer}を展開すると ${question} になる。`,
  };
}

function makeHardQuestion(id, a, b, c, d) {
  const x2Coef = a * c;
  const xCoef = a * d + b * c;
  const constant = b * d;
  const question = formatQuadratic(x2Coef, xCoef, constant);
  const answer = `${formatFactor(a, b)}${formatFactor(c, d)}`;

  return {
    id,
    level: "hard",
    question,
    answer,
    hint: "たすきがけで、x^2の係数と定数の組み合わせを確認する",
    explanation: `${answer}を展開すると ${question} になる。`,
  };
}

const easyPairs = [
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [1, 6],
  [1, 7],
  [1, 8],
  [1, 9],
  [1, 10],
  [2, 2],
  [2, 3],
  [2, 4],
  [2, 5],
  [2, 6],
  [2, 7],
  [2, 8],
  [2, 9],
  [2, 10],
  [3, 3],
  [3, 4],
  [3, 5],
  [3, 6],
  [3, 7],
  [3, 8],
  [3, 9],
  [3, 10],
  [4, 4],
  [4, 5],
  [4, 6],
  [4, 7],
  [4, 8],
  [4, 9],
  [4, 10],
  [5, 5],
  [5, 6],
  [5, 7],
  [5, 8],
  [5, 9],
  [5, 10],
  [6, 6],
  [6, 7],
  [6, 8],
  [6, 9],
  [6, 10],
  [7, 7],
  [7, 8],
  [7, 9],
  [7, 10],
  [8, 8],
];

const normalPairs = [
  [1, -2],
  [1, -3],
  [1, -4],
  [1, -5],
  [1, -6],
  [1, -7],
  [1, -8],
  [1, -9],
  [1, -10],
  [2, -3],
  [2, -4],
  [2, -5],
  [2, -6],
  [2, -7],
  [2, -8],
  [2, -9],
  [2, -10],
  [3, -4],
  [3, -5],
  [3, -6],
  [3, -7],
  [3, -8],
  [3, -9],
  [3, -10],
  [2, -2],
  [3, -3],
  [4, -4],
  [5, -5],
  [6, -6],
  [7, -7],
  [8, -8],
  [9, -9],
  [10, -10],
  [-1, -1],
  [-1, -2],
  [-1, -3],
  [-1, -4],
  [-1, -5],
  [-1, -6],
  [-2, -2],
  [-2, -3],
  [-2, -4],
  [-2, -5],
  [-2, -6],
  [-3, -3],
  [-3, -4],
  [-3, -5],
  [-4, -4],
  [-4, -5],
  [-5, -5],
];

const hardFactors = [
  [2, 1, 1, 3],
  [2, 3, 1, 4],
  [3, 1, 1, 2],
  [3, 2, 1, 5],
  [4, 1, 1, 3],
  [5, 2, 1, 1],
  [2, 5, 1, 2],
  [3, 4, 1, 1],
  [2, 1, 3, 2],
  [2, 3, 3, 1],
  [2, 5, 3, 2],
  [4, 3, 2, 1],
  [5, 1, 2, 3],
  [3, 5, 2, 1],
  [4, 1, 3, 2],
  [5, 3, 3, 1],
  [6, 1, 1, 5],
  [6, 5, 1, 1],
  [2, -1, 1, 3],
  [2, 1, 1, -3],
  [3, -1, 1, 4],
  [3, 2, 1, -5],
  [4, -3, 1, 2],
  [5, 1, 1, -2],
  [2, -3, 3, 1],
  [2, 3, 3, -1],
  [3, -2, 2, 5],
  [3, 2, 2, -5],
  [4, -1, 2, 3],
  [4, 1, 2, -3],
  [5, -2, 2, 1],
  [5, 2, 2, -1],
  [2, -5, 1, -1],
  [3, -4, 1, -2],
  [4, -3, 1, -1],
  [5, -1, 1, -3],
  [2, -1, 3, -2],
  [2, -3, 3, -1],
  [3, -5, 2, -1],
  [4, -1, 3, -2],
  [2, 7, 1, 1],
  [3, 7, 1, 2],
  [4, 5, 1, 3],
  [5, 4, 1, 2],
  [6, 5, 1, 2],
  [2, 7, 3, 1],
  [3, 8, 2, 1],
  [4, 7, 2, 3],
  [5, 6, 3, 1],
  [6, 7, 2, 1],
];

export const factorQuestions = [
  ...easyPairs.map(([p, q], index) =>
    makeMonicQuestion(index + 1, "easy", p, q),
  ),
  ...normalPairs.map(([p, q], index) =>
    makeMonicQuestion(index + 51, "normal", p, q),
  ),
  ...hardFactors.map(([a, b, c, d], index) =>
    makeHardQuestion(index + 101, a, b, c, d),
  ),
];
