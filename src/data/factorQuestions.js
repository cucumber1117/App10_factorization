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

function makeFactorQuestion(id, level, a, b, c, d) {
  const x2Coef = a * c;
  const xCoef = a * d + b * c;
  const constant = b * d;
  const question = formatQuadratic(x2Coef, xCoef, constant);
  const answer = `${formatFactor(a, b)}${formatFactor(c, d)}`;

  return {
    id,
    level,
    question,
    answer,
    hint: "たすきがけで、x^2の係数と定数の組み合わせを確認する",
    explanation: `${answer}を展開すると ${question} になる。`,
  };
}

function makeNumberRange(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function makeMonicPairs(values, limit, filter) {
  const pairs = [];

  for (const p of values) {
    for (const q of values) {
      if (p > q || p === 0 || q === 0 || !filter(p, q)) {
        continue;
      }

      pairs.push([p, q]);
    }
  }

  return pairs.slice(0, limit);
}

function makeFactorSets({
  leftCoefficients,
  rightCoefficients,
  constants,
  limit,
  filter,
}) {
  const seen = new Set();
  const factors = [];

  for (const a of leftCoefficients) {
    for (const c of rightCoefficients) {
      for (const b of constants) {
        for (const d of constants) {
          if (b === 0 || d === 0 || !filter(a, b, c, d)) {
            continue;
          }

          const x2Coef = a * c;
          const xCoef = a * d + b * c;
          const constant = b * d;
          const key = `${x2Coef},${xCoef},${constant}`;

          if (seen.has(key)) {
            continue;
          }

          seen.add(key);
          factors.push([a, b, c, d]);
        }
      }
    }
  }

  return pickDiverseFactors(factors, limit);
}

function pickDiverseFactors(factors, limit) {
  const groups = new Map();

  for (const factor of factors) {
    const [a, , c] = factor;
    const x2Coefficient = a * c;

    if (!groups.has(x2Coefficient)) {
      groups.set(x2Coefficient, []);
    }

    groups.get(x2Coefficient).push(factor);
  }

  const sortedGroups = [...groups.entries()]
    .sort(([left], [right]) => left - right)
    .map(([, group]) => group);
  const selected = [];
  let index = 0;

  while (selected.length < limit && sortedGroups.length > 0) {
    const group = sortedGroups[index % sortedGroups.length];
    const factor = group.shift();

    if (factor) {
      selected.push(factor);
    }

    if (group.length === 0) {
      sortedGroups.splice(index % sortedGroups.length, 1);
    } else {
      index += 1;
    }
  }

  return selected;
}

const easyPairs = makeMonicPairs(makeNumberRange(1, 14), 70, () => true);

const normalPairs = makeMonicPairs(
  makeNumberRange(-14, 14),
  80,
  (p, q) => p < 0 || q < 0,
);

const hardFactors = makeFactorSets({
  leftCoefficients: makeNumberRange(2, 7),
  rightCoefficients: makeNumberRange(1, 4),
  constants: makeNumberRange(1, 8),
  limit: 80,
  filter: () => true,
});

const expertFactors = makeFactorSets({
  leftCoefficients: makeNumberRange(2, 8),
  rightCoefficients: makeNumberRange(2, 6),
  constants: makeNumberRange(-8, 8),
  limit: 90,
  filter: (a, b, c, d) => b * d < 0 || a * d + b * c < 0,
});

const masterFactors = makeFactorSets({
  leftCoefficients: makeNumberRange(3, 10),
  rightCoefficients: makeNumberRange(2, 9),
  constants: makeNumberRange(-12, 12),
  limit: 100,
  filter: (a, b, c, d) =>
    Math.abs(a * c) >= 12 && Math.abs(a * d + b * c) >= 8,
});

const randomLevelConfigs = {
  easy: {
    type: "monic",
    values: makeNumberRange(1, 9),
    filter: (p, q) => p + q <= 12 && p * q <= 36,
  },
  normal: {
    type: "monic",
    values: makeNumberRange(-10, 10).filter((number) => number !== 0),
    filter: (p, q) =>
      (p < 0 || q < 0) && Math.abs(p + q) <= 12 && Math.abs(p * q) <= 48,
  },
  hard: {
    type: "factor",
    leftCoefficients: makeNumberRange(2, 5),
    rightCoefficients: makeNumberRange(1, 3),
    constants: makeNumberRange(1, 8),
    filter: (a, b, c, d) =>
      a * c <= 12 && Math.abs(a * d + b * c) <= 32 && b * d <= 48,
  },
  expert: {
    type: "factor",
    leftCoefficients: makeNumberRange(2, 8),
    rightCoefficients: makeNumberRange(2, 6),
    constants: makeNumberRange(-10, 10).filter((number) => number !== 0),
    filter: (a, b, c, d) =>
      (b * d < 0 || a * d + b * c < 0)
      && a * c <= 36
      && Math.abs(a * d + b * c) <= 60
      && Math.abs(b * d) <= 80,
  },
  master: {
    type: "factor",
    leftCoefficients: makeNumberRange(3, 12),
    rightCoefficients: makeNumberRange(2, 10),
    constants: makeNumberRange(-14, 14).filter((number) => number !== 0),
    filter: (a, b, c, d) =>
      Math.abs(a * c) >= 18
      && Math.abs(a * c) <= 72
      && Math.abs(a * d + b * c) >= 10
      && Math.abs(a * d + b * c) <= 120
      && Math.abs(b * d) <= 144,
  },
};

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function pickRandomPair(config) {
  while (true) {
    const p = pickRandom(config.values);
    const q = pickRandom(config.values);

    if (config.filter(p, q)) {
      return p <= q ? [p, q] : [q, p];
    }
  }
}

function pickRandomFactors(config) {
  while (true) {
    const a = pickRandom(config.leftCoefficients);
    const b = pickRandom(config.constants);
    const c = pickRandom(config.rightCoefficients);
    const d = pickRandom(config.constants);

    if (config.filter(a, b, c, d)) {
      return [a, b, c, d];
    }
  }
}

export function generateRandomQuestion(level, id = Date.now()) {
  const config = randomLevelConfigs[level] ?? randomLevelConfigs.easy;

  if (config.type === "monic") {
    const [p, q] = pickRandomPair(config);
    return makeMonicQuestion(id, level, p, q);
  }

  const [a, b, c, d] = pickRandomFactors(config);
  return makeFactorQuestion(id, level, a, b, c, d);
}

export function generateRandomQuestions(level, count) {
  const questions = [];
  const seen = new Set();
  let attempts = 0;

  while (questions.length < count && attempts < count * 50) {
    const question = generateRandomQuestion(level, `${level}-${questions.length}-${attempts}`);
    attempts += 1;

    if (seen.has(question.question)) {
      continue;
    }

    seen.add(question.question);
    questions.push({
      ...question,
      id: `${level}-${questions.length + 1}`,
    });
  }

  return questions;
}

export const worksheetQuestionCount = 30;

export const factorQuestions = [
  ...easyPairs.map(([p, q], index) =>
    makeMonicQuestion(index + 1, "easy", p, q),
  ),
  ...normalPairs.map(([p, q], index) =>
    makeMonicQuestion(index + 101, "normal", p, q),
  ),
  ...hardFactors.map(([a, b, c, d], index) =>
    makeFactorQuestion(index + 201, "hard", a, b, c, d),
  ),
  ...expertFactors.map(([a, b, c, d], index) =>
    makeFactorQuestion(index + 301, "expert", a, b, c, d),
  ),
  ...masterFactors.map(([a, b, c, d], index) =>
    makeFactorQuestion(index + 401, "master", a, b, c, d),
  ),
];
