<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->safe()->except(['logo']));

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        if ($request->hasFile('logo')) {
            if ($user->logo_marca_agua) {
                \Illuminate\Support\Facades\Storage::delete($user->logo_marca_agua);
            }
            
            $logoFile = $request->file('logo');
            // Increase memory limit in case they upload a huge logo
            ini_set('memory_limit', '512M');
            
            $image = \Intervention\Image\Laravel\Facades\Image::decode($logoFile)
                ->scaleDown(width: 300); // 300px width max for logos
                
            $encoded = $image->encodeUsingFileExtension($logoFile->getClientOriginalExtension());
            $path = 'logos/' . \Illuminate\Support\Str::random(40) . '.' . $logoFile->getClientOriginalExtension();
            \Illuminate\Support\Facades\Storage::put($path, (string) $encoded);
            
            $user->logo_marca_agua = $path;
        }

        $user->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Profile updated.')]);

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
