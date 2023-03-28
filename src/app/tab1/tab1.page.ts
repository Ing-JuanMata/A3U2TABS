import { Component } from '@angular/core';

import { Carrera } from '../models/carrera';
import { Student } from '../models/student';
import { CarrerasService } from '../services/carreras.service';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  students: Student[] = [];
  student: Student = {
    controlNumber: '',
    age: 0,
    career: 'ISC',
    curp: '',
    email: '',
    name: '',
    nip: 0,
    photo: '',
  };
  carreras: Carrera[] = [];
  constructor(
    private studentService: StudentService,
    private carreraService: CarrerasService,
  ) {
    this.students = this.studentService.getStudents();
    this.carreras = this.carreraService.getCarreras();
  }

  public deleteStudent(pos: number) {
    console.log(pos)
    this.students = this.studentService.deleteStudent(pos);
  }

  public newStudent() {
    this.student.photo = `https://picsum.photos/600?random=${
      this.students.length + 1
    }`;
    this.students = this.studentService.newStudent({ ...this.student });
  }
}
