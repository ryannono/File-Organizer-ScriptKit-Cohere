"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// External libraries
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Training data
const examples_json_1 = __importDefault(require("./data/examples.json"));
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
async function* getClassifications(inputs) {
    // partition input for API
    // max allowable input size
    const chunkSize = 90;
    const chunks = Array.from({ length: Math.ceil(inputs.length / chunkSize) }, (chunk, index) => inputs.slice(index * chunkSize, index * chunkSize + chunkSize));
    // Enable env variables
    dotenv_1.default.config();
    // Yield API results
    for (const chunk of chunks) {
        const axiosOptions = {
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
                examples: examples_json_1.default,
            },
        };
        const response = await axios_1.default.request(axiosOptions);
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
async function classify(directory) {
    try {
        const dirFiles = fs_1.default.readdirSync(directory);
        for await (const { classifications } of getClassifications(dirFiles)) {
            for (const classification of classifications) {
                const { input: fileName, prediction, labels, confidence, } = classification;
                const spacedFileName = fileName.replaceAll('-', ' ');
                const classificationDir = prediction.replaceAll(' ', '-');
                const classificationDirPath = path_1.default.join(directory, classificationDir);
                const oldFilePath = path_1.default.join(directory, fileName);
                let newFilePath = path_1.default.join(directory, classificationDir, fileName);
                if (!(spacedFileName in labels) && spacedFileName !== 'unclassified') {
                    if (confidence < 0.5) {
                        const unclassifiedDirPath = path_1.default.join(directory, 'unclassified');
                        if (!fs_1.default.existsSync(unclassifiedDirPath)) {
                            fs_1.default.mkdirSync(unclassifiedDirPath);
                        }
                        newFilePath = path_1.default.join(unclassifiedDirPath, fileName);
                    }
                    else if (!fs_1.default.existsSync(classificationDirPath)) {
                        fs_1.default.mkdirSync(classificationDirPath);
                    }
                    fs_1.default.renameSync(oldFilePath, newFilePath);
                }
            }
        }
    }
    catch (error) {
        console.error(error);
    }
}
classify('/Users/ryannono/Desktop');
