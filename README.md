# Simple File Organizer: ScriptKit & Cohere Integration

## Introduction
Welcome to the hub of a swift and efficient script designed to streamline your file organization process. By merging the capabilities of Cohere's LLM Classify Model with the utilities offered by John Lindquist's Script Kit, this script automates the file organization process, saving you time and hassle.

## How It Functions
This script delves through file names within a specified directory, utilizing the Cohere API for classification. Subsequently, it allocates the files into respective folders according to their classification data. An added feature allows for ongoing monitoring of a folder, automatically sorting new files as they are added. The script now operates asynchronously, enhancing performance by allowing multiple operations to run in parallel.

Here's a deeper insight into its workflow:

1. **Kick-start**: Launch the 'organize' script, a versatile tool empowered by Script Kit by John Lindquist.
2. **Classification of Files**: The script taps into Cohere's API, classifying file names swiftly and accurately.
3. **Sorting and Organization**: Post-classification, files are migrated to folders that match their classification. Files with a classification confidence below 50% are housed in an 'unclassified' folder, ensuring clear categorization.
4. **Continuous Monitoring** (Optional): Enable this feature to allow the script to constantly monitor a folder and organize new files as they come in.

## Setting It Up

### Requirements
- Node.js installed (version X.X.X or later)
- An active Cohere API key

### Setup Steps
1. Clone this repository: 
   ```
   git clone https://github.com/yourusername/File-Organizer-ScriptKit-Cohere.git
   ```
2. Navigate to the project folder:
   ```
   cd File-Organizer-ScriptKit-Cohere
   ```
3. Install necessary packages:
   ```
   npm install
   ```
4. Register your Cohere API key in a `.env` file situated at the project root:
   ```
   COHERE_API_KEY=your_api_key_here
   ```

## Running the Script
1. Adjust the directory path in the script to point to your target directory.
2. Run the script:
   ```
   npm run organize
   ```

## Contributions
Community contributions are greatly appreciated! Please feel free to fork this project and submit your improvements or ideas through a pull request.

## License
This project is distributed under the MIT License. See the LICENSE file for more details.

## Get in Touch
Should you have any queries or feedback, please [open an issue](https://github.com/ryannono/File-Organizer-ScriptKit-Cohere/issues) or contact me directly.
