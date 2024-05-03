<?php

namespace App\Repositories\Task;

use App\Models\Task;
use App\Repositories\Task\TaskRepositoryInterface;
use Illuminate\Http\Request;

class TaskRepository implements TaskRepositoryInterface
{
    protected $request;
    protected $task;

    public function __construct(Request $request, Task $task)
    {
        $this->request = $request;
        $this->task = $task;
    }

    public function get()
    {
        $tasks = $this->task->query();

        if ($this->request->task_id) {
            $task = $this->task->find($this->request->id);
            return $task;
        }

        if ($this->request->search) {
            $tasks->where('name', 'LIKE', '%' . $this->request->search . '%');
        }
    
        if ($this->request->filter && $this->request->filter !== 'all') {
            $tasks->where('priority', $this->request->filter);
        }
    
        if ($this->request->due_date) {
            $tasks->where('due_date', $this->request->due_date);
        }

        $total = $tasks->count();

        if ($this->request->has('page') && $this->request->page > 0) {
            $tasks = $tasks->paginate($this->request->per_page ?? 20);
        } else {
            $tasks = $tasks->get();
        }

        return [
            'total' => $total,
            'tasks' => $tasks,
        ];
    }

    public function store()
    {
        return $this->task->create($data);
    }

    public function update()
    {
        $task = $this->task->find($id);
        if ($task) {
            $task->update($data);
            return $task;
        }
        return null;
    }

    public function delete($id)
    {
        $task = $this->task->find($id);
        if ($task) {
            $task->delete();
            return true;
        }
        return false;
    }
}
