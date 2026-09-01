<?php

$files = [
    'app/Http/Controllers/DashboardController.php',
    'app/Http/Controllers/Coincidencia/CoincidenciaController.php',
];

foreach ($files as $file) {
    if (! file_exists($file)) {
        continue;
    }
    $content = file_get_contents($file);
    $content = str_replace('apellidoss,apellidos', 'apellidos', $content);
    file_put_contents($file, $content);
}
echo "Done!\n";
