import { FormControl } from '@angular/forms';

export interface Student {
  id?: string;
  controlNumber: string;
  name: string;
  curp: string;
  age: number;
  nip: number;
  email: string;
  career: string;
  photo?: string;
  deleted?: boolean;
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
