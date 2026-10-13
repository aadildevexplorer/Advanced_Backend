// const { GoogleGenAI } = require("@google/genai");
const express = require("express");
require("dotenv").config();
// const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ChatGroq } = require("@langchain/groq");
const { Annotation, StateGraph } = require("@langchain/langgraph");
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// without langChain
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
// ye LLM Call kya langchain me

const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  // temperature: 0,
  // maxTokens: 20,
});

app.post("/ai", async (req, res) => {
  const { input } = req.body;

  // const response = await llm.invoke([
  //   {
  //     role: "system",
  //     content:
  //       "You are an assistant and your name is Jarvis. if you don't know the answer so don't give the wrong answer.",
  //   },

  //   {
  //     role: "human",
  //     content: input,
  //   },
  // ]);

  const response = await graph.invoke({ prompt: input });

  console.log(response);
  return res.status(200).json({
    ai: response.aiMsg,
  });
});

// with LangGraph
const State = Annotation.Root({
  prompt: Annotation,
  aiMsg: Annotation,
});

const callLLM = async (state) => {
  console.log("state:=>", state);
  const response = await llm.invoke([
    {
      role: "system",
      content:
        "You are an assistant and your name is Jarvis. if you don't know the answer so don't give the wrong answer.",
    },

    {
      role: "human",
      content: state.prompt,
    },
  ]);

  return {
    aiMsg: {
      prompt: state.prompt,
      aiMsg: response.content,
    },
  };
};

const graph = new StateGraph(State)
  .addNode("agent", callLLM)
  .addEdge("__start__", "agent")
  .addEdge("agent", "__end__")
  .compile();

app.get("/", (req, res) => {
  res.json({ msg: "AI 0.1" });
});

app.listen(PORT, () => {
  console.log("server running");
});

// Node.js backend mein ek AI API banaye h, jo user ka question lekar LLM
// se answer generate karwaye aur user ko response return kare.

// LangChain is an open-source software framework designed to help developers build applications powered by large language models (LLMs) like OpenAI's GPT, Anthropic's Claude, or open-source models
// LangChain ek open-source software framework hai, jo developers ko Large Language Models (LLMs) jaise OpenAI ke GPT, Anthropic ke Claude ya open-source models ka use karke AI-powered applications banane mein help karta hai.

// A Large Language Model (LLM) is a type of artificial intelligence built on deep neural networks that is trained on massive amounts of text to understand, summarize, translate, and generate human-like language.
// LLM (Large Language Model) ek tarah ki Artificial Intelligence hai, jo Deep Neural Networks par based hoti hai aur bahut saare text data par train ki jaati hai, taaki woh human language ko samajh sake, text ko summarize aur translate kar sake, aur insaanon jaisa text generate kar sake.
