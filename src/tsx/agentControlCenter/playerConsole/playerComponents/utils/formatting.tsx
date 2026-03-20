// export const formatValueWithSpaces = (
//   value: string | number | null,
// ): string => {
//   if (value === null || value === undefined || value === "") {
//     return "";
//   }

//   const stringValue = value.toString();
//   const isNumber = /^-?\d*\.?\d*$/.test(stringValue.replace(/\s/g, ""));

//   if (!isNumber) {
//     return stringValue;
//   }

//   const cleanValue = stringValue.replace(/[^\d.-]/g, "");

//   if (cleanValue === "" || cleanValue === "-") {
//     return cleanValue;
//   }

//   const parts = cleanValue.split(".");
//   let integerPart = parts[0];
//   const decimalPart = parts.length > 1 ? `.${parts[1]}` : "";

//   integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

//   const formatted = integerPart + decimalPart;
//   return cleanValue.startsWith("-") ? `-${formatted}` : formatted;
// };

// export const parseFormattedValue = (formattedValue: string): string => {
//   if (
//     formattedValue === null ||
//     formattedValue === undefined ||
//     formattedValue === ""
//   ) {
//     return "";
//   }

//   const hasText = /[^-\d.\s]/.test(formattedValue);

//   if (hasText) {
//     return formattedValue;
//   }

//   return formattedValue.replace(/\s/g, "");
// };

// export const applyInputMask = (
//   value: string,
//   previousValue: string,
// ): string => {
//   const hasNonNumericChars = /[^-\d.\s]/.test(value);

//   if (hasNonNumericChars) {
//     return value;
//   }

//   let cleanValue = value.replace(/[^\d.-]/g, "");

//   if (cleanValue.includes("-")) {
//     if (cleanValue.charAt(0) !== "-") {
//       cleanValue = cleanValue.replace(/-/g, "");
//     } else if (cleanValue.lastIndexOf("-") > 0) {
//       cleanValue = "-" + cleanValue.replace(/-/g, "");
//     }
//   }

//   const dotCount = (cleanValue.match(/\./g) || []).length;
//   if (dotCount > 1) {
//     const firstDotIndex = cleanValue.indexOf(".");
//     cleanValue =
//       cleanValue.substring(0, firstDotIndex + 1) +
//       cleanValue.substring(firstDotIndex + 1).replace(/\./g, "");
//   }

//   return cleanValue;
// };

// export const isYearColumn = (column: string): boolean => {
//   return [
//     "year_one",
//     "year_two",
//     "year_three",
//     "year_four",
//     "year_five",
//   ].includes(column);
// };

// utils/formatting.ts

// Список возможных префиксов для опций контракта
const OPTION_PREFIXES = ["PO-", "TO-", "RFA-", "UFA-"];

/**
 * Форматирует числовое значение, добавляя пробелы между разрядами.
 * Если значение содержит один из префиксов (PO-, TO-, RFA-, UFA-),
 * префикс сохраняется, а числовая часть форматируется.
 *
 * @param value - исходное значение (число, строка или null)
 * @returns отформатированная строка
 */
export const formatValueWithSpaces = (
  value: string | number | null,
): string => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const stringValue = value.toString().trim();

  // Определяем, есть ли префикс
  let prefix = "";
  let numberPart = stringValue;
  for (const p of OPTION_PREFIXES) {
    if (stringValue.startsWith(p)) {
      prefix = p;
      numberPart = stringValue.slice(p.length);
      break;
    }
  }

  // Проверяем, является ли оставшаяся часть числом (убираем пробелы для проверки)
  const numberWithoutSpaces = numberPart.replace(/\s/g, "");
  const isNumber = /^-?\d*\.?\d*$/.test(numberWithoutSpaces);

  if (!isNumber) {
    // Если после префикса не число, возвращаем исходную строку без изменений
    return stringValue;
  }

  // Оставляем только цифры, точку и минус
  const cleanValue = numberPart.replace(/[^\d.-]/g, "");

  if (cleanValue === "" || cleanValue === "-") {
    return prefix + cleanValue;
  }

  const parts = cleanValue.split(".");
  let integerPart = parts[0];
  const decimalPart = parts.length > 1 ? `.${parts[1]}` : "";

  // Отделяем знак минус, если есть
  let sign = "";
  let unsignedInteger = integerPart;
  if (integerPart.startsWith("-")) {
    sign = "-";
    unsignedInteger = integerPart.slice(1);
  }

  // Форматируем целую часть без знака
  unsignedInteger = unsignedInteger.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  const formattedNumber = sign + unsignedInteger + decimalPart;
  return prefix + formattedNumber;
};

/**
 * Преобразует отформатированное значение (с пробелами) обратно в строку для сохранения.
 * Если в значении присутствуют нечисловые символы (кроме минуса, точки и пробела),
 * возвращается исходная строка (например, с префиксом). Иначе удаляются пробелы.
 *
 * @param formattedValue - значение, отформатированное для отображения
 * @returns строка, готовая к сохранению
 */
export const parseFormattedValue = (formattedValue: string): string => {
  if (
    formattedValue === null ||
    formattedValue === undefined ||
    formattedValue === ""
  ) {
    return "";
  }

  const hasText = /[^-\d.\s]/.test(formattedValue);

  if (hasText) {
    return formattedValue;
  }

  return formattedValue.replace(/\s/g, "");
};

/**
 * Применяет маску к вводимому значению, ограничивая ввод цифрами, точкой и минусом.
 * Если в строке есть другие символы (например, буквы), маска не применяется.
 *
 * @param value - текущее значение поля ввода
 * @param previousValue - предыдущее значение (не используется, но оставлено для совместимости)
 * @returns отфильтрованное значение
 */
export const applyInputMask = (
  value: string,
  previousValue: string,
): string => {
  const hasNonNumericChars = /[^-\d.\s]/.test(value);

  if (hasNonNumericChars) {
    return value;
  }

  let cleanValue = value.replace(/[^\d.-]/g, "");

  // Корректируем минусы: разрешён только в начале
  if (cleanValue.includes("-")) {
    if (cleanValue.charAt(0) !== "-") {
      cleanValue = cleanValue.replace(/-/g, "");
    } else if (cleanValue.lastIndexOf("-") > 0) {
      cleanValue = "-" + cleanValue.replace(/-/g, "");
    }
  }

  // Оставляем не более одной точки
  const dotCount = (cleanValue.match(/\./g) || []).length;
  if (dotCount > 1) {
    const firstDotIndex = cleanValue.indexOf(".");
    cleanValue =
      cleanValue.substring(0, firstDotIndex + 1) +
      cleanValue.substring(firstDotIndex + 1).replace(/\./g, "");
  }

  return cleanValue;
};

/**
 * Проверяет, является ли колонка одной из годовых зарплатных колонок.
 *
 * @param column - имя колонки
 * @returns true, если колонка относится к зарплатам по годам
 */
export const isYearColumn = (column: string): boolean => {
  return [
    "year_one",
    "year_two",
    "year_three",
    "year_four",
    "year_five",
  ].includes(column);
};
