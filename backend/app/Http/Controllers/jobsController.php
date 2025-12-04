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

    public function getJob(Request $request, $id)
    {
        try {
            $job = Job::findOrFail($id);
            $proposals=$job->proposals()->get();

            if ($job->client_id !== $request->user()->id) {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 403);
            }

            return response()->json([
                'message' => 'Job fetched successfully',
                'job' => $job,
                'proposals'=>$proposals
            ], 200);
        } catch (Exception $th) {
            return response()->json([
                'message' => 'Job not found'
            ], 404);
        }
    }
}
