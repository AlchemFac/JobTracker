import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

app.listen(PORT, function() {
  console.log(`Server running at http://localhost:${PORT}`);
});