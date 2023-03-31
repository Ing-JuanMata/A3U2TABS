import { FormControl, FormGroup } from '@angular/forms';

export interface Student {
  controlNumber: string;
  name: string;
  curp: string;
  age: number;
  nip: number;
  email: string;
  career: string;
  photo?: string;
}

export interface StudentForm {
  controlNumber: FormControl<string>;
  name: FormControl<string>;
  curp: FormControl<string>;
  age: FormControl<number>;
  nip: FormControl<number>;
  email: FormControl<string>;
  career: FormControl<string>;
  photo: FormControl<string | undefined>;
}
