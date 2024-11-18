# Program Committee Formation Web App

This web application assists academic conference organizers in forming a diverse, high-quality program committee using a data-driven, human-in-the-loop approach. It streamlines the process of candidate selection, ensuring diversity, reducing conflicts of interest, and enhancing user experience with intuitive workflows and real-time visualizations.

---

## Features

### 1. File Upload and Data Validation
- Upload candidate data in `.xlsx`, `.xls`, or `.csv` formats.
- Validate and match uploaded data to required fields: **Name**, **Email**, **Institute**, and **Country**.
- Automatically enrich candidate data with DBLP and co-author network information.

### 2. Candidate Management
- View, search, add, edit, and delete candidate data in a customizable table.
- Retain row selection state across sessions.
- Advanced search for column-specific filtering.

### 3. Iterative Decision-Making
- Input desired program committee size and identify the least-connected candidates to minimize conflicts of interest.
- Update candidate decisions (Accepted/Declined) for iterative selection rounds.
- Support for multiple iterations to refine committee formation.

### 4. Graph Visualizations
- View co-authorship networks for selected candidates.
- Analyze distribution graphs for expertise, country, gender, and other factors.
- Dynamically update graphs based on candidate selection.

## Installation Steps
1. npm install
2. npm start

## Work Flow with Visualizations
1. Click on the UPLOAD FILE button
![Upload File Modal](workflow/button.png "Upload File Modal")
