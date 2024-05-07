<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Repositories\Task\TaskRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    protected $taskRepository;

    public function __construct(TaskRepositoryInterface $taskRepository)
    {
        $this->taskRepository = $taskRepository;
    }

    public function get(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'task_id' => 'sometimes|exists:tasks,id',
            'per_page' => 'sometimes',
            'page' => 'sometimes',
            'search' => 'sometimes',
        ]);

        if ($validator->fails()) {
            return sendError('Validation Errors', $validator->errors(), 422);
        }

        try {
            $data = $this->taskRepository->get($request);

            return sendSuccess('Data fetched successfully', $data);
        } catch (\Exception $e) {
            return sendError($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'description' => 'required|string',
            'due_date' => 'required|date',
            'priority' => 'required|integer|between:1,3',
        ]);

        if ($validator->fails()) {
            return sendError('Validation Errors', $validator->errors(), 422);
        }

        try {
            $this->taskRepository->store($request);

            return sendSuccess('Task created successfully');
        } catch (\Exception $e) {
            return sendError($e->getMessage());
        }
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:tasks,id',
            'title' => 'required|string',
            'description' => 'required|string',
            'due_date' => 'required|date',
            'priority' => 'required|integer|between:1,3',
        ]);

        if ($validator->fails()) {
            return sendError('Validation Errors', $validator->errors(), 422);
        }

        try {
            $this->taskRepository->update($request);

            return sendSuccess('Task updated successfully');
        } catch (\Exception $e) {
            return sendError($e->getMessage());
        }
    }
    public function delete(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:tasks,id',
        ]);

        if ($validator->fails()) {
            return sendError($validator->errors()->first(), null, 422);
        }

        try {
            $this->taskRepository->delete($request);

            return sendSuccess('Task deleted successfully');
        } catch (\Exception $e) {
            return sendError($e->getMessage());
        }
    }
}
