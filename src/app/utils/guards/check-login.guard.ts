import { CanActivateFn } from '@angular/router';

export const checkLoginGuard: CanActivateFn = (route, state) => {
  return true;
};
