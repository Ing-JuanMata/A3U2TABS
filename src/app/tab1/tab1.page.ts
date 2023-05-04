import { Subscription } from 'rxjs';

import { Component, OnDestroy, ViewChild } from '@angular/core';
import {
  AlertController,
  IonSearchbar,
  IonSelect,
  ToastController,
} from '@ionic/angular';

import { Student } from '../models/student';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnDestroy {
  private students$?: Subscription;
  @ViewChild('input') busqueda!: IonSearchbar;
  @ViewChild('filtro') filtro!: IonSelect;
  students: Student[] = [];
  filteredStudents: Student[] = [];
  constructor(
    private studentService: StudentService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.students$ = studentService.getStudents().subscribe((students) => {
      this.students = students;
      this.filteredStudents = students;
      if (this.busqueda) this.filter(this.busqueda.value || '');
    });
  }

  ionViewDidEnter() {
    this.busqueda.setFocus();
  }

  public deleteStudent(id: string) {
    this.confirmationDialog(
      '¿Estás seguro de eliminar este estudiante?',
      () => {
        this.studentService
          .deleteStudent(id)
          .then(() => {
            this.presentToast('Estudiante eliminado correctamente', 'success');
            this.filter(this.busqueda.value || '');
          })
          .catch((error) => {
            console.log(error);
            this.presentToast(
              'Ocurrió un error al eliminar el estudiante',
              'danger'
            );
          });
      }
    );
  }

  private filter(busqueda: string) {
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

  public filterStudents(event: Event) {
    if (event instanceof CustomEvent) {
      this.filter(event.detail.value);
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

  ngOnDestroy(): void {
    this.students$?.unsubscribe();
  }
}
