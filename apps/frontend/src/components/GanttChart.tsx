import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string | null;
  startDate?: string;
  endDate?: string;
  priority: string;
  order: number;
}

interface GanttChartProps {
  tasks: Task[];
  projectStartDate: string;
  projectEndDate: string | null;
}

export default function GanttChart({ tasks, projectStartDate, projectEndDate }: GanttChartProps) {
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const [tasksByDate, setTasksByDate] = useState<{[key: string]: Task[]}>({});

  // Calculate the date range for the Gantt chart
  useEffect(() => {
    const start = new Date(projectStartDate);
    let end;
    
    if (projectEndDate) {
      end = new Date(projectEndDate);
    } else {
      // If no end date, use current date + 30 days
      end = new Date();
      end.setDate(end.getDate() + 30);
    }

    // Ensure we have the tasks' due dates included in our range
    tasks.forEach(task => {
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        if (dueDate > end) {
          end = dueDate;
        }
      }
    });

    // Generate array of dates between start and end
    const range: Date[] = [];
    const current = new Date(start);
    
    while (current <= end) {
      range.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    setDateRange(range);
  }, [projectStartDate, projectEndDate, tasks]);

  // Group tasks by date
  useEffect(() => {
    const taskMap: {[key: string]: Task[]} = {};
    
    dateRange.forEach(date => {
      const dateStr = date.toISOString().split('T')[0];
      taskMap[dateStr] = tasks.filter(task => {
        if (task.dueDate) {
          const dueDate = task.dueDate.split('T')[0];
          return dueDate === dateStr;
        }
        return false;
      });
    });
    
    setTasksByDate(taskMap);
  }, [dateRange, tasks]);

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get status color class
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-blue-500';
      case 'inProgress':
        return 'bg-purple-500';
      case 'review':
        return 'bg-amber-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Show only every 7th date label to avoid overcrowding
  const showDateLabel = (index: number) => index % 7 === 0;

  return (
    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-xl overflow-x-auto">
      <h2 className="text-xl font-semibold text-white mb-4">Project Timeline</h2>
      
      <div className="min-w-max">
        {/* Date headers */}
        <div className="flex border-b border-white/10 pb-2">
          <div className="w-40 flex-shrink-0"></div>
          {dateRange.map((date, index) => (
            <div key={date.toISOString()} className="w-10 flex-shrink-0 text-xs text-center">
              {showDateLabel(index) && (
                <div className="text-blue-300 -rotate-45 origin-left transform translate-y-2 whitespace-nowrap">
                  {formatDate(date)}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Tasks rows */}
        <div className="mt-6">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center mb-3 group">
              <div className="w-40 flex-shrink-0 pr-4 truncate">
                <div className="text-white font-medium">{task.title}</div>
                <div className="text-xs text-blue-300">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                </div>
              </div>
              
              <div className="flex flex-grow">
                {dateRange.map((date, index) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const isTaskDueDate = task.dueDate && task.dueDate.split('T')[0] === dateStr;
                  
                  return (
                    <div
                      key={`${task.id}-${dateStr}`}
                      className={`w-10 h-6 flex-shrink-0 border-r border-t border-b border-white/5 group-hover:bg-white/5 ${
                        isTaskDueDate ? getStatusColor(task.status) : ''
                      }`}
                    >
                      {isTaskDueDate && (
                        <div className="h-full w-full flex items-center justify-center">
                          <span className="animate-ping absolute h-2 w-2 rounded-full bg-white"></span>
                          <span className="relative rounded-full h-1.5 w-1.5 bg-white"></span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {tasks.length === 0 && (
        <div className="text-center py-8 text-blue-300">
          No tasks available for timeline view
        </div>
      )}
    </div>
  );
}