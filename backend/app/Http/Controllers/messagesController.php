<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class messagesController extends Controller
{
    public function getContacts(Request $request)
    {
        try {
            $user_id = auth('sanctum')->id();

            $contacts = Message::with(['sender', 'receiver'])
                ->where('sender_id', $user_id)
                ->orWhere('receiver_id', $user_id)
                ->latest()
                ->get()
                ->map(function ($message) use ($user_id) {
                    // Extract the contact
                    return $message->sender_id === $user_id ? $message->receiver : $message->sender;
                })
                ->unique('id')
                ->values();

            return response()->json([
                'message' => 'Contacts retrieved successfully',
                'contacts' => $contacts
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to get contacts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getMessages(Request $request, $id)
    {
        try {
            $user_id = auth('sanctum')->id();

            $messages = Message::with(['sender', 'receiver'])
                ->where(function ($query) use ($user_id, $id) {
                    $query->where('sender_id', $user_id)
                        ->where('receiver_id', $id);
                })
                ->orWhere(function ($query) use ($user_id, $id) {
                    $query->where('sender_id', $id)
                        ->where('receiver_id', $user_id);
                })
                ->oldest()
                ->get();

            return response()->json([
                'message' => 'Messages retrieved successfully',
                'messages' => $messages
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to get messages',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function sendMessage(Request $request, $id)
    {
        try {
            $user_id = auth('sanctum')->id();

            $message = Message::create([
                'sender_id' => $user_id,
                'receiver_id' => $id,
                'message' => $request->message,
            ])->load(['sender', 'receiver']);

            return response()->json([
                'feedback' => 'Message sent successfully',
                'message_data' => $message
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to send message',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function addContact(Request $request)
    {
        try {
            $user_id = auth('sanctum')->id();

            $contact = Message::create([
                'sender_id' => $user_id,
                'receiver_id' => $request->receiver_id,
                'message' => 'Hi, I would like to start a conversation.',
            ])->load(['sender', 'receiver']);

            return response()->json([
                'feedback' => 'Contact added successfully',
                'contact_data' => $contact
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to add contact',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
