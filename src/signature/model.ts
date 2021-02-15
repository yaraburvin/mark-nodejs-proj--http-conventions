interface Signature {
  /**
   * Treated like an id, the return value of Date.now() [making the assumption that no more than 1 signature is added in a given millisecond]
   *
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
   */
  date: number;
  name: string;
  message?: string;
}

/**
 * A data structure to store signatures.
 */
type SignatureCollection = Signature[];
// note: an object would be the preferred structure
//    for more efficient lookup by id (date), but
//    we're using an array of signatures to make the
//    typing a bit friendlier.
// if you're interested, look up the Record type:
// type SignatureCollection = Record<string, Signature>

/**
 * Where we store our signatures.
 *
 * Private variable - should not be used directly.
 */
let _signatureCollection: SignatureCollection = [];

function protectFromMutations(
  signatures: SignatureCollection
): SignatureCollection {
  /**
   * Uses a spread inside of a map to prevent
   *  accidental mutation: shallow copy of each
   *  signature and then a new array containing them all
   */
  return signatures.map((signature) => ({
    ...signature,
  }));
}

export function getAllSignatures() {
  return protectFromMutations(_signatureCollection);
}

/**
 * Finds the first signature with the matching date
 * @param date the Date.now() number id for the date
 */
export function getSignatureByDate(date: number) {
  const matchingSignature = _signatureCollection.find(
    (signature) => signature.date === date
  );
  return matchingSignature ? { ...matchingSignature } : null;
}

export function getSignatureByDateOrFail() {}

export function setAllSignatures(signatures: SignatureCollection) {
  _signatureCollection = protectFromMutations(signatures);
}
