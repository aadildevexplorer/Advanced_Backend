// const { GoogleGenAI } = require("@google/genai");
const express = require("express");
require("dotenv").config();
// const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ChatGroq } = require("@langchain/groq");
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// app.post("/ai", async (req, res) => {
//   const { input } = req.body;
//   const response = await ai.models.generateContent({
//     model: "gemini-3.6-flash",
//     config: {
//       systemInstruction:
//         "You are an assistant and your name is Jarvis. if you don't know the answer so don't give the wrong answer.",
//     },
//     contents: [
//       {
//         role: "user",
//         parts: [{ text: input }],
//       },
//     ],
//   });

//   console.log(response);
//   return res.status(200).json({
//     ai: response.text,
//   });
// });

// with LangChain

const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  // apiKey : process.env.GROQ_API_KEY
});

app.post("/ai", async (req, res) => {
  const { input } = req.body;

  const response = await llm.invoke(input);

  console.log(response.text);
  return res.status(200).json({
    ai: response.content,
  });
});

app.get("/", (req, res) => {
  res.json({ msg: "AI 0.1" });
});

app.listen(PORT, () => {
  console.log("server running");
});
