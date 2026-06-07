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
Analyze this job description for a junior software developer or QA analyst candidate.

Return the response in this exact format:

Match Score: __/100

Strong Matches:
-

Missing or Weak Skills:
-

Important Keywords:
-

Resume Bullet Suggestions:
-

Recommendation:
Short direct recommendation.

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