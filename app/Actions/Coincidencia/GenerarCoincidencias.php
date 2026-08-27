<?php

namespace App\Actions\Coincidencia;

use App\Enums\EstadoCoincidencia;
use App\Enums\EstadoPropiedad;
use App\Models\Cliente;
use App\Models\ClienteInteres;
use App\Models\Coincidencia;
use App\Models\EtiquetaInteres;
use App\Models\Propiedad;

class GenerarCoincidencias
{
    /**
     * Find and record matches for a propiedad against all compatible
     * cliente intereses in the same equipo.
     */
    public function paraPropiedad(Propiedad $propiedad): void
    {
        $tipoEtiquetaId = EtiquetaInteres::where('nombre', $propiedad->tipo->value)->value('id');
        $etiquetaIds = $propiedad->etiquetas()->pluck('etiqueta_id');

        if ($tipoEtiquetaId && ! $etiquetaIds->contains($tipoEtiquetaId)) {
            $etiquetaIds->push($tipoEtiquetaId);
        }

        $zona = mb_strtolower(trim($propiedad->zona));

        $intereses = ClienteInteres::query()
            ->whereIn('etiqueta_id', $etiquetaIds)
            ->whereHas('cliente', fn ($query) => $query->where('equipo_id', $propiedad->equipo_id))
            ->where(fn ($query) => $query->whereNull('zona')->orWhereRaw('LOWER(TRIM(zona)) = ?', [$zona]))
            ->where(fn ($query) => $query->whereNull('presupuesto_min')->orWhere('presupuesto_min', '<=', $propiedad->precio))
            ->where(fn ($query) => $query->whereNull('presupuesto_max')->orWhere('presupuesto_max', '>=', $propiedad->precio))
            ->with('cliente')
            ->get();

        foreach ($intereses as $interes) {
            $this->crear($interes->cliente, $propiedad);
        }
    }

    /**
     * Find and record matches for a newly captured cliente interes against
     * all compatible propiedades disponibles in the same equipo.
     */
    public function paraInteres(ClienteInteres $interes): void
    {
        $cliente = $interes->cliente;
        $zona = $interes->zona ? mb_strtolower(trim($interes->zona)) : null;
        $interes->loadMissing('etiqueta');
        $nombreEtiqueta = $interes->etiqueta?->nombre;

        $propiedades = Propiedad::query()
            ->where('equipo_id', $cliente->equipo_id)
            ->where('estado', EstadoPropiedad::Disponible)
            ->where(function ($query) use ($interes, $nombreEtiqueta) {
                $query->whereHas('etiquetas', fn ($q) => $q->where('etiqueta_id', $interes->etiqueta_id));
                if ($nombreEtiqueta) {
                    $query->orWhere('tipo', $nombreEtiqueta);
                }
            })
            ->when($zona, fn ($query, $zona) => $query->whereRaw('LOWER(TRIM(zona)) = ?', [$zona]))
            ->when($interes->presupuesto_min, fn ($query, $min) => $query->where('precio', '>=', $min))
            ->when($interes->presupuesto_max, fn ($query, $max) => $query->where('precio', '<=', $max))
            ->get();

        foreach ($propiedades as $propiedad) {
            $this->crear($cliente, $propiedad);
        }
    }

    /**
     * Record a pendiente coincidencia between a cliente and a propiedad,
     * without duplicating an existing one.
     */
    private function crear(Cliente $cliente, Propiedad $propiedad): void
    {
        Coincidencia::firstOrCreate([
            'cliente_id' => $cliente->id,
            'propiedad_id' => $propiedad->id,
        ], [
            'equipo_id' => $propiedad->equipo_id,
            'estado' => EstadoCoincidencia::Pendiente,
        ]);
    }

    /**
     * Discard every still-active coincidencia for a propiedad that is no
     * longer disponible, so agentes stop chasing or notifying clientes about
     * a property that was just sold, reserved, or withdrawn. Optionally
     * excludes the coincidencia that triggered the estado change (e.g. the
     * one being closed to Cerrado).
     */
    public function descartarActivas(Propiedad $propiedad, ?int $exceptoId = null): void
    {
        Coincidencia::query()
            ->where('propiedad_id', $propiedad->id)
            ->whereNotIn('estado', [EstadoCoincidencia::Cerrado, EstadoCoincidencia::Descartado])
            ->when($exceptoId, fn ($query) => $query->whereKeyNot($exceptoId))
            ->update(['estado' => EstadoCoincidencia::Descartado]);
    }
}
