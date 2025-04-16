import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string | null;
  priority: string;
  order: number;
}

interface ColumnProps {
  title: string;
  tasks: Task[];
  color: string;
  id: string;
}

const TaskColumn = ({ title, tasks, color, id }: ColumnProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
        <span className={`inline-block w-3 h-3 ${color} rounded-full mr-2`}></span>
        {title}
      </h3>
      <Droppable droppableId={id}>
        {(provided) => (
          <div 
            className="space-y-3 min-h-[200px]" 
            ref={provided.innerRef} 
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <h4 className="font-medium text-white">{task.title}</h4>
                    <p className="text-sm text-blue-200 mt-1 line-clamp-2">{task.description}</p>
                    {task.dueDate && (
                      <div className="mt-2 text-xs text-blue-300">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, destination: string) => void;
}

export default function KanbanBoard({ tasks, onTaskMove }: KanbanBoardProps) {
  const [taskItems, setTaskItems] = useState(tasks);

  const columns = {
    todo: {
      id: 'todo',
      title: 'To Do',
      color: 'bg-blue-400',
      tasks: taskItems.filter(task => task.status === 'todo')
    },
    inProgress: {
      id: 'inProgress',
      title: 'In Progress',
      color: 'bg-purple-400',
      tasks: taskItems.filter(task => task.status === 'inProgress')
    },
    review: {
      id: 'review',
      title: 'In Review',
      color: 'bg-amber-400',
      tasks: taskItems.filter(task => task.status === 'review')
    },
    completed: {
      id: 'completed',
      title: 'Completed',
      color: 'bg-green-400',
      tasks: taskItems.filter(task => task.status === 'completed')
    }
  };

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item is dropped in its original place, do nothing
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Find the task that was dragged
    const draggedTask = taskItems.find(task => task.id === draggableId);
    if (!draggedTask) return;

    // Update the task's status
    const updatedTasks = taskItems.map(task => {
      if (task.id === draggableId) {
        return { ...task, status: destination.droppableId };
      }
      return task;
    });

    // Update UI
    setTaskItems(updatedTasks);
    
    // Notify parent component
    onTaskMove(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.values(columns).map(column => (
          <TaskColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={column.tasks}
            color={column.color}
          />
        ))}
      </div>
    </DragDropContext>
  );
}