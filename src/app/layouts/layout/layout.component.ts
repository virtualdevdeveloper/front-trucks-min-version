import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/utils/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  userbymail:string = '';
  isAdmin!: boolean;
  constructor(
    private authService:AuthService,
    private router:Router
  ) {}
  ngOnInit(): void {
    this.userbymail = this.authService.getEmail();
    this.checkRole();
  }

  logout() {
    this.authService.logoutZulema();
    this.router.navigate(['/login']);
  }
  
  isAuthPage(): boolean {
    const authPages = ['login', 'register'];
    return authPages.includes(this.router.url.split('/')[1]);
  }

  checkRole(): void {
    const roles = this.authService.getClaimsFromToken()?.roles;
    console.log(roles);

    if (roles &&roles.includes("ROLE_ADMIN")) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }
}
