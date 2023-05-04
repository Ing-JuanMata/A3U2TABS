import { Injectable } from '@angular/core';

import { Student } from '../models/student';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private collection: CollectionReference<DocumentData>;
  constructor(private readonly firestore: Firestore) {
    this.collection = collection(firestore, 'students');
  }

  public getStudents() {
    return collectionData(
      query(this.collection, where('deleted', '!=', true)),
      { idField: 'id' }
    ) as Observable<Student[]>;
  }

  public getStudentByControlNumber(controlNumber: string) {
    return collectionData(
      query(this.collection, where('controlNumber', '==', controlNumber)),
      { idField: 'id' }
    ) as Observable<Student[]>;
  }

  public newStudent(student: Student) {
    return addDoc(this.collection, student);
  }

  public updateStudent(student: Student) {
    return updateDoc(doc(this.collection, student.id!!), { ...student });
  }

  public deleteStudent(id: string) {
    return updateDoc(doc(this.collection, id), { deleted: true });
  }
}
