export function sortArrayOfObjects(...args) {
  const [sortKey, a, b] = args;

  if (a[sortKey] < b[sortKey]) {
    return -1;
  }
  if (a[sortKey] > b[sortKey]) {
    return 1;
  }

  return 0;
}

/**
  Algorithm from:
  https://stackoverflow.com/questions/34730056/constructing-alphabetized-array-of-objects
*/
export function createAlphaSections(baseData, nameKey) {
  const sections = [];

  baseData.forEach((dataPoint) => {
    const firstLetter = dataPoint[nameKey][0].toUpperCase();
    let lastObj = sections[sections.length - 1];

    if (!lastObj || lastObj.name !== firstLetter) {
      lastObj = {
        name: firstLetter,
        data: []
      };
      sections.push(lastObj);
    }
    lastObj.data.push(dataPoint);
  });

  return sections;
}
