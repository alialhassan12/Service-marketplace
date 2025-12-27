<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\Payment;
use App\Models\Proposal;
use App\Services\StripeService;
use Exception;
use Illuminate\Http\Request;

class jobsController extends Controller
{
    protected $stripeService;
    public function __construct(StripeService $stripeService)
    {
        $this->stripeService = $stripeService;
    }
    
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
                'provider_id' => 'required|integer|exists:users,id',
                'job_id' => 'required|integer|exists:jobs,id',
                'amount' => 'required|numeric|min:1',
                'description' => 'nullable|string',
            ]);
            
            $proposal = Proposal::findOrFail($request->proposal_id);
            $proposal->status = $request->state;
            $proposal->save();
            //create a pending payment record with intent
            if($request->state === 'accepted'){
                $payment=Payment::where('job_id',$request->job_id)->first();
                if(!$payment){
                    // Create a pending payment record
                    Payment::create([
                        'client_id' => auth('sanctum')->id(),
                        'provider_id' => $request->provider_id,
                        'job_id' => $request->job_id,
                        'amount' => $request->amount,
                        'currency' => 'USD',
                        'status' => 'pending',
                        'payment_method' => 'stripe',
                        // 'stripe_payment_intent_id' => $paymentIntent->id,
                        'description' => $request->description,
                        // 'transaction_id' => 'txn_' . $paymentIntent->id,
                    ]);
                }
            }

            return response()->json([
                'message' => 'Proposal state updated successfully',
                'proposal' => $proposal,
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
    public function getClientAcceptedProviders(Request $request){
        try {
            $user_id=$request->user()->id;
            if(!$user_id){
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }
            if($request->user()->role !== 'client'){
                return response()->json([
                    'message' => 'Unauthorized'
                ], 403);
            }
            //get the completed jobs of the client with the accepted provider
            $jobs=Job::with('proposals.provider')
                        ->where('client_id',$user_id)
                        ->whereHas('proposals', function ($query) {
                            $query->where('status', 'accepted');
                        })
                        ->where('status','completed')
                        ->get();
            //get the jobs that have pending payments
            $Jobs=Payment::with('provider','job')
                        ->where('client_id',$user_id)
                        ->where('status','pending')
                        ->get();
            return response()->json([
                'message' => 'Providers fetched successfully',
                'providers' => $Jobs
            ], 200);
        } catch (Exception $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], 500);
        }
    }
}
