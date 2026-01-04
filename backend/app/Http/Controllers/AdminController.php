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

    public function createUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:client,provider,admin',
            'phone_number' => 'nullable|string',
            'location' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'role' => $request->role,
            'status' => 'Active', // Default status
            'phone_number' => $request->phone_number,
            'location' => $request->location,
        ]);

        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
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

    public function getUser($id)
    {
        $user = User::findOrFail($id);
        $stats = [];

        if ($user->role === 'client') {
            $stats['jobs_posted'] = Job::where('client_id', $id)->count();
            // Total spent: Sum of paid payments
            $stats['total_spent'] = \App\Models\Payment::where('client_id', $id)->where('status', 'paid')->sum('amount');
        } elseif ($user->role === 'provider') {
            // Jobs completed: Accepted proposals where job is completed
            $stats['jobs_completed'] = Proposal::where('provider_id', $id)
                ->where('status', 'accepted')
                ->whereHas('job', function($q) {
                    $q->where('status', 'completed');
                })->count();
            
            // Total earned: Sum of paid payments to this provider
            $stats['total_earned'] = \App\Models\Payment::where('provider_id', $id)->where('status', 'paid')->sum('amount');
        }

        return response()->json(array_merge($user->toArray(), $stats));
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

        // Filter by Remote/On-site
        if ($request->has('location')) {
            $loc = $request->get('location');
            if ($loc === 'remote') {
                $query->where('is_remote', true);
            } elseif ($loc === 'onsite') {
                $query->where('is_remote', false);
            }
        }

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

    public function createJob(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('createJob attempt', $request->all());

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'budget' => 'required|numeric|min:0',
            'client_email' => 'required|email|exists:users,email',
            'location' => 'nullable|string',
            'is_remote' => 'boolean'
        ]);

        $client = User::where('email', $request->client_email)->where('role', 'client')->first();

        if (!$client) {
            return response()->json(['message' => 'User found but is not a client role.'], 400);
        }

        $job = Job::create([
            'title' => $request->title,
            'description' => $request->description,
            'budget' => $request->budget,
            'client_id' => $client->id,
            'location' => $request->is_remote ? 'Remote' : $request->location,
            'status' => 'open',
            'is_remote' => $request->is_remote ?? false,
        ]);

        return response()->json(['message' => 'Job created successfully', 'job' => $job], 201);
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
    // ===================== TRANSACTIONS =====================
    public function getTransactions(Request $request)
    {
        $query = \App\Models\Payment::with(['client:id,name,email', 'provider:id,name,email', 'job:id,title']);

        // Search
        if ($request->has('search')) {
            $s = $request->get('search');
            $query->where(function ($q) use ($s) {
                $q->where('transaction_id', 'like', "%$s%")
                    ->orWhereHas('client', function ($q) use ($s) {
                        $q->where('name', 'like', "%$s%");
                    })
                    ->orWhereHas('provider', function ($q) use ($s) {
                        $q->where('name', 'like', "%$s%");
                    });
            });
        }

        // Filters
        if ($request->has('status') && $request->get('status') !== 'All') {
            $query->where('status', $request->get('status'));
        }

        if ($request->has('client_id')) {
            $query->where('client_id', $request->get('client_id'));
        }

        if ($request->has('provider_id')) {
            $query->where('provider_id', $request->get('provider_id'));
        }

        if ($request->has('date_range') && $request->get('date_range') !== 'All') {
            $range = $request->get('date_range');
            $now = now();
            if ($range === 'Last 7 days') {
                $query->where('created_at', '>=', $now->subDays(7));
            } elseif ($range === 'Last 30 days') {
                $query->where('created_at', '>=', $now->subDays(30));
            } elseif ($range === 'Last 90 days') {
                $query->where('created_at', '>=', $now->subDays(90));
            }
        }

        $perPage = $request->get('per_page', 10);
        
        $transactions = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($transactions);
    }

    public function getTransactionStats()
    {
        $totalVolume = \App\Models\Payment::where('status', 'paid')->sum('amount');
        
        // Assuming platform fee is a percentage or calculated. 
        // For now, let's assume a fixed 5% fee for logic or if there is a 'fee' column.
        // Looking at the schema, there is no explicit 'fee' column, so we might need to calculate it.
        // Let's assume 5% platform fee for now as a placeholder logic or derived from amount.
        $totalFees = $totalVolume * 0.05; 
        $totalPayouts = $totalVolume - $totalFees; // Subtract fees to get actual payouts // In a real scenario, this might be (Total - Fees)
        $pendingVolume = \App\Models\Payment::where('status', 'pending')->sum('amount');

        // Calculate delta (example: simple comparison to zero or mock logic for now as we don't have historical snapshots easily without complex queries)
        // For MVP/Admin view, accurate current totals are key. 

        return response()->json([
            'total_volume' => [
                'value' => $totalVolume,
                'delta' => 0, // Implement date-based comparison if needed
                'positive' => true
            ],
            'platform_fees' => [
                'value' => $totalFees,
                'delta' => 0,
                'positive' => true
            ],
            'total_payouts' => [
                'value' => $totalPayouts, // Or Total Volume - Fees
                'delta' => 0,
                'positive' => true
            ],
            'pending_transactions' => [
                'value' => $pendingVolume,
                'delta' => 0,
                'positive' => false
            ]
        ]);
    }

    public function getRevenueChartData()
    {
        // Get last 7 days
        $days = collect(range(6, 0))->map(function ($day) {
            return now()->subDays($day)->format('Y-m-d');
        });

        $data = $days->map(function ($date) {
            $revenue = \App\Models\Payment::whereDate('created_at', $date)
                ->where('status', 'paid')
                ->sum('amount');
            
            return [
                'name' => \Carbon\Carbon::parse($date)->format('M d'), // e.g. "Oct 25"
                'revenue' => $revenue
            ];
        });

        return response()->json($data);
    }

    public function exportTransactions(Request $request)
    {
        $query = \App\Models\Payment::with(['client', 'provider']);

        // Apply same filters as getTransactions
        if ($request->has('search')) {
            $s = $request->get('search');
            $query->where(function ($q) use ($s) {
                $q->where('transaction_id', 'like', "%$s%")
                    ->orWhereHas('client', function ($q) use ($s) {
                        $q->where('name', 'like', "%$s%");
                    })
                    ->orWhereHas('provider', function ($q) use ($s) {
                        $q->where('name', 'like', "%$s%");
                    });
            });
        }
        
         if ($request->has('status') && $request->get('status') !== 'All') {
            $query->where('status', $request->get('status'));
        }

        $payments = $query->orderBy('created_at', 'desc')->get();

        $csvFileName = 'transactions_' . date('Y-m-d_H-i-s') . '.csv';
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$csvFileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() use($payments) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Transaction ID', 'Client', 'Provider', 'Amount', 'Status', 'Date']);

            foreach ($payments as $payment) {
                fputcsv($file, [
                    $payment->id,
                    $payment->transaction_id,
                    $payment->client ? $payment->client->name : 'N/A',
                    $payment->provider ? $payment->provider->name : 'N/A',
                    $payment->amount,
                    $payment->status,
                    $payment->created_at
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
