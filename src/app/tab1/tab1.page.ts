import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

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
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.students = this.studentService.getStudents();
    this.carreras = this.carreraService.getCarreras();
  }

  public deleteStudent(pos: number) {
    this.confirmationDialog('¿Estás seguro de eliminar este estudiante?', () => {});
    this.students = this.studentService.deleteStudent(pos);
  }

  public newStudent() {
    this.student.photo = `https://picsum.photos/600?random=${
      this.students.length + 1
    }`;
    this.students = this.studentService.newStudent({ ...this.student });
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
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          cssClass: 'primary',
          handler: () => {
            if (handler) handler();
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
