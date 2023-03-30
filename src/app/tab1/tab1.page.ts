import { Component, ViewChild } from '@angular/core';
import {
  AlertController,
  IonSearchbar,
  IonSelect,
  ModalController,
  ToastController,
} from '@ionic/angular';

import { Student } from '../models/student';
import { StudentService } from '../services/student.service';
import { StudentUpdateComponent } from './student-update/student-update.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  @ViewChild('input') nombre!: IonSearchbar;
  @ViewChild('filtro') filtro!: IonSelect;
  students: Student[] = [];
  filteredStudents: Student[] = [];
  constructor(
    private studentService: StudentService,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController
  ) {
    this.students = this.studentService.getStudents();
    this.filteredStudents = this.students;
  }

  ionViewDidEnter() {
    this.nombre.setFocus();
    this.students = this.studentService.getStudents();
  }

  public deleteStudent(controlNumber: string) {
    this.confirmationDialog(
      '¿Estás seguro de eliminar este estudiante?',
      () => (this.students = this.studentService.deleteStudent(controlNumber))
    );
  }

  public async updateStudent(student: Student) {
    const modal = await this.modalController.create({
      component: StudentUpdateComponent,
      componentProps: {
        student: { ...student },
        //carreras: this.carreras,
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
