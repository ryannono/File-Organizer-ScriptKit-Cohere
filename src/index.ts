// External libraries
import axios, { AxiosRequestConfig } from 'axios';
import dotenv from 'dotenv'
import fs from 'fs';
import path from 'path';

// Training data
import examples from './data/examples.json';

// Types
import { ClassificationAPIResponse } from './types';

/**
 * An asynchronous generator function that partitions the input array into chunks and sends them to the Cohere API
 * for classification. The function yields the response data from the API for each chunk.
 *
 * @param inputs - An array of strings, where each string represents a filename to be classified.
 *
 * @yields {ClassificationAPIResponse} - The response data from the Cohere API for each chunk of inputs.
 *
 * @example
 * 
 * for await (const response of getClassifications(inputs)) {
 *   console.log(response); // Logs the API response data for each chunk.
 * }
 */
async function* getClassifications(inputs: string[]) {
  // partition input for API
  // max allowable input size
  const chunkSize = 90;
  const chunks = Array.from(
    { length: Math.ceil(inputs.length / chunkSize) },
    (chunk, index) =>
      inputs.slice(index * chunkSize, index * chunkSize + chunkSize)
  );

  // Enable env variables
  dotenv.config()

  // Yield API results
  for (const chunk of chunks) {
    const axiosOptions: AxiosRequestConfig = {
      method: 'POST',
      url: 'https://api.cohere.ai/v1/classify',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.COHERE_API_KEY}`,
      },
      data: {
        truncate: 'END',
        inputs: chunk,
        examples,
      },
    };

    const response = await axios.request<ClassificationAPIResponse>(axiosOptions)
    yield response.data;
  }
}

/**
 * An asynchronous function that classifies the files in the specified directory based on their filenames.
 * It uses the Cohere API for classification, and reorganizes the files in the directory based on the
 * classification results, creating new directories as necessary.
 *
 * @param directory - The path to the directory where the files to be classified are located.
 *
 * @throws Will throw an error if an error occurs during the classification process (e.g., API request failure, filesystem errors).
 *
 * @example
 * 
 * classify('/path/to/directory')
 *   .then(() => console.log('Classification completed'))
 *   .catch(error => console.error('Classification failed', error));
 */
async function classify(directory: string) {
  try {
    const dirFiles = fs.readdirSync(directory);

    for await (const { classifications } of getClassifications(dirFiles)) {
      for (const classification of classifications) {
        const {
          input: fileName,
          prediction,
          labels,
          confidence,
        } = classification;

        const spacedFileName = fileName.replaceAll('-', ' ');

        const classificationDir = prediction.replaceAll(' ', '-');
        const classificationDirPath = path.join(directory, classificationDir);

        const oldFilePath = path.join(directory, fileName);
        let newFilePath = path.join(directory, classificationDir, fileName);

        if (!(spacedFileName in labels) && spacedFileName !== 'unclassified') {
          if (confidence < 0.5) {
            const unclassifiedDirPath = path.join(directory, 'unclassified');

            if (!fs.existsSync(unclassifiedDirPath)) {
              fs.mkdirSync(unclassifiedDirPath);
            }

            newFilePath = path.join(unclassifiedDirPath, fileName);
          } else if (!fs.existsSync(classificationDirPath)) {
            fs.mkdirSync(classificationDirPath);
          }

          fs.renameSync(oldFilePath, newFilePath);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

classify('/Users/ryannono/Desktop');

