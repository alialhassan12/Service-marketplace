<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Exception;
use Illuminate\Http\Request;

class jobsController extends Controller
{
    public function addJob(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string',
                'description' => 'required|string',
                'location' => 'required|string',
                'is_remote' => 'required|boolean',
                'budget' => 'required|numeric',
            ]);

            $job = Job::create([
                'client_id' => $request->user()->id,
                'title' => $request->title,
                'description' => $request->description,
                'location' => $request->location,
                'is_remote' => $request->is_remote,
                'budget' => $request->budget
            ]);
            return response()->json([
                'message' => 'Job added successfully',
                'job' => $job
            ], 200);
        } catch (Exception $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function getJobs(Request $request)
    {
        $jobs = $request->user()->jobs()->get();
        return response()->json([
            'message' => 'Jobs fetched successfully',
            'jobs' => $jobs
        ], 200);
    }
}
