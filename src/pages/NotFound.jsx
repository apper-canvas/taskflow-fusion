import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  const AlertCircleIcon = getIcon('AlertCircle');
  const HomeIcon = getIcon('Home');
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-surface-50 dark:bg-surface-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="mb-6 flex justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0] 
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          >
            <AlertCircleIcon className="h-24 w-24 text-accent" />
          </motion.div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold text-surface-800 dark:text-surface-100 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-lg text-surface-600 dark:text-surface-300 mb-8">
          Oops! It seems the page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/"
          className="btn btn-primary inline-flex items-center px-6 py-3 text-base"
        >
          <HomeIcon className="h-5 w-5 mr-2" />
          Return Home
        </Link>
      </motion.div>
      
      <div className="mt-auto py-6 text-center text-sm text-surface-500">
        <p>TaskFlow © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default NotFound;