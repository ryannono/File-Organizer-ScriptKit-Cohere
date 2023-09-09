// Name: organize
import '@johnlindquist/kit';
import { rename } from 'fs/promises';
import { join } from 'path';

// Data
import examples from './data/examples.json' assert { type: 'json' };

// Types
import {
  Classification,
  ClassificationAPIResponse,
} from '../types/ClassificationAPIResponse.ts';

/**
 * Handles the classification of a single file. Depending on the classification
 * result, the file is moved to a respective folder based on its classification
 * or moved to an 'unclassified' folder if the confidence level is below the
 * threshold (0.5).
 *
 * @async
 * @function
 * @param {Classification} classification - An object representing a single
 * classification result from the Cohere API, which includes details like the
 * file name (input), predicted classification, confidence level, and associated
 * labels.
 *
 * @param {string} directory - The directory where the original file is located
 * and where new classification directories will be created.
 *
 * @returns {Promise<void>} A promise that resolves when the file has been
 * successfully moved to its new classification directory.
 *
 * @throws May throw an error if directory creation or file renaming fails.
 *
 * @example
 *
 * await handleClassification(classificationData, directoryPath);
 */
async function handleClassification(
  classification: Classification,
  directory: string
): Promise<void> {
  const { input: fileName, prediction, confidence, labels } = classification;

  if (fileName.replaceAll('-', ' ') in labels) return;

  const classificationDir =
    confidence >= 0.5 ? prediction.replaceAll(' ', '-') : 'unclassified';

  await mkdirp(join(directory, classificationDir));
  await rename(
    join(directory, fileName),
    join(directory, classificationDir, fileName)
  );
}

/**
 * Organizes files in a directory based on classifications received from the
 * Cohere API. Files are grouped into directories according to their
 * classifications.
 *
 * The function reads all the files in the specified directory, then sends
 * batches of filenames (up to a maximum size) to the Cohere API for
 * classification. Depending on the classification results, it moves the files
 * to respective folders. If an error occurs during the process, it will display
 * a message indicating the failure.
 *
 * @async
 * @function
 * @param {string} directory - The path of the directory to be organized. All
 * files in this directory will be classified and moved to respective
 * classification folders.
 *
 * @returns {Promise<void>} A promise that resolves when all files have been
 * classified and moved to their respective directories.
 *
 * @throws Will throw an error if reading the directory, fetching the API key,
 * posting to the API, or moving files fails.
 *
 * @example
 *
 * async function main() {
 *   try {
 *     await organize('/path/to/directory');
 *   } catch (error) {
 *     console.error('Failed to organize directory:', error);
 *   }
 * }
 */
async function organize(directory: string): Promise<void> {
  const dirFiles = await readdir(directory);

  // partition input for API
  // max allowable input size
  const MAX_INPUT_ARRAY_SIZE = 96;
  const inputArrays = Array.from(
    { length: Math.ceil(dirFiles.length / MAX_INPUT_ARRAY_SIZE) },
    (chunk, index) =>
      dirFiles.slice(
        index * MAX_INPUT_ARRAY_SIZE,
        index * MAX_INPUT_ARRAY_SIZE + MAX_INPUT_ARRAY_SIZE
      )
  );

  // Cohere API key
  const COHERE_API_KEY = await env('COHERE_API_KEY');

  try {
    // Classify each chunk
    await Promise.all(
      inputArrays.map(async (inputArray) => {
        const { data } = await post<ClassificationAPIResponse>(
          'https://api.cohere.ai/v1/classify',
          { truncate: 'END', inputs: inputArray, examples },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${COHERE_API_KEY}`,
            },
          }
        );

        return Promise.all(
          data.classifications.map((classification) =>
            handleClassification(classification, directory)
          )
        );
      })
    );

    await div(
      md(
        `# The "${directory
          .split('/')
          .at(-1)}" folder was successfully organized!`
      )
    );
  } catch (error) {
    await div(
      md(
        `# The "${directory
          .split('/')
          .at(
            -1
          )}" folder failed to be organized with the following error: ${error}`
      )
    );
  }
}

await organize(
  await path().catch((error) => div(md(`# An error occurred: ${error}`)))
);

process.exit();
