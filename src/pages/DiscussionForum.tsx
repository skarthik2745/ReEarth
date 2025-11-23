import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle, Pin, Upload, Send, ThumbsUp, Reply, MoreVertical, Search, Filter } from 'lucide-react';

export default function DiscussionForum() {
  const { user } = useAuth();
  const [activeChannel, setActiveChannel] = useState('water-conservation');
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'prompt',
      author: 'Ms. Lakshmi',
      role: 'teacher',
      content: 'Share one water-saving hack you tried this week. Upload a photo as proof!',
      timestamp: '2 hours ago',
      pinned: true,
      reactions: { thumbsUp: 5 },
      replies: []
    },
    {
      id: 2,
      type: 'message',
      author: 'Priya K',
      role: 'student',
      content: 'I collected shower water while waiting for it to warm up and used it for watering plants. Saved about 10 liters daily!',
      timestamp: '1 hour ago',
      attachment: { type: 'image', name: 'plant_water.jpg', url: '#' },
      reactions: { thumbsUp: 8 },
      status: 'pending_review',
      replies: [
        {
          id: 21,
          author: 'Arjun S',
          role: 'student',
          content: 'Great idea! I do the same with kitchen water.',
          timestamp: '45 min ago'
        }
      ]
    },
    {
      id: 3,
      type: 'message',
      author: 'Karthik M',
      role: 'student',
      content: 'Installed a low-flow showerhead at home. Family water usage dropped by 30%!',
      timestamp: '30 min ago',
      attachment: { type: 'image', name: 'showerhead.jpg', url: '#' },
      reactions: { thumbsUp: 12 },
      status: 'approved',
      replies: []
    }
  ]);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [documents, setDocuments] = useState([
    { id: 1, title: 'Water Conservation Worksheet.pdf', author: 'Ms. Lakshmi', size: '2.3 MB', tags: ['water', 'activity'] },
    { id: 2, title: 'Rainwater Harvesting Guide.docx', author: 'Ms. Lakshmi', size: '1.8 MB', tags: ['water', 'guide'] }
  ]);

  const channels = [
    { id: 'water-conservation', name: 'Water Conservation', class: 'Class 11B', teacher: 'Ms. Lakshmi', members: 32 },
    { id: 'waste-management', name: 'Waste Management', class: 'Class 11B', teacher: 'Ms. Lakshmi', members: 32 },
    { id: 'general-discussion', name: 'General Discussion', class: 'Class 11B', teacher: 'Ms. Lakshmi', members: 32 }
  ];





  const sendMessage = () => {
    if (newMessage.trim() || selectedFile) {
      const newMsg = {
        id: Date.now(),
        type: 'message',
        author: user?.name || 'Anonymous',
        role: user?.role || 'student',
        content: newMessage || (selectedFile ? `Shared a file: ${selectedFile.name}` : ''),
        timestamp: 'just now',
        reactions: { thumbsUp: 0 },
        status: 'approved',
        replies: [],
        ...(selectedFile && {
          attachment: {
            type: selectedFile.type.startsWith('image/') ? 'image' : 'file',
            name: selectedFile.name,
            url: URL.createObjectURL(selectedFile)
          }
        })
      };
      
      if (replyTo) {
        setMessages(prev => prev.map(msg => 
          msg.id === replyTo 
            ? { ...msg, replies: [...msg.replies, { id: Date.now(), author: user?.name || 'Anonymous', role: user?.role || 'student', content: newMessage, timestamp: 'just now' }] }
            : msg
        ));
      } else {
        setMessages(prev => [...prev, newMsg]);
      }
      
      setNewMessage('');
      setReplyTo(null);
      setSelectedFile(null);
    }
  };

  const toggleReaction = (messageId: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, reactions: { ...msg.reactions, thumbsUp: msg.reactions.thumbsUp + 1 } }
        : msg
    ));
  };

  const createChannel = () => {
    if (newChannelName.trim()) {
      alert(`Channel "${newChannelName}" created successfully!`);
      setNewChannelName('');
      setShowCreateChannel(false);
    }
  };

  const uploadDocument = (file: File) => {
    const newDoc = {
      id: Date.now(),
      title: file.name,
      author: user?.name || 'Teacher',
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      tags: ['uploaded']
    };
    setDocuments(prev => [...prev, newDoc]);
    setShowUpload(false);
  };

  const searchMessages = () => {
    setShowSearch(true);
  };

  const performSearch = () => {
    if (searchTerm.trim()) {
      const results = messages.filter(msg => 
        msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      alert(`Found ${results.length} messages matching "${searchTerm}"`);
      setShowSearch(false);
      setSearchTerm('');
    }
  };

  const viewAttachment = (attachment: { name: string; url: string; type: string }) => {
    if (attachment.url.startsWith('blob:')) {
      // For uploaded files, open in new tab
      window.open(attachment.url, '_blank');
    } else {
      // For demo files, show download simulation
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.name;
      link.click();
    }
  };

  const deleteMessage = (messageId: number) => {
    if (confirm('Delete this message?')) {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="arcade-h1 mb-4">DISCUSSION FORUM</h1>
        <p className="arcade-text arcade-text-yellow">COLLABORATE • DISCUSS • SHARE</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Channels Sidebar */}
        <div className="lg:col-span-1">
          <div className="arcade-dialog p-4">
            <h3 className="arcade-h3 mb-4">CHANNELS</h3>
            
            {user?.role === 'teacher' && (
              <button 
                onClick={() => setShowCreateChannel(true)}
                className="w-full arcade-btn arcade-btn-primary text-xs mb-4"
              >
                + CREATE CHANNEL
              </button>
            )}

            <div className="space-y-2">
              {channels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={`w-full text-left p-3 arcade-card text-xs ${
                    activeChannel === channel.id ? 'arcade-card-cyan' : ''
                  }`}
                >
                  <div className="arcade-text arcade-text-cyan"># {channel.name.toUpperCase()}</div>
                  <div className="arcade-text arcade-text-yellow text-xs">{channel.class}</div>
                  <div className="arcade-text text-xs">{channel.members} members</div>
                </button>
              ))}
            </div>

            {/* Document Library */}
            <div className="mt-6">
              <h4 className="arcade-h3 mb-3">DOCUMENTS</h4>
              <div className="space-y-2">
                {documents.map(doc => (
                  <div key={doc.id} className="arcade-card p-2">
                    <div className="arcade-text arcade-text-cyan text-xs">{doc.title}</div>
                    <div className="arcade-text arcade-text-yellow text-xs">{doc.size}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {doc.tags.map(tag => (
                        <span key={tag} className="arcade-text text-xs bg-gray-600 px-1">{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <div className="arcade-dialog p-4 h-96 flex flex-col">
            {/* Channel Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-gray-600">
              <div>
                <h3 className="arcade-h3"># {channels.find(c => c.id === activeChannel)?.name.toUpperCase()}</h3>
                <p className="arcade-text arcade-text-yellow text-xs">
                  {channels.find(c => c.id === activeChannel)?.class} • {channels.find(c => c.id === activeChannel)?.members} members
                </p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowSearch(true)}
                  className="arcade-btn arcade-btn-secondary text-xs"
                >
                  <Search className="w-3 h-3 inline mr-1" />SEARCH
                </button>
                {user?.role === 'teacher' && (
                  <button 
                    onClick={() => setShowUpload(true)}
                    className="arcade-btn arcade-btn-secondary text-xs"
                  >
                    <Upload className="w-3 h-3 inline mr-1" />UPLOAD
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map(message => (
                <div key={message.id} className={`arcade-card p-4 ${message.pinned ? 'arcade-card-yellow' : ''}`}>
                  {message.pinned && (
                    <div className="flex items-center mb-2">
                      <Pin className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="arcade-text arcade-text-yellow text-xs">PINNED MESSAGE</span>
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 border-2 border-white flex items-center justify-center arcade-text text-xs ${
                        message.role === 'teacher' ? 'bg-yellow-400 text-black' : 'bg-cyan-400 text-black'
                      }`}>
                        {message.author.charAt(0)}
                      </div>
                      <div>
                        <span className="arcade-text arcade-text-cyan text-sm">{message.author.toUpperCase()}</span>
                        {message.role === 'teacher' && (
                          <span className="arcade-text arcade-text-yellow text-xs ml-2">TEACHER</span>
                        )}
                        <div className="arcade-text text-xs">{message.timestamp}</div>
                      </div>
                    </div>
                    
                    {message.status && (
                      <span className={`arcade-text text-xs px-2 py-1 ${
                        message.status === 'approved' ? 'bg-green-600' : 
                        message.status === 'pending_review' ? 'bg-yellow-600' : 'bg-red-600'
                      }`}>
                        {message.status.replace('_', ' ').toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="arcade-text arcade-text-cyan text-sm mb-3">{message.content}</div>

                  {message.attachment && (
                    <div className="arcade-card p-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <Upload className="w-4 h-4 text-cyan-400" />
                        <span className="arcade-text arcade-text-cyan text-xs">{message.attachment.name}</span>
                        <button 
                          onClick={() => viewAttachment(message.attachment)}
                          className="arcade-btn arcade-btn-secondary text-xs"
                        >
                          VIEW
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => toggleReaction(message.id)}
                        className="flex items-center space-x-1 arcade-text text-xs hover:arcade-text-yellow"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{message.reactions.thumbsUp}</span>
                      </button>
                      <button 
                        onClick={() => setReplyTo(message.id)}
                        className="flex items-center space-x-1 arcade-text text-xs hover:arcade-text-cyan"
                      >
                        <Reply className="w-4 h-4" />
                        <span>REPLY</span>
                      </button>
                    </div>

                    {(user?.role === 'teacher' || message.author === user?.name) && (
                      <button 
                        onClick={() => deleteMessage(message.id)}
                        className="arcade-btn arcade-btn-red text-xs"
                      >
                        DELETE
                      </button>
                    )}
                  </div>

                  {/* Replies */}
                  {message.replies.length > 0 && (
                    <div className="mt-3 ml-6 space-y-2">
                      {message.replies.map(reply => (
                        <div key={reply.id} className="arcade-card p-2">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="w-6 h-6 bg-cyan-400 border border-white flex items-center justify-center arcade-text text-xs text-black">
                              {reply.author.charAt(0)}
                            </div>
                            <span className="arcade-text arcade-text-cyan text-xs">{reply.author.toUpperCase()}</span>
                            <span className="arcade-text text-xs">{reply.timestamp}</span>
                          </div>
                          <div className="arcade-text text-xs">{reply.content}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t-2 border-gray-600 pt-4">
              {replyTo && (
                <div className="arcade-card p-2 mb-2">
                  <span className="arcade-text arcade-text-yellow text-xs">
                    REPLYING TO: {messages.find(m => m.id === replyTo)?.author}
                  </span>
                  <button 
                    onClick={() => setReplyTo(null)}
                    className="arcade-text text-xs ml-2 hover:arcade-text-red"
                  >
                    CANCEL
                  </button>
                </div>
              )}
              
              {selectedFile && (
                <div className="arcade-card p-2 mb-2">
                  <span className="arcade-text arcade-text-cyan text-xs">
                    FILE: {selectedFile.name}
                  </span>
                  <button 
                    onClick={() => setSelectedFile(null)}
                    className="arcade-text text-xs ml-2 hover:arcade-text-red"
                  >
                    REMOVE
                  </button>
                </div>
              )}
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="TYPE YOUR MESSAGE..."
                  className="flex-1 arcade-input px-3 py-2 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button 
                  onClick={() => document.getElementById('messageFile')?.click()}
                  className={`arcade-btn arcade-btn-secondary ${selectedFile ? 'arcade-btn-primary' : ''}`}
                >
                  <Upload className="w-4 h-4" />
                </button>
                <input 
                  id="messageFile" 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                    }
                  }}
                />
                <button 
                  onClick={sendMessage}
                  className="arcade-btn arcade-btn-primary"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Channel Modal */}
      {showCreateChannel && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="arcade-dialog p-6 max-w-md w-full mx-4">
            <h3 className="arcade-h3 mb-4">CREATE NEW CHANNEL</h3>
            <input
              type="text"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              placeholder="CHANNEL NAME..."
              className="w-full arcade-input mb-4"
              onKeyPress={(e) => e.key === 'Enter' && createChannel()}
            />
            <div className="flex space-x-2">
              <button 
                onClick={createChannel}
                className="arcade-btn arcade-btn-primary flex-1"
              >
                CREATE
              </button>
              <button 
                onClick={() => setShowCreateChannel(false)}
                className="arcade-btn arcade-btn-secondary flex-1"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="arcade-dialog p-6 max-w-md w-full mx-4">
            <h3 className="arcade-h3 mb-4">UPLOAD DOCUMENT</h3>
            <div className="arcade-card p-4 mb-4 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
              <p className="arcade-text arcade-text-cyan text-xs mb-2">SELECT DOCUMENT TO UPLOAD</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    uploadDocument(file);
                  }
                }}
                className="w-full arcade-input"
              />
            </div>
            <button 
              onClick={() => setShowUpload(false)}
              className="arcade-btn arcade-btn-secondary w-full"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="arcade-dialog p-6 max-w-md w-full mx-4">
            <h3 className="arcade-h3 mb-4">SEARCH MESSAGES</h3>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SEARCH TERM..."
              className="w-full arcade-input mb-4"
              onKeyPress={(e) => e.key === 'Enter' && performSearch()}
            />
            <div className="flex space-x-2">
              <button 
                onClick={performSearch}
                className="arcade-btn arcade-btn-primary flex-1"
              >
                SEARCH
              </button>
              <button 
                onClick={() => {
                  setShowSearch(false);
                  setSearchTerm('');
                }}
                className="arcade-btn arcade-btn-secondary flex-1"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}