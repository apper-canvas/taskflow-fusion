import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const MainFeature = ({ boardId }) => {
  // Get icons
  const PlusIcon = getIcon('Plus');
  const XIcon = getIcon('X');
  const EditIcon = getIcon('Edit2');
  const TrashIcon = getIcon('Trash');
  const MoreHorizontalIcon = getIcon('MoreHorizontal');
  const ClipboardIcon = getIcon('Clipboard');
  const AlertCircleIcon = getIcon('AlertCircle');
  const ChevronDownIcon = getIcon('ChevronDown');
  const CheckIcon = getIcon('Check');
  
  // State for board data
  const [lists, setLists] = useState(() => {
    const savedLists = localStorage.getItem(`taskflow-lists-${boardId}`);
    if (savedLists) return JSON.parse(savedLists);
    
    // Default lists if none saved
    return [
      {
        id: 'list-1',
        title: 'To Do',
        cards: [
          { id: 'card-1', title: 'Create project plan', description: 'Outline tasks and timeline', labels: ['Design'] },
          { id: 'card-2', title: 'Design wireframes', description: 'Create low-fidelity mockups', labels: ['Design', 'UX'] }
        ]
      },
      {
        id: 'list-2',
        title: 'In Progress',
        cards: [
          { id: 'card-3', title: 'Set up development environment', description: 'Install all necessary tools and dependencies', labels: ['Development'] }
        ]
      },
      {
        id: 'list-3',
        title: 'Done',
        cards: [
          { id: 'card-4', title: 'Define project scope', description: 'Document requirements and deliverables', labels: ['Planning'] }
        ]
      }
    ];
  });
  
  // UI states
  const [newListTitle, setNewListTitle] = useState('');
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [draggingCard, setDraggingCard] = useState(null);
  const [draggingList, setDraggingList] = useState(null);
  const [newCardData, setNewCardData] = useState({ listId: null, title: '', description: '' });
  const [availableLabels] = useState([
    { id: 'label-1', name: 'Design', color: 'bg-blue-500' },
    { id: 'label-2', name: 'Development', color: 'bg-green-500' },
    { id: 'label-3', name: 'Planning', color: 'bg-purple-500' },
    { id: 'label-4', name: 'UX', color: 'bg-yellow-500' },
    { id: 'label-5', name: 'Bug', color: 'bg-red-500' },
  ]);
  const [selectedLabels, setSelectedLabels] = useState([]);
  
  // Save lists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`taskflow-lists-${boardId}`, JSON.stringify(lists));
  }, [lists, boardId]);
  
  // Add a new list
  const handleAddList = (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) {
      toast.error('Please enter a list title');
      return;
    }
    
    const newList = {
      id: `list-${Date.now()}`,
      title: newListTitle,
      cards: []
    };
    
    setLists([...lists, newList]);
    setNewListTitle('');
    setShowNewListForm(false);
    toast.success('New list added!');
  };
  
  // Handle card drag start
  const handleDragStart = (cardId, listId) => {
    setDraggingCard({ cardId, listId });
  };
  
  // Handle dropping a card on a list
  const handleDrop = (targetListId) => {
    if (!draggingCard) return;
    
    const { cardId, listId: sourceListId } = draggingCard;
    if (sourceListId === targetListId) {
      setDraggingCard(null);
      return;
    }
    
    const sourceList = lists.find(list => list.id === sourceListId);
    const card = sourceList.cards.find(card => card.id === cardId);
    
    // Create new lists array with the card moved
    const newLists = lists.map(list => {
      if (list.id === sourceListId) {
        return {
          ...list,
          cards: list.cards.filter(c => c.id !== cardId)
        };
      }
      if (list.id === targetListId) {
        return {
          ...list,
          cards: [...list.cards, card]
        };
      }
      return list;
    });
    
    setLists(newLists);
    setDraggingCard(null);
    toast.info(`Card moved to ${lists.find(list => list.id === targetListId).title}`);
  };
  
  // Show new card form
  const showAddCardForm = (listId) => {
    setNewCardData({ listId, title: '', description: '' });
    setSelectedLabels([]);
  };
  
  // Cancel adding a new card
  const cancelAddCard = () => {
    setNewCardData({ listId: null, title: '', description: '' });
    setSelectedLabels([]);
  };
  
  // Add a new card to a list
  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newCardData.title.trim()) {
      toast.error('Please enter a card title');
      return;
    }
    
    const newCard = {
      id: `card-${Date.now()}`,
      title: newCardData.title,
      description: newCardData.description,
      labels: selectedLabels.map(label => label.name)
    };
    
    const updatedLists = lists.map(list => {
      if (list.id === newCardData.listId) {
        return {
          ...list,
          cards: [...list.cards, newCard]
        };
      }
      return list;
    });
    
    setLists(updatedLists);
    cancelAddCard();
    toast.success('New card added!');
  };
  
  // Toggle a label selection
  const toggleLabel = (label) => {
    if (selectedLabels.find(l => l.id === label.id)) {
      setSelectedLabels(selectedLabels.filter(l => l.id !== label.id));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };
  
  // Open card editor modal
  const openCardEditor = (card, listId) => {
    const cardLabels = availableLabels.filter(label => 
      card.labels && card.labels.includes(label.name)
    );
    
    setEditingCard({
      ...card,
      listId,
      selectedLabels: cardLabels
    });
    setSelectedLabels(cardLabels);
  };
  
  // Update an existing card
  const updateCard = (e) => {
    e.preventDefault();
    
    if (!editingCard.title.trim()) {
      toast.error('Card title cannot be empty');
      return;
    }
    
    const updatedLists = lists.map(list => {
      if (list.id === editingCard.listId) {
        return {
          ...list,
          cards: list.cards.map(card => 
            card.id === editingCard.id
              ? { 
                  ...card, 
                  title: editingCard.title, 
                  description: editingCard.description,
                  labels: selectedLabels.map(label => label.name)
                }
              : card
          )
        };
      }
      return list;
    });
    
    setLists(updatedLists);
    setEditingCard(null);
    toast.success('Card updated successfully');
  };
  
  // Delete a card
  const deleteCard = () => {
    if (!editingCard) return;
    
    const updatedLists = lists.map(list => {
      if (list.id === editingCard.listId) {
        return {
          ...list,
          cards: list.cards.filter(card => card.id !== editingCard.id)
        };
      }
      return list;
    });
    
    setLists(updatedLists);
    setEditingCard(null);
    toast.success('Card deleted');
  };
  
  // Delete a list
  const deleteList = (listId) => {
    setLists(lists.filter(list => list.id !== listId));
    toast.success('List deleted');
  };
  
  return (
    <div className="container mx-auto px-2 sm:px-4">
      <div className="board-container">
        {/* Render all lists */}
        {lists.map((list, index) => (
          <div 
            key={list.id}
            className="list-column"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={() => handleDrop(list.id)}
          >
            {/* List header */}
            <div className="p-3 flex items-center justify-between border-b border-surface-200 dark:border-surface-700 bg-surface-200/80 dark:bg-surface-700/80">
              <h3 className="font-semibold text-base truncate">{list.title}</h3>
              <div className="flex items-center">
                <div className="relative">
                  <button className="p-1 rounded hover:bg-surface-300 dark:hover:bg-surface-600">
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </button>
                  <div className="hidden absolute right-0 mt-1 z-10 w-40 bg-white dark:bg-surface-800 shadow-lg rounded-lg border border-surface-200 dark:border-surface-700">
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-surface-100 dark:hover:bg-surface-700 flex items-center">
                      <EditIcon className="h-3.5 w-3.5 mr-2" />
                      Edit list
                    </button>
                    <button 
                      onClick={() => deleteList(list.id)}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-surface-100 dark:hover:bg-surface-700 flex items-center"
                    >
                      <TrashIcon className="h-3.5 w-3.5 mr-2" />
                      Delete list
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cards container */}
            <div className="p-2 overflow-y-auto flex-grow max-h-[calc(100vh-20rem)]">
              {list.cards.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-24 text-surface-400 dark:text-surface-500 text-sm">
                  <ClipboardIcon className="h-6 w-6 mb-2" />
                  <p>No cards yet</p>
                </div>
              ) : (
                list.cards.map(card => (
                  <div
                    key={card.id}
                    className="task-card"
                    draggable
                    onDragStart={() => handleDragStart(card.id, list.id)}
                    onClick={() => openCardEditor(card, list.id)}
                  >
                    {/* Card labels */}
                    {card.labels && card.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {card.labels.map(labelName => {
                          const label = availableLabels.find(l => l.name === labelName);
                          return label ? (
                            <span 
                              key={labelName}
                              className={`${label.color} px-2 py-0.5 rounded-full text-white text-xs font-medium`}
                            >
                              {labelName}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                    
                    <h4 className="font-medium text-sm mb-1">{card.title}</h4>
                    
                    {card.description && (
                      <p className="text-xs text-surface-600 dark:text-surface-400 line-clamp-2">
                        {card.description}
                      </p>
                    )}
                  </div>
                ))
              )}
              
              {/* New card form */}
              {newCardData.listId === list.id ? (
                <div className="mt-2 bg-white dark:bg-surface-700 p-3 rounded-lg shadow-sm border border-surface-200 dark:border-surface-600">
                  <form onSubmit={handleAddCard}>
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Card title"
                        className="input"
                        value={newCardData.title}
                        onChange={(e) => setNewCardData({...newCardData, title: e.target.value})}
                        autoFocus
                      />
                    </div>
                    
                    <div className="mb-3">
                      <textarea
                        placeholder="Description (optional)"
                        className="input min-h-[60px]"
                        value={newCardData.description}
                        onChange={(e) => setNewCardData({...newCardData, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">Labels</div>
                      <div className="flex flex-wrap gap-1">
                        {availableLabels.map(label => (
                          <button
                            key={label.id}
                            type="button"
                            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
                              selectedLabels.find(l => l.id === label.id)
                                ? `${label.color} text-white`
                                : 'bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-300'
                            }`}
                            onClick={() => toggleLabel(label)}
                          >
                            {selectedLabels.find(l => l.id === label.id) && (
                              <CheckIcon className="h-3 w-3 mr-1" />
                            )}
                            {label.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={cancelAddCard}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                      >
                        Add Card
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <button
                  onClick={() => showAddCardForm(list.id)}
                  className="w-full mt-2 flex items-center justify-center py-2 px-3 text-sm text-surface-600 dark:text-surface-400 bg-surface-50/80 dark:bg-surface-800/50 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg border border-dashed border-surface-300 dark:border-surface-600 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add a card
                </button>
              )}
            </div>
          </div>
        ))}
        
        {/* Add new list */}
        <div className="list-column bg-surface-50/50 dark:bg-surface-800/50 border-dashed">
          {showNewListForm ? (
            <div className="p-3">
              <form onSubmit={handleAddList}>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Enter list title"
                    className="input"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="flex items-center">
                  <button
                    type="submit"
                    className="btn btn-primary mr-2"
                  >
                    Add List
                  </button>
                  <button
                    type="button"
                    className="p-2 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
                    onClick={() => setShowNewListForm(false)}
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button
              onClick={() => setShowNewListForm(true)}
              className="flex items-center justify-center w-full h-full py-6 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700/50 transition-colors rounded-xl"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              <span className="font-medium">Add another list</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Card Edit Modal */}
      <AnimatePresence>
        {editingCard && (
          <motion.div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditingCard(null)}
          >
            <motion.div
              className="bg-white dark:bg-surface-800 rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Edit Card</h3>
                  <button
                    onClick={() => setEditingCard(null)}
                    className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={updateCard}>
                  <div className="mb-4">
                    <label className="input-label">Title</label>
                    <input
                      type="text"
                      className="input"
                      value={editingCard.title}
                      onChange={(e) => setEditingCard({...editingCard, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="input-label">Description</label>
                    <textarea
                      className="input min-h-[100px]"
                      value={editingCard.description || ''}
                      onChange={(e) => setEditingCard({...editingCard, description: e.target.value})}
                      placeholder="Add a more detailed description..."
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="input-label">Labels</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {availableLabels.map(label => (
                        <button
                          key={label.id}
                          type="button"
                          className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${
                            selectedLabels.find(l => l.id === label.id)
                              ? `${label.color} text-white`
                              : 'bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-300'
                          }`}
                          onClick={() => toggleLabel(label)}
                        >
                          {selectedLabels.find(l => l.id === label.id) && (
                            <CheckIcon className="h-3.5 w-3.5 mr-1.5" />
                          )}
                          {label.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={deleteCard}
                      className="btn bg-red-500 hover:bg-red-600 text-white focus:ring-red-500"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                    
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingCard(null)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Empty State for no lists */}
      {lists.length === 0 && !showNewListForm && (
        <div className="flex flex-col items-center justify-center h-64 text-center px-4">
          <div className="mb-4 text-surface-400 dark:text-surface-500">
            <AlertCircleIcon className="h-16 w-16 mx-auto mb-2" />
            <h3 className="text-xl font-semibold text-surface-700 dark:text-surface-300">No Lists Yet</h3>
          </div>
          <p className="text-surface-600 dark:text-surface-400 max-w-md mb-6">
            Create your first list to start organizing your tasks. Lists can represent stages of work like "To Do", "In Progress", and "Done".
          </p>
          <button
            onClick={() => setShowNewListForm(true)}
            className="btn btn-primary"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Your First List
          </button>
        </div>
      )}
    </div>
  );
};

export default MainFeature;