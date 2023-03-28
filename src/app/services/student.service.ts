import { Injectable } from '@angular/core';

import { Student } from '../models/student';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private students: Student[] = [];
  constructor() {
    this.students.push(
      {
        controlNumber: 'C17400607',
        age: 23,
        career: 'ISC',
        curp: 'MASJ990901HNTTLN04',
        email: 'jujemataso@ittepic.edu.mx',
        name: 'Juan Jesús Mata Solis',
        nip: 4849,
        photo: 'https://picsum.photos/600?random=1',
      },
      {
        controlNumber: '18400607',
        age: 23,
        career: 'ISC',
        curp: 'MASJ990901HNTTLN10',
        email: 'jejusomata@ittepic.edu.mx',
        name: 'Jesus Juan Solis Mata',
        nip: 4849,
        photo: 'https://picsum.photos/600?random=2',
      }
    );
  }

  public getStudents(): Student[] {
    return this.students;
  }

  public getStudentByControlNumber(controlNumber: string): Student | undefined {
    return this.students.find(
      (student) => student.controlNumber === controlNumber
    );
  }

  public newStudent(student: Student): Student[] {
    this.students.push(student);
    return this.students;
  }

  public updateStudent(pos: number, student: Student): Student[] {
    this.students[pos] = student;
    return this.students;
  }

  public deleteStudent(pos: number): Student[] {
    this.students.splice(pos, 1);
    return this.students;
  }
}
