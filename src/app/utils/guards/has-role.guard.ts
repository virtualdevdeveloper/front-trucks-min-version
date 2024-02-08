import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HasRoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRole = route.data['role']
    const token = this.authService.getAuthToken();

    // If there is no token, the user is not authenticated.
    if (!token) {
      this.router.navigate(['/login'])
      return false
    }

    // Extract the user's roles from the token.
    const roles = this.authService.getClaims(token).roles

    // Check if the user has the required roles.
    if (allowedRole && !roles.some((role) => allowedRole.includes(role))) {
      this.router.navigate(['/'])
      return false
    }

    // The user is authorized to access the route.
    return true
  }
  
}