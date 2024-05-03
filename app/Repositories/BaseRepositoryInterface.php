<?php 

namespace App\Repositories;

use Illuminate\Http\Request;

interface BaseRepositoryInterface
{
    public function get();

    public function store();

    public function update();

    public function delete();
}
