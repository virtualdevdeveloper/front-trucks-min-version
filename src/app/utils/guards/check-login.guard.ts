import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class CheckLoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this.authService.getAuthToken();
    // If there is no token, the user is not authenticated.

    if (token) {
      const claims = this.authService.getClaimsFromToken();
      this.router.navigate(["/dashboard"]); // Path a dashboard
      return false;
    } else {
      return true;
    }
  }
}