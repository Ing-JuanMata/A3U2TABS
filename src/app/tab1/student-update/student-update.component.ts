import { Student } from 'src/app/models/student';

import { Component, Input, OnInit } from '@angular/core';
import { Carrera } from 'src/app/models/carrera';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-student-update',
  templateUrl: './student-update.component.html',
  styleUrls: ['./student-update.component.scss'],
})
export class StudentUpdateComponent {
  @Input() student!: Student;
  @Input() carreras!: Carrera[];
  @Input() updateStudent!: (student: Student) => void;
  constructor(private modalController: ModalController) {}

  public validStudent(): boolean {
    return (
      this.student.name.match(/^[^0-9]+$/) !== null &&
      this.student.age > 0 &&
      this.student.nip > 0 &&
      this.student.email.match(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
      ) !== null &&
      this.student.curp.match(/^[A-Z]{4}[0-9]{6}[A-Z]{6}[0-9]{2}$/) !== null &&
      this.student.controlNumber.match(/^[BC]?[0-9]{8}$/) !== null
    );
  }

  public closeModal() {
    this.modalController.dismiss(undefined, 'cancel');
  }
}
