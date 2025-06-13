import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Quinn = ({ currentPage = '', userContext = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => Date.now().toString());
  const messagesEndRef = useRef(null);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'greeting',
        type: 'quinn',
        message: "👋 Hi! I'm Quinn, your IRS Escape Plan assistant. I can help explain glossary terms, recommend courses, provide strategy advice, and guide you through our tools. What would you like to explore?",
        timestamp: new Date()
      }]);
    }
  }, [messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/quinn/chat`, {
        user_id: 'default_user',
        message: userMessage.message,
        context: {
          current_page: currentPage,
          user_profile: userContext,
          timestamp: new Date().toISOString()
        },
        current_page: currentPage,
        session_id: sessionId
      });

      const quinnMessage = {
        id: response.data.id,
        type: 'quinn',
        message: response.data.response,
        module_used: response.data.module_used,
        related_terms: response.data.related_terms || [],
        suggested_actions: response.data.suggested_actions || [],
        course_links: response.data.course_links || [],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, quinnMessage]);
    } catch (error) {
      console.error('Quinn error:', error);
      const errorMessage = {
        id: Date.now().toString(),
        type: 'quinn',
        message: "I'm having trouble right now. Please try again or rephrase your question.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestedAction = (action) => {
    if (action.action.startsWith('glossary/')) {
      // Navigate to glossary term
      window.location.href = `#glossary?term=${action.action.split('/')[1]}`;
    } else if (action.action.startsWith('course/')) {
      // Navigate to course
      window.location.href = `#courses/${action.action.split('/')[1]}`;
    } else if (action.action.startsWith('tool/')) {
      // Navigate to tool
      window.location.href = `#tools/${action.action.split('/')[1]}`;
    } else {
      // Send as message
      setInputMessage(action.text);
    }
  };

  const formatMessage = (message) => {
    // Convert markdown-style formatting to HTML
    return message
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/•/g, '&bull;');
  };

  return (
    <>
      {/* Quinn Chat Icon */}
      <div 
        className={`fixed bottom-6 right-6 z-50 transition-transform duration-300 ${
          isOpen ? 'transform scale-0' : 'transform scale-100'
        }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 group"
          title="Chat with Quinn"
        >
          <div className="relative">
            🤖
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          </div>
        </button>
      </div>

      {/* Quinn Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 w-96 h-[500px] flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🤖</span>
              <div>
                <h3 className="font-semibold">Quinn</h3>
                <p className="text-blue-100 text-xs">IRS Escape Plan Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-blue-100 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: formatMessage(msg.message) 
                    }}
                  />
                  
                  {/* Related Terms */}
                  {msg.related_terms && msg.related_terms.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs font-semibold mb-1">Related Terms:</p>
                      <div className="flex flex-wrap gap-1">
                        {msg.related_terms.slice(0, 3).map((term, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded cursor-pointer hover:bg-blue-200"
                            onClick={() => setInputMessage(`What is ${term}?`)}
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Actions */}
                  {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="space-y-1">
                        {msg.suggested_actions.slice(0, 2).map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestedAction(action)}
                            className="block w-full text-left text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded transition-colors"
                          >
                            {action.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Course Links */}
                  {msg.course_links && msg.course_links.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs font-semibold mb-1">Recommended:</p>
                      <div className="space-y-1">
                        {msg.course_links.slice(0, 2).map((course, index) => (
                          <a
                            key={index}
                            href={`#courses/${course.id}`}
                            className="block text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            📚 {course.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm">Quinn is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Quinn anything about tax strategies, courses, or tools..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors self-end"
              >
                ↗
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-2 flex flex-wrap gap-1">
              {[
                "What is REPS?",
                "Where should I start?",
                "Show my progress",
                "Help with tools"
              ].map((quick, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(quick)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
                >
                  {quick}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Quinn;