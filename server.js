import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("."));

app.post("/analyze-job", async function(req, res) {
  try {
    const jobDescription = req.body.jobDescription;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        error: "Job description is required."
      });
    }

const prompt = `
You are analyzing a job description for an entry-level software developer, QA analyst, or technical analyst candidate.

Be strict and practical. Do not hype the candidate. Separate required skills from preferred skills.

For Strong Candidate Matches, list only specific skills, tools, educatoin or experience that appear in the job description and could reasonably match an entry-level CS graduate. Do not write generic sentences.

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

const aiProvider = process.env.AI_PROVIDER || "mock";

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

const data = await ollamaResponse.json();

res.json({
  analysis: data.response
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to analyze job description."
    });
  }
});

app.post("/compare-resume", async function(req, res) {
  try {
    const resumeText = req.body.resumeText;
    const jobDescription = req.body.jobDescription;

    if (!resumeText || !resumeText.trim() || !jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        error: "Resume and job description are required."
      });
    }

    const aiProvider = (process.env.AI_PROVIDER || "mock").toLowerCase().trim();

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

    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: prompt,
        stream: false
      })
    });

    const data = await ollamaResponse.json();

    res.json({
      analysis: data.response
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to compare resume and job description."
    });
  }
});

app.post("/compare-resume", async function(req, res) {
  try {
    const resumeText = req.body.resumeText;
    const jobDescription = req.body.jobDescription;

    if (!resumeText || !resumeText.trim() || !jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        error: "Resume and job description are required."
      });
    }

    const aiProvider = (process.env.AI_PROVIDER || "mock").toLowerCase().trim();

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

    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: prompt,
        stream: false
      })
    });

    const data = await ollamaResponse.json();

    res.json({
      analysis: data.response
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to compare resume and job description."
    });
  }
});

app.listen(PORT, function() {
  console.log(`Server running at http://localhost:${PORT}`);
});