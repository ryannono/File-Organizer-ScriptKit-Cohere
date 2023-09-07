# File Organizer with ScriptKit & Cohere

## Overview
This repository houses a straightforward script, `organize`, crafted to streamline file organization. By incorporating Cohere's LLM Classify Model and John Lindquist's Script Kit, it simplifies file management, allowing for an automated, organized, and clutter-free directory.

## How It Works
The script operates by analyzing file names within a specified folder, classifying them with Cohere's AI, and then organizing them into respective folders based on the classification results. Optionally, it can monitor a folder continuously, sorting new files as they appear.

Here's a step-by-step breakdown of the process:

1. **Initialization**: Utilizing Script Kit by John Lindquist, initiate the script named 'organize'.
2. **File Analysis & Classification**: Cohere's API comes into play, categorizing file names swiftly and accurately.
3. **File Organization**: Post-classification, files are moved to their respective folders. If the confidence level is below 50%, the file gets moved to an 'unclassified' folder.
4. **Folder Monitoring** (Optional): Enable this feature to have the script watch a folder and organize new files as they come in.

## Getting Started
ns, or feedback, feel free to [open an issue](https://github.com/ryannono/File-Organizer-ScriptKit-Cohere/issues) or contact me directly.
