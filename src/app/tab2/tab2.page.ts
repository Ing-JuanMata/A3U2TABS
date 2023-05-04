import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastController } from '@ionic/angular';

import { Carrera } from '../models/carrera';
import { StudentForm } from '../models/student';
import { CarrerasService } from '../services/carreras.service';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  myForm!: FormGroup<StudentForm>;
  carreras: Carrera[] = [];
  validation_messages!: any;
  constructor(
    private studentService: StudentService,
    private carreraService: CarrerasService,
    private toastController: ToastController,
    private formBuilder: FormBuilder
  ) {
    this.carreras = this.carreraService.getCarreras();
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group<StudentForm>({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      age: new FormControl(17, {
        nonNullable: true,
        validators: [Validators.min(17), Validators.required],
      }),
      career: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      curp: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.minLength(18),
          Validators.pattern(
            '^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$'
          ),
          Validators.required,
        ],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.email, Validators.required],
      }),
      controlNumber: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.minLength(8),
          Validators.pattern('^[a-zA-Z]?[0-9]+$'),
          Validators.required,
        ],
      }),
      nip: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.min(10), Validators.required],
      }),
      photo: new FormControl('https://picsum.photos/200', {
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

  public newStudent() {
    this.studentService
      .newStudent({
        ...this.myForm.getRawValue(),
        deleted: false,
      })
      .then(() => {
        this.presentToast('Estudiante agregado', 'success');
        this.myForm.reset();
      })
      .catch((error) => {
        this.presentToast('Error al agregar estudiante', 'danger');
        console.log(error);
      });
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
}
