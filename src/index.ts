// Name: organize
// eslint-disable-next-line import/no-extraneous-dependencies
import '@johnlindquist/kit';

// External libraries
import fs, { promises as fsPromises } from 'fs';
import path from 'path';

// Data
import examples from './cohereClassifyExamples.json' assert { type: 'json' };

// Types
import {
  Classification,
  ClassificationAPIResponse,
} from './types';

/**
 * Handles the classification of a single file. Depending on the classification
 * result, the file may be moved to a respective folder based on its
 * classification or moved to an 'unclassified' folder if it doesn't meet
 * the confidence threshold.
 *
 * @param classification - An object representing a single classification result
 * from the Cohere API.
 * @param directory - The directory where the original file is located and where
 * new classification directories will be created.
 *
 * @throws May throw an error if file operations (such as directory creation or
 * file renaming) fail.
 */
async function handleClassification(
  classification: Classification,
  directory: string
) {
  const { input: fileName, prediction, labels, confidence } = classification;

  const spacedFileName = fileName.replaceAll('-', ' ');

  const classificationDir = prediction.replaceAll(' ', '-');
  const classificationDirPath = path.join(directory, classificationDir);

  const oldFilePath = path.join(directory, fileName);
  let newFilePath = path.join(directory, classificationDir, fileName);

  if (!(spacedFileName in labels) && spacedFileName !== 'unclassified') {
    if (confidence < 0.5) {
      const unclassifiedDirPath = path.join(directory, 'unclassified');

      if (!fs.existsSync(unclassifiedDirPath)) {
        await fsPromises.mkdir(unclassifiedDirPath);
      }

      newFilePath = path.join(unclassifiedDirPath, fileName);
    } else if (!fs.existsSync(classificationDirPath)) {
      await fsPromises.mkdir(classificationDirPath);
    }

    await fsPromises.rename(oldFilePath, newFilePath);
  }
}

/**
 * An asynchronous function that organizes files in a directory based on
 * classification data received from the Cohere API. Files are grouped into
 * directories according to their classification labels.
 *
 * @param directory - The path to the directory containing the files to be
 * organized.
 *
 * @example
 *
 * if (folderPath) organize(folderPath);
 *
 * @throws Will display a success or error message at the end of the organization
 * process.
 */
async function organize(directory: string) {
  const dirFiles = fs.readdirSync(directory);

  // partition input for API
  // max allowable input size
  const chunkSize = 90;
  const chunks = Array.from(
    { length: Math.ceil(dirFiles.length / chunkSize) },
    (chunk, index) =>
      dirFiles.slice(index * chunkSize, index * chunkSize + chunkSize)
  );

  // Cohere API key
  const COHERE_API_KEY = await env('COHERE_API_KEY');

  try {
    // Define API promises
    const promises = chunks.map((chunk) =>
      post<ClassificationAPIResponse>(
        'https://api.cohere.ai/v1/classify',
        { truncate: 'END', inputs: chunk, examples },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${COHERE_API_KEY}`,
          },
        }
      ).then((response) =>
        response.data.classifications.map((classification) =>
          handleClassification(classification, directory)
        )
      )
    );

    await Promise.all(promises);
    await div(
      md(
        `# The ${directory
          .split('/')
          .at(-1)} folder was successfully organized!`
      )
    );
  } catch (error) {
    await div(
      md(
        `# The ${directory
          .split('/')
          .at(
            -1
          )} folder failed to be organized with the following error: ${error}`
      )
    );
  }
}

const folderPath = await selectFolder();

organize(folderPath);
