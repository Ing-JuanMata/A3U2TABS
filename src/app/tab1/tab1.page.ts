import { Component, ViewChild } from '@angular/core';
import {
  AlertController,
  IonInput,
  IonSelect,
  ModalController,
  ToastController,
} from '@ionic/angular';

import { Carrera } from '../models/carrera';
import { Student } from '../models/student';
import { CarrerasService } from '../services/carreras.service';
import { StudentService } from '../services/student.service';
import { StudentUpdateComponent } from './student-update/student-update.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  @ViewChild('nombre') nombre!: IonInput;
  @ViewChild('filtro') filtro!: IonSelect;
  students: Student[] = [];
  filteredStudents: Student[] = [];
  student: Student = {
    controlNumber: '',
    age: 0,
    career: '',
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
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController
  ) {
    this.students = this.studentService.getStudents();
    this.filteredStudents = this.students;
    this.carreras = this.carreraService.getCarreras();
  }

  ionViewDidEnter() {
    this.nombre.setFocus();
  }

  public deleteStudent(controlNumber: string) {
    this.confirmationDialog(
      '¿Estás seguro de eliminar este estudiante?',
      () => (this.students = this.studentService.deleteStudent(controlNumber))
    );
  }

  public newStudent() {
    this.student.photo = `https://picsum.photos/600?random=${
      this.students.length + 1
    }`;
    this.students = this.studentService.newStudent({ ...this.student });
    this.student = {
      controlNumber: '',
      age: 0,
      career: '',
      curp: '',
      email: '',
      name: '',
      nip: 0,
    };
    this.presentToast('Estudiante agregado', 'success');
  }

  public async updateStudent(student: Student) {
    const modal = await this.modalController.create({
      component: StudentUpdateComponent,
      componentProps: {
        student: { ...student },
        carreras: this.carreras,
        updateStudent: (student: Student) => {
          this.students = this.studentService.updateStudent(student);
          modal.dismiss(undefined, 'confirm');
          this.presentToast('Estudiante actualizado', 'success');
        },
      },
    });
    modal.present();
    modal.onDidDismiss().then((respuesta) => {
      if (respuesta.role === 'cancel' || respuesta.role === 'backdrop')
        this.presentToast('Operación cancelada', 'warning');
      this.students = this.studentService.getStudents();
    });
  }

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

  public filterStudents(event: Event) {
    if (event instanceof CustomEvent) {
      const busqueda = event.detail.value;
      
      if (!busqueda.trim()) {
        this.filteredStudents = this.students;
        return;
      }
      switch (this.filtro.value) {
        case 'nombre':
          this.filteredStudents = this.students.filter((student) =>
            student.name.toLowerCase().includes(busqueda.toLowerCase())
          );
          break;
        case 'control':
          this.filteredStudents = this.students.filter((student) =>
            student.controlNumber.toLowerCase().includes(busqueda.toLowerCase())
          );
          break;
        case 'carrera':
          this.filteredStudents = this.students.filter((student) =>
            student.career.toLowerCase().includes(busqueda.toLowerCase())
          );
          break;
      }
    }
  }

  private async presentToast(
    message: string,
    color: 'success' | 'danger' | 'warning'
  ) {
    const toast = await this.toastController.create({
      message,
      duration: 500,
      color,
    });
    toast.present();
  }

  private async confirmationDialog(
    header: string,
    handler?: Function,
    dismissFunction?: Function
  ) {
    const alert = await this.alertController.create({
      header,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.presentToast('Operación cancelada', 'warning');
          },
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          cssClass: 'primary',
          handler: () => {
            if (handler) handler();
            this.presentToast('Operación realizada', 'success');
          },
        },
      ],
    });
    alert.present();
    alert.onDidDismiss().then((respuesta) => {
      if (dismissFunction) dismissFunction(respuesta);
    });
  }
}
