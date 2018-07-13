import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-administrator',
  templateUrl: './user-administrator.component.html',
  styleUrls: ['./user-administrator.component.css']
})
export class UserAdministratorComponent implements OnInit {
  listUser = [{
    ID: "unknown",
    Login: "unknown",
    Email: "unknown",
    Status: "unknown",
    Language: "unknown",
    Profiles: "unknown",
    CreateDate: "unknown",
    ModifiedBy: "unknown",
    ModifiedDate: "unknown"
  }]
  constructor() { }

  ngOnInit() {
  }

}
