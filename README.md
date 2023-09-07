# Simple File Organizer: ScriptKit & Cohere Integration

## Introduction
Welcome to the home of a quick and nifty script that takes the hassle out of file organization. Leveraging the prowess of Cohere's LLM Classify Model and John Lindquist's Script Kit, it promises a seamless and automated way to keep your directories neat and organized.

## How It Functions
The script is designed to scrutinize file names within a designated folder, engaging Cohere's AI for classification, followed by arranging them into corresponding folders based on the categorization data. Moreover, it has an optional feature to keep a vigil on a folder and sort newly added files automatically.

Here's a closer look at its workflow:

1. **Kick-start**: Launch the 'organize' script, a handy creation facilitated by Script Kit by John Lindquist.
2. **Classification of Files**: Cohere's API springs into action, categorizing file names efficiently and with precision.
3. **Sorting and Organization**: After the classification, files find their new home in respective folders. If a file's classification confidence is below 50%, it safely lands in an 'unclassified' folder.
4. **Continuous Monitoring** (Optional): Activate this feature if you want the script to continuously oversee a folder, arranging new files as they are added.

## Setting It Up

### Requirements
- Node.js installed (version X.X.X or later)
- Active Cohere API key

### Setup Steps
1. Clone this repository: 
   ```
   git clone https://github.com/yourusername/File-Organizer-ScriptKit-Cohere.git
   ```
2. Move to the project folder:
   ```
   cd File-Organizer-ScriptKit-Cohere
   ```
3. Install necessary packages:
   ```
   npm install
   ```
4. Input your Cohere API key in a `.env` file located in the project root:
   ```
   COHERE_API_KEY=your_api_key_here
   ```

## Running the Script
1. Modify the folder path in the script to aim at your intended directory.
2. Execute the script:
   ```
   npm run organize
   ```

## Contributions
Community contributions are encouraged! Feel free to fork this project and propose your enhancements or ideas through a pull request.

## License
This project is distributed under the MIT License. For more information, refer to the LICENSE file.

## Get in Touch
If any queries or feedback springs up, don't hesitate to [open an issue](https://github.com/ryannono/File-Organizer-ScriptKit-Cohere/issues) or reach out to me directly.
