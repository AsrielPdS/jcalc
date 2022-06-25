
export enum QueryAlgorithm {
  word,
  like
}
export interface QueryOptions {
  type: QueryAlgorithm,
  fields?: string[],
  sub?: boolean;
  subfields?: boolean;
}

function queryInArray<T>(query: string, array: T[], fields?: string[]) {
  var words = query.split(' ');

  return array.filter((row) => queryInObj(words, row, fields));
}
export function queryInObj(words: string[], obj, fields?: string[]) {
  function helper(obj, fields?: string[]) {
    if (typeof obj == "object") {
      var r: string[] = [];

      for (let key in obj)
        if (!fields || fields.indexOf(key) > -1)
          r.push.apply(r, helper(obj[key]));
      return r;
    }
    else if (typeof obj == "string" || (typeof obj == "number" && (obj = obj.toString()))) {
      var r: string[] = [];
      for (let word of words)
        if (obj.indexOf(word) > -1)
          r.push(word);
      return r;
    }
    return [];
  }

  let t = helper(obj, fields);
  return words.every((word) => t.indexOf(word) > -1);
}

export function query<T>(query: string, array: Array<T>, options: QueryOptions) {
  switch (options.type) {
    case QueryAlgorithm.word:
      return queryInArray(query, array, options.fields);
    case QueryAlgorithm.like:
      break;
  }
  return null;
}

function compareString(str1: string, str2: string) {
  str1 = str1.replace(/\s+/g, '');
  str2 = str2.replace(/\s+/g, '');

  if (!str1.length && !str2.length) return 1;                   // if both are empty strings
  if (!str1.length || !str2.length) return 0;                   // if only one is empty string
  if (str1 === str2) return 1;       							 // identical
  if (str1.length === 1 && str2.length === 1) return 0;         // both are 1-letter strings
  if (str1.length < 2 || str2.length < 2) return 0;			 // if either is a 1-letter string

  let firstBigrams = new Map();
  for (let i = 0; i < str1.length - 1; i++) {
    const bigram = str1.substr(i, 2);
    const count = firstBigrams.has(bigram)
      ? firstBigrams.get(bigram) + 1
      : 1;

    firstBigrams.set(bigram, count);
  };

  let intersectionSize = 0;
  for (let i = 0; i < str2.length - 1; i++) {
    const bigram = str2.substr(i, 2);
    const count = firstBigrams.has(bigram)
      ? firstBigrams.get(bigram)
      : 0;

    if (count > 0) {
      firstBigrams.set(bigram, count - 1);
      intersectionSize++;
    }
  }

  return (2.0 * intersectionSize) / (str1.length + str2.length - 2);
}