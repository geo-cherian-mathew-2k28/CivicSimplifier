import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Upload, Bot, User, FileText, Loader2, Sparkles } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I'm CivicSimplifier. Upload a complex legal PDF, and I'll explain it in plain English." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post('http://localhost:8000/upload', formData);
      setMessages(prev => [...prev, { role: 'bot', text: `✅ Analyzed "${selectedFile.name}". I'm ready for your questions!` }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: '❌ Error analyzing file. Please try again.' }]);
    }
    setUploading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/ask', { question: userMessage });
      setMessages(prev => [...prev, { role: 'bot', text: res.data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Please upload a document first.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans overflow-hidden">
      
      {/* Sidebar - Glass Effect */}
      <div className="w-80 bg-white/5 backdrop-blur-lg border-r border-white/10 p-6 flex flex-col hidden md:flex">
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="text-blue-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            CivicSimplifier
          </h1>
        </div>
        
        <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5 mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Active Brain</p>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <span className="font-medium text-sm text-gray-200">Llama 3.2:1b (Local)</span>
          </div>
        </div>

        <div className="flex-1"></div>

        {/* Upload Box */}
        <label className={`
          group relative flex flex-col items-center justify-center w-full h-32 
          border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
          ${file ? 'border-green-500/50 bg-green-500/10' : 'border-gray-600 hover:border-blue-400 hover:bg-blue-500/5'}
        `}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            ) : file ? (
              <>
                <FileText className="w-8 h-8 text-green-400 mb-2" />
                <p className="text-sm text-green-300 font-medium truncate max-w-[200px]">{file.name}</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-400 transition-colors mb-2" />
                <p className="text-sm text-gray-400 group-hover:text-gray-300">Drop PDF here</p>
              </>
            )}
          </div>
          <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
        </label>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header for Mobile */}
        <div className="md:hidden p-4 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
            <span className="font-bold text-blue-400">CivicSimplifier</span>
            <span className="text-xs px-2 py-1 bg-gray-800 rounded text-green-400">Online</span>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6 scroll-smooth">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`
                max-w-[85%] md:max-w-[70%] p-5 rounded-2xl shadow-xl flex gap-4 backdrop-blur-sm
                ${msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-800/80 border border-white/10 text-gray-100 rounded-bl-none'}
              `}>
                <div className={`mt-1 p-2 rounded-lg h-fit ${msg.role === 'user' ? 'bg-blue-700' : 'bg-gray-700'}`}>
                   {msg.role === 'bot' ? <Bot size={18} /> : <User size={18} />}
                </div>
                <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed">
                    {msg.text}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start animate-in fade-in">
              <div className="bg-gray-800/50 p-4 rounded-2xl rounded-bl-none flex items-center gap-3 border border-white/5">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="text-gray-400 text-sm">Analyzing document context...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-gray-900/90 backdrop-blur-md border-t border-white/10">
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question about the document..."
              className="flex-1 bg-gray-800/50 text-white p-4 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-gray-500"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-xl transition-all shadow-lg shadow-blue-500/20"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-center text-xs text-gray-600 mt-3">
            Powered by Llama 3.2 1B & • Runs 100% Offline
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;