import React, { useState } from 'react';
import { Upload, Filter, Eye, Download, CheckCircle, Clock } from 'lucide-react';
import { useProjects } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';

export default function ProjectHub() {
  const [activeTab, setActiveTab] = useState('gallery');
  const { projectSubmissions, addProjectSubmission } = useProjects();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [createdProjects, setCreatedProjects] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [viewingProject, setViewingProject] = useState<any>(null);

  const projects = [
    {
      id: 1,
      title: 'Solar-Powered Classroom Fan',
      student: 'Nivetha R',
      category: 'Renewable Energy',
      summary: 'Installed a small panel to run a DC fan reducing electricity consumption',
      status: 'approved',
      points: 90,
      date: '2024-01-15',
      grade: '10-B'
    },
    {
      id: 2,
      title: 'Rainwater Harvesting System',
      student: 'Karthik M',
      category: 'Water Conservation',
      summary: 'Built a mini rainwater collection system for school garden',
      status: 'pending',
      points: 0,
      date: '2024-01-20',
      grade: '9-A'
    },
    {
      id: 3,
      title: 'Vertical Garden Tower',
      student: 'Priya K',
      category: 'Biodiversity',
      summary: 'Created a space-efficient vertical garden using recycled bottles',
      status: 'approved',
      points: 85,
      date: '2024-01-18',
      grade: '10-A'
    },
    {
      id: 4,
      title: 'Waste Segregation App',
      student: 'Arjun S',
      category: 'Climate Tech',
      summary: 'Developed a mobile app to help students segregate waste properly',
      status: 'approved',
      points: 120,
      date: '2024-01-12',
      grade: '11-C'
    },
    {
      id: 5,
      title: 'Compost Bin Design',
      student: 'Meera P',
      category: 'Waste Management',
      summary: 'Designed an efficient compost bin for organic waste recycling',
      status: 'approved',
      points: 75,
      date: '2024-01-10',
      grade: '9-B'
    },
    {
      id: 6,
      title: 'Wind Power Generator',
      student: 'Harish P',
      category: 'Renewable Energy',
      summary: 'Built a small wind turbine to generate electricity for LED lights',
      status: 'pending',
      points: 0,
      date: '2024-01-22',
      grade: '11-A'
    }
  ];

  const categories = ['All', 'Renewable Energy', 'Waste Management', 'Biodiversity', 'Water Conservation', 'Climate Tech'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="arcade-h1 mb-4">GREEN PROJECT HUB</h1>
        <p className="arcade-text arcade-text-yellow">SUBMIT • SHARE • INSPIRE</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="arcade-card p-2 flex space-x-2">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`arcade-btn text-xs px-4 py-2 ${activeTab === 'gallery' ? 'arcade-btn-primary' : 'arcade-btn-secondary'}`}
          >
            GALLERY
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`arcade-btn text-xs px-4 py-2 ${activeTab === 'submit' ? 'arcade-btn-primary' : 'arcade-btn-secondary'}`}
          >
            SUBMIT
          </button>
          <button
            onClick={() => setActiveTab('my-projects')}
            className={`arcade-btn text-xs px-4 py-2 ${activeTab === 'my-projects' ? 'arcade-btn-primary' : 'arcade-btn-secondary'}`}
          >
            MY PROJECTS
          </button>
        </div>
      </div>

      {/* Project Gallery */}
      {activeTab === 'gallery' && (
        <div>
          {/* Filter Bar */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 justify-center">
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

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...projects.filter(p => p.status === 'approved'), ...createdProjects]
              .filter(project => selectedCategory === 'All' || project.category === selectedCategory)
              .map(project => (
              <div key={project.id} className="arcade-dialog p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="arcade-card arcade-card-green text-xs px-2 py-1">
                    APPROVED
                  </span>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="arcade-text arcade-text-green text-xs">{project.points} PTS</span>
                  </div>
                </div>

                <h3 className="arcade-h3 mb-2">{project.title.toUpperCase()}</h3>
                <p className="arcade-text arcade-text-cyan text-xs mb-4">{project.summary.toUpperCase()}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between arcade-text text-xs">
                    <span className="arcade-text-yellow">STUDENT:</span>
                    <span className="arcade-text-cyan">{project.student.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between arcade-text text-xs">
                    <span className="arcade-text-yellow">CATEGORY:</span>
                    <span className="arcade-text-green">{project.category.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between arcade-text text-xs">
                    <span className="arcade-text-yellow">GRADE:</span>
                    <span className="arcade-text-magenta">{project.grade}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {(project.pdf || project.images?.length > 0) && (
                    <div className="arcade-card p-2">
                      <div className="arcade-text arcade-text-yellow text-xs mb-1">ATTACHMENTS:</div>
                      {project.pdf && (
                        <div className="arcade-text arcade-text-green text-xs">📄 {project.pdf.name || 'REPORT.PDF'}</div>
                      )}
                      {project.images?.length > 0 && (
                        <div className="arcade-text arcade-text-cyan text-xs">🖼️ {project.images.length} IMAGE(S)</div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setViewingProject(project)}
                    className="flex-1 arcade-btn arcade-btn-secondary text-xs"
                  >
                    <Eye className="w-3 h-3 inline mr-1" />
                    VIEW
                  </button>
                  <button 
                    onClick={() => {
                      let downloaded = false;
                      
                      // Download PDF
                      if (project.pdf) {
                        const url = URL.createObjectURL(project.pdf);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = project.pdf.name;
                        a.click();
                        downloaded = true;
                      }
                      
                      // Download Images
                      if (project.images?.length > 0) {
                        project.images.forEach((image: File, index: number) => {
                          setTimeout(() => {
                            const url = URL.createObjectURL(image);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = image.name;
                            a.click();
                          }, index * 500); // Delay to avoid browser blocking
                        });
                        downloaded = true;
                      }
                      
                      if (!downloaded) {
                        alert('No files available for download');
                      }
                    }}
                    className="flex-1 arcade-btn arcade-btn-primary text-xs"
                  >
                    <Download className="w-3 h-3 inline mr-1" />
                    DOWNLOAD ALL
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Project */}
      {activeTab === 'submit' && (
        <div className="max-w-2xl mx-auto">
          <div className="arcade-dialog p-6">
            <h2 className="arcade-h2 mb-6 text-center">SUBMIT NEW PROJECT</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">PROJECT TITLE</label>
                <input name="title" className="arcade-input w-full px-3" placeholder="ENTER PROJECT TITLE" required />
              </div>

              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">CATEGORY</label>
                <select name="category" className="arcade-input w-full px-3">
                  <option>RENEWABLE ENERGY</option>
                  <option>WASTE MANAGEMENT</option>
                  <option>BIODIVERSITY</option>
                  <option>WATER CONSERVATION</option>
                  <option>CLIMATE TECH</option>
                </select>
              </div>

              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">SHORT SUMMARY</label>
                <textarea name="summary" className="arcade-input w-full px-3 h-20" placeholder="BRIEF DESCRIPTION OF YOUR PROJECT" required></textarea>
              </div>

              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">FULL REPORT (PDF)</label>
                {selectedPdf ? (
                  <div className="arcade-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="arcade-text arcade-text-green text-xs">{selectedPdf.name}</span>
                      <button 
                        onClick={() => setSelectedPdf(null)}
                        className="arcade-btn arcade-btn-red text-xs px-2 py-1"
                      >
                        REMOVE
                      </button>
                    </div>
                    <div className="arcade-text arcade-text-cyan text-xs">PDF FILE SELECTED</div>
                  </div>
                ) : (
                  <div className="arcade-card p-4 border-2 border-dashed border-cyan-400 cursor-pointer" onClick={() => document.getElementById('pdfInput')?.click()}>
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                      <p className="arcade-text arcade-text-cyan text-xs">CLICK TO UPLOAD PDF</p>
                    </div>
                  </div>
                )}
                <input 
                  id="pdfInput" 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedPdf(file);
                    }
                  }}
                />
              </div>

              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">IMAGES (OPTIONAL)</label>
                {selectedImages.length > 0 ? (
                  <div className="arcade-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="arcade-text arcade-text-yellow text-xs">{selectedImages.length} IMAGE(S) SELECTED</span>
                      <button 
                        onClick={() => setSelectedImages([])}
                        className="arcade-btn arcade-btn-red text-xs px-2 py-1"
                      >
                        REMOVE ALL
                      </button>
                    </div>
                    <div className="space-y-1">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="arcade-text arcade-text-green text-xs">
                          {file.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="arcade-card p-4 border-2 border-dashed border-yellow-400 cursor-pointer" onClick={() => document.getElementById('imageInput')?.click()}>
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <p className="arcade-text arcade-text-yellow text-xs">CLICK TO UPLOAD IMAGES</p>
                    </div>
                  </div>
                )}
                <input 
                  id="imageInput" 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      setSelectedImages(Array.from(files));
                    }
                  }}
                />
              </div>

              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">VIDEO LINK (OPTIONAL)</label>
                <input className="arcade-input w-full px-3" placeholder="YOUTUBE/DRIVE LINK" />
              </div>

              <button 
                type="submit" 
                onClick={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget.form!);
                  if (user) {
                    const newProject = {
                      id: Date.now(),
                      title: formData.get('title') as string,
                      category: formData.get('category') as string,
                      summary: formData.get('summary') as string,
                      student: user.name,
                      status: 'approved',
                      points: 0,
                      date: new Date().toISOString().split('T')[0],
                      grade: '10-A',
                      pdf: selectedPdf,
                      images: selectedImages
                    };
                    setCreatedProjects([...createdProjects, newProject]);
                    e.currentTarget.form?.reset();
                    setSelectedPdf(null);
                    setSelectedImages([]);
                    alert('Project created successfully!');
                  }
                }}
                className="w-full arcade-btn arcade-btn-primary"
              >
                SUBMIT PROJECT
              </button>
            </form>
          </div>
        </div>
      )}

      {/* My Projects */}
      {activeTab === 'my-projects' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...projectSubmissions.filter(project => project.studentName === user?.name), ...createdProjects.filter(project => project.student === user?.name)].map(project => (
              <div key={project.id} className="arcade-dialog p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className={`arcade-card text-xs px-2 py-1 ${
                    project.status === 'approved' ? 'arcade-card-green' : 
                    project.status === 'pending' ? 'arcade-card-yellow' : 'arcade-card-red'
                  }`}>
                    {project.status.toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-1">
                    {project.status === 'approved' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-400" />
                    )}
                    <span className="arcade-text arcade-text-cyan text-xs">
                      {project.status === 'pending' ? 'PENDING' : 'APPROVED'}
                    </span>
                  </div>
                </div>

                <h3 className="arcade-h3 mb-2">{project.title.toUpperCase()}</h3>
                <p className="arcade-text arcade-text-cyan text-xs mb-4">{project.summary.toUpperCase()}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between arcade-text text-xs">
                    <span className="arcade-text-yellow">CATEGORY:</span>
                    <span className="arcade-text-green">{project.category.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between arcade-text text-xs">
                    <span className="arcade-text-yellow">SUBMITTED:</span>
                    <span className="arcade-text-magenta">{project.submittedAt ? project.submittedAt.toLocaleDateString() : project.date}</span>
                  </div>
                  {(project.pdf || project.images?.length > 0) && (
                    <div className="arcade-card p-2">
                      <div className="arcade-text arcade-text-yellow text-xs mb-1">FILES:</div>
                      {project.pdf && (
                        <div className="arcade-text arcade-text-green text-xs">📄 PDF REPORT</div>
                      )}
                      {project.images?.length > 0 && (
                        <div className="arcade-text arcade-text-cyan text-xs">🖼️ {project.images.length} IMAGE(S)</div>
                      )}
                    </div>
                  )}
                </div>

                {createdProjects.some(cp => cp.id === project.id) && (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setEditingProject(project)}
                      className="flex-1 arcade-btn arcade-btn-secondary text-xs"
                    >
                      EDIT
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('DELETE THIS PROJECT?')) {
                          setCreatedProjects(createdProjects.filter(p => p.id !== project.id));
                        }
                      }}
                      className="flex-1 arcade-btn arcade-btn-red text-xs"
                    >
                      DELETE
                    </button>
                  </div>
                )}
              </div>
            ))}
            {[...projectSubmissions.filter(project => project.studentName === user?.name), ...createdProjects.filter(project => project.student === user?.name)].length === 0 && (
              <div className="col-span-2 text-center arcade-dialog p-8">
                <Upload className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                <h3 className="arcade-h3 mb-2">NO PROJECTS SUBMITTED</h3>
                <p className="arcade-text arcade-text-cyan">SUBMIT YOUR FIRST PROJECT TO GET STARTED</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setEditingProject(null)}>
          <div className="arcade-dialog p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="arcade-h3 mb-4 text-center">EDIT PROJECT</h3>
            
            <form className="space-y-4">
              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">PROJECT TITLE</label>
                <input 
                  defaultValue={editingProject.title}
                  name="title" 
                  className="arcade-input w-full px-3" 
                  required 
                />
              </div>

              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">CATEGORY</label>
                <select defaultValue={editingProject.category} name="category" className="arcade-input w-full px-3">
                  <option>RENEWABLE ENERGY</option>
                  <option>WASTE MANAGEMENT</option>
                  <option>BIODIVERSITY</option>
                  <option>WATER CONSERVATION</option>
                  <option>CLIMATE TECH</option>
                </select>
              </div>

              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">SHORT SUMMARY</label>
                <textarea 
                  defaultValue={editingProject.summary}
                  name="summary" 
                  className="arcade-input w-full px-3 h-20" 
                  required
                ></textarea>
              </div>

              <div className="flex space-x-2">
                <button 
                  type="submit" 
                  onClick={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget.form!);
                    const updatedProject = {
                      ...editingProject,
                      title: formData.get('title') as string,
                      category: formData.get('category') as string,
                      summary: formData.get('summary') as string
                    };
                    setCreatedProjects(createdProjects.map(p => 
                      p.id === editingProject.id ? updatedProject : p
                    ));
                    setEditingProject(null);
                  }}
                  className="flex-1 arcade-btn arcade-btn-primary"
                >
                  UPDATE PROJECT
                </button>
                <button 
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="flex-1 arcade-btn arcade-btn-secondary"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Project Modal */}
      {viewingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setViewingProject(null)}>
          <div className="arcade-dialog p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="arcade-h3 mb-4 text-center">{viewingProject.title.toUpperCase()}</h3>
            
            <div className="space-y-4">
              <div className="arcade-card p-4">
                <div className="arcade-text arcade-text-yellow text-xs mb-2">SUMMARY:</div>
                <div className="arcade-text arcade-text-cyan text-xs">{viewingProject.summary.toUpperCase()}</div>
              </div>
              
              <div className="arcade-card p-4">
                <div className="arcade-text arcade-text-yellow text-xs mb-2">CATEGORY:</div>
                <div className="arcade-text arcade-text-green text-xs">{viewingProject.category.toUpperCase()}</div>
              </div>
              
              {viewingProject.pdf && (
                <div className="arcade-card p-4">
                  <div className="arcade-text arcade-text-yellow text-xs mb-2">PDF REPORT:</div>
                  <div className="arcade-text arcade-text-green text-xs mb-2">📄 {viewingProject.pdf.name}</div>
                  <button 
                    onClick={() => {
                      const url = URL.createObjectURL(viewingProject.pdf);
                      window.open(url, '_blank');
                    }}
                    className="arcade-btn arcade-btn-primary text-xs"
                  >
                    OPEN PDF
                  </button>
                </div>
              )}
              
              {viewingProject.images?.length > 0 && (
                <div className="arcade-card p-4">
                  <div className="arcade-text arcade-text-yellow text-xs mb-2">IMAGES ({viewingProject.images.length}):</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {viewingProject.images.map((image: File, index: number) => (
                      <div key={index} className="border-2 border-white">
                        <img 
                          src={URL.createObjectURL(image)} 
                          alt={`Project image ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <div className="arcade-text arcade-text-cyan text-xs p-1 text-center">{image.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <button 
                onClick={() => setViewingProject(null)}
                className="w-full arcade-btn arcade-btn-secondary"
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