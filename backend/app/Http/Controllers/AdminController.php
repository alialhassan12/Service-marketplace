<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateJobStatusRequest;
use App\Models\Job;
use App\Models\Proposal;
use App\Models\User;
use App\Models\ContentPage;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'users_count' => User::count(),
            'jobs_count' => Job::count(),
            'proposals_count' => Proposal::count(),
        ]);
    }

    // ===================== USERS =====================
    public function getUsers(Request $request)
    {
        $query = User::query();

        // Search
        if ($request->has('search')) {
            $s = $request->get('search');
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%$s%")
                    ->orWhere('email', 'like', "%$s%")
                    ->orWhere('id', $s);
            });
        }

        // Filters
        if ($request->has('filter')) {
            $filter = $request->get('filter');

            if ($filter === 'clients') {
                $query->where('role', 'client');
            }

            if ($filter === 'providers') {
                $query->where('role', 'provider');
            }

            if ($filter === 'admins') {
                $query->where('role', 'admin');
            }

            if ($filter === 'pending') {
                $query->where('status', 'Pending Approval');
            }
        }

        $perPage = $request->get('per_page', 5);

        $users = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json($users);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);

        // ✅ Protect admins
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot delete admin user.'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    // ===================== JOBS =====================
    public function getJobs(Request $request)
    {
        $query = Job::with('client');

        // Search by title or location (add more fields if you want)
        if ($request->has('search')) {
            $s = $request->get('search');
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', "%$s%")
                    ->orWhere('location', 'like', "%$s%");
            });
        }

        // Status filter (approved/pending/rejected/closed/open/in_progress/completed etc.)
        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        // Optional future filters (only if you want):
        // if ($request->has('job_type')) $query->where('job_type', $request->get('job_type'));
        // if ($request->has('location')) { ... }
        // if ($request->has('date_range')) { ... }

        $jobs = $query->orderBy('created_at', 'desc')->paginate(5);
        return response()->json($jobs);
    }

    // ===================== VIEW SINGLE JOB =====================
    public function getJob($id)
    {
        $job = Job::with([
            'client:id,name,email',
            'proposals.provider:id,name,email'
        ])->findOrFail($id);

        return response()->json($job);
    }


    public function updateJobStatus(UpdateJobStatusRequest $request, $id)
    {
        $job = Job::findOrFail($id);

        // ✅ Block updates on locked jobs
        if (in_array($job->status, ['closed', 'completed'])) {
            return response()->json([
                'message' => 'Cannot update a closed or completed job'
            ], 403);
        }

        $job->status = $request->get('status');
        $job->save();

        return response()->json([
            'message' => 'Job status updated successfully',
            'job' => $job
        ]);
    }

    public function deleteJob($id)
    {
        $job = Job::findOrFail($id);

        // ✅ Only allow deleting open jobs (you can change rule if you want)
        if ($job->status !== 'open') {
            return response()->json([
                'message' => 'Only open jobs can be deleted'
            ], 403);
        }

        $job->delete();
        return response()->json(['message' => 'Job deleted successfully']);
    }

    // ===================== PROPOSALS =====================
    public function getProposals(Request $request)
    {
        $query = Proposal::with(['job', 'provider']);
        $proposals = $query->orderBy('created_at', 'desc')->paginate(10);
        return response()->json($proposals);
    }

    public function deleteProposal($id)
    {
        $proposal = Proposal::findOrFail($id);
        $proposal->delete();
        return response()->json(['message' => 'Proposal deleted successfully']);
    }

    // ===================== CONTENT =====================
    public function getContent($key)
    {
        $page = ContentPage::where('page_key', $key)->first();
        if (!$page) return response()->json(['message' => 'Content not found'], 404);
        return response()->json($page);
    }

    public function updateContent(Request $request, $key)
    {
        $request->validate([
            'content' => 'required|string',
            'status' => 'required|string',
            'title' => 'sometimes|string'
        ]);

        $page = ContentPage::firstOrCreate(['page_key' => $key]);
        $page->content = $request->get('content');
        $page->status = $request->get('status');
        if ($request->has('title')) $page->title = $request->get('title');
        $page->save();

        return response()->json(['message' => 'Content updated', 'content' => $page]);
    }
}
