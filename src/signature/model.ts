import { cloneDeep } from "lodash";
import { isObjectSubset } from "./utils";

export interface Signature {
  /**
   * Treated like an id, the return value of Date.now() [making the assumption that no more than 1 signature is added in a given millisecond]
   *
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
   *
   * Read more about the 'epoch' idea here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#the_ecmascript_epoch_and_timestamps
   */
  epochMs: number;
  name: string;
  message?: string;
}

/** A signature, omitting the 'epochMs' property */
export type DatelessSignature = Omit<Signature, "epochMs">;

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
 * Finds the first signature with the matching `epochMs`.
 * Returns null if there is no matching signature
 * @param epochMs the Date.now() number id from the signature's date
 */
export function findSignatureByEpoch(epochMs: number): Signature | null {
  return findSignature({ epochMs });
}

/**
 * Finds the first signature with the matching epochMs.
 * Throws an error if there is no matching signature.
 *
 * @param epochMs the Date.now() number id for the signature
 */
export function findSignatureByEpochOrFail(epochMs: number): Signature {
  const signature = findSignatureByEpoch(epochMs);
  if (signature) {
    return signature;
  } else {
    throw new Error(`No signature exists with the epochMs ${epochMs}`);
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
  // use a deep clone to prevent accidental mutation of _signatureCollection
  return cloneDeep(_signatureCollection);
}

/**
 * Inserts data from a (dateless) signature into the collection.
 * Returns the signature inserted, with an auto-given date
 * @param signature the (dateless) signature to insert
 */
export function insertSignature(signature: DatelessSignature): Signature {
  const signatureToAdd = {
    ...signature,
    epochMs: Date.now(), // create date as adding it in
  };
  _signatureCollection.push(signatureToAdd);
  return signatureToAdd;
}

/**
 * Tries to remove the first matching signature based on the passed
 *  in signature matcher.
 *
 * @param signatureMatcher the properties to match against
 * @returns `true` if a signature was removed, and `false` otherwise
 */
export function removeSignature(signatureMatcher: PartialSignature): boolean {
  const matchingIndex = findIndexOfSignature(signatureMatcher);
  if (matchingIndex === null /* let 0 pass through */) return false;
  const filteredSignatures = getAllSignatures().filter(
    (_, idx) => idx !== matchingIndex
  );
  setAllSignatures(filteredSignatures);
  return true;
}

/**
 * Tries to remove a signature with the given epochMs identifier
 *  from the signature collection.
 *
 * @param epochMs the Date.now() number id for the signature
 * @returns `true` if a signature was removed, and `false` otherwise
 */
export function removeSignatureByEpoch(epochMs: number): boolean {
  return removeSignature({ epochMs });
}

export function setAllSignatures(signatures: SignatureCollection): void {
  // use a deep clone to prevent accidental mutation of _signatureCollection
  _signatureCollection = cloneDeep(signatures);
}

export function updateSignature(
  matcher: PartialSignature,
  updateProperties: PartialSignature
): Signature | null {
  const matchingIndex = findIndexOfSignature(matcher);

  // !matchingIndex breaks for index of 0
  if (matchingIndex === null) {
    // nothing to update - so early return
    return null;
  }

  const allSignatures = getAllSignatures();
  const updatedSignature = {
    ...allSignatures[matchingIndex],
    ...updateProperties,
  };
  allSignatures[matchingIndex] = updatedSignature;

  setAllSignatures(allSignatures);
  return updatedSignature;
}

export function updateSignatureByEpoch(
  epochMs: number,
  updateProperties: PartialSignature
): Signature | null {
  return updateSignature({ epochMs }, updateProperties);
}
