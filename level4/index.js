const express = require("express");
require("dotenv").config();
const { ChatGroq } = require("@langchain/groq");
const {
  Annotation,
  StateGraph,
  MessagesAnnotation,
} = require("@langchain/langgraph");
const { ToolNode } = require("@langchain/langgraph/prebuilt");
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

  const response = await graph.invoke({
    messages: [
      {
        role: "user",
        content: input,
      },
    ],
  });

  console.log(response);
  return res.status(200).json({
    ai: response.messages[response.messages.length-1].content,
  });
});

// with LangGraph
// const State = Annotation.Root({
//   prompt: Annotation,
//   aiMsg: Annotation,
// });

const tool = [];
const toolNode = new ToolNode(tool);

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
      content: state.messages[0].content,
    },
  ]);

  return { messages: [response] };

  // return {
  //   aiMsg: {
  //     prompt: state.prompt,
  //     aiMsg: response.content,
  //   },
  // };
};

const shouldContinue = async (state) => {

    const lastMessage = state.messages[state.messages.length-1]
    if(lastMessage.tool_calls.length > 0){
      return 'tools'
    }else{
      return '__end__'
    }
};

// const graph = new StateGraph(MessagesAnnotation)
//   .addNode("agent", callLLM)
//   .addEdge("__start__", "agent")
//   .addEdge("agent", "__end__")
//   .addNode('tools' , toolNode)
//   .addEdge('tools' , 'agent')
//   .addConditionalEdges('agent' , shouldContinue)
//   .compile();


const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", callLLM)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent")
  .compile();


app.get("/", (req, res) => {
  res.json({ msg: "AI 0.1" });
});

app.listen(PORT, () => {
  console.log("server running");
});
