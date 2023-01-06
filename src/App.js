import { useState } from "react";
import "./App.css";

const { Configuration, OpenAIApi } = require("openai");

const apiKey = "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";

const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

async function gpt(question, setResult) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: question,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  console.log(response.data.choices[0].text);

  setResult(response.data.choices[0].text);

  const utterance = new SpeechSynthesisUtterance(response.data.choices[0].text);
  window.speechSynthesis.speak(utterance);
}

function App() {
  const [result, setResult] = useState("");
  const [question, setQuestion] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    gpt(question, setResult);
  };

  const onClick = () => {
    console.log("recording");
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.addEventListener("result", (event) => {
      let spokenQuestion = event.results[0][0].transcript;
      gpt(spokenQuestion, setResult);
    });
  };
  return (
    <div className="App">
      <form onSubmit={onSubmit}>
        <input onChange={(e) => setQuestion(e.target.value)}></input>
        <input type="submit" value="ok" />
      </form>
      <button onClick={onClick}>Record</button>
      <h4>{result}</h4>
    </div>
  );
}

export default App;
