import { protectFromMutations } from "./util";

export interface Signature {
  /**
   * Treated like an id, the return value of Date.now() [making the assumption that no more than 1 signature is added in a given millisecond]
   *
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
   */
  date: number;
  name: string;
  message?: string;
}

/** A signature, omitting the 'date' property */
export type DatelessSignature = Omit<Signature, "date">;

/**
 * A data structure to store signatures.
 */
export type SignatureCollection = Signature[];
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

/**
 * Finds the first signature with the matching date.
 * Returns null if there is no matching signature
 * @param date the Date.now() number id for the date
 */
export function findSignatureByDate(date: number): Signature | null {
  const matchingSignature = _signatureCollection.find(
    (signature) => signature.date === date
  );
  return matchingSignature ? { ...matchingSignature } : null;
}

/**
 * Finds the first signature with the matching date.
 * Throws an error if there is no matching signature.
 *
 * @param date the Date.now() number id for the date
 */
export function findSignatureByDateOrFail(date: number): Signature {
  const signature = findSignatureByDate(date);
  if (signature) {
    return signature;
  } else {
    throw new Error(`No signature exists with the date ${date}`);
  }
}

export function getAllSignatures(): SignatureCollection {
  return protectFromMutations(_signatureCollection);
}

/**
 * Inserts data from a (dateless) signature into the collection.
 * Returns the signature inserted, with an auto-given date
 * @param signature the (dateless) signature to insert
 */
export function insertSignature(signature: DatelessSignature): Signature {
  const signatureToAdd = {
    ...signature,
    date: Date.now(), // create date as adding it in
  };
  _signatureCollection.push(signatureToAdd);
  return signatureToAdd;
}

export function setAllSignatures(signatures: SignatureCollection): void {
  _signatureCollection = protectFromMutations(signatures);
}
