import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/utils/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  constructor(
    private authService:AuthService,
    private router:Router
  ) {}
  logout() {
    this.authService.logoutZulema();
    this.router.navigate(['/login']);
  }

}
