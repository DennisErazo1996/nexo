<?php

namespace App\Enums;

enum Departamento: string
{
    case Atlantida = 'atlantida';
    case Colon = 'colon';
    case Comayagua = 'comayagua';
    case Copan = 'copan';
    case Cortes = 'cortes';
    case Choluteca = 'choluteca';
    case ElParaiso = 'el_paraiso';
    case FranciscoMorazan = 'francisco_morazan';
    case GraciasADios = 'gracias_a_dios';
    case Intibuca = 'intibuca';
    case IslasDeLaBahia = 'islas_de_la_bahia';
    case LaPaz = 'la_paz';
    case Lempira = 'lempira';
    case Ocotepeque = 'ocotepeque';
    case Olancho = 'olancho';
    case SantaBarbara = 'santa_barbara';
    case Valle = 'valle';
    case Yoro = 'yoro';

    /**
     * Get the human-readable label for the departamento.
     */
    public function label(): string
    {
        return match ($this) {
            self::Atlantida => 'Atlántida',
            self::Colon => 'Colón',
            self::Comayagua => 'Comayagua',
            self::Copan => 'Copán',
            self::Cortes => 'Cortés',
            self::Choluteca => 'Choluteca',
            self::ElParaiso => 'El Paraíso',
            self::FranciscoMorazan => 'Francisco Morazán',
            self::GraciasADios => 'Gracias a Dios',
            self::Intibuca => 'Intibucá',
            self::IslasDeLaBahia => 'Islas de la Bahía',
            self::LaPaz => 'La Paz',
            self::Lempira => 'Lempira',
            self::Ocotepeque => 'Ocotepeque',
            self::Olancho => 'Olancho',
            self::SantaBarbara => 'Santa Bárbara',
            self::Valle => 'Valle',
            self::Yoro => 'Yoro',
        };
    }
}
