// Astro implementation
---
// src/pages/tasks.astro
import TaskList from '../components/TaskList';
import { getTasks } from '../lib/tasks';

const tasks = await getTasks();

// Handle form submission
if (Astro.request.method === 'POST') {
  const formData = await Astro.request.formData();
  const taskId = formData.get('id');
  await completeTask(taskId);
  return Astro.redirect('/tasks');
}
---

<ul>
  {tasks.map(task => (
    <li>
      <form method="post">
        <input type="hidden" name="id" value={task.id} />
        <button 
          type="submit"
          class:list={[task.completed && 'completed']}
        >
          {task.title}
        </button>
      </form>
    </li>
  ))}
</ul>

<!-- Need client-side JS for optimistic updates -->
<script>
  // Handle form submissions
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Find the button and add completed class immediately
      const button = e.currentTarget.querySelector('button');
      button.classList.add('completed');
      button.disabled = true;
      
      // Submit the form
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
      }).catch(() => {
        // Revert optimistic update on error
        button.classList.remove('completed');
        button.disabled = false;
      });
    });
  });
</script>