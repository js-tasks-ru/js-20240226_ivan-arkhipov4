/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (obj) {
    let invertedObj = {};
    for (let key of Object.keys(obj)) {
      invertedObj[obj[key]] = key;
    }
    return invertedObj;
  }  
}