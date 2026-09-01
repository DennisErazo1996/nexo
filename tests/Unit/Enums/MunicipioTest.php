<?php

namespace Tests\Unit\Enums;

use App\Enums\Departamento;
use App\Enums\Municipio;
use PHPUnit\Framework\TestCase;

class MunicipioTest extends TestCase
{
    public function test_olancho_has_all_23_municipios(): void
    {
        $olanchoMunicipios = Municipio::porDepartamento(Departamento::Olancho);

        $this->assertCount(23, $olanchoMunicipios);
        $this->assertContains(Municipio::Juticalpa, $olanchoMunicipios);
        $this->assertContains(Municipio::Catacamas, $olanchoMunicipios);
        $this->assertContains(Municipio::Campamento, $olanchoMunicipios);
    }

    public function test_municipios_have_correct_labels_and_departamento(): void
    {
        $this->assertSame('Juticalpa', Municipio::Juticalpa->label());
        $this->assertSame(Departamento::Olancho, Municipio::Juticalpa->departamento());
        $this->assertSame('Dulce Nombre de Culmí', Municipio::DulceNombreDeCulmi->label());
    }

    public function test_departamentos_have_18_cases_with_labels(): void
    {
        $this->assertCount(18, Departamento::cases());
        $this->assertSame('Olancho', Departamento::Olancho->label());
        $this->assertSame('Francisco Morazán', Departamento::FranciscoMorazan->label());
    }
}
