import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, MapPin, Users, Clock, Camera, QrCode, Award, Plus, Eye, CheckCircle } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  type: 'cleanup' | 'plantation' | 'webinar';
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  registrationDeadline: string;
  proofType: 'qr' | 'photo' | 'manual';
  points: number;
  organizer: string;
  registered: string[];
  waitlist: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  requiresConsent: boolean;
}

export default function EventManagement() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'events' | 'create' | 'manage'>('events');
  const [showRegistration, setShowRegistration] = useState<number | null>(null);
  const [showQR, setShowQR] = useState<number | null>(null);
  const [showGallery, setShowGallery] = useState<number | null>(null);
  const [eventPhotos, setEventPhotos] = useState<{[eventId: number]: string[]}>({});

  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: 'Neighborhood Clean-up Drive',
      description: 'Join us for a community clean-up to collect plastic waste and make our neighborhood cleaner!',
      type: 'cleanup',
      date: '2025-12-05',
      time: '09:00',
      location: 'Central Park, Sector 15',
      maxParticipants: 50,
      registrationDeadline: '2025-12-03',
      proofType: 'photo',
      points: 30,
      organizer: 'Ms. Priya',
      registered: ['Alex Green', 'Priya K', 'Karthik M'],
      waitlist: [],
      status: 'upcoming',
      requiresConsent: true
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'cleanup' as const,
    date: '',
    time: '',
    location: '',
    maxParticipants: 20,
    registrationDeadline: '',
    proofType: 'photo' as const,
    points: 20,
    requiresConsent: false
  });

  const createEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.location) {
      const event: Event = {
        id: Date.now(),
        ...newEvent,
        organizer: user?.name || 'Teacher',
        registered: [],
        waitlist: [],
        status: 'upcoming'
      };
      setEvents(prev => [...prev, event]);
      setNewEvent({
        title: '',
        description: '',
        type: 'cleanup',
        date: '',
        time: '',
        location: '',
        maxParticipants: 20,
        registrationDeadline: '',
        proofType: 'photo',
        points: 20,
        requiresConsent: false
      });
      setActiveTab('events');
      alert('Event created successfully!');
    }
  };

  const registerForEvent = (eventId: number) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId && user?.name) {
        if (event.registered.length < event.maxParticipants) {
          return { ...event, registered: [...event.registered, user.name] };
        } else {
          return { ...event, waitlist: [...event.waitlist, user.name] };
        }
      }
      return event;
    }));
    setShowRegistration(null);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'cleanup': return 'arcade-card-cyan';
      case 'plantation': return 'arcade-card-green';
      case 'webinar': return 'arcade-card-yellow';
      default: return 'arcade-card';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="arcade-h1 mb-4">RE-EARTH EVENTS</h1>
        <p className="arcade-text arcade-text-yellow">SUSTAINABILITY • COMMUNITY • ACTION</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('events')}
            className={`arcade-btn ${activeTab === 'events' ? 'arcade-btn-primary' : 'arcade-btn-secondary'}`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />EVENTS
          </button>
          {user?.role === 'teacher' && (
            <>
              <button
                onClick={() => setActiveTab('create')}
                className={`arcade-btn ${activeTab === 'create' ? 'arcade-btn-primary' : 'arcade-btn-secondary'}`}
              >
                <Plus className="w-4 h-4 inline mr-2" />CREATE
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`arcade-btn ${activeTab === 'manage' ? 'arcade-btn-primary' : 'arcade-btn-secondary'}`}
              >
                <Eye className="w-4 h-4 inline mr-2" />MANAGE
              </button>
            </>
          )}
        </div>
      </div>

      {/* Events List */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className={`arcade-card ${getEventTypeColor(event.type)} p-6`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="arcade-h3 text-sm">{event.title.toUpperCase()}</h3>
                <span className={`arcade-text text-xs px-2 py-1 ${
                  event.type === 'cleanup' ? 'bg-cyan-600' :
                  event.type === 'plantation' ? 'bg-green-600' : 'bg-yellow-600'
                }`}>
                  {event.type.toUpperCase()}
                </span>
              </div>

              <p className="arcade-text arcade-text-cyan text-xs mb-4">{event.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span className="arcade-text text-xs">{event.date} at {event.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="arcade-text text-xs">{event.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span className="arcade-text text-xs">{event.registered.length}/{event.maxParticipants} registered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="arcade-text arcade-text-yellow text-xs">{event.points} POINTS</span>
                </div>
                {user?.role === 'student' && (
                  <div className="arcade-text arcade-text-cyan text-xs">
                    Organizer: {event.organizer}
                  </div>
                )}
              </div>

              {user?.role === 'student' && !event.registered.includes(user.name) && !event.waitlist.includes(user.name) && (
                <button
                  onClick={() => setShowRegistration(event.id)}
                  className="w-full arcade-btn arcade-btn-primary text-xs"
                >
                  REGISTER
                </button>
              )}

              {user?.role === 'student' && event.registered.includes(user.name) && (
                <div className="flex items-center justify-center space-x-2 arcade-card-green p-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="arcade-text arcade-text-green text-xs">REGISTERED</span>
                </div>
              )}

              {user?.role === 'student' && event.waitlist.includes(user.name) && (
                <div className="arcade-card-yellow p-2 text-center">
                  <span className="arcade-text arcade-text-yellow text-xs">ON WAITLIST</span>
                </div>
              )}

              {user?.role === 'teacher' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowQR(event.id)}
                    className="flex-1 arcade-btn arcade-btn-secondary text-xs"
                  >
                    <QrCode className="w-3 h-3 inline mr-1" />QR
                  </button>
                  <button
                    onClick={() => setShowGallery(event.id)}
                    className="flex-1 arcade-btn arcade-btn-secondary text-xs"
                  >
                    <Camera className="w-3 h-3 inline mr-1" />GALLERY
                  </button>
                </div>
              )}

              {user?.role === 'student' && eventPhotos[event.id] && eventPhotos[event.id].length > 0 && (
                <button
                  onClick={() => setShowGallery(event.id)}
                  className="w-full arcade-btn arcade-btn-secondary text-xs"
                >
                  <Camera className="w-3 h-3 inline mr-1" />VIEW PHOTOS ({eventPhotos[event.id].length})
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Event Form */}
      {activeTab === 'create' && user?.role === 'teacher' && (
        <div className="max-w-2xl mx-auto">
          <div className="arcade-dialog p-6">
            <h2 className="arcade-h2 mb-6">CREATE NEW EVENT</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="arcade-text arcade-text-cyan text-xs block mb-2">EVENT TITLE</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full arcade-input"
                  placeholder="Event name..."
                />
              </div>

              <div>
                <label className="arcade-text arcade-text-cyan text-xs block mb-2">EVENT TYPE</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full arcade-input"
                >
                  <option value="cleanup">Clean-up Drive</option>
                  <option value="plantation">Tree Plantation</option>
                  <option value="webinar">Webinar</option>
                </select>
              </div>

              <div>
                <label className="arcade-text arcade-text-cyan text-xs block mb-2">DATE</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full arcade-input"
                />
              </div>

              <div>
                <label className="arcade-text arcade-text-cyan text-xs block mb-2">TIME</label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full arcade-input"
                />
              </div>

              <div>
                <label className="arcade-text arcade-text-cyan text-xs block mb-2">MAX PARTICIPANTS</label>
                <input
                  type="number"
                  value={newEvent.maxParticipants}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                  className="w-full arcade-input"
                  min="1"
                />
              </div>

              <div>
                <label className="arcade-text arcade-text-cyan text-xs block mb-2">POINTS REWARD</label>
                <input
                  type="number"
                  value={newEvent.points}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                  className="w-full arcade-input"
                  min="1"
                />
              </div>

              <div>
                <label className="arcade-text arcade-text-cyan text-xs block mb-2">PROOF TYPE</label>
                <select
                  value={newEvent.proofType}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, proofType: e.target.value as any }))}
                  className="w-full arcade-input"
                >
                  <option value="qr">QR Code Scan</option>
                  <option value="photo">Photo Upload</option>
                  <option value="manual">Manual Check</option>
                </select>
              </div>

              <div>
                <label className="arcade-text arcade-text-cyan text-xs block mb-2">REGISTRATION DEADLINE</label>
                <input
                  type="date"
                  value={newEvent.registrationDeadline}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, registrationDeadline: e.target.value }))}
                  className="w-full arcade-input"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="arcade-text arcade-text-cyan text-xs block mb-2">LOCATION</label>
              <input
                type="text"
                value={newEvent.location}
                onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                className="w-full arcade-input"
                placeholder="Event location..."
              />
            </div>

            <div className="mt-4">
              <label className="arcade-text arcade-text-cyan text-xs block mb-2">DESCRIPTION</label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                className="w-full arcade-input h-20"
                placeholder="Event description..."
              />
            </div>

            <div className="mt-4 flex items-center space-x-2">
              <input
                type="checkbox"
                id="consent"
                checked={newEvent.requiresConsent}
                onChange={(e) => setNewEvent(prev => ({ ...prev, requiresConsent: e.target.checked }))}
                className="w-4 h-4"
              />
              <label htmlFor="consent" className="arcade-text arcade-text-yellow text-xs">
                REQUIRES PARENT CONSENT (OFF-CAMPUS)
              </label>
            </div>

            <button
              onClick={createEvent}
              className="w-full mt-6 arcade-btn arcade-btn-primary"
            >
              CREATE EVENT
            </button>
          </div>
        </div>
      )}

      {/* Event Management */}
      {activeTab === 'manage' && user?.role === 'teacher' && (
        <div className="space-y-6">
          {events.map(event => (
            <div key={event.id} className="arcade-dialog p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="arcade-h3">{event.title.toUpperCase()}</h3>
                  <p className="arcade-text arcade-text-yellow text-xs">{event.date} • {event.registered.length} registered</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setShowQR(event.id)}
                    className="arcade-btn arcade-btn-secondary text-xs"
                  >
                    <QrCode className="w-4 h-4 inline mr-1" />QR CODE
                  </button>
                  <button 
                    onClick={() => setShowGallery(event.id)}
                    className="arcade-btn arcade-btn-secondary text-xs"
                  >
                    <Camera className="w-4 h-4 inline mr-1" />GALLERY
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="arcade-text arcade-text-cyan text-xs mb-2">REGISTERED PARTICIPANTS</h4>
                  <div className="space-y-1">
                    {event.registered.map((name, index) => (
                      <div key={index} className="arcade-card p-2 flex justify-between items-center">
                        <span className="arcade-text text-xs">{name}</span>
                        <button className="arcade-btn arcade-btn-primary text-xs">
                          MARK PRESENT
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {event.waitlist.length > 0 && (
                  <div>
                    <h4 className="arcade-text arcade-text-yellow text-xs mb-2">WAITLIST</h4>
                    <div className="space-y-1">
                      {event.waitlist.map((name, index) => (
                        <div key={index} className="arcade-card p-2">
                          <span className="arcade-text text-xs">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="arcade-dialog p-6 max-w-md w-full mx-4">
            <h3 className="arcade-h3 mb-4">REGISTER FOR EVENT</h3>
            <div className="arcade-card p-4 mb-4">
              <p className="arcade-text arcade-text-cyan text-xs mb-2">
                You are registering for: {events.find(e => e.id === showRegistration)?.title}
              </p>
              {events.find(e => e.id === showRegistration)?.requiresConsent && (
                <div className="flex items-center space-x-2 mt-2">
                  <input type="checkbox" id="parentConsent" className="w-4 h-4" />
                  <label htmlFor="parentConsent" className="arcade-text arcade-text-yellow text-xs">
                    I have parent consent for off-campus event
                  </label>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => registerForEvent(showRegistration)}
                className="arcade-btn arcade-btn-primary flex-1"
              >
                CONFIRM
              </button>
              <button
                onClick={() => setShowRegistration(null)}
                className="arcade-btn arcade-btn-secondary flex-1"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="arcade-dialog p-6 max-w-md w-full mx-4 text-center">
            <h3 className="arcade-h3 mb-4">EVENT QR CODE</h3>
            <div className="arcade-card p-8 mb-4">
              <div className="w-48 h-48 mx-auto bg-white flex items-center justify-center">
                <QrCode className="w-32 h-32 text-black" />
              </div>
              <p className="arcade-text arcade-text-cyan text-xs mt-4">
                EVENT ID: {showQR}
              </p>
            </div>
            <p className="arcade-text arcade-text-yellow text-xs mb-4">
              STUDENTS SCAN THIS CODE FOR ATTENDANCE
            </p>
            <button
              onClick={() => setShowQR(null)}
              className="arcade-btn arcade-btn-secondary w-full"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="arcade-dialog p-4 max-w-md w-full mx-4">
            <h3 className="arcade-h3 mb-4">EVENT GALLERY</h3>
            <div className="grid grid-cols-2 gap-2 mb-4 max-h-48 overflow-y-auto">
              {eventPhotos[showGallery] && eventPhotos[showGallery].length > 0 ? (
                eventPhotos[showGallery].map((photo, i) => (
                  <div key={i} className="arcade-card p-1 aspect-square">
                    <img src={photo} alt={`Event photo ${i + 1}`} className="w-full h-full object-cover rounded" />
                  </div>
                ))
              ) : (
                <div className="arcade-card p-2 aspect-square flex items-center justify-center col-span-full">
                  <Camera className="w-6 h-6 text-cyan-400" />
                  <span className="arcade-text text-xs ml-1">NO PHOTOS YET</span>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              {user?.role === 'teacher' && (
                <button 
                  onClick={() => document.getElementById('galleryFile')?.click()}
                  className="arcade-btn arcade-btn-primary flex-1"
                >
                  <Plus className="w-4 h-4 inline mr-1" />ADD PHOTOS
                </button>
              )}
              <input 
                id="galleryFile" 
                type="file" 
                multiple
                accept="image/*"
                className="hidden" 
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0 && showGallery) {
                    const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
                    setEventPhotos(prev => ({
                      ...prev,
                      [showGallery]: [...(prev[showGallery] || []), ...newPhotos]
                    }));
                  }
                }}
              />
              <button
                onClick={() => setShowGallery(null)}
                className="arcade-btn arcade-btn-secondary flex-1"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}