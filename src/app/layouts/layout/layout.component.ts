import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/utils/services/auth.service';
import { CrudService } from 'src/app/utils/services/crud.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  userbymail: string = '';
  isAdmin!: boolean;
  notificationsQuantity: any = '...';
  constructor(
    private authService: AuthService,
    private router: Router,
    private crud: CrudService
  ) {}
  ngOnInit(): void {
    this.userbymail = this.authService.getEmail();
    this.checkRole();
    this.getCantidadNotificaciones();
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

    if (roles && roles.includes('ROLE_ADMIN')) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

  getCantidadNotificaciones() {
    this.crud.getCantidadNotificaciones(this.authService.getClaimsFromToken().userId).subscribe((res: any) => {
      this.notificationsQuantity = res;
    });
  }
}
