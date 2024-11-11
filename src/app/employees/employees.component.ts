import {Component, inject} from '@angular/core';
import {EmployeeService} from "../service/employee.service";
import { RouterLink } from '@angular/router';
import { NgFor, AsyncPipe, DatePipe } from '@angular/common';

import { OnInit } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { gql } from 'graphql-tag';
const GET_EMPLOYEES = gql`
  query GetEmployees {
    employees {
      id
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
    selector: 'app-employees',
    templateUrl: './employees.component.html',
    styleUrls: ['./employees.component.css'],
    standalone: true,
    imports: [RouterLink, NgFor, AsyncPipe, DatePipe]
})
export class EmployeesComponent implements OnInit {
  /////////////////////////////////////////////// a partir du tableau
  //protected employees: EmployeeService = inject(EmployeeService);
  ///////////////////////////////////////////// à partir de firebase
  loading:String="";
  employees:any[]=[];
  constructor(private apollo: Apollo) {}
  ngOnInit(): void {
    this.apollo
    .watchQuery({
      query: GET_EMPLOYEES,
    })
    .valueChanges.subscribe({
      next: (result: any) => {
        this.employees = result.data.employees; // Assigner les données récupérées à la variable employees

      },
      error: (error) => {
        this.loading = 'Error loading employees data';

      },
    });
  }
  ///////////////////////////////////////////////////



}
