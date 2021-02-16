import { isObjectSubset, protectFromMutations } from "./utils";

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
 * All keys set as optional for a Signature
 * https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype
 */
export type PartialSignature = Partial<Signature>;

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
 * Finds the index of the first signature with the matching data.
 * Returns null if there is no matching signature.
 *
 * @param signatureMatcher the properties to match against
 */
export function findIndexOfSignature(
  signatureMatcher: PartialSignature
): number | null {
  for (let [index, signature] of Object.entries(getAllSignatures())) {
    if (isObjectSubset(signature, signatureMatcher)) {
      return parseInt(index);
    }
  }
  return null;
}

/**
 * Finds the first signature with the matching data.
 * Returns null if there is no matching signature.
 *
 * @param signatureMatcher the properties to match against
 */
export function findSignature(
  signatureMatcher: PartialSignature
): Signature | null {
  const matchingSignature = getAllSignatures().find((signature) =>
    isObjectSubset(signature, signatureMatcher)
  );
  return matchingSignature ? { ...matchingSignature } : null;
}

/**
 * Finds the first signature with the matching date.
 * Returns null if there is no matching signature
 * @param date the Date.now() number id for the date
 */
export function findSignatureByDate(date: number): Signature | null {
  return findSignature({ date });
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

/**
 * Finds the first signature with the matching data.
 * Throws an error if there is no matching signature.
 *
 * @param signatureMatcher the properties to match against
 */
export function findSignatureOrFail(
  signatureMatcher: PartialSignature
): Signature {
  const signature = findSignature(signatureMatcher);
  if (signature) {
    return signature;
  } else {
    throw new Error(
      `No signature exists with the data ${JSON.stringify(signatureMatcher)}`
    );
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

export function updateSignature(
  matcher: PartialSignature,
  updateProperties: PartialSignature
): Signature | null {
  const allSignatures = getAllSignatures();
  const matchingSignature = findSignature(matcher);

  // if no matching signature, no update to make
  if (!matchingSignature) return null;

  const indexOfMatchingSignature = allSignatures.indexOf(matchingSignature);
  const updatedSignature = { ...matchingSignature, ...updateProperties };

  // set to be updated
  allSignatures[indexOfMatchingSignature] = updatedSignature;
  console.log(allSignatures);
  setAllSignatures(allSignatures);
  return updatedSignature;
}
