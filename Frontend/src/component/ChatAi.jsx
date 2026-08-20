import { useForm } from 'react-hook-form';
import { useState, useRef, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';

const ChatAi = ({ problem }) => {
  const [messages, setMessages] = useState([
    { 
      role: "model", 
      parts: [{ text: "You Want my Help?" }] 
    }
  ]);
  const [isThinking, setIsThinking] = useState(false); 
  const { register, handleSubmit, reset } = useForm();
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when messages change or AI is thinking
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Handle standard form submission
  const onSubmit = async (data) => {
    if (data.message.trim()) {
      const newUserMessage = { 
        role: "user", 
        parts: [{ text: data.message }] 
      };
      const updatedMessages = [...messages, newUserMessage];
      
      setMessages(updatedMessages);
      setIsThinking(true); 
      reset();

      try {
        const response = await axiosClient.post("/ai/chat", {
          messages: updatedMessages,
          title: problem?.title,
          description: problem?.description,
          startCode: problem?.startCode,
          testCases: problem?.visibleTestCases,     
        });

        setMessages(prev => [...prev, { 
          role: "model", 
          parts: [{ text: response.data.response }] 
        }]);
      } catch (err) {
        console.error("Error communicating with AI:", err);
        setMessages(prev => [...prev, { 
          role: "model", 
          parts: [{ text: "Sorry, I'm having trouble responding right now. Please try again later." }] 
        }]);
      } finally {
        setIsThinking(false); 
      }
    }
  };

  // Clear chat history back to greeting
  const clearChat = () => {
    setMessages([
      { 
        role: "model", 
        parts: [{ text: "Hello, I'm your AI assistant. How can I help you?" }] 
      }
    ]);
    setIsThinking(false);
  };

  // Handle template suggestion clicks cleanly
  const handleSuggestionClick = async (suggestion) => {
    const newUserMessage = { 
      role: "user", 
      parts: [{ text: suggestion }] 
    };
    
    // Using a local array fixes the asynchronous React state update bug
    const updatedMessages = [...messages, newUserMessage]; 
      
    setMessages(updatedMessages);
    setIsThinking(true);
    reset();

    try {
      const response = await axiosClient.post("/ai/chat", {
        messages: updatedMessages,
        title: problem?.title,
        description: problem?.description,
        startCode: problem?.startCode,
        testCases: problem?.visibleTestCases,
      });

      setMessages(prev => [...prev, { 
        role: "model", 
        parts: [{ text: response.data.response }] 
      }]);
    } catch (err) {
      console.error("Error communicating with AI:", err);
      setMessages(prev => [...prev, { 
        role: "model", 
        parts: [{ text: "Sorry, I'm having trouble responding right now. Please try again later." }] 
      }]);
    } finally {
      setIsThinking(false); 
    }
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      
      {/* Chat Messages Container - This grows and scrolls internally */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0" style={{
         scrollbarWidth: 'thin',
         scrollbarColor: '#52525b #27272a'
      }}>
        {messages.map((message, index) => (
          <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            
            {/* AI Message (Left aligned) */}
            {message.role === 'model' && (
              <>
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="max-w-xs lg:max-w-md">
                  <div className="bg-zinc-800/50 border border-zinc-700/30 rounded-lg rounded-bl-none p-3">
                    <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap">{message.parts[0].text}</p>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 ml-1">ChatAi</p>
                </div>
              </>
            )}
  
            {/* User Message (Right aligned) */}
            {message.role === 'user' && (
              <>
                <div className="max-w-xs lg:max-w-md">
                  <div className="bg-red-600/80 rounded-lg rounded-br-none p-3">
                    <p className="text-xs text-white leading-relaxed">{message.parts[0].text}</p>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 mr-1 text-right">You</p>
                </div>
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-medium text-blue-400">U</span>
                </div>
              </>
            )}
          </div>
        ))}
        
        {/* Thinking Message */}
        {isThinking && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <div className="w-4 h-4 text-red-400 animate-pulse">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="max-w-xs lg:max-w-md">
              <div className="bg-zinc-800/50 border border-zinc-700/30 rounded-lg rounded-bl-none p-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <p className="text-xs text-zinc-400">thinking is on</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
  
      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-zinc-700/50 bg-zinc-900/50">
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              {...register('message')}
              disabled={isThinking}
              className={`w-full bg-zinc-800 border border-zinc-600/50 rounded-lg py-3 px-4 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all ${
                isThinking ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              placeholder={isThinking ? "Hello code" : "Ask to AI"}
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={isThinking}
            className={`bg-red-600 hover:bg-red-500 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center min-w-[48px] focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
              isThinking ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isThinking ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
        
        {/* Helper text */}
        <p className="text-xs text-zinc-500 mt-2 text-center">
          {isThinking ? "Please Wait" : "Chat only for codeing"}
        </p>
      </div>
    </div>
  );
};

export default ChatAi;