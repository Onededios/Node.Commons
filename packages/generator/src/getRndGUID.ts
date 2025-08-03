import { GUID } from '@onededios/node-commons-types';
import { isGUID } from '@onededios/node-commons-validators';
import { random } from './common';

/**
 * Generates a **random {@link GUID}**.
 */
export function getRndGUID(): GUID {
  const guid = random.uuid4();
  if (!isGUID(guid)) throw new Error('Generated GUID is invalid');
  return guid;
}
