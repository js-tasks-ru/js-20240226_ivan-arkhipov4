/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (typeof size === 'undefined') {
    return string;
  }

  let count = 1;
  let trimmedString = '';
  let countChar = '';

  for (const currentChar of string) {
    
    if (currentChar != countChar) {
      countChar = currentChar;
      count = 1;
    } else {
      count++;
    }
  
    if (count <= size) {
      trimmedString += currentChar;
    }
  }
  return trimmedString;
}