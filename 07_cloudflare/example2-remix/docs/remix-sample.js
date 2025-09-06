// Remix - optimistic UI with built-in support
export default function TaskList() {
    const { tasks } = useLoaderData<typeof loader>();
    const fetcher = useFetcher();
    
    // Optimistically show the new task state
    const optimisticTasks = tasks.map(task => {
      if (task.id === fetcher.formData?.get('id')) {
        return { ...task, completed: true };
      }
      return task;
    });
  
    return (
      <ul>
        {optimisticTasks.map(task => (
          <li key={task.id}>
            <fetcher.Form method="post">
              <input type="hidden" name="id" value={task.id} />
              <button 
                name="intent" 
                value="complete"
                className={task.completed ? 'completed' : ''}
              >
                {task.title}
              </button>
            </fetcher.Form>
          </li>
        ))}
      </ul>
    );
  }