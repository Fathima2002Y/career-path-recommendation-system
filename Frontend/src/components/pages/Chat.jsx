import { useState } from "react";
import "../../index.css";
import { TypeAnimation } from "react-type-animation";
import { sendChatMessage } from "../../utils/api";
import "regenerator-runtime/runtime";

const Message = ({ message }) => {
  const isBot = message.role === "bot";
  const messageClass = isBot
    ? "bg-gray-100 text-gray-800"
    : "bg-blue-500 text-white";
  const alignClass = isBot ? "justify-start" : "justify-end";
  const messageTextClass = isBot ? "text-left" : "text-right";
  const profileImage = isBot ? "/bot.png" : "/user.jpg";

  return (
    <div className={`flex ${alignClass} mb-4`}>
      <div className="flex items-start">
        <img
          src={profileImage}
          alt={isBot ? "Bot Profile" : "User Profile"}
          className="w-10 h-10 rounded-full mr-2"
        />
        <div 
          className={`rounded-lg p-4 max-w-xs ${messageClass} ${messageTextClass}`}
        >
          <TypeAnimation
          sequence={message.content}
          speed={50}
          className="text-lg"
          repeat={0}

          />
          {/* {message.content} */}
        </div>
      </div>
    </div>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello, how can I assist you?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    // Special response for "Thank you"
    if (input.trim().toLowerCase() === "thank you") {
      setMessages([
        ...messages,
        userMessage,
        { role: "bot", content: "You are welcome, Good luck to your future!" },
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await sendChatMessage(input);

      if (error) {
        setMessages([
          ...messages,
          userMessage,
          { role: "bot", content: `Error: ${error}. Please check your GOOGLE_API_KEY is set in the backend .env file.` },
        ]);
        setLoading(false);
        return;
      }

      if (data && data.response) {
        let responseText;
        // Handle different response formats
        if (typeof data.response === 'string') {
          responseText = data.response;
        } else if (data.response.output_text) {
          responseText = data.response.output_text;
        } else if (data.response.text) {
          responseText = data.response.text;
        } else if (typeof data.response === 'object') {
          // Try to extract text from LangChain response
          responseText = data.response.output_text || data.response.text || JSON.stringify(data.response);
        } else {
          responseText = String(data.response);
        }
        
        const botMessage = { role: "bot", content: responseText };
        setMessages([...messages, userMessage, botMessage]);
      } else {
        setMessages([
          ...messages,
          userMessage,
          { role: "bot", content: "Sorry, I couldn't get a valid response. Please check your GOOGLE_API_KEY is set in the backend .env file." },
        ]);
      }
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages([
        ...messages,
        userMessage,
        { role: "bot", content: `Error: ${error.message || 'Failed to get response'}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="chat-bg-image flex flex-col items-center min-h-screen relative overflow-hidden">
        <h1 className="text-7xl font-bold text-cyan-300 text-center mt-24">
          {" "}
          Chat with Personal Assistant
        </h1>
        <TypeAnimation
          sequence={[
            "We assist for Software Development.",
            1000,
            "We assist for UI/UX Engineering.",
            1000,
            "We assist for Cyber Security.",
            1000,
            "We assist for Web Development.",
            1000,
            "We assist for Mobile Development.",
            1000,
            "We assist for DevOps Engineering.",
            1000,
            "We assist for Machine Learning.",
            1000,
            "We assist for AI Engineering.",
            1000,
            "We assist for Database Administration.",
            1000,
            "We assist for Cloud Computing.",
            1000,
          ]}
          speed={50}
          repeat={Infinity}
          className="text-5xl text-white font-semibold text-center mt-24 mb-10"
        />
        <div className="bg-gray-800 shadow-lg rounded-lg w-full max-w-4xl z-10">
          <div className="p-4 h-auto">
            {messages.map((msg, index) => (
              <Message key={index} message={msg} />
            ))}
            {loading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-center rounded-lg p-4 max-w-xs bg-gray-100 text-gray-800">
                  <div className="spinner mr-2"></div>
                  <span>processing...</span>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg p-2 mr-2 focus:outline-none"
                placeholder="Type your message..."
              />
              <button
                onClick={handleSend}
                className="bg-red-500 hover:bg-red-800 text-white rounded-lg px-4 py-2"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
