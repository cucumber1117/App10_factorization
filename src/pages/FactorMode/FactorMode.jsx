import { useState } from "react";
import styles from "./FactorMode.module.css";

function normalizeExpression(value) {
  return value
    .replace(/[０-９]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0xfee0),
    )
    .replace(/[＋]/g, "+")
    .replace(/[－−]/g, "-")
    .replace(/ｘ/g, "x")
    .replace(/Ｘ/g, "x")
    .replace(/X/g, "x")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/⁴/g, "^4")
    .replace(/\*/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

function formatMathText(text) {
  return text
    .replace(/\^2/g, "²")
    .replace(/\^3/g, "³")
    .replace(/\^4/g, "⁴");
}

function gcdTwo(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }

  return x;
}

function gcdAll(numbers) {
  return numbers.reduce((current, number) => gcdTwo(current, number), 0) || 1;
}

function getDivisors(value) {
  const absValue = Math.abs(value);
  const divisors = [];

  for (let number = 1; number <= absValue; number += 1) {
    if (absValue % number === 0) {
      divisors.push(number, -number);
    }
  }

  return divisors;
}

function parseCoefficient(value) {
  if (value === "" || value === "+") {
    return 1;
  }

  if (value === "-") {
    return -1;
  }

  const number = Number(value);
  return Number.isInteger(number) ? number : null;
}

function parsePolynomial(value) {
  const expression = normalizeExpression(value);

  if (!expression) {
    return { error: "式を入力してください" };
  }

  const terms = expression.match(/[+-]?[^+-]+/g);

  if (!terms || terms.join("") !== expression) {
    return { error: "式を読み取れませんでした" };
  }

  const coefficients = { 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 };

  for (const term of terms) {
    if (term.includes("x")) {
      const [coefficientText, powerText = "1"] = term.split("x");
      const coefficient = parseCoefficient(coefficientText);
      const power = powerText === "" ? 1 : Number(powerText.replace(/^\^/, ""));

      if (coefficient === null || ![1, 2, 3, 4].includes(power)) {
        return { error: "xの1次式から4次式まで計算できます" };
      }

      coefficients[power] += coefficient;
    } else {
      const constant = Number(term);

      if (!Number.isInteger(constant)) {
        return { error: "整数係数の式だけ計算できます" };
      }

      coefficients[0] += constant;
    }
  }

  return {
    a4: coefficients[4],
    a3: coefficients[3],
    a2: coefficients[2],
    a1: coefficients[1],
    a0: coefficients[0],
  };
}

function formatSignedTerm(value) {
  return value >= 0 ? `+ ${value}` : `- ${Math.abs(value)}`;
}

function formatLinearFactor(coefficient, constant) {
  const xTerm =
    coefficient === 1
      ? "x"
      : coefficient === -1
        ? "-x"
        : `${coefficient}x`;

  if (constant === 0) {
    return `(${xTerm})`;
  }

  return `(${xTerm} ${formatSignedTerm(constant)})`;
}

function formatContent(content) {
  if (content === 1) {
    return "";
  }

  if (content === -1) {
    return "-";
  }

  return String(content);
}

function formatQuadraticFactor(a, b, c) {
  const terms = [];

  if (a !== 0) {
    terms.push(a === 1 ? "x^2" : a === -1 ? "-x^2" : `${a}x^2`);
  }

  if (b !== 0) {
    const xTerm = Math.abs(b) === 1 ? "x" : `${Math.abs(b)}x`;
    terms.push(`${b > 0 ? "+" : "-"} ${xTerm}`);
  }

  if (c !== 0) {
    terms.push(formatSignedTerm(c));
  }

  return `(${terms.join(" ")})`;
}

function formatPolynomialFactor(coefficients) {
  const trimmed = [...coefficients];

  while (trimmed.length > 1 && trimmed[0] === 0) {
    trimmed.shift();
  }

  const degree = trimmed.length - 1;
  const terms = [];

  trimmed.forEach((coefficient, index) => {
    if (coefficient === 0) {
      return;
    }

    const power = degree - index;
    const absCoefficient = Math.abs(coefficient);
    const variable =
      power === 0 ? "" : power === 1 ? "x" : `x^${power}`;
    const number =
      absCoefficient === 1 && power > 0 ? "" : String(absCoefficient);
    const term = `${number}${variable}`;

    if (terms.length === 0) {
      terms.push(coefficient < 0 ? `-${term}` : term);
      return;
    }

    terms.push(`${coefficient > 0 ? "+" : "-"} ${term}`);
  });

  return `(${terms.length > 0 ? terms.join(" ") : "0"})`;
}

function evaluatePolynomial(coefficients, numerator, denominator) {
  const degree = coefficients.length - 1;

  return coefficients.reduce(
    (sum, coefficient, index) =>
      sum
        + coefficient
          * numerator ** (degree - index)
          * denominator ** index,
    0,
  );
}

function findLinearFactorFromCoefficients(coefficients) {
  const leadingCoefficient = coefficients[0];
  const constant = coefficients.at(-1);

  if (constant === 0) {
    return { xCoefficient: 1, constant: 0 };
  }

  const xDivisors = getDivisors(leadingCoefficient);
  const constantDivisors = getDivisors(constant);

  for (const xCoefficient of xDivisors) {
    for (const factorConstant of constantDivisors) {
      if (
        evaluatePolynomial(coefficients, -factorConstant, xCoefficient) === 0
      ) {
        return { xCoefficient, constant: factorConstant };
      }
    }
  }

  return null;
}

function divideByLinearFactor(coefficients, xCoefficient, constant) {
  const quotient = [coefficients[0] / xCoefficient];

  for (let index = 1; index < coefficients.length - 1; index += 1) {
    quotient.push((coefficients[index] - constant * quotient[index - 1]) / xCoefficient);
  }

  const remainder = coefficients.at(-1) - constant * quotient.at(-1);

  if (remainder !== 0 || quotient.some((coefficient) => !Number.isInteger(coefficient))) {
    return null;
  }

  return quotient;
}

function findLinearFactor(a, b, c, d) {
  return findLinearFactorFromCoefficients([a, b, c, d]);
}

function factorQuadratic(a, b, c) {
  if (a === 0 && b === 0 && c === 0) {
    return { status: "empty", message: "0はどの式でも割り切れるため、因数分解を1つに決められません" };
  }

  if (a === 0 && b === 0) {
    return { status: "found", answer: String(c) };
  }

  const contentSign = a < 0 || (a === 0 && b < 0) ? -1 : 1;
  const content = gcdAll([a, b, c]) * contentSign;
  const reducedA = a / content;
  const reducedB = b / content;
  const reducedC = c / content;

  if (reducedA === 0) {
    const factor = formatLinearFactor(reducedB, reducedC);
    return { status: "found", answer: `${formatContent(content)}${factor}` };
  }

  if (reducedC === 0) {
    const factor = formatLinearFactor(reducedA, reducedB);
    return { status: "found", answer: `${formatContent(content)}x${factor}` };
  }

  const aDivisors = getDivisors(reducedA);
  const cDivisors = getDivisors(reducedC);

  for (const leftX of aDivisors) {
    const rightX = reducedA / leftX;

    for (const leftConstant of cDivisors) {
      const rightConstant = reducedC / leftConstant;

      if (leftX * rightConstant + rightX * leftConstant === reducedB) {
        const firstFactor = formatLinearFactor(leftX, leftConstant);
        const secondFactor = formatLinearFactor(rightX, rightConstant);
        return {
          status: "found",
          answer: `${formatContent(content)}${firstFactor}${secondFactor}`,
        };
      }
    }
  }

  return { status: "empty", message: "整数の範囲では因数分解できませんでした" };
}

function factorCubic(a, b, c, d) {
  const contentSign = a < 0 ? -1 : 1;
  const content = gcdAll([a, b, c, d]) * contentSign;
  const reducedA = a / content;
  const reducedB = b / content;
  const reducedC = c / content;
  const reducedD = d / content;

  if (reducedD === 0) {
    const quadraticResult = factorQuadratic(reducedA, reducedB, reducedC);
    const quadraticPart =
      quadraticResult.status === "found"
        ? quadraticResult.answer
        : formatQuadraticFactor(reducedA, reducedB, reducedC);

    return {
      status: "found",
      answer: `${formatContent(content)}x${quadraticPart}`,
    };
  }

  const linearFactor = findLinearFactor(reducedA, reducedB, reducedC, reducedD);

  if (!linearFactor) {
    return { status: "empty", message: "整数の範囲では因数分解できませんでした" };
  }

  const { xCoefficient, constant } = linearFactor;
  const quotientA = reducedA / xCoefficient;
  const quotientB = (reducedB - quotientA * constant) / xCoefficient;
  const quotientC = reducedD / constant;
  const quadraticResult = factorQuadratic(quotientA, quotientB, quotientC);
  const quadraticPart =
    quadraticResult.status === "found"
      ? quadraticResult.answer
      : formatQuadraticFactor(quotientA, quotientB, quotientC);

  return {
    status: "found",
    answer: `${formatContent(content)}${formatLinearFactor(
      xCoefficient,
      constant,
    )}${quadraticPart}`,
  };
}

function findQuadraticFactor(a, b, c, d, e) {
  const leadingDivisors = getDivisors(a);
  const constantDivisors = getDivisors(e);

  for (const leftA of leadingDivisors) {
    const rightA = a / leftA;

    for (const leftC of constantDivisors) {
      const rightC = e / leftC;
      const determinant = rightA * leftC - leftA * rightC;

      if (determinant === 0) {
        continue;
      }

      const leftBNumerator = b * leftC - leftA * d;
      const rightBNumerator = rightA * d - b * rightC;

      if (
        leftBNumerator % determinant !== 0
        || rightBNumerator % determinant !== 0
      ) {
        continue;
      }

      const leftB = leftBNumerator / determinant;
      const rightB = rightBNumerator / determinant;

      if (leftA * rightC + leftB * rightB + leftC * rightA === c) {
        return {
          left: [leftA, leftB, leftC],
          right: [rightA, rightB, rightC],
        };
      }
    }
  }

  return null;
}

function factorQuartic(a, b, c, d, e) {
  const contentSign = a < 0 ? -1 : 1;
  const content = gcdAll([a, b, c, d, e]) * contentSign;
  const reducedA = a / content;
  const reducedB = b / content;
  const reducedC = c / content;
  const reducedD = d / content;
  const reducedE = e / content;

  if (reducedE === 0) {
    const cubicResult = factorCubic(reducedA, reducedB, reducedC, reducedD);

    return {
      status: "found",
      answer: `${formatContent(content)}x${
        cubicResult.status === "found"
          ? cubicResult.answer
          : formatPolynomialFactor([reducedA, reducedB, reducedC, reducedD])
      }`,
    };
  }

  const linearFactor = findLinearFactorFromCoefficients([
    reducedA,
    reducedB,
    reducedC,
    reducedD,
    reducedE,
  ]);

  if (linearFactor) {
    const quotient = divideByLinearFactor(
      [reducedA, reducedB, reducedC, reducedD, reducedE],
      linearFactor.xCoefficient,
      linearFactor.constant,
    );

    if (quotient) {
      const cubicResult = factorCubic(quotient[0], quotient[1], quotient[2], quotient[3]);

      return {
        status: "found",
        answer: `${formatContent(content)}${formatLinearFactor(
          linearFactor.xCoefficient,
          linearFactor.constant,
        )}${
          cubicResult.status === "found"
            ? cubicResult.answer
            : formatPolynomialFactor(quotient)
        }`,
      };
    }
  }

  const quadraticFactor = findQuadraticFactor(
    reducedA,
    reducedB,
    reducedC,
    reducedD,
    reducedE,
  );

  if (quadraticFactor) {
    const leftResult = factorQuadratic(...quadraticFactor.left);
    const rightResult = factorQuadratic(...quadraticFactor.right);

    return {
      status: "found",
      answer: `${formatContent(content)}${
        leftResult.status === "found"
          ? leftResult.answer
          : formatQuadraticFactor(...quadraticFactor.left)
      }${
        rightResult.status === "found"
          ? rightResult.answer
          : formatQuadraticFactor(...quadraticFactor.right)
      }`,
    };
  }

  return { status: "empty", message: "整数の範囲では因数分解できませんでした" };
}

function factorPolynomial({ a4, a3, a2, a1, a0 }) {
  if (a4 === 0) {
    if (a3 === 0) {
      return factorQuadratic(a2, a1, a0);
    }

    return factorCubic(a3, a2, a1, a0);
  }

  return factorQuartic(a4, a3, a2, a1, a0);
}

export default function FactorMode() {
  const [input, setInput] = useState("x^2 + 5x + 6");
  const [result, setResult] = useState(null);

  const examples = [
    "x^2 + 5x + 6",
    "2x^2 + 7x + 3",
    "x^3 - 6x^2 + 11x - 6",
    "x^4 - 5x^2 + 4",
  ];

  function calculate() {
    const parsed = parsePolynomial(input);

    if (parsed.error) {
      setResult({ status: "empty", message: parsed.error });
      return;
    }

    setResult(factorPolynomial(parsed));
  }

  function chooseExample(example) {
    setInput(example);
    const parsed = parsePolynomial(example);
    setResult(parsed.error ? null : factorPolynomial(parsed));
  }

  return (
    <section className={styles.card}>
      <div className={styles.topArea}>
        <div>
          <p className={styles.modeLabel}>Calculator Mode</p>
          <h2>因数分解計算</h2>
          <p className={styles.description}>
            式を入力して確認する画面です。4乗の式まで対応しています。
          </p>
        </div>

        <div className={styles.calcIcon}>🧮</div>
      </div>

      <div className={styles.display}>
        <span>入力式</span>
        <strong>{formatMathText(input || "式を入力してください")}</strong>
      </div>

      <div className={styles.inputArea}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setResult(null);
          }}
          placeholder="例: x^2 + 5x + 6"
        />

        <button type="button" className={styles.button} onClick={calculate}>
          因数分解
        </button>
      </div>

      <div
        className={`${styles.previewBox} ${
          result?.status === "found" ? styles.foundResult : ""
        }`}
      >
        <span>結果</span>
        <strong>
          {result?.status === "found"
            ? formatMathText(result.answer)
            : result?.status === "empty"
              ? result.message
              : "式を入力して因数分解を押してください"}
        </strong>
      </div>

      <div className={styles.exampleArea}>
        <p>例題から選ぶ</p>

        <div className={styles.exampleGrid}>
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              className={styles.exampleButton}
              onClick={() => chooseExample(example)}
            >
              {formatMathText(example)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
