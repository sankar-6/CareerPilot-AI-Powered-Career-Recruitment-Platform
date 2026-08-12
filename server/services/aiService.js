const config = require('../config/env');

/**
 * Call Gemini API with a prompt expecting JSON response
 */
async function callGemini(prompt) {
  const apiKey = config.geminiApiKey;
  if (!apiKey) {
    throw new Error('No GEMINI_API_KEY configured');
  }

  const modelsToTry = ['gemini-flash-latest', 'gemini-pro-latest', 'gemini-1.5-flash'];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${prompt}\n\nIMPORTANT: Return ONLY a valid raw JSON object. Do not include markdown codeblocks or extra text.` }] }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          let cleanText = rawText.trim();
          if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```(json)?/i, '').replace(/```$/, '').trim();
          }
          return JSON.parse(cleanText);
        }
      } else {
        const errorText = await response.text();
        lastError = new Error(`Gemini API (${model} - ${response.status}): ${errorText}`);
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to connect to Gemini API models');
}

/**
 * AI Resume Analyzer
 */
const analyzeResume = async (resumeText, profileSkills = []) => {
  const prompt = `
You are an expert AI Resume Reviewer and Career Coach.
Analyze the following resume details and user skills.

User Skills: ${profileSkills.join(', ') || 'Not specified'}
Resume Info/Text: ${resumeText || 'Standard Candidate Profile'}

Return a JSON object with this EXACT structure:
{
  "score": <number between 60 and 95>,
  "strengths": [<3-4 bullet points on what is great about the resume>],
  "improvements": [<3-4 actionable tips to improve the resume>],
  "detectedSkills": [<list of technical & soft skills found>],
  "missingSkills": [<list of recommended skills for current industry standards>]
}
`;

  try {
    if (config.geminiApiKey) {
      return await callGemini(prompt);
    }
  } catch (err) {
    console.warn('AI Service notice: Using rule-based analyzer fallback.', err.message);
  }

  // Smart fallback analysis if API key is missing or fails
  const allSkills = Array.from(new Set([...profileSkills, 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Git']));
  const recommendedSkills = ['Docker', 'TypeScript', 'AWS', 'CI/CD', 'System Design'].filter(
    (s) => !allSkills.includes(s)
  );

  return {
    score: Math.min(88, 65 + profileSkills.length * 4),
    strengths: [
      'Clean structure with clear section headers',
      `Solid foundation in key skills: ${allSkills.slice(0, 3).join(', ')}`,
      'Relevant education and practical projects demonstrated',
    ],
    improvements: [
      'Quantify project achievements with measurable metrics (e.g., improved load speed by 30%)',
      'Add key industry-demanded tools like Docker and AWS to expand your scope',
      'Tailor the summary objective for target roles',
    ],
    detectedSkills: allSkills,
    missingSkills: recommendedSkills,
  };
};

/**
 * Generate Interview Questions
 */
const generateInterviewQuestions = async (role, topic, difficulty) => {
  const prompt = `
You are an expert technical interviewer.
Generate exactly 5 interview questions for a candidate applying for the role of "${role}", on the topic "${topic}", at "${difficulty}" difficulty level.

Return a JSON object with this EXACT structure:
{
  "questions": [
    { "question": "<question 1 text>" },
    { "question": "<question 2 text>" },
    { "question": "<question 3 text>" },
    { "question": "<question 4 text>" },
    { "question": "<question 5 text>" }
  ]
}
`;

  try {
    if (config.geminiApiKey) {
      return await callGemini(prompt);
    }
  } catch (err) {
    console.warn('AI Service notice: Using fallback questions.', err.message);
  }

  // Fallback questions based on topic
  const defaultQuestions = [
    { question: `What are the core concepts and best practices when working with ${topic} in a ${role} position?` },
    { question: `How do you handle performance optimization and error handling in ${topic}?` },
    { question: `Explain a challenging problem you solved using ${topic} in one of your recent projects.` },
    { question: `What is the difference between synchronous and asynchronous operations in ${topic}?` },
    { question: `How do you write clean, scalable, and maintainable code when developing with ${topic}?` },
  ];

  return { questions: defaultQuestions };
};

/**
 * Evaluate Individual Answer
 */
const evaluateAnswer = async (role, topic, question, userAnswer) => {
  const prompt = `
Evaluate the candidate's answer for an interview question.
Role: ${role}
Topic: ${topic}
Question: ${question}
Candidate Answer: ${userAnswer}

Return a JSON object with this EXACT structure:
{
  "score": <number from 1 to 10>,
  "feedback": "<2-3 sentence constructive feedback on the candidate's answer>"
}
`;

  try {
    if (config.geminiApiKey) {
      return await callGemini(prompt);
    }
  } catch (err) {
    console.warn('AI Service notice: Using fallback evaluation.', err.message);
  }

  const length = (userAnswer || '').trim().length;
  const score = length > 150 ? 9 : length > 50 ? 7 : 5;
  const feedback =
    length > 100
      ? 'Good explanation covering essential points. Consider mentioning real-world edge cases to stand out.'
      : 'Basic answer provided. Expand on technical details, syntax, or practical code examples to strengthen your response.';

  return { score, feedback };
};

/**
 * Evaluate Overall Interview (AI-Powered)
 */
const evaluateOverallInterview = async (questionsWithAnswers) => {
  const totalScore = questionsWithAnswers.reduce((acc, q) => acc + (q.score || 0), 0);
  const avgScore = Math.round((totalScore / (questionsWithAnswers.length * 10)) * 100);

  // Build a summary of all Q&A for AI evaluation
  const qaSummary = questionsWithAnswers
    .map((q, i) => `Q${i + 1}: ${q.question}\nAnswer: ${q.userAnswer || 'No answer'}\nScore: ${q.score || 0}/10`)
    .join('\n\n');

  const prompt = `
You are an expert technical interview evaluator.
A candidate just completed a mock interview. Here are all the questions, their answers, and individual scores:

${qaSummary}

Overall Average Score: ${avgScore}%

Based on the actual answers given above, provide a personalized performance evaluation.
Return a JSON object with this EXACT structure:
{
  "overallScore": ${avgScore},
  "strengths": ["<2-3 specific strengths based on the candidate's actual answers>"],
  "improvements": ["<2-3 specific areas where the candidate should improve, referencing their actual weak answers>"]
}
`;

  try {
    if (config.geminiApiKey) {
      const result = await callGemini(prompt);
      // Ensure overallScore is preserved from our calculation
      result.overallScore = avgScore;
      return result;
    }
  } catch (err) {
    console.warn('AI Service notice: Using fallback overall evaluation.', err.message);
  }

  // Fallback if AI fails
  return {
    overallScore: avgScore,
    strengths: [
      'Demonstrated understanding of core concepts across multiple questions',
      'Provided structured responses with relevant technical terminology',
    ],
    improvements: [
      'Expand answers with specific code examples and real-world use cases',
      'Discuss performance trade-offs and scalability considerations in more depth',
    ],
  };
};

module.exports = {
  analyzeResume,
  generateInterviewQuestions,
  evaluateAnswer,
  evaluateOverallInterview,
};
