import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StudentServiceService} from '../../service/student-service.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Student} from '../../interface/student';
import Swal from 'sweetalert2';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private studentService: StudentServiceService,
              private routes: Router) { }
  student: Student[];
  studentUpdateForm: FormGroup;

  ngOnInit(): void {
    this.studentUpdateForm = new FormGroup(
      {
        name: new FormControl('',
          [Validators.required,
            Validators.minLength(2)]),
        studentCode: new FormControl('',
          [Validators.required,
            Validators.minLength(4)]),
        dateOfBirth: new FormControl('',
          [Validators.required]),
        phone: new FormControl('',
          [Validators.required,
            Validators.minLength(10), Validators.maxLength(11)])
      }
    );
    // patch the edited value to the update form
    const id = +this.route.snapshot.paramMap.get('id');
    this.studentService.getStudentById(id)
      .subscribe(result => {
        result.dateOfBirth = formatDate(result.dateOfBirth, 'yyyy-MM-dd', 'en-US');
        // console.log(result.dateOfBirth);
        this.student = result;
        this.studentUpdateForm.patchValue(this.student);
      });
  }
  // tslint:disable-next-line:typedef
  onSubmit() {
    if (this.studentUpdateForm.valid) {
      const {value} = this.studentUpdateForm;
      const data = {
        ...this.student,
        ...value
      };
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Save`,
        denyButtonText: `Don't save`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.studentService.updateStudent(data)
            // tslint:disable-next-line:no-shadowed-variable
            .subscribe(result => {
              Swal.fire('Saved!', '', 'success');
              this.routes.navigate(['/home']);
            }, error => {
              Swal.fire('Student not found', '', 'warning');
            });
        } else if (result.isDenied) {
          this.routes.navigate(['/home']);
          Swal.fire('Changes are not saved', '', 'info');
        }
      });
    }
  }
}
