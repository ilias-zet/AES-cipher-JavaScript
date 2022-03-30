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
  print('128-битное сообщение:', `<div style="font-size:10px">${message}</div>`);
  print('128-битный ключ:', `<div style="font-size:10px">${key}</div>`);

  // Делаем XOR
  state = addRoundKey(message, key);
  print('AddRoundKey():', `<div style="font-size:10px">${state}</div>`);

  // Заменяем значениями из таблицы
  print('SubBytes()');
  state = subBytes(state);

  // Делаем сдвиг строк в матрице
  print('ShiftRows()');
  state = shiftRows(state);
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

// Функция возвращает XOR между бинарным сообщением и ключом
const addRoundKey = (msgBin, keyBin) => msgBin.split('').map((bit, idx) => bit ^ keyBin[idx]).join('');

const subBytes = (state) => {
  // Разбиваем стейт на части по 8 бит
  const HEXstateArr = state.match(/.{1,8}/g).map(byte => {
    // Преобразовываем в HEX
    const hex = bin2hex(byte);
    return hex.length === 2 ? hex : "0" + hex;
  });

  // Заменяем значениями из таблицы S-box
  const result = HEXstateArr.map(hex => {
    const row = hex2num(hex[0]);
    const column = hex2num(hex[1]);
    return SBox[row][column];
  });

  // print('Входящая матрица:');
  // print(getMatrix(HEXstateArr).map(row => `<div>${row.join(' ')}</div>`).join(''));
  // print('Результат:');
  // print(getMatrix(result).map(row => `<div>${row.join(' ')}</div>`).join(''));

  return result;
}

// Функция делает битовый сдвиг строк матрицы
const shiftRows = (state) => {
  const matrix = getMatrix(state);
  const result = []
  matrix.forEach((row, count) => {
    result.push(bitShift(row,'left', count));
  });
  // print('Входящая матрица:');
  // print(getMatrix(state).map(row => `<div>${row.join(' ')}</div>`).join(''));
  // print('Результат:');
  // print(result.map(row => `<div>${row.join(' ')}</div>`).join(''));
  return result;
}

// Функция делает циклический битовый сдвиг
const bitShift = (bytesArr, direction, count) => {
  let k;
  if (direction == 'right') k = -1;
  else if (direction == 'left') k = 1;
  return bytesArr.splice(k * count).concat(bytesArr);
}

// Функция преобразовывает входящий массив в матрицу
const getMatrix = (arr, size=4) => {
  console.log(arr)
  let matrix = [];
  for (let i = 0; i < arr.length; i += size) {
    console.log(i, i+ size)
    const a = arr.slice(i, i+size)
    console.log(a)
    matrix.push(arr.slice(i, i + size));
  }
  console.log(matrix)
  return matrix;
}

encrypt(message, key);