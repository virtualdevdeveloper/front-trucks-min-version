import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/utils/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  role: any;
  isAdmin!: boolean;
  constructor(private auth:AuthService) {}
  ngOnInit(): void {
    this.role = this.auth.getClaimsFromToken()?.roles;
    this.isAdmin = this.role.includes('ROLE_ADMIN') ? true : false;
  }
}
