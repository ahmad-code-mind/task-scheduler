<?php

namespace App\Repositories\Task;

use App\Models\Task;
use App\Repositories\Task\TaskRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

        $tasks->where('user_id', $this->request->user_id);

        if ($this->request->task_id) {
            $task = $this->task->find($this->request->task_id);
            return $task;
        }

        if ($this->request->search) {
            $tasks->where('title', 'LIKE', '%' . $this->request->search . '%');
        }
    
        if ($this->request->filter && $this->request->filter !== 'all') {
            $tasks->where('priority', $this->request->filter);
        }

        $tasks->orderBy('priority', 'desc');

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
        $data = $this->request->all();
        $data['user_id'] = $this->request->user_id;
        return $this->task->create($data);
    }

    public function update()
    {
        $data = $this->request->all();
        $task = $this->task->find($data['id']);
        if ($task) {
            $task->update($data);
        }
        return null;
    }

    public function delete()
    {
        $data = $this->request->all();
        $task = $this->task->find($data['id']);
        if ($task) {
            $task->delete();
            return true;
        }
        return false;
    }
}
