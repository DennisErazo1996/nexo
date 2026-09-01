<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Rewrite photo URLs that were stored as absolute (host-baked) URLs into
     * root-relative paths, so images resolve regardless of the app's host.
     */
    public function up(): void
    {
        foreach (DB::table('propiedad_fotos')->get(['id', 'url', 'url_con_marca_agua']) as $foto) {
            DB::table('propiedad_fotos')
                ->where('id', $foto->id)
                ->update([
                    'url' => $this->normalizar($foto->url),
                    'url_con_marca_agua' => $this->normalizar($foto->url_con_marca_agua),
                ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Irreversible: original host is not preserved.
    }

    /**
     * Reduce an absolute or relative URL to a `/storage/...` path.
     */
    private function normalizar(?string $valor): ?string
    {
        if ($valor === null || $valor === '') {
            return $valor;
        }

        $path = parse_url($valor, PHP_URL_PATH) ?: $valor;

        return str_starts_with($path, '/storage/')
            ? $path
            : '/storage/'.ltrim($path, '/');
    }
};
