import {Component, OnInit} from '@angular/core';
import {StudentServiceService} from '../../service/student-service.service';
import {Student} from '../../interface/student';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  studentList: Student[] = [];
  studentCreateForm: FormGroup;
  fixDate: string;

  constructor(private studentService: StudentServiceService,
              private router: Router) {}

  ngOnInit(): void {
    // get current date and assign this.fixdate
    const today = new Date();
    const setDate = new Date();
    setDate.setDate(today.getDate());
    setDate.setMonth(today.getMonth());
    setDate.setFullYear(today.getFullYear() - 20);
    this.fixDate = formatDate(setDate, 'yyyy-MM-dd', 'en-US');
    console.log(this.fixDate);

    // Init form validation
    this.studentCreateForm = new FormGroup(
      {
        name: new FormControl('',
          [Validators.required,
            Validators.minLength(4)]),
        studentCode: new FormControl('',
          [Validators.required,
            Validators.minLength(4)]),
        dateOfBirth: new FormControl(this.fixDate,
          [Validators.required]),
        phone: new FormControl('',
          [Validators.required,
            Validators.minLength(10),
            Validators.maxLength(11)])
      }
    );
  }

  onSubmit(): void {
    if (this.studentCreateForm.valid) {
      const {value} = this.studentCreateForm;
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Save`,
        denyButtonText: `Don't save`,
      }).then((result) => {
        /* get student list & check duplicated code*/
        this.studentService.showStudentList()
          // tslint:disable-next-line:no-shadowed-variable
          .subscribe(studentList => {
            // tslint:disable-next-line:prefer-const
            let flag: number;
            flag = 1;
            studentList.forEach((student) => {
              const check = value.studentCode.localeCompare(student.studentCode);
              // tslint:disable-next-line:triple-equals
              if (check == 0) {
                flag = 0;
              }
            });
            console.log(flag);
            // tslint:disable-next-line:triple-equals
            if (flag != 0) {
              /* If it's confirmed and not duplicated then add new Student to Database */
              if (result.isConfirmed) {
                this.studentService.createStudent(value)
                  .subscribe(newStudent => {
                    this.studentList.push(newStudent);
                    console.log(result);
                    this.router.navigate(['/home']);
                  });
                Swal.fire('Saved!', '', 'success');
              } else if (result.isDenied) {
                this.router.navigate(['/home']);
                Swal.fire('Changes are not saved', '', 'info');
              }
            } else {
              Swal.fire('Student\'s code is duplicated', '', 'warning');
              // @ts-ignore
              this.router.navigate('[/home/create]');
            }
          });
      });
    }
  }
}
