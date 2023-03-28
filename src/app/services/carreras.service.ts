import { Injectable } from '@angular/core';
import { Carrera } from '../models/carrera';

@Injectable({
  providedIn: 'root',
})
export class CarrerasService {
  carreras: Carrera[] = [];
  constructor() {
    this.carreras.push(
      {
        name: 'Ingeniería en Sistemas Computacionales',
        acronym: 'ISC',
      },
      {
        name: 'Ingeniería en Gestión Empresarial',
        acronym: 'IGE',
      },
      {
        name: 'Ingeniería Industrial',
        acronym: 'II',
      },
      {
        name: 'Ingeniería Química',
        acronym: 'IQ',
      },
      {
        name: 'Ingeniería Bioquímica',
        acronym: 'IBQ',
      }
    );
  }

  public getCarreras(): Carrera[] {
    return this.carreras;
  }
}
