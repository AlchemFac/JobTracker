// ======================================================
// 1. IMPORTS
// Imports external libraries and local project modules.
// ======================================================

import pool from "./db.js";
import express from "express";
import dotenv from "dotenv";


// ======================================================
// 2. CONFIGURATION
// Loads environment variables and initializes Express.
// ======================================================

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


// ======================================================
// 3. DATABASE CONNECTION
// Tests whether the server can connect to PostgreSQL.
// ======================================================

async function testDatabaseConnection() {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log(
      "PostgreSQL connected:",
      result.rows[0].now
    );
  } catch (error) {
    console.error(
      "PostgreSQL connection failed:",
      error.message
    );
  }
}

testDatabaseConnection();


// ======================================================
// 4. MIDDLEWARE
// Middleware runs before the route handlers.
//
// express.json()
// Parses incoming JSON request bodies.
//
// express.static(".")
// Serves frontend HTML, CSS, and JavaScript files from
// the root project directory.
// ======================================================

app.use(express.json());
app.use(express.static("."));


// ======================================================
// 5. DATABASE ROUTES
// Contains PostgreSQL CRUD operations for job records.
//
// GET    /jobs
// Returns all saved jobs.
//
// POST   /jobs
// Creates a new job.
//
// PUT    /jobs/:id
// Updates an existing job.
//
// DELETE /jobs/:id
// Deletes an existing job.
// ======================================================


// ------------------------------------------------------
// GET /jobs
// Retrieves all job records from PostgreSQL and returns
// them to the frontend as JSON.
// ------------------------------------------------------

app.get("/jobs", async function(req, res) {
  try {
    const result = await pool.query(`
      SELECT *
      FROM jobs
      ORDER BY created_at DESC
      `);

      res.json(result.rows);
  }   catch (error) {
     console.error("Failed to fectch jobs:");
     
     res.status(500).json({
     error: "Failed to fetch jobs."
    });
  }
});

// ======================================================
// 6. AI ROUTES
// Handles requests sent to either the mock AI provider
// or the locally running Ollama model.
// ======================================================


// ------------------------------------------------------
// POST /analyze-job
// Receives a job description and returns an AI-generated
// evaluation of its requirements and candidate fit.
// ------------------------------------------------------

app.post("/analyze-job", async function(req, res) {
  try {
    // --------------------------------------------------
    // Request Data
    // Retrieves the job description from the request.
    // --------------------------------------------------

    const jobDescription = req.body.jobDescription;


    // --------------------------------------------------
    // Request Validation
    // Rejects requests that do not include a valid job
    // description.
    // --------------------------------------------------

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        error: "Job description is required."
      });
    }


    // --------------------------------------------------
    // AI Prompt
    // Defines the instructions and response format that
    // will be sent to the configured AI provider.
    // --------------------------------------------------

    const prompt = `
You are analyzing a job description for an entry-level software developer, QA analyst, or technical analyst candidate.

Be strict and practical. Do not hype the candidate. Separate required skills from preferred skills.

For Strong Candidate Matches, list only specific skills, tools, education, or experience that appear in the job description and could reasonably match an entry-level CS graduate. Do not write generic sentences.

Create a bulleted list for the Strong Candidate Matches and Missing or Weak Skills that will show the candidate where they are strong and where they lack experience.

Return the response in this exact format:

Match Score: __/100

Role Type:
- Frontend / Backend / Full-Stack / QA / Analyst / Other

Required Skills Found:
-

Preferred Skills Found:
-

Strong Candidate Matches:
-
-
-

Missing or Weak Skills:
-
-
-

Important Resume Keywords:
-

Suggested Resume Bullets:
-

Match Level:
- None / Low / Moderate / High

Reason:
Short explanation in 2-3 sentences.

Rules:
- If a skill is only listed as preferred, do not treat it as required.
- If the job description mentions a skill, do not say it is missing.
- Be specific.
- Do not invent experience.
- Keep the analysis concise.

Job Description:
${jobDescription}
`;


    // --------------------------------------------------
    // AI Provider Selection
    // Uses the provider defined in .env.
    // Defaults to mock mode when none is provided.
    // --------------------------------------------------

    const aiProvider = (
      process.env.AI_PROVIDER || "mock"
    )
      .toLowerCase()
      .trim();


    // --------------------------------------------------
    // Mock AI Response
    // Returns predictable test data without contacting
    // Ollama.
    // --------------------------------------------------

    if (aiProvider === "mock") {
      return res.json({
        analysis: `
Match Score: 70/100

Role Type:
- Demo Analysis

Required Skills Found:
- JavaScript
- Git
- Basic frontend development

Preferred Skills Found:
- Node.js
- Express
- SQL

Strong Candidate Matches:
- Built JavaScript projects
- Used Git and GitHub
- Created CRUD applications

Missing or Weak Skills:
- Production database experience
- Cloud deployment experience
- Team software development experience

Important Resume Keywords:
- JavaScript
- Node.js
- Express
- CRUD
- REST API
- Git

Suggested Resume Bullets:
- Built a full-stack job tracker using JavaScript, Node.js, and Express.
- Implemented CRUD functionality, search, filtering, and AI analysis architecture.

Match Level:
- Moderate

Reason:
This is a mock analysis used when Ollama is disabled.
`
      });
    }


    // --------------------------------------------------
    // Ollama Request
    // Sends the completed prompt to the local Llama 3
    // model through Ollama.
    // --------------------------------------------------

    const ollamaResponse = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          model: "llama3",
          prompt: prompt,
          stream: false
        })
      }
    );


    // --------------------------------------------------
    // Ollama Response Validation
    // Detects HTTP errors returned by Ollama.
    // --------------------------------------------------

    if (!ollamaResponse.ok) {
      throw new Error(
        `Ollama request failed with status ${ollamaResponse.status}.`
      );
    }


    // --------------------------------------------------
    // Response Processing
    // Converts the Ollama response into JavaScript data.
    // --------------------------------------------------

    const data = await ollamaResponse.json();


    // --------------------------------------------------
    // Client Response
    // Sends the completed analysis back to the frontend.
    // --------------------------------------------------

    res.json({
      analysis: data.response
    });
  } catch (error) {
    // --------------------------------------------------
    // Error Handling
    // Logs the internal error and sends a safe response
    // to the frontend.
    // --------------------------------------------------

    console.error(
      "Job analysis error:",
      error
    );

    res.status(500).json({
      error: "Failed to analyze job description."
    });
  }
});


// ------------------------------------------------------
// POST /compare-resume
// Receives a resume and job description, compares them,
// and returns an AI-generated match analysis.
// ------------------------------------------------------

app.post("/compare-resume", async function(req, res) {
  try {
    // --------------------------------------------------
    // Request Data
    // Retrieves the resume and job description from the
    // request body.
    // --------------------------------------------------

    const resumeText = req.body.resumeText;
    const jobDescription = req.body.jobDescription;


    // --------------------------------------------------
    // Request Validation
    // Rejects requests when either required field is
    // missing or empty.
// --------------------------------------------------

    if (
      !resumeText ||
      !resumeText.trim() ||
      !jobDescription ||
      !jobDescription.trim()
    ) {
      return res.status(400).json({
        error: "Resume and job description are required."
      });
    }


    // --------------------------------------------------
    // AI Provider Selection
    // Uses the provider defined in .env.
    // Defaults to mock mode when none is provided.
    // --------------------------------------------------

    const aiProvider = (
      process.env.AI_PROVIDER || "mock"
    )
      .toLowerCase()
      .trim();


    // --------------------------------------------------
    // AI Prompt
    // Defines the instructions and response format for
    // comparing the resume with the job description.
    // --------------------------------------------------

    const prompt = `
You are comparing a resume against a job description for an entry-level software developer, QA analyst, or technical analyst candidate.

Be strict and practical. Do not hype the candidate. Do not invent experience.

Return the response in this exact format:

Resume Match Score: __/100

Best Matches:
-
-
-

Missing or Weak Keywords:
-
-
-

Experience Gaps:
-
-
-

Resume Improvement Suggestions:
-
-
-

Suggested Resume Bullets:
-
-

Match Level:
- None / Low / Moderate / High

Reason:
Short explanation in 2-3 sentences.

Rules:
- Only use information found in the resume and job description.
- Do not claim the candidate has a skill unless it appears in the resume.
- If a job requirement appears in the job description but not the resume, list it as missing or weak.
- Separate missing keywords from larger experience gaps.
- Keep the response concise.

Resume:
${resumeText}

Job Description:
${jobDescription}
`;


    // --------------------------------------------------
    // Mock AI Response
    // Returns predictable test data without contacting
    // Ollama.
    // --------------------------------------------------

    if (aiProvider === "mock") {
      return res.json({
        analysis: `
Resume Match Score: 68/100

Best Matches:
- JavaScript project experience
- Git and GitHub usage
- Full-stack application development with Node.js and Express

Missing or Weak Keywords:
- React
- SQL
- AWS

Experience Gaps:
- Limited production software development experience
- Limited database-backed application experience
- Limited cloud deployment experience

Resume Improvement Suggestions:
- Add stronger technical bullets for JavaScript, Express, REST APIs, and CRUD functionality.
- Include measurable project outcomes where possible.
- Add missing keywords honestly if the experience exists.

Suggested Resume Bullets:
- Built a full-stack job tracking application using JavaScript, Node.js, Express, and localStorage.
- Integrated configurable AI analysis using Ollama/Llama 3 and mock provider modes.

Match Level:
- Moderate

Reason:
This is a mock resume comparison used when AI_PROVIDER is set to mock. Use AI_PROVIDER=ollama locally for real Llama 3 analysis.
`
      });
    }


    // --------------------------------------------------
    // Ollama Request
    // Sends the resume comparison prompt to the local
    // Llama 3 model through Ollama.
    // --------------------------------------------------

    const ollamaResponse = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          model: "llama3",
          prompt: prompt,
          stream: false
        })
      }
    );


    // --------------------------------------------------
    // Ollama Response Validation
    // Detects HTTP errors returned by Ollama.
    // --------------------------------------------------

    if (!ollamaResponse.ok) {
      throw new Error(
        `Ollama request failed with status ${ollamaResponse.status}.`
      );
    }


    // --------------------------------------------------
    // Response Processing
    // Converts the Ollama response into JavaScript data.
    // --------------------------------------------------

    const data = await ollamaResponse.json();


    // --------------------------------------------------
    // Client Response
    // Sends the resume comparison back to the frontend.
    // --------------------------------------------------

    res.json({
      analysis: data.response
    });
  } catch (error) {
    // --------------------------------------------------
    // Error Handling
    // Logs the internal error and sends a safe response
    // to the frontend.
    // --------------------------------------------------

    console.error(
      "Resume comparison error:",
      error
    );

    res.status(500).json({
      error: "Failed to compare resume and job description."
    });
  }
});


// ======================================================
// 7. SERVER STARTUP
// Starts the Express server and listens for incoming
// HTTP requests.
// ======================================================

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});