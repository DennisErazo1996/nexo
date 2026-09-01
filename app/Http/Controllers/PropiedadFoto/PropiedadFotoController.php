<?php

namespace App\Http\Controllers\PropiedadFoto;

use App\Actions\PropiedadFoto\ProcesarFoto;
use App\Http\Controllers\Controller;
use App\Http\Requests\PropiedadFoto\StoreFotoRequest;
use App\Models\Propiedad;
use App\Models\PropiedadFoto;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PropiedadFotoController extends Controller
{
    /**
     * Add more fotos to an existing propiedad.
     */
    public function store(StoreFotoRequest $request, Propiedad $propiedad, ProcesarFoto $procesarFoto): RedirectResponse
    {
        $siguienteOrden = $propiedad->fotos()->max('orden') + 1;

        foreach ($request->file('fotos', []) as $index => $foto) {
            $rutas = $procesarFoto->handle($foto, $propiedad->id);

            $propiedad->fotos()->create([...$rutas, 'orden' => $siguienteOrden + $index]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Fotos agregadas.')]);

        return to_route('propiedades.show', $propiedad);
    }

    /**
     * Remove a foto from a propiedad, deleting both files from disk.
     */
    public function destroy(Propiedad $propiedad, PropiedadFoto $foto): RedirectResponse
    {
        if (auth()->user()?->cannot('update', $propiedad)) {
            throw new AuthorizationException;
        }

        abort_unless($foto->propiedad_id === $propiedad->id, 404);

        Storage::disk('public')->delete([
            $foto->rutaOriginal(),
            $foto->rutaMarcaAgua(),
        ]);

        $foto->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Foto eliminada.')]);

        return to_route('propiedades.show', $propiedad);
    }
}
