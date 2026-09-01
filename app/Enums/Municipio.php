<?php

namespace App\Enums;

enum Municipio: string
{
    // Olancho (23 municipios)
    case Campamento = 'campamento';
    case Catacamas = 'catacamas';
    case Concordia = 'concordia';
    case DulceNombreDeCulmi = 'dulce_nombre_de_culmi';
    case ElRosario = 'el_rosario';
    case EsquipulasDelNorte = 'esquipulas_del_norte';
    case Gualaco = 'gualaco';
    case Guarizama = 'guarizama';
    case Guata = 'guata';
    case Guayape = 'guayape';
    case Jano = 'jano';
    case Juticalpa = 'juticalpa';
    case LaUnion = 'la_union';
    case Mangulile = 'mangulile';
    case Manto = 'manto';
    case Patuca = 'patuca';
    case Salama = 'salama';
    case SanEsteban = 'san_esteban';
    case SanFranciscoDeBecerra = 'san_francisco_de_becerra';
    case SanFranciscoDeLaPaz = 'san_francisco_de_la_paz';
    case SantaMariaDelReal = 'santa_maria_del_real';
    case Silca = 'silca';
    case Yocon = 'yocon';

    /**
     * Get the human-readable label for the municipio.
     */
    public function label(): string
    {
        return match ($this) {
            self::Campamento => 'Campamento',
            self::Catacamas => 'Catacamas',
            self::Concordia => 'Concordia',
            self::DulceNombreDeCulmi => 'Dulce Nombre de Culmí',
            self::ElRosario => 'El Rosario',
            self::EsquipulasDelNorte => 'Esquipulas del Norte',
            self::Gualaco => 'Gualaco',
            self::Guarizama => 'Guarizama',
            self::Guata => 'Guata',
            self::Guayape => 'Guayape',
            self::Jano => 'Jano',
            self::Juticalpa => 'Juticalpa',
            self::LaUnion => 'La Unión',
            self::Mangulile => 'Mangulile',
            self::Manto => 'Manto',
            self::Patuca => 'Patuca',
            self::Salama => 'Salamá',
            self::SanEsteban => 'San Esteban',
            self::SanFranciscoDeBecerra => 'San Francisco de Becerra',
            self::SanFranciscoDeLaPaz => 'San Francisco de la Paz',
            self::SantaMariaDelReal => 'Santa María del Real',
            self::Silca => 'Silca',
            self::Yocon => 'Yocón',
        };
    }

    /**
     * Get the departamento this municipio belongs to.
     */
    public function departamento(): Departamento
    {
        return match ($this) {
            self::Campamento,
            self::Catacamas,
            self::Concordia,
            self::DulceNombreDeCulmi,
            self::ElRosario,
            self::EsquipulasDelNorte,
            self::Gualaco,
            self::Guarizama,
            self::Guata,
            self::Guayape,
            self::Jano,
            self::Juticalpa,
            self::LaUnion,
            self::Mangulile,
            self::Manto,
            self::Patuca,
            self::Salama,
            self::SanEsteban,
            self::SanFranciscoDeBecerra,
            self::SanFranciscoDeLaPaz,
            self::SantaMariaDelReal,
            self::Silca,
            self::Yocon => Departamento::Olancho,
        };
    }

    /**
     * Get all municipios that belong to the given departamento.
     *
     * @return array<int, self>
     */
    public static function porDepartamento(Departamento $departamento): array
    {
        return array_values(array_filter(
            self::cases(),
            fn (self $municipio) => $municipio->departamento() === $departamento,
        ));
    }
}
