import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

import { Carrera } from '../models/carrera';
import { Student, StudentForm } from '../models/student';
import { CarrerasService } from '../services/carreras.service';
import { StudentService } from '../services/student.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  private student$?: Subscription;
  controlNumber: string = '';
  validation_messages!: any;
  myForm!: FormGroup<StudentForm>;
  careers: Carrera[] = [];
  student?: Student = {
    controlNumber: '',
    name: '',
    career: '',
    age: 0,
    curp: '',
    email: '',
    nip: 0,
    photo: '',
  };

  constructor(
    private studentService: StudentService,
    private careerService: CarrerasService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) {
    this.careers = this.careerService.getCarreras();
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group<StudentForm>({
      name: new FormControl(this.student?.name || '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      age: new FormControl(this.student?.age || 0, {
        nonNullable: true,
        validators: [Validators.min(17), Validators.required],
      }),
      career: new FormControl(this.student?.career || '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      curp: new FormControl(this.student?.curp || '', {
        nonNullable: true,
        validators: [
          Validators.minLength(18),
          Validators.pattern(
            '^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$'
          ),
          Validators.required,
        ],
      }),
      email: new FormControl(this.student?.email || '', {
        nonNullable: true,
        validators: [Validators.email, Validators.required],
      }),
      controlNumber: new FormControl(
        { value: this.student?.controlNumber || '', disabled: true },
        {
          nonNullable: true,
          validators: [
            Validators.minLength(8),
            Validators.pattern('^[a-zA-Z]?[0-9]+$'),
            Validators.required,
          ],
        }
      ),
      nip: new FormControl(this.student?.nip || 0, {
        nonNullable: true,
        validators: [Validators.min(10), Validators.required],
      }),
      photo: new FormControl(this.student?.photo, {
        nonNullable: true,
      }),
    });

    this.validation_messages = {
      name: [
        {
          type: 'required',
          message: 'El nombre es requerido',
        },
      ],
      age: [
        {
          type: 'required',
          message: 'La edad es requerida',
        },
        {
          type: 'min',
          message: 'La edad mínima es 17',
        },
      ],
      career: [
        {
          type: 'required',
          message: 'La carrera es requerida',
        },
      ],
      curp: [
        {
          type: 'required',
          message: 'La CURP es requerida',
        },
        {
          type: 'minlength',
          message: 'La CURP debe tener al menos 18 caracteres',
        },
        {
          type: 'pattern',
          message: 'La CURP no es válida',
        },
      ],
      email: [
        {
          type: 'required',
          message: 'El correo electrónico es requerido',
        },
        {
          type: 'email',
          message: 'El correo electrónico no es válido',
        },
      ],
      controlNumber: [
        {
          type: 'required',
          message: 'El número de control es requerido',
        },
        {
          type: 'minlength',
          message: 'El número de control debe tener al menos 8 caracteres',
        },
        {
          type: 'pattern',
          message: 'El número de control debe ser alfanumérico',
        },
      ],
      nip: [
        {
          type: 'required',
          message: 'El NIP es requerido',
        },
        {
          type: 'min',
          message: 'El NIP debe tener al menos 2 caracteres',
        },
      ],
      photo: [
        {
          type: 'required',
          message: 'La foto es requerida',
        },
      ],
    };
  }

  ionViewDidEnter() {
    this.activatedRoute.paramMap
      .subscribe((paramMap) => {
        if (!paramMap.has('controlNumber')) {
          return;
        }
        this.controlNumber = paramMap.get('controlNumber')!;
        this.student$?.unsubscribe();
        this.student$ = this.studentService
          .getStudentByControlNumber(this.controlNumber)
          .subscribe((student) => {
            if (student.length > 0) {
              this.myForm.patchValue(student[0]);
              this.student = student[0];
            }
          });
      })
      .unsubscribe();
  }

  updateStudent() {
    this.confirmationDialog(
      '¿Estás seguro de actualizar el estudiante?',
      () => {
        this.studentService
          .updateStudent({ ...this.student, ...this.myForm.getRawValue() })
          .then(() => {
            this.presentToast('Estudiante actualizado', 'success');
            this.router.navigate(['tabs', 'tab1']);
          })
          .catch((error) => {
            this.presentToast('Error al actualizar', 'danger');
            console.log(error);
          });
      }
    );
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
