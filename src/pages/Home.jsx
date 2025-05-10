import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

const Home = ({ darkMode, toggleDarkMode }) => {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardProjectId, setNewBoardProjectId] = useState(null);
  const [expandedProjects, setExpandedProjects] = useState({});
  
  // Initialize projects state
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('taskflow-projects');
    if (savedProjects) return JSON.parse(savedProjects);
    
    // Create default project with default board
    return [
      {
        id: 'project-1',
        title: 'My First Project',
        createdAt: new Date().toISOString(),
        boards: [
          { 
            id: 'board-1',
            title: 'My First Board',
            createdAt: new Date().toISOString(),
            background: 'bg-gradient-to-r from-blue-500 to-purple-600'
          }
        ]
      }
    ];
  });
  
  // Migrate old board data if exists
  useEffect(() => {
    const oldBoards = localStorage.getItem('taskflow-boards');
    const hasProjects = localStorage.getItem('taskflow-projects');
    
    // Only migrate if we have old boards but no projects yet
    if (oldBoards && !hasProjects) {
      const parsedOldBoards = JSON.parse(oldBoards);
      setProjects([{
        id: 'project-1',
        title: 'Migrated Project',
        createdAt: new Date().toISOString(),
        boards: parsedOldBoards
      }]);
      
      // Set first board as active if it exists
      if (parsedOldBoards.length > 0) setActiveBoardId(parsedOldBoards[0].id);
    }
  }, []);
  
  const [activeBoardId, setActiveBoardId] = useState(() => {
    const savedActiveBoard = localStorage.getItem('taskflow-active-board');
    return savedActiveBoard || 'board-1';
  });

  useEffect(() => {
    localStorage.setItem('taskflow-boards', JSON.stringify(boards));
  }, [boards]);

  useEffect(() => {
    localStorage.setItem('taskflow-projects', JSON.stringify(projects));
  }, [projects]);

  const SunIcon = getIcon('Sun');
    
    // Initialize expanded state for all projects
    const initialExpandedState = {};
    projects.forEach(project => {
      // Find which project contains the active board
      const hasActiveBoard = project.boards.some(board => board.id === activeBoardId);
      // Expand the project containing the active board
      initialExpandedState[project.id] = hasActiveBoard;
    });
    
    // Only set on first load if expandedProjects is empty
    if (Object.keys(expandedProjects).length === 0)
      setExpandedProjects(initialExpandedState);
  const MoonIcon = getIcon('Moon');
  const MenuIcon = getIcon('Menu');
  const FolderIcon = getIcon('Folder');
  const XIcon = getIcon('X');
  const PlusIcon = getIcon('Plus');
  const LogOutIcon = getIcon('LogOut');
  const SettingsIcon = getIcon('Settings');
  const BoardIcon = getIcon('Kanban');
  const ChevronDownIcon = getIcon('ChevronDown');
  const ChevronRightIcon = getIcon('ChevronRight');
  const ChevronRightIcon = getIcon('ChevronRight');

  const findActiveBoard = () => {
    for (const project of projects) {
      const board = project.boards.find(board => board.id === activeBoardId);
      if (board) return { project, board };
    }
    
    // Return first board of first project if no active board found
    if (projects.length > 0 && projects[0].boards.length > 0) {
      return { 
        project: projects[0], 
        board: projects[0].boards[0] 
      };
    }
    
    return { project: null, board: null };
  };

  const { project: activeProject, board: activeBoard } = findActiveBoard();

  const addNewProject = (e) => {
    e.preventDefault();
    
    if (!newProjectTitle.trim()) {
      toast.error('Please enter a project title');
      return;
    }
    
    const newProject = {
      id: `project-${Date.now()}`,
      title: newProjectTitle,
      createdAt: new Date().toISOString(),
      boards: []
    };
    
    setProjects([...projects, newProject]);
    setNewProjectTitle('');
    setShowCreateProjectModal(false);
    
    // Expand the new project
    setExpandedProjects({
      ...expandedProjects,
      [newProject.id]: true
    });
    
    toast.success('New project created!', {
      icon: '📁',
    });
  };
    
    if (!newBoardTitle.trim()) {
      toast.error('Please enter a board title');
      return;
    }
    
    if (!newBoardProjectId) {
  };

  const addNewBoard = (e) => {
    e?.preventDefault();
      toast.error('Please select a project');
    if (!newBoardTitle.trim()) {
      toast.error('Please enter a board title');
      return;
    }
    
    if (!newBoardProjectId) {
      toast.error('Please select a project');
      return;
    }

    const newBoard = {
      id: `board-${Date.now()}`,
      title: newBoardTitle,
      createdAt: new Date().toISOString(),
      background: 'bg-gradient-to-r from-green-400 to-cyan-500'
    };

    setBoards([...boards, newBoard]);
      icon: '📋'
    });

    const updatedProjects = projects.map(project => {
    
    toast.success('New board created!', {
    const updatedProjects = projects.map(project => {
      if (project.id === newBoardProjectId) {
        return {
          ...project,
          boards: [...project.boards, newBoard]
        };
      }
      return project;

    
    setActiveBoardId(newBoard.id);
    });
    setNewBoardTitle('');
    setNewBoardProjectId(null);
    setShowCreateBoardModal(false);
  };

  return (

  const toggleProjectExpanded = (projectId) => {
    setExpandedProjects({
      ...expandedProjects,
      ...expandedProjects,
      [projectId]: !expandedProjects[projectId]
    });
  };
      <header className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BoardIcon className="h-7 w-7 text-primary dark:text-primary-light" />
              <h1 className="text-xl sm:text-2xl font-bold ml-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TaskFlow
              </h1>
            </motion.div>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 mr-2"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-surface-600" />
              )}
            </button>
            
            <div className="relative ml-2">
              <button 
                onClick={() => setShowActionMenu(!showActionMenu)}
                className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 relative"
                aria-label="Menu"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
              
              {showActionMenu && (
                <motion.div 
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 z-20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="py-1">
                    <button
                      onClick={addNewBoard}
                      className="flex items-center w-full px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                    >
                      onClick={() => setShowCreateProjectModal(true)}
                      New Board
                      className="flex items-center w-full px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                    >
                    </button>
                    <button
                      onClick={() => {
                        if (projects.length === 0) {
                          toast.error('Create a project first');
                          setShowCreateProjectModal(true);
                          return;
                        }
                        setNewBoardProjectId(projects[0].id);
                        setShowCreateBoardModal(true);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      className="flex items-center w-full px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                    >
                      <SettingsIcon className="h-4 w-4 mr-2" />
                      Settings
                    </button>
                    <button
                      Account Settings
                    >
                      <LogOutIcon className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Board Selection */}
      <div className="border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800">
        <div className="container mx-auto px-4 sm:px-6 py-4">
      <div className="border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 sticky top-16 z-10">
            <div className="flex items-center mb-2 sm:mb-0">
              <button
                className="flex items-center bg-white dark:bg-surface-700 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-600 shadow-sm"
              <div 
                className="flex bg-white dark:bg-surface-700 rounded-lg border border-surface-200 dark:border-surface-600 shadow-sm"
                <span className="font-medium truncate max-w-[150px] sm:max-w-[200px]">
                <div className="flex items-center pl-3 py-1.5 border-r border-surface-200 dark:border-surface-600">
                  <FolderIcon className="h-4 w-4 mr-2 text-primary dark:text-primary-light" />
                  <span className="font-medium truncate max-w-[100px] sm:max-w-[150px]">
                    {activeProject?.title || 'No Project'}
                  </span>
                </div>
                <div className="flex items-center px-3 py-1.5">
                  <BoardIcon className="h-4 w-4 mr-2 text-primary dark:text-primary-light" />
                  <span className="font-medium truncate max-w-[100px] sm:max-w-[150px]">
                    {activeBoard?.title || 'No Board'}
                  </span>
                </div>
              </div>
              <button
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowCreateProjectModal(true)}
                className="btn btn-secondary"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Project
              </button>
                className="btn btn-primary"
                onClick={() => {
                  if (projects.length === 0) {
                    toast.error('Create a project first');
                    setShowCreateProjectModal(true);
                    return;
                  }
                  setNewBoardProjectId(activeProject?.id || projects[0].id);
                  setShowCreateBoardModal(true);
                }}
                <PlusIcon className="h-4 w-4 mr-2" />
                Add New Board
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow bg-surface-100 dark:bg-surface-900">
      {/* Project and Board Navigation */}
      <div className="bg-surface-100 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex overflow-x-auto pb-2">
            {projects.length === 0 ? (
              <div className="text-center w-full py-2 text-surface-500 dark:text-surface-400">
                No projects yet. Create your first project to get started.
              </div>
            ) : (
              <div className="w-full">
                {projects.map(project => (
                  <div key={project.id} className="mb-2">
                    <div 
                      className={`flex items-center px-3 py-2 rounded-lg cursor-pointer ${
                        activeProject?.id === project.id ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-surface-200 dark:hover:bg-surface-800'
                      }`}
                      onClick={() => toggleProjectExpanded(project.id)}
                    >
                      {expandedProjects[project.id] ? (
                        <ChevronDownIcon className="h-4 w-4 mr-2" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4 mr-2" />
                      )}
                      <FolderIcon className="h-4 w-4 mr-2 text-primary dark:text-primary-light" />
                      <span className="font-medium">{project.title}</span>
                      <span className="ml-2 text-xs text-surface-500 dark:text-surface-400">
                        ({project.boards.length} {project.boards.length === 1 ? 'board' : 'boards'})
                      </span>
                    </div>
                    
                    {/* Project's boards */}
                    {expandedProjects[project.id] && (
                      <div className="ml-6 mt-1 space-y-1">
                        {project.boards.length === 0 ? (
                          <div className="text-sm text-surface-500 dark:text-surface-400 py-1 px-3">
                            No boards in this project
                          </div>
                        ) : (
                          project.boards.map(board => (
                            <div 
                              key={board.id}
                              className={`flex items-center px-3 py-1.5 rounded-md cursor-pointer ${
                                activeBoardId === board.id 
                                  ? 'bg-primary text-white' 
                                  : 'hover:bg-surface-200 dark:hover:bg-surface-800'
                              }`}
                              onClick={() => setActiveBoardId(board.id)}
                            >
                              <BoardIcon className={`h-4 w-4 mr-2 ${
                                activeBoardId === board.id ? 'text-white' : 'text-primary dark:text-primary-light'
                              }`} />
                              <span className="text-sm">{board.title}</span>
                            </div>
                          ))
                        )}
                        <button
                          onClick={() => {
                            setNewBoardProjectId(project.id);
                            setShowCreateBoardModal(true);
                          }}
                          className="flex items-center px-3 py-1.5 text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-800 rounded-md w-full"
                        >
                          <PlusIcon className="h-3.5 w-3.5 mr-2" />
                          Add board to this project
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

        <div className="py-6">
          <MainFeature boardId={activeBoardId} />
        <div className="py-4">
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 py-4">
      {/* Create Project Modal */}
      {showCreateProjectModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg max-w-md w-full">
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Create New Project</h3>
                <button
                  onClick={() => setShowCreateProjectModal(false)}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={addNewProject}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter project title"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    autoFocus
                  />
                </div>
                
                <div className="flex justify-end gap-2 mt-5">
                  <button
                    type="button"
                    onClick={() => setShowCreateProjectModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Board Modal */}
      {showCreateBoardModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg max-w-md w-full">
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Create New Board</h3>
                <button
                  onClick={() => setShowCreateBoardModal(false)}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={addNewBoard}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Board Title
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter board title"
                    value={newBoardTitle}
                    onChange={(e) => setNewBoardTitle(e.target.value)}
                    autoFocus
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Project
                  </label>
                  <select
                    className="input"
                    value={newBoardProjectId || ''}
                    onChange={(e) => setNewBoardProjectId(e.target.value)}
                  >
                    <option value="" disabled>Select a project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-end gap-2 mt-5">
                  <button
                    type="button"
                    onClick={() => setShowCreateBoardModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Board
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

        <div className="container mx-auto px-4 sm:px-6 text-center text-sm text-surface-500 dark:text-surface-400">
          <p>TaskFlow - Organize your tasks visually. © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;