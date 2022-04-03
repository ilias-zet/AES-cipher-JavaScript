const message = 'зерм';
const key = 'илья';
const alphabet = {
  "а": "11100000", "б": "11100001",
  "в": "11100010", "г": "11100011",
  "д": "11100100", "е": "11100101",
  "ж": "11100110", "з": "11100111",
  "и": "11101000", "й": "11101001",
  "к": "11101010", "л": "11101011",
  "м": "11101100", "н": "11101101",
  "о": "11101110", "п": "11101111",
  "р": "11110000", "с": "11110001",
  "т": "11110010", "у": "11110011",
  "ф": "11110100", "х": "11110101",
  "ц": "11110110", "ч": "11110111",
  "ш": "11111000", "щ": "11111001",
  "ъ": "11111010", "ы": "11111011",
  "ь": "11111100", "э": "11111101",
  "ю": "11111110", "я": "11111111",
};

// Таблица для формирования S-блоков
const SBox = [
  ['63', '7c', '77', '7b', 'f2', '6b', '6f', 'c5', '30', '01', '67', '2b', 'fe', 'd7', 'ab', '76'],
  ['ca', '82', 'c9', '7d', 'fa', '59', '47', 'f0', 'ad', 'd4', 'a2', 'af', '9c', 'a4', '72', 'c0'],
  ['b7', 'fd', '93', '26', '36', '3f', 'f7', 'cc', '34', 'a5', 'e5', 'f1', '71', 'd8', '31', '15'],
  ['04', 'c7', '23', 'c3', '18', '96', '05', '9a', '07', '12', '80', 'e2', 'eb', '27', 'b2', '75'],
  ['09', '83', '2c', '1a', '1b', '6e', '5a', 'a0', '52', '3b', 'd6', 'b3', '29', 'e3', '2f', '84'],
  ['53', 'd1', '00', 'ed', '20', 'fc', 'b1', '5b', '6a', 'cb', 'be', '39', '4a', '4c', '58', 'cf'],
  ['d0', 'ef', 'aa', 'fb', '43', '4d', '33', '85', '45', 'f9', '02', '7f', '50', '3c', '9f', 'a8'],
  ['51', 'a3', '40', '8f', '92', '9d', '38', 'f5', 'bc', 'b6', 'da', '21', '10', 'ff', 'f3', 'd2'],
  ['cd', '0c', '13', 'ec', '5f', '97', '44', '17', 'c4', 'a7', '7e', '3d', '64', '5d', '19', '73'],
  ['60', '81', '4f', 'dc', '22', '2a', '90', '88', '46', 'ee', 'b8', '14', 'de', '5e', '0b', 'db'],
  ['e0', '32', '3a', '0a', '49', '06', '24', '5c', 'c2', 'd3', 'ac', '62', '91', '95', 'e4', '79'],
  ['e7', 'c8', '37', '6d', '8d', 'd5', '4e', 'a9', '6c', '56', 'f4', 'ea', '65', '7a', 'ae', '08'],
  ['ba', '78', '25', '2e', '1c', 'a6', 'b4', 'c6', 'e8', 'dd', '74', '1f', '4b', 'bd', '8b', '8a'],
  ['70', '3e', 'b5', '66', '48', '03', 'f6', '0e', '61', '35', '57', 'b9', '86', 'c1', '1d', '9e'],
  ['e1', 'f8', '98', '11', '69', 'd9', '8e', '94', '9b', '1e', '87', 'e9', 'ce', '55', '28', 'df'],
  ['8c', 'a1', '89', '0d', 'bf', 'e6', '42', '68', '41', '99', '2d', '0f', 'b0', '54', 'bb', '16'],
];

// Матрица для функции MixColumns
const MCmatrix = [
  ['02','03','01','01'],
  ['01','02','03','01'],
  ['01','01','02','03'],
  ['03','01','01','02']
];

// Функция шифрования
const encrypt = (message, key) => {
  let state = '';
  print('Исходное сообщение:', message);
  print('Исходный ключ:', key);

  // Дополняем до 128 бит
  message = get128bit(message);
  key = get128bit(key);

  let msg = message.match(/.{1,8}/g).map(el => parseInt(el, 2))
  print('10-ричное сообщение:', `<div>${msg.join(', ')}</div>`);
  msg = msg.map(el => el.toString(16))
  print('HEX-сообщение:', `<div>${msg.join(', ')}</div>`);
  let k = key.match(/.{1,8}/g).map(el => parseInt(el, 2))
  print('10-ричный ключ:', `<div>${k.join(', ')}</div>`);
  k = k.map(el => el.toString(16))
  print('HEX-ключ:', `<div>${k.join(', ')}</div>`);

  // Конвертируем бинарное сообщение и ключ в HEX-матрицу
  state = getMatrix(getHexArr(message));
  key = getMatrix(getHexArr(key));

  // Генерируем ключи
  const keysArr = keyGenerator(key, 10);

  // Делаем XOR
  state = addRoundKey(state, key);
  print('AddRoundKey():', `
  <div style="display:flex;flex-direction:row;align-items:center">
    <div>${state.map(row => `<div>${row.join(' ')}</div>`).join('')}</div>
  </div>`);

  // Запускаем цикл
  for (let i = 1; i < keysArr.length - 1; i++) {
    print(`<h1 style="color:red">Раунд ${i}</h1>`);

    // Заменяем значениями из таблицы
    print('SubBytes()');
    state = subBytes(state);
  
    // Делаем сдвиг строк в матрице
    print('ShiftRows()');
    state = shiftRows(state);
  
    // Умножаем матрицы
    print('MixColumns()');
    state = mixColumns(state);

    // Делаем XOR
    state = addRoundKey(state, keysArr[i]);
    print('AddRoundKey():', `
    <div style="display:flex;flex-direction:row;align-items:center">
      <div>${state.map(row => `<div>${row.join(' ')}</div>`).join('')}</div>
    </div>`);
  }

  print(`<h1 style="color:red">Финальный раунд</h1>`);
  // Заменяем значениями из таблицы
  print('SubBytes()');
  state = subBytes(state);

  // Делаем сдвиг строк в матрице
  print('ShiftRows()');
  state = shiftRows(state);

  // Делаем XOR
  state = addRoundKey(state, keysArr[keysArr.length - 1]);
  print('AddRoundKey():', `
  <div style="display:flex;flex-direction:row;align-items:center">
    <div>${state.map(row => `<div>${row.join(' ')}</div>`).join('')}</div>
  </div>`);
  
  print(`<h1 style="color:red">Зашифрованное сообщение:</h1>`);
  print(`
    <div style="display:flex;flex-direction:row;align-items:center">
      <div>${state.map(row => `<div>${row.join(' ')}</div>`).join('')}</div>
    <div>
  `)
}

// Функция с помощью которой мы будем выводить все на экран
const print = (...message) => {
  document.body.innerHTML += `<div>${message.join(' ')}</div>`;
}

// Функция для преобразования HEX в двоичный код
const hex2bin = (hex) => {
  let bin = parseInt(hex, 16).toString(2);
  while (bin.length < 8) bin = "0" + bin;
  return bin;
}

// Функция для преобразования чисел в двоичный код
const num2bin = (num) => num.toString(2);

// Функция для преобразования двоичного кода в HEX
const bin2hex = (bin) => parseInt(bin, 2).toString(16);

// Функция для преобразования HEX в десятичные числа
const hex2num = (hex) => parseInt(hex, 16);

// Функция конвертирует текст в двоичный код и дополняет до 128 бит
const get128bit = (text) => {
  let bin = text.split('').map(letter => alphabet[letter]).join('');
  while (bin.length < 128) bin = '0' + bin;
  return bin;
}

// Функция возвращает XOR между стейтом и матрицей ключа сообщением и ключом
const addRoundKey = (state, keyMatrix) => 
  state.map((row, rowIdx) => 
    row.map((el, colIdx) => {
      const binaryMsgByte = hex2bin(el);
      const binaryKeyByte = hex2bin(keyMatrix[rowIdx][colIdx]);
      let hexByte = bin2hex(XOR(binaryMsgByte, binaryKeyByte));
      while (hexByte.length < 2) hexByte = '0' + hexByte;
      return hexByte;
    })
  );

// Собственно сам XOR
const XOR = (bin1, bin2) => {
  while(bin1.length < bin2.length) bin1 = '0' + bin1;
  while(bin2.length < bin1.length) bin2 = '0' + bin2;
  return bin1.split('').map((bit, idx) => bit ^ bin2[idx]).join('');
}

const subBytes = (state) => {
  const HEXstateArr = state.flat(Infinity);

  // Заменяем значениями из таблицы S-box
  let result = HEXstateArr.map(hex => getSboxValue(hex));

  result = getMatrix(result);
  print(`
  Заменяем значениями из таблицы:
  <div style="display:flex;flex-direction:row;align-items:center">
    <div>${state.map(row => `<div>${row.join(' ')}</div>`).join('')}</div>
    <span style="margin: 0 10px">=></span>
    <div>${result.map(row => `<div>${row.join(' ')}</div>`).join('')}</div>
  </div>`);
  return result;
}

// Функция делает битовый сдвиг строк матрицы
const shiftRows = (state) => {
  const result = [];
  state.forEach((row, count) => {
    result.push(bitShift(row,'left', count));
  });
  print(`
  Сдвигаем строки:
  <div style="display:flex;flex-direction:row;align-items:center">
    <div>${state.map(row => `<div>${row.join(' ')}</div>`).join('')}</div>
    <span style="margin: 0 10px">=></span>
    <div>${result.map(row => `<div>${row.join(' ')}</div>`).join('')}</div>
  </div>`);
  return result;
}

// Функция умножает специальную матрицу на входящую
const mixColumns = (state) => {
  // Создаем массив столбцов
  const columns = getColumns(state);
  print(`
  Умножаем матрицы:
  <div style="display:flex;flex-direction:row;align-items:center">
    <div>${state.map(row => `<div>${row.join(' ')}</div>`).join('')}</div>
    <span style="margin: 0 10px">X</span>
    <div>${MCmatrix.map(row => `<div>${row.join(' ')}</div>`).join('')}</div>
  </div>`);

  return columns.map((column) => {
    const preview = [];
    const preResults = MCmatrix.map(matrixRow => {
      preview.push(matrixRow.map((el, idx) => `${el} * ${column[idx]}`));
      return matrixRow.map((el, idx) => hex2num(el) * hex2num(column[idx]));
    });
    let results = preResults.map(res => {
      res = res.map(el => num2bin(el));
      return res.reduce((acc, el) => XOR(acc, el));
    }).map(el => bin2hex(el));
    results = results.map(el => {
      let hex = el;
      while (hex.length > 2) hex = (hex2num(hex) / 1.5).toString(16)
      while (hex.length < 2) hex = '0' + hex;
      return hex;
    })
    print(`
    <span>Умножаем столбец</span>
    <div style="display:flex;flex-direction:row;align-items:center">
      <div>${column.map(el => `<div>${el}</div>`).join('')}</div>
      <span style="margin: 0 10px">X</span>
      <div>${MCmatrix.map(row => `<div>${row.join(' ')}</div>`).join('')}</div>
      <span style="margin: 0 10px">=</span>
      <div>${preview.map(el => `<div>${el.join(' ⊕ ')}</div>`).join('')}</div>
      <span style="margin: 0 10px">=</span>
      <div>${preResults.map(el => `<div>${el.join(' ⊕ ')}</div>`).join('')}</div>
      <span style="margin: 0 10px">=</span>
      <div>${results.map(el => `<div>${el}</div>`).join('')}</div>
    </div>`);
    return results;
  });
}

// Функция генериирует ключи
const keyGenerator = (keyMatrix, keyCount) => {
  const matrixCols = getColumns(keyMatrix);
  const cols = matrixCols;
  for (let i = 4; i < 4 * (keyCount + 1); i++) {
    let nextColl = [];
    const prevCol = cols[i - 1];
    const xorCol = cols[i-4];
    if (i % 4 === 0) {
      const shiftedCol = bitShift(prevCol,'left', 1);
      const subBytedCol = shiftedCol.map(el => getSboxValue(el));
      nextColl = subBytedCol.map((el, idx) => bin2hex(XOR(hex2bin(el), hex2bin(xorCol[idx]))));
    }
    else {
      nextColl = prevCol.map((el, idx) => bin2hex(XOR(hex2bin(el), hex2bin(xorCol[idx]))));
    }
    cols.push(nextColl.map(el => el.length < 2 ? '0'+el : el));
  }
  return getMatrix(cols).map(el => getRows(el));
}

// Функция делает циклический битовый сдвиг
const bitShift = (bytesArr, direction, count) => {
  let k;
  const arr = copyOf(bytesArr);
  if (direction == 'right') k = -1;
  else if (direction == 'left') k = 1;
  const result = arr.splice(k * count).concat(arr);
  return result;
}

// Функция преобразовывает входящий массив в матрицу
const getMatrix = (arr, size=4) => {
  const matrix = [];
  for (let i = 0; i < arr.length; i += size) {
    matrix.push(arr.slice(i, i + size));
  }
  return matrix;
}

const getHexArr = (binaryMsg) => {
  return binaryMsg.match(/.{1,8}/g).map(byte => {
    // Преобразовываем в HEX
    const hex = bin2hex(byte);
    return hex.length >= 2 ? hex : "0" + hex;
  });
}

// Функция делает deep копию объекта
const copyOf = (obj) => JSON.parse(JSON.stringify(obj));

// Функция возвращает значение HEX замененное значением из таблицы S-Box
const getSboxValue = (hex) => {
  const row = hex2num(hex[0]);
  const column = hex2num(hex[1]);
  return SBox[row][column];
}

// Функция возвращает массив столбцов матрицы
const getColumns = (matrix) => {
  const columns = [];
  for (let i = 0; i < matrix.length; i++) {
    columns.push(matrix.map(row => row[i]));
  }
  return columns;
}

const getRows = (matrix) => 
  matrix.map((col, i) => 
    col.map((el, j) => matrix[j][i])
  );

encrypt(message, key);