import { FormControl } from "@angular/forms";

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
