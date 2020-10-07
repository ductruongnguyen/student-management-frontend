import {Component, OnInit} from '@angular/core';
import {Student} from '../../interface/student';
import {StudentServiceService} from '../../service/student-service.service';
import Swal from 'sweetalert2';
import {SearchService} from '../../service/search.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit {
  studentList: Student[] = [];
  failMessage: string;
  successMessage: string;
  Toast: any;
  keyword: any;

  constructor(private studentService: StudentServiceService,
              private searchService: SearchService) {
  }

  ngOnInit(): void {
    this.studentService.showStudentList()
      .subscribe((result) => {
        this.studentList = result;
        console.log(this.studentList);
      }, error => {
        this.failMessage = 'Show Student List Fail';
      });
  }

  // tslint:disable-next-line:typedef
  deleteStudent(id: number) {
    this.Toast = Swal.fire({
      title: 'Do you want to delete this student?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.studentService.deleteStudentById(id).subscribe(() => {
          this.ngOnInit();
          Swal.fire('Delete success!', '', 'success');
        });
      } else if (result.isDenied) {
        this.ngOnInit();
        Swal.fire('Not delete this student', '', 'info');
      }
    });
  }
  // tslint:disable-next-line:typedef
  search(){
    if (this.keyword !== ''){
      this.studentService.getStudentByName(this.keyword).subscribe( data => {
        this.studentList = data;
        this.searchService.changeValue(this.keyword, this.studentList);
      });
    }else {
      this.studentService.showStudentList().subscribe( data => {
        this.studentList = data;
        this.searchService.changeValue(this.keyword, this.studentList);
      });
    }
  }
}
