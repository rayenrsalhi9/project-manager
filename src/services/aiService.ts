import OpenAI from 'openai';

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  baseURL: baseUrl,
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

const prompt = `
    You are a helpful assistant.You are a project management AI assistant. Based on the following project description, generate a list of specific, actionable tasks that need to be completed by team members.

    Project Description: I want to build a mobile app for tracking fitness goals with user authentication, workout logging, and progress visualization.

    Requirements:
    1. Generate 5-10 specific tasks
    2. Each task should have a clear title and detailed description
    3. Tasks should be logically ordered
    4. Focus on technical implementation tasks

    Return the response in this JSON format:
    {
    "tasks": [
        {
        "title": "Task title",
        "description": "Detailed task description"
        }
    ]
    }
`

export async function generateText() {
  const completion = await openai.chat.completions.create({
    model: "openai/gpt-oss-20b:free",
    messages: [{ role: 'user', content: prompt }],
  });
  return completion.choices[0].message.content;
}