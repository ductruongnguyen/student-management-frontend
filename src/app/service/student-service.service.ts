import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Student} from '../interface/student';

@Injectable({
  providedIn: 'root'
})
export class StudentServiceService {
  private readonly STUDENT_API = 'http://localhost:8080/student';
  constructor(private httpClient: HttpClient) { }
  showStudentList(): Observable<Student[]>{
    return this.httpClient.get<Student[]>(`${this.STUDENT_API}/list`);
  }
  createStudent(student: Student): Observable<Student>{
    return this.httpClient.post<Student>(`${this.STUDENT_API}/insert`, student);
  }
  getStudentById(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.STUDENT_API}/${id}`);
  }
  updateStudent(student: Student): Observable<Student> {
    return this.httpClient.put<Student>(`${this.STUDENT_API}/update/${student.id}`, student);
  }
  deleteStudentById(id: number): Observable<Student> {
    return this.httpClient.delete<Student>(`${this.STUDENT_API}/delete/${id}`);
  }
  getStudentByName(keyword: string): Observable<Student[]>{
    return this.httpClient.get<Student[]>(`${this.STUDENT_API}/search/${keyword}`);
  }
}
