import React, { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { sendVoiceQuery, activateVoiceCommand } from "../../utils/api";
import "regenerator-runtime/runtime";
import microphoneAnimation from "../../assets/mic.webm";
import { TypeAnimation } from "react-type-animation";

const VoiceBot = () => {
  const [userQuestion, setUserQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [manualInput, setManualInput] = useState("");
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [Listening, setListening] = useState(false);
  
  const browserSupportsSpeech = SpeechRecognition.browserSupportsSpeechRecognition();

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true }, setListening(true));

  const stopListening = () => {
    SpeechRecognition.stopListening();
    sendTranscript(transcript);
    resetTranscript();
    setListening(false);
  };

  const sendTranscript = async (text) => {
    if (!text || text.trim() === '') {
      setResponse("Please speak something before sending.");
      return;
    }

    try {
      const { data, error } = await sendVoiceQuery(text);

      if (error) {
        setResponse(`Error: ${error}. Please check your GOOGLE_API_KEY is set in the backend .env file.`);
        setUserQuestion(text);
        return;
      }

      if (data) {
        setUserQuestion(data.query || text);
        setResponse(data.response || "No response received");
      } else {
        setResponse("No response received from server");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse(`Error: ${error.message || 'Failed to get response'}`);
    }
  };

  const voiceCommand = async () => {
    try {
      const { data, error } = await activateVoiceCommand();
      
      if (error) {
        console.error("Voice command error:", error);
        return;
      }
      
      if (data && data.message) {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Voice command error:", error);
    }
  };

  const handleManualSubmit = async () => {
    if (!manualInput || manualInput.trim() === '') {
      setResponse("Please enter a question.");
      return;
    }
    await sendTranscript(manualInput);
    setManualInput("");
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-6xl font-semibold mb-4 text-center my-16 text-green-500">
        Voice Assistant
      </h2>
      
      {!browserSupportsSpeech && (
        <div className="bg-yellow-500 text-black p-4 rounded-lg mb-6 max-w-2xl mx-auto text-center">
          <p className="font-bold text-lg">⚠️ Your browser does not support speech recognition.</p>
          <p className="mt-2">Please use Chrome, Edge, or Safari. Alternatively, you can type your question below.</p>
        </div>
      )}

      {browserSupportsSpeech && (
        <>
          <video
            className="mx-auto mb-2 cursor-pointer"
            src={microphoneAnimation}
            autoPlay
            loop
            muted
            width="120"
            height="140"
            onClick={voiceCommand}
          ></video>
          <h3 className="text-center text-4xl font-semibold my-10">
            Ask anything about your career goals...
          </h3>
          <div className="text-center my-10">
            <TypeAnimation
              sequence={[
                "Press the Start Button to start the recording . . . ",
                1000,
                "",
              ]}
              speed={50}
              repeat={Infinity}
              className="text-lg text-white font-semibold"
            />
          </div>

          <div className="flex flex-row my-4 justify-center">
            <button
              className="bg-green-500 text-black font-semibold px-4 py-2 rounded mr-5 hover:bg-green-700"
              onClick={startListening}
              disabled={listening}
            >
              {Listening ? "Listening..." : "Start Recording"}
            </button>
            <button
              className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-700"
              onClick={stopListening}
              disabled={!listening}
            >
              Stop Recording
            </button>
          </div>
        </>
      )}

      {/* Manual text input as fallback */}
      <div className="max-w-2xl mx-auto my-8">
        <div className="flex flex-col gap-4">
          <label className="text-white font-semibold text-lg">
            {browserSupportsSpeech ? "Or type your question:" : "Type your question:"}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
              placeholder="Ask about career paths, skills, job roles..."
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-green-500 focus:outline-none"
            />
            <button
              onClick={handleManualSubmit}
              className="bg-green-500 text-black font-semibold px-6 py-3 rounded hover:bg-green-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between lg:ml-96 ">
        {browserSupportsSpeech && (
          <div className="transcript pb-10 p-5 border border-gray-300 rounded mb-4 max-w-3xl">
            <h3 className="text-xl font-bold">Transcript:</h3>
            <p>{transcript}</p>
          </div>
        )}

        <div className="response pb-10 p-4 border border-gray-300 rounded max-w-3xl mt-16 my-5">
          <h3 className="text-xl font-bold">User: </h3>
          {userQuestion ? <p>{userQuestion} ?</p> : ""}
        </div>

        <div className="response pb-10 p-4 border border-gray-300 rounded max-w-3xl">
          <h3 className="text-xl font-bold">Assistant:</h3>
          <p>{response}</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceBot;
