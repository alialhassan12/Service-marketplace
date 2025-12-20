<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\Proposal;
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
                'location' => 'string',
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

    public function getJob(Request $request, $id){
        try {
            $job = Job::with('proposals.provider')->findOrFail($id);

            if ($job->client_id !== $request->user()->id) {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 403);
            }

            return response()->json([
                'message' => 'Job fetched successfully',
                'job' => $job,
            ], 200);
        } catch (Exception $th) {
            return response()->json([
                'message' => 'Job not found'
            ], 404);
        }
    }

    public function updateJob(Request $request){
        try {
            $request->validate([
                'title' => 'required|string',
                'description' => 'required|string',
                'location' => 'string',
                'is_remote' => 'required|boolean',
                'budget' => 'required|numeric',
            ]);

            $job = Job::findOrFail($request->id);
            $job->title = $request->title;
            $job->description = $request->description;
            $job->location = $request->location;
            $job->is_remote = $request->is_remote;
            $job->budget = $request->budget;
            $job->save();

            return response()->json([
                'message' => 'Job updated successfully',
                'job' => $job
            ], 200);
        } catch (Exception $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function updateJobStatus(Request $request){
        try {
            $request->validate([
                'job_id' => 'required|integer',
                'status' => 'required|string|in:open,in_progress,completed,closed',   
            ]);

            $job = Job::findOrFail($request->job_id);
            if($job->client_id !== $request->user()->id){
                return response()->json([
                    'message' => 'Unauthorized'
                ], 403);
            }

            $job->status = $request->status;
            $job->save();

            return response()->json([
                'message' => 'Job status updated successfully',
                'job' => $job
            ], 200);
        } catch (Exception $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function updateProposalState(Request $request){
        try {
            $request->validate([
                'proposal_id' => 'required|integer',
                'state' => 'required|string',   
            ]);

            $proposal = Proposal::findOrFail($request->proposal_id);
            $proposal->status = $request->state;
            $proposal->save();

            return response()->json([
                'message' => 'Proposal state updated successfully',
                'proposal' => $proposal
            ], 200);
        } catch (Exception $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function getRecomendedJobs(Request $request){
        try {
            $jobs=Job::where('client_id','!=',$request->user()->id)->where('status','open')
                ->inRandomOrder()
                ->limit(4)
                ->get();
            return response()->json([
                'message' => 'Jobs fetched successfully',
                'jobs' => $jobs
            ], 200);
        } catch (Exception $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], 500);
        }
    }
}
