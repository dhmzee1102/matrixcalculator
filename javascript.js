function createMatrix() {
  const dimension = parseInt(document.getElementById('dimension').value, 10);

  const matrixTable = document.getElementById('matrixTable');
  matrixTable.innerHTML = '';

  for (let i = 0; i < dimension; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < dimension; j++) {
      const cell = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = `A[${i}][${j}]`;
      cell.appendChild(input);
      row.appendChild(cell);
    }
    matrixTable.appendChild(row);
  }

  const matrixInput = document.getElementById('matrixInput');
  matrixInput.style.display = 'block';

  const result = document.getElementById('result');
  result.style.display = 'none';
}

function calculateInverse() {
  const dimension = parseInt(document.getElementById('dimension').value, 10);
  const matrix = [];

  const matrixTable = document.getElementById('matrixTable');
  const inputElements = matrixTable.getElementsByTagName('input');

  for (let i = 0; i < dimension; i++) {
    const row = [];
    for (let j = 0; j < dimension; j++) {
      const value = parseFloat(inputElements[i * dimension + j].value);
      row.push(value);
    }
    matrix.push(row);
  }

  const inverseMatrix = getInverseMatrix(matrix);

  if (inverseMatrix === null) {
    const error = document.getElementById('error');
    error.textContent = 'Matrix is not invertible.';
    error.style.color = 'red';

    const result = document.getElementById('result');
    result.style.display = 'none';
  } else {
    const resultTable = document.getElementById('resultTable');
    resultTable.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < dimension; j++) {
        const cell = document.createElement('td');
        cell.textContent = inverseMatrix[i][j];
        row.appendChild(cell);
      }
      resultTable.appendChild(row);
    }

    const error = document.getElementById('error');
    error.textContent = '';
    error.style.color = 'red';

    const result = document.getElementById('result');
    result.style.display = 'block';
  }
}

function getInverseMatrix(matrix) {
  const dimension = matrix.length;
  const identityMatrix = getIdentityMatrix(dimension);
  const augmentedMatrix = [];

  // Augment the matrix with the identity matrix
  for (let i = 0; i < dimension; i++) {
    const row = matrix[i].concat(identityMatrix[i]);
    augmentedMatrix.push(row);
  }

  // Perform row operations to transform the matrix to reduced row echelon form
  for (let i = 0; i < dimension; i++) {
    const pivot = augmentedMatrix[i][i];

    if (pivot === 0) {
      for (let j = i + 1; j < dimension; j++) {
        if (augmentedMatrix[j][i] !== 0) {
          [augmentedMatrix[i], augmentedMatrix[j]] = [augmentedMatrix[j], augmentedMatrix[i]];
          break;
        }
      }

      if (augmentedMatrix[i][i] === 0) {
        return null; // Matrix is not invertible
      }
    }

    // Scale the current row to make the pivot equal to 1
    for (let j = i; j < 2 * dimension; j++) {
      augmentedMatrix[i][j] /= pivot;
    }

    // Eliminate other rows
    for (let j = 0; j < dimension; j++) {
      if (j !== i) {
        const factor = augmentedMatrix[j][i];
        for (let k = i; k < 2 * dimension; k++) {
          augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k];
        }
      }
    }
  }

  // Extract the inverse matrix
  const inverseMatrix = [];
  for (let i = 0; i < dimension; i++) {
    const row = augmentedMatrix[i].slice(dimension);
    inverseMatrix.push(row);
  }

  return inverseMatrix;
}

function getIdentityMatrix(dimension) {
  const identityMatrix = [];
  for (let i = 0; i < dimension; i++) {
    const row = [];
    for (let j = 0; j < dimension; j++) {
      row.push(i === j ? 1 : 0);
    }
    identityMatrix.push(row);
  }
  return identityMatrix;
}
function solveLinearEquations(coefficients, constants) {
  const numEquations = coefficients.length;
  const numVariables = coefficients[0].length;

  const matrix = [];
  for (let i = 0; i < numEquations; i++) {
    const row = coefficients[i].concat(constants[i]);
    matrix.push(row);
  }

  const variableValues = solveGaussianElimination(matrix, numVariables);
  return variableValues;
}

function solveGaussianElimination(matrix, numVariables) {
  const augmentedMatrix = [...matrix];

  for (let i = 0; i < numVariables; i++) {
    let pivotRow = i;

    for (let j = i + 1; j < augmentedMatrix.length; j++) {
      if (Math.abs(augmentedMatrix[j][i]) > Math.abs(augmentedMatrix[pivotRow][i])) {
        pivotRow = j;
      }
    }

    [augmentedMatrix[i], augmentedMatrix[pivotRow]] = [augmentedMatrix[pivotRow], augmentedMatrix[i]];

    const pivot = augmentedMatrix[i][i];

    for (let j = i + 1; j < augmentedMatrix.length; j++) {
      const factor = augmentedMatrix[j][i] / pivot;

      for (let k = i; k < augmentedMatrix[j].length; k++) {
        augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k];
      }
    }
  }

  const solution = new Array(numVariables);
  for (let i = numVariables - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < numVariables; j++) {
      sum += augmentedMatrix[i][j] * solution[j];
    }
    solution[i] = (augmentedMatrix[i][numVariables] - sum) / augmentedMatrix[i][i];
  }

  return solution;
}

document.getElementById('linearEquationForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const numVariables = parseInt(document.getElementById('numVariables').value, 10);
  const numEquations = parseInt(document.getElementById('numEquations').value, 10);

  const coefficients = [];
  const constants = [];

  for (let i = 0; i < numEquations; i++) {
    const equationCoefficients = [];
    for (let j = 0; j < numVariables; j++) {
      const variableCoefficient = parseFloat(document.getElementById(`coefficient-${i}-${j}`).value);
      equationCoefficients.push(variableCoefficient);
    }
    coefficients.push(equationCoefficients);

    const constant = parseFloat(document.getElementById(`constant-${i}`).value);
    constants.push(constant);
  }

  const variableValues = solveLinearEquations(coefficients, constants);

  const output = variableValues.map((value, index) => `Variable ${index + 1}: ${value}`);
  document.getElementById('output').innerText = output.join('\n');
});

document.getElementById('numVariables').addEventListener('input', function(event) {
  const numVariables = parseInt(event.target.value, 10);
  const numEquations = parseInt(document.getElementById('numEquations').value, 10);

  const variablesContainer = document.getElementById('variablesContainer');
  variablesContainer.innerHTML = '';

  for (let i = 0; i < numVariables; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `variable-${i}`;
    input.placeholder = `Variable ${i + 1}`;

    variablesContainer.appendChild(input);
  }
});

document.getElementById('numEquations').addEventListener('input', function(event) {
  const numEquations = parseInt(event.target.value, 10);
  const numVariables = parseInt(document.getElementById('numVariables').value, 10);

  const equationsContainer = document.getElementById('equationsContainer');
  equationsContainer.innerHTML = '';

  for (let i = 0; i < numEquations; i++) {
    const equationContainer = document.createElement('div');
    equationContainer.className = 'equation';

    for (let j = 0; j < numVariables; j++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.id = `coefficient-${i}-${j}`;
      input.placeholder = `Coefficient ${j + 1}`;

      equationContainer.appendChild(input);
    }

    const constantInput = document.createElement('input');
    constantInput.type = 'text';
    constantInput.id = `constant-${i}`;
    constantInput.placeholder = 'Constant';

    equationContainer.appendChild(constantInput);
    equationsContainer.appendChild(equationContainer);
  }
});