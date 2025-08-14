import { parseAsString } from '@onededios/node-commons-parsers';
import { ArgumentsBuilder } from '@onededios/node-commons-process';
import { File, Directory } from '@onededios/node-commons-crate';

const builder = new ArgumentsBuilder({
  BASE_PACKAGE_PATH: parseAsString,
  FOLDER_TO_REPLACE_PATH: parseAsString,
});

function deepMerge(
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...obj1 };

  for (const key of Object.keys(obj2)) {
    const value2 = obj2[key];
    const value1 = obj1[key];

    if (
      value2 &&
      typeof value2 === 'object' &&
      !Array.isArray(value2) &&
      value1 &&
      typeof value1 === 'object' &&
      !Array.isArray(value1)
    ) {
      result[key] = deepMerge(
        value1 as Record<string, unknown>,
        value2 as Record<string, unknown>
      );
    } else {
      result[key] = value2;
    }
  }
  return result;
}

/**
 * Processes multiple package directories by merging their `package.json` files
 * with a base package configuration.
 *
 * This function reads a base `package.json` file, then iterates through all
 * directories in a specified folder. For each directory containing a `package.json`,
 * it merges the base configuration with the existing one using `deepMerge`, and
 * writes the result back to the file.
 *
 * Logs the status of each processed package and handles errors gracefully.
 *
 * @throws Will log and exit the process if the base package file cannot be read.
 */
export async function processPackages() {
  try {
    const baseFile = new File(builder.arguments.BASE_PACKAGE_PATH);
    const baseParsed = await baseFile.readJSONAsync();
    const baseParsedObj = baseParsed as Record<string, unknown>;

    const packageDir = new Directory(builder.arguments.FOLDER_TO_REPLACE_PATH);
    const dirs = packageDir.getDirs();

    const processPromises = dirs.map(async (dir) => {
      const currentPackage = new Directory(dir);

      if (currentPackage.hasChild('package.json')) {
        try {
          const file = new File(currentPackage.getFullPath('package.json'));
          const parsed = await file.readJSONAsync();
          const parsedObj = parsed as Record<string, unknown>;
          const merged = deepMerge(baseParsedObj, parsedObj);

          await file.writeAsync(JSON.stringify(merged, null, 2));
          console.log(`✓ Updated package.json in ${dir}`);
        } catch (error) {
          console.error(`✗ Failed to process ${dir}:`, error);
        }
      }
    });

    await Promise.all(processPromises);
    console.log('✓ All packages processed successfully');
  } catch (error) {
    console.error('✗ Failed to read base package.json:', error);
    process.exit(1);
  }
}
