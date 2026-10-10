// Список возможных префиксов для опций контракта
const OPTION_PREFIXES = ["PO-", "TO-", "RFA-", "UFA-"];

/**
 * Парсит денежное значение в целое число.
 * Разделителями могут быть пробелы, запятые, точки.
 * Поддерживает префиксы (PO-, TO-, RFA-, UFA-) — они игнорируются.
 *
 * @param raw - исходное значение (число, строка или null/undefined)
 * @returns целое число (0, если распарсить не удалось)
 */
export const parseMoney = (raw: string | number | null | undefined): number => {
  if (raw === null || raw === undefined || raw === "") return 0;

  // Убираем префиксы опций, если они есть
  let str = String(raw).trim();
  for (const p of OPTION_PREFIXES) {
    if (str.startsWith(p)) {
      str = str.slice(p.length);
      break;
    }
  }

  // Оставляем только цифры, разделители и минус
  const cleaned = str.replace(/[^\d\s.,-]/g, "").replace(/[\s.,]/g, ""); // убираем разделители

  if (!cleaned || cleaned === "-") return 0;

  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
};

/**
 * Форматирует числовое значение, добавляя пробелы между разрядами.
 * Если значение содержит один из префиксов (PO-, TO-, RFA-, UFA-),
 * префикс сохраняется, а числовая часть форматируется.
 *
 * @param value - исходное значение (число, строка, null или undefined)
 * @returns отформатированная строка
 */
export const formatValueWithSpaces = (
  value: string | number | null | undefined,
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
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? `.${parts[1]}` : "";

  // Отделяем знак минус, если есть
  let sign = "";
  let unsignedInteger = integerPart;
  if (integerPart.startsWith("-")) {
    sign = "-";
    unsignedInteger = integerPart.slice(1);
  }

  // Форматируем целую часть без знака: 1234567 -> "1 234 567"
  unsignedInteger = unsignedInteger.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  const formattedNumber = sign + unsignedInteger + decimalPart;
  return prefix + formattedNumber;
};

/**
 * Алиас для обратной совместимости с TeamRoster.
 * Раньше называлась formatYearValue — теперь использует общий формат с пробелами.
 */
export const formatYearValue = formatValueWithSpaces;

/**
 * Преобразует отформатированное значение (с пробелами) обратно в строку для сохранения.
 * Если в значении присутствуют нечисловые символы (кроме минуса, точки и пробела),
 * возвращается исходная строка (например, с префиксом). Иначе удаляются пробелы.
 *
 * @param formattedValue - значение, отформатированное для отображения
 * @returns строка, готовая к сохранению
 */
export const parseFormattedValue = (
  formattedValue: string | null | undefined,
): string => {
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
  value: string | null | undefined,
  previousValue?: string,
): string => {
  if (value === null || value === undefined) return "";

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
 * Включает как обычные (year_*), так и dead cap (dc_year_*).
 *
 * @param column - имя колонки
 * @returns true, если колонка относится к зарплатам по годам
 */
export const isYearColumn = (column: string): boolean => {
  return column.startsWith("year_") || column.startsWith("dc_year_");
};
