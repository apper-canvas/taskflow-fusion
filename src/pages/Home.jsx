import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

const Home = ({ darkMode, toggleDarkMode }) => {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [boards, setBoards] = useState(() => {
    const savedBoards = localStorage.getItem('taskflow-boards');
    return savedBoards ? JSON.parse(savedBoards) : [
      { 
        id: 'board-1',
        title: 'My First Board',
        createdAt: new Date().toISOString(),
        background: 'bg-gradient-to-r from-blue-500 to-purple-600'
      }
    ];
  });
  
  const [activeBoardId, setActiveBoardId] = useState(() => {
    const savedActiveBoard = localStorage.getItem('taskflow-active-board');
    return savedActiveBoard || 'board-1';
  });

  useEffect(() => {
    localStorage.setItem('taskflow-boards', JSON.stringify(boards));
  }, [boards]);
  
  useEffect(() => {
    localStorage.setItem('taskflow-active-board', activeBoardId);
  }, [activeBoardId]);

  const SunIcon = getIcon('Sun');
  const MoonIcon = getIcon('Moon');
  const MenuIcon = getIcon('Menu');
  const PlusIcon = getIcon('Plus');
  const LogOutIcon = getIcon('LogOut');
  const SettingsIcon = getIcon('Settings');
  const BoardIcon = getIcon('Kanban');
  const ChevronDownIcon = getIcon('ChevronDown');

  const addNewBoard = () => {
    const newBoard = {
      id: `board-${Date.now()}`,
      title: `New Board`,
      createdAt: new Date().toISOString(),
      background: 'bg-gradient-to-r from-green-400 to-cyan-500',
    };
    
    setBoards([...boards, newBoard]);
    setActiveBoardId(newBoard.id);
    
    toast.success('New board created!', {
      icon: '📋',
    });
  };

  const activeBoard = boards.find(board => board.id === activeBoardId) || boards[0];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
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
                      <PlusIcon className="h-4 w-4 mr-2" />
                      New Board
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                    >
                      <SettingsIcon className="h-4 w-4 mr-2" />
                      Settings
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="flex items-center mb-2 sm:mb-0">
              <button
                className="flex items-center bg-white dark:bg-surface-700 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-600 shadow-sm"
              >
                <BoardIcon className="h-4 w-4 mr-2 text-primary dark:text-primary-light" />
                <span className="font-medium truncate max-w-[150px] sm:max-w-[200px]">
                  {activeBoard.title}
                </span>
                <ChevronDownIcon className="h-4 w-4 ml-2" />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addNewBoard}
                className="btn btn-primary"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add New Board
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow bg-surface-100 dark:bg-surface-900">
        <div className="py-6">
          <MainFeature boardId={activeBoardId} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 py-4">
        <div className="container mx-auto px-4 sm:px-6 text-center text-sm text-surface-500 dark:text-surface-400">
          <p>TaskFlow - Organize your tasks visually. © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;