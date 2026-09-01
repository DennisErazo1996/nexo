<?php

$files = [
    'app/Http/Controllers/DashboardController.php',
    'app/Http/Controllers/Cliente/ClienteController.php',
    'app/Http/Controllers/Coincidencia/CoincidenciaController.php',
    'app/Http/Controllers/Propiedad/PropiedadController.php',
];

foreach ($files as $file) {
    if (! file_exists($file)) {
        continue;
    }
    $content = file_get_contents($file);

    // Replace User 'name' columns
    $content = str_replace(':id,name,telefono', ':id,nombres,apellidos,telefono', $content);
    $content = str_replace(':id,name', ':id,nombres,apellidos', $content);

    // Replace Cliente 'nombre' columns
    $content = str_replace('cliente:id,nombre,telefono,agente_registro_id', 'cliente:id,nombres,apellidos,telefono,agente_registro_id', $content);
    $content = str_replace('cliente:id,nombre,telefono,estado,agente_registro_id', 'cliente:id,nombres,apellidos,telefono,estado,agente_registro_id', $content);
    $content = str_replace('cliente:id,nombre', 'cliente:id,nombres,apellidos', $content);

    file_put_contents($file, $content);
}
echo "Done!\n";
