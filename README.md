# West Academy School Chatbot

A rule-based chatbot for West Academy School, featuring a glassmorphism UI, lead generation, and CSV export.

## Features
- **Rule-Based Responses**: Answers queries about Admissions, Courses, Fees, and Contact.
- **Lead Generation**: Collects Name, Phone, Class, and Address from interested users.
- **CSV Storage**: Automatically saves leads to `leads.csv` on the server.
- **Modern UI**: Responsive glassmorphism design.

## Prerequisites
- [Node.js](https://nodejs.org/) installed on your computer.

## How to Run Locally

1.  **Open Terminal**: Navigate to the project folder.
    ```bash
    cd c:\Users\piyus\Desktop\rulebasedchatbot
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Start the Server**:
    ```bash
    node server.js
    ```
    *Note: `server.js` is for local testing. Vercel uses `api/leads.js`.*

4.  **Open in Browser**:
    Go to [http://localhost:3000](http://localhost:3000)

## Deployment (Vercel)

This project is ready for Vercel.

1.  Push this code to a GitHub repository.
2.  Import the project in Vercel.
3.  Vercel will automatically detect the `api/` folder and `public/` assets.

**Important**: The CSV file feature works differently on Vercel. Since Vercel is serverless, files saved to disk are **temporary** and will be lost. For a production app, you should connect a database (like Vercel Postgres).

## Project Structure
- `public/`: Static website files (HTML, CSS, JS, Images).
- `api/`: Serverless functions for the backend.
- `server.js`: Local development server.
"# rulebased-chatbot" 
