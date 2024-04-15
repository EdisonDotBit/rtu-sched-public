<?php

namespace App\Http\Controllers;

use App\Models\Feedbacks;
use Illuminate\Http\Request;

class Feedback extends Controller
{
    public function all()
    {
        $fb = Feedbacks::all();
        return $fb;
    }
    public function add(Request $request)
    {
        $fb = new Feedbacks();
        $fb->name = $request->input('name', 'Uknown');
        $fb->message = $request->input('message');
        $fb->rating = $request->input('rating');

        try {
            $fb->save();
            return response()->json([
                'status' => 200,
                'messages' => 'successfully added feed',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 400,
                'error' => $e,
            ], 400);
        }
    }
}
