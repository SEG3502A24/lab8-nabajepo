import {Component, inject} from '@angular/core';
import { AbstractControl, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import {EmployeeService} from "../service/employee.service";
import { Router, RouterLink } from "@angular/router";
import { Apollo } from 'apollo-angular';
import { gql } from 'graphql-tag';
const ADD_EMPLOYEE = gql`
  mutation AddEmployee($name: String!, $dateOfBirth: String!, $city: String!, $salary: Float!, $gender: String!, $email: String!) {
    addEmployee(name: $name, dateOfBirth: $dateOfBirth, city: $city, salary: $salary, gender: $gender, email: $email) {
      name
      dateOfBirth
      city
      salary
      gender
      email
    }
  }
`;

@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css'],
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule]
})
export class EmployeeComponent {
  private builder: FormBuilder = inject(FormBuilder);
  private employeeService: EmployeeService = inject(EmployeeService);
  private router: Router = inject(Router);
  employeeForm = this.builder.group({
    name: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    city: ['', Validators.required],
    salary: [0, Validators.required],
    gender: ['', Validators.pattern('^[MFX]$')],
    email: ['', Validators.email]
  });
  responseMessage:String="";
  get name(): AbstractControl<string> {return <AbstractControl<string>>this.employeeForm.get('name'); }
  get dateOfBirth(): AbstractControl<string> {return <AbstractControl<string>>this.employeeForm.get('dateOfBirth'); }
  get city(): AbstractControl<string> {return <AbstractControl>this.employeeForm.get('city'); }
  get salary(): AbstractControl<number> {return <AbstractControl<number>>this.employeeForm.get('salary'); }
  get gender(): AbstractControl<string> {return <AbstractControl<string>>this.employeeForm.get('gender'); }
  get email(): AbstractControl<string> {return <AbstractControl<string>>this.employeeForm.get('email'); }
  //////////////////////////////
  constructor(private apollo: Apollo) {}
  //onSubmit() {//Here we add element on a array
    //const employee: Employee = new Employee(this.name.value,
      //new Date(this.dateOfBirth.value),
      //this.city.value,
     // this.salary.value,
      //this.gender.value,
     // this.email.value);
    //this.employeeService.addEmployee(employee);
    //this.employeeForm.reset();
    //this.router.navigate(['/employees']).then(() => {});
  //}
  /*
  onSubmit() {//Here we add element on a cloud firestore
    const employee: Employee = new Employee(this.name.value,
      new Date(this.dateOfBirth.value),
      this.city.value,
      this.salary.value,
      this.gender.value,
      this.email.value);
    ////////////////////////////////////// on ajoute une nouvelle insertion
    const newEmployee={nameEmployee:employee.name,dateBirthEmployee: new Date(employee.dateOfBirth).toISOString().split('T')[0],  // Format YYYY-MM-DD
      cityEmployee:employee.city,salaryEmployee:employee.salary,genderEmployee:employee.gender,emailEmployee:employee.email};
    this.dataservice.addData(newEmployee);
    //////////////////////////////////////
    this.employeeForm.reset();
    this.router.navigate(['/employees']).then(() => {});
  }*/
    onSubmit() {
      const formattedDateOfBirth = new Date(this.dateOfBirth.value).toISOString();
      this.apollo.mutate({
        mutation: ADD_EMPLOYEE,
        variables: {
          name: this.name.value,
          dateOfBirth: formattedDateOfBirth,
          salary: this.salary.value,
          gender: this.gender.value,
          email: this.email.value,
        },
      }).subscribe({
        next: (response) => {
          this.responseMessage = 'Employee added successfully!';
          this.router.navigate(['/employees'])
        },
        error: (error) => {
          console.log('Error adding employee:', error);
          this.responseMessage = 'Error adding employee!'
          this.router.navigate(['/employees'])
        },
      });
    }








}
