<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\ProviderResource;
use App\Models\Job;
use App\Models\Proposal;
use Exception;

class ProviderProfileController extends Controller
{
    public function show(Request $request){
        return new ProviderResource($request->user());
    }

    public function update(Request $request){

        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|nullable|string|min:6|confirmed',
            'phone_number' => 'sometimes|string|max:20',
            'location' => 'sometimes|nullable|string|max:255',
            'profile_picture' => 'sometimes|nullable|mimes:jpeg,jpg,png|max:2048',
            'bio' => 'sometimes|nullable|string|max:255',
            'skills' => 'sometimes|nullable|array'
        ]);

        $user->fill($request->only([
            'name',
            'email',
            'phone_number',
            'location',
            'bio',
            'skills'
        ]));

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        if ($request->hasFile('profile_picture')) {
            $path = $request->file('profile_picture')->store('profile_pictures', 'public');

            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }

            $user->profile_picture = $path;
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ], 200);
    }

    public function browseJobs(Request $request){
        try {
            
            $limit = 10;
            $query = Job::query()->with('client');

            if ($request->filled('title')) {
                $query->where('title', 'like', '%' . $request->title . '%');
            }

            if ($request->boolean('remote')) {
                $query->where('is_remote', true);
            } else {
                if ($request->filled('location')) {
                    $query->where('location', 'like', '%' . $request->location . '%');
                }
            }

            if ($request->filled('priceRange') && is_array($request->priceRange) && count($request->priceRange) === 2) {
                $query->where('budget', '>=', $request->priceRange[0])
                    ->where('budget', '<=', $request->priceRange[1]);
            }

            if ($request->filled('datePosted') && $request->datePosted !== 'any') {
                $date = now();
                switch ($request->datePosted) {
                    case 'today':
                        $query->where('created_at', '>=', $date->subDay());
                        break;
                    case 'week':
                        $query->where('created_at', '>=', $date->subWeek());
                        break;
                    case 'month':
                        $query->where('created_at', '>=', $date->subMonth());
                        break;
                }
            }

            $query->latest();

            $jobs = $query->paginate($limit);

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

    public function submitProposal(Request $request){
        try {
            $request->validate([
                'job_id'=>'required|exists:jobs,id',
                'provider_id'=>'required|exists:users,id',
                'price'=>'required|numeric',
                'description'=>'required|string',
                'status'=>'required|string|in:pending,accepted,declined'
            ]);

            $proposal=new Proposal();
            $proposal->job_id=$request->job_id;
            $proposal->provider_id=$request->provider_id;
            $proposal->price=$request->price;
            $proposal->description=$request->description;
            $proposal->status=$request->status;
            $proposal->save();

            return response()->json([
                'message' => 'Proposal submitted successfully',
                'proposal' => $proposal
            ], 200);
        } catch (Exception $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], 500);
        }
    }
}
