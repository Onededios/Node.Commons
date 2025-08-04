import { GUID } from '@onededios/node-commons-types';
import { isGUID } from '@onededios/node-commons-validators';
import { random } from './common';

/**
 * Generates a **random {@link GUID}**.
 */
export const getRndGUID = (): GUID => random.uuid4() as GUID;
