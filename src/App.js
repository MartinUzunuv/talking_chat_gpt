import { useState } from "react";
import "./App.css";
import { useRef } from "react";

const { Configuration, OpenAIApi } = require("openai");

const apiKey = "API_KEY";

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






// let isActive = false

// async function gpt2(question) {
//   isActive = true;
//   const response = await openai.createCompletion({
//     model: "text-davinci-003",
//     prompt: question,
//     temperature: 0.7,
//     max_tokens: 256,
//     top_p: 1,
//     frequency_penalty: 0,
//     presence_penalty: 0,
//   });

//   console.log(response.data.choices[0].text);

//   const utterance = new SpeechSynthesisUtterance(response.data.choices[0].text);
//   window.speechSynthesis.speak(utterance);

//   isActive = false;
// }

// function recordQuestion(){
//   console.log("recording");
//   const SpeechRecognition =
//     window.SpeechRecognition || window.webkitSpeechRecognition;

//   let recognition = new SpeechRecognition();
//   recognition.lang = "en-US";
//   recognition.start();
//   recognition.addEventListener("result", (event) => {
//     let spokenQuestion = event.results[0][0].transcript;
//     gpt2(spokenQuestion);
//   });
// };

// function awlays() {
//   isActive = true;
//   const SpeechRecognition =
//     window.SpeechRecognition || window.webkitSpeechRecognition;

//   let recognition = new SpeechRecognition();
//   recognition.lang = "en-US";
//   recognition.start();
//   recognition.addEventListener("result", (event) => {
//     let words = event.results[0][0].transcript;
//     console.log(words);
//     let end = true
//     for (let i = 0; i < words.length - 7; i++) {
//       if (
//         (words[i] === "C" || words[i] === "c") &&
//         words[i + 1] === "o" &&
//         words[i + 2] === "m" &&
//         words[i + 3] === "p" &&
//         words[i + 4] === "u" &&
//         words[i + 5] === "t" &&
//         words[i + 6] === "e" &&
//         words[i + 7] === "r"
//       ) {
//         console.log("here!");
//         recordQuestion()
//         end = false
//       }
//     }
//     if(end){
//       isActive = false;
//     }
//   });
//   setTimeout(() => {
//     if (!isActive) {
//       isActive = true;
//     }
//   },10000)
// }

// setInterval(() => {
//   if(!isActive){
//     awlays();
//   }
// },100)


function App() {
  const [result, setResult] = useState("");
  const [question, setQuestion] = useState("");

  const textBox = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    gpt(question, setResult);
  };

  const onClick = () => {
    console.log("recording");
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    recognition.addEventListener("result", (event) => {
      let spokenQuestion = event.results[0][0].transcript;
      textBox.current.value = spokenQuestion;
      gpt(spokenQuestion, setResult);
    });
  };

  // const deleteText = () => {
  //   textBox.current.value = "";
  // }
  return (
    <div className="App">
      <h1 className="Text">SPEAKING AI</h1>
      <form className="Form" onSubmit={onSubmit}>
        <input
          ref={textBox}
          type="text"
          className="TextBox"
          onChange={(e) => setQuestion(e.target.value)}
        ></input>
        <input className="Button" type="submit" value="Go" />
        {/* <button className="Button" onClick={deleteText}>Dell</button> */}
      </form>
      <button className="Button" onClick={onClick}>
        Record
      </button>
      <p className="Text">{result}</p>
    </div>
  );
}

export default App;
