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

    if (!jobDescription) {
      return res.status(400).json({
        error: "Job description is required."
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.5",
      input: `
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
      `
    });

    res.json({
      analysis: response.output_text
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