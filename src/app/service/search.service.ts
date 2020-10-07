import { Injectable } from '@angular/core';
import {Student} from '../interface/student';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SearchService {
  student: Student[] = [];
  value = new BehaviorSubject('');
  list = new BehaviorSubject(this.student);
  constructor() { }
  // tslint:disable-next-line:typedef
  changeValue(message: string, student: Student[]) {
    this.value.next(message);
    this.list.next(student);
  }
}
