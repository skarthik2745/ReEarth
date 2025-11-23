import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Play, Pause, Heart, MessageCircle, Share, Star, Upload, Filter, Search, Clock, User } from 'lucide-react';

export default function StoriesSection() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('stories');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Inspiration', 'Case Study', 'Student Work', 'Field Report', 'Quick Facts'];

  const stories = [
    {
      id: 1,
      type: 'text',
      title: 'My Zero-Plastic Week',
      author: 'Kavya R',
      role: 'student',
      category: 'Student Work',
      content: 'This week I challenged myself to go completely plastic-free. Here\'s what I learned and how I managed to do it...',
      images: ['plastic_free_1.jpg', 'plastic_free_2.jpg', 'plastic_free_3.jpg'],
      readTime: '3 min read',
      publishDate: '2 days ago',
      likes: 24,
      comments: 8,
      featured: true,
      status: 'approved'
    },
    {
      id: 2,
      type: 'audio',
      title: 'Local Composting 101',
      author: 'Mr. Ramesh',
      role: 'teacher',
      category: 'Case Study',
      summary: 'A step-by-step guide to starting composting at home with kitchen waste and garden materials.',
      duration: '8m 32s',
      publishDate: '1 week ago',
      likes: 45,
      comments: 12,
      featured: false,
      status: 'approved',
      audioUrl: '#'
    },
    {
      id: 3,
      type: 'text',
      title: 'School Garden Success Story',
      author: 'Priya K',
      role: 'student',
      category: 'Field Report',
      content: 'Our class transformed the unused corner of our school into a thriving vegetable garden. Here\'s our journey...',
      images: ['garden_before.jpg', 'garden_after.jpg'],
      readTime: '4 min read',
      publishDate: '3 days ago',
      likes: 18,
      comments: 5,
      featured: false,
      status: 'approved'
    }
  ];

  const pendingStories = [
    {
      id: 4,
      type: 'text',
      title: 'Rainwater Harvesting at Home',
      author: 'Arjun S',
      role: 'student',
      category: 'Student Work',
      content: 'I helped my family install a simple rainwater harvesting system...',
      readTime: '2 min read',
      status: 'pending'
    }
  ];

  const toggleAudio = (storyId: number) => {
    setPlayingAudio(playingAudio === storyId ? null : storyId);
  };

  const toggleLike = (storyId: number) => {
    // Toggle like logic here
  };

  const approveStory = (storyId: number) => {
    // Approve story logic here
  };

  const filteredStories = stories.filter(story => 
    (selectedCategory === 'All' || story.category === selectedCategory) &&
    (story.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     story.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="arcade-h1 mb-4">SUSTAINABILITY STORIES</h1>
        <p className="arcade-text arcade-text-yellow">INSPIRE • LEARN • SHARE</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="arcade-card p-2 flex space-x-2">
          <button
            onClick={() => setActiveTab('stories')}
            className={`arcade-btn text-xs px-4 py-2 ${activeTab === 'stories' ? 'arcade-btn-primary' : 'arcade-btn-secondary'}`}
          >
            STORIES & PODCASTS
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`arcade-btn text-xs px-4 py-2 ${activeTab === 'submit' ? 'arcade-btn-primary' : 'arcade-btn-secondary'}`}
          >
            SUBMIT STORY
          </button>
          {user?.role === 'teacher' && (
            <button
              onClick={() => setActiveTab('review')}
              className={`arcade-btn text-xs px-4 py-2 ${activeTab === 'review' ? 'arcade-btn-primary' : 'arcade-btn-secondary'}`}
            >
              REVIEW QUEUE ({pendingStories.length})
            </button>
          )}
        </div>
      </div>

      {/* Stories & Podcasts Tab */}
      {activeTab === 'stories' && (
        <div>
          {/* Featured Story */}
          {stories.find(s => s.featured) && (
            <div className="arcade-dialog p-6 mb-8">
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="arcade-text arcade-text-yellow text-sm">FEATURED STORY</span>
              </div>
              {(() => {
                const featured = stories.find(s => s.featured)!;
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h2 className="arcade-h2 mb-3">{featured.title.toUpperCase()}</h2>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-cyan-400" />
                          <span className="arcade-text arcade-text-cyan text-sm">{featured.author}</span>
                          {featured.role === 'teacher' && (
                            <span className="arcade-text arcade-text-yellow text-xs">TEACHER</span>
                          )}
                        </div>
                        <span className="arcade-text text-xs">{featured.publishDate}</span>
                      </div>
                      <p className="arcade-text arcade-text-cyan text-sm mb-4">{featured.content}</p>
                      <div className="flex items-center space-x-4">
                        <button className="arcade-btn arcade-btn-primary text-xs">READ MORE</button>
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-red-400" />
                          <span className="arcade-text text-xs">{featured.likes}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4 text-cyan-400" />
                          <span className="arcade-text text-xs">{featured.comments}</span>
                        </div>
                      </div>
                    </div>
                    <div className="arcade-card p-4">
                      <div className="arcade-text arcade-text-yellow text-xs mb-2">STORY IMAGES</div>
                      <div className="grid grid-cols-2 gap-2">
                        {featured.images?.slice(0, 4).map((img, index) => (
                          <div key={index} className="bg-gray-600 h-20 border-2 border-white flex items-center justify-center">
                            <span className="arcade-text text-xs">{img}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Search and Filter */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="SEARCH STORIES..."
                className="arcade-input w-full px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`arcade-btn text-xs px-3 py-1 ${
                    selectedCategory === category ? 'arcade-btn-primary' : 'arcade-btn-secondary'
                  }`}
                >
                  {category.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map(story => (
              <div key={story.id} className="arcade-dialog p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`arcade-card text-xs px-2 py-1 ${
                    story.category === 'Student Work' ? 'arcade-card-green' :
                    story.category === 'Case Study' ? 'arcade-card-cyan' :
                    story.category === 'Field Report' ? 'arcade-card-yellow' :
                    'arcade-card-magenta'
                  }`}>
                    {story.category.toUpperCase()}
                  </span>
                  {story.type === 'audio' && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-yellow-400" />
                      <span className="arcade-text arcade-text-yellow text-xs">{story.duration}</span>
                    </div>
                  )}
                </div>

                <h3 className="arcade-h3 mb-2">{story.title.toUpperCase()}</h3>
                
                <div className="flex items-center space-x-2 mb-3">
                  <div className={`w-6 h-6 border border-white flex items-center justify-center arcade-text text-xs ${
                    story.role === 'teacher' ? 'bg-yellow-400 text-black' : 'bg-cyan-400 text-black'
                  }`}>
                    {story.author.charAt(0)}
                  </div>
                  <span className="arcade-text arcade-text-cyan text-xs">{story.author}</span>
                  <span className="arcade-text text-xs">{story.publishDate}</span>
                </div>

                {story.type === 'text' ? (
                  <div>
                    <p className="arcade-text arcade-text-cyan text-xs mb-3 line-clamp-3">{story.content}</p>
                    <div className="flex items-center space-x-2 mb-4">
                      <Clock className="w-3 h-3 text-yellow-400" />
                      <span className="arcade-text arcade-text-yellow text-xs">{story.readTime}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="arcade-text arcade-text-cyan text-xs mb-3">{story.summary}</p>
                    <div className="arcade-card p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => toggleAudio(story.id)}
                          className="arcade-btn arcade-btn-primary text-xs"
                        >
                          {playingAudio === story.id ? (
                            <><Pause className="w-3 h-3 inline mr-1" />PAUSE</>
                          ) : (
                            <><Play className="w-3 h-3 inline mr-1" />PLAY</>
                          )}
                        </button>
                        <span className="arcade-text arcade-text-yellow text-xs">{story.duration}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => toggleLike(story.id)}
                      className="flex items-center space-x-1 arcade-text text-xs hover:arcade-text-red"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{story.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 arcade-text text-xs hover:arcade-text-cyan">
                      <MessageCircle className="w-4 h-4" />
                      <span>{story.comments}</span>
                    </button>
                    <button className="arcade-text text-xs hover:arcade-text-yellow">
                      <Share className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="arcade-btn arcade-btn-secondary text-xs">READ MORE</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Story Tab */}
      {activeTab === 'submit' && (
        <div className="max-w-2xl mx-auto">
          <div className="arcade-dialog p-6">
            <h2 className="arcade-h2 mb-6 text-center">SUBMIT YOUR STORY</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">STORY TYPE</label>
                <select className="arcade-input w-full px-3">
                  <option>TEXT STORY</option>
                  <option>AUDIO PODCAST</option>
                  <option>ILLUSTRATED STORY</option>
                </select>
              </div>

              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">TITLE</label>
                <input className="arcade-input w-full px-3" placeholder="ENTER STORY TITLE" />
              </div>

              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">CATEGORY</label>
                <select className="arcade-input w-full px-3">
                  <option>STUDENT WORK</option>
                  <option>FIELD REPORT</option>
                  <option>INSPIRATION</option>
                  <option>QUICK FACTS</option>
                </select>
              </div>

              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">CONTENT</label>
                <textarea className="arcade-input w-full px-3 h-32" placeholder="WRITE YOUR STORY..."></textarea>
              </div>

              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">ATTACHMENTS</label>
                <div className="arcade-card p-4 border-2 border-dashed border-cyan-400 cursor-pointer">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <p className="arcade-text arcade-text-cyan text-xs">UPLOAD IMAGES OR AUDIO</p>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full arcade-btn arcade-btn-primary">
                SUBMIT FOR REVIEW
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Review Queue Tab (Teacher Only) */}
      {activeTab === 'review' && user?.role === 'teacher' && (
        <div>
          <h2 className="arcade-h2 mb-6 text-center">PENDING STORIES</h2>
          
          <div className="space-y-6">
            {pendingStories.map(story => (
              <div key={story.id} className="arcade-dialog p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="arcade-h3 mb-2">{story.title.toUpperCase()}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="arcade-text arcade-text-cyan text-sm">BY {story.author.toUpperCase()}</span>
                      <span className="arcade-card arcade-card-yellow text-xs px-2 py-1">{story.category.toUpperCase()}</span>
                    </div>
                  </div>
                  <span className="arcade-card arcade-card-yellow text-xs px-2 py-1">PENDING REVIEW</span>
                </div>

                <p className="arcade-text arcade-text-cyan text-sm mb-4">{story.content}</p>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => approveStory(story.id)}
                    className="arcade-btn arcade-btn-green text-xs"
                  >
                    APPROVE & PUBLISH
                  </button>
                  <button className="arcade-btn arcade-btn-red text-xs">
                    REJECT
                  </button>
                  <button className="arcade-btn arcade-btn-secondary text-xs">
                    REQUEST CHANGES
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}