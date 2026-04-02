import { Injectable, signal } from '@angular/core';

export type UserRole = 'HR' | 'EMPLOYEE' | null;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'cyw_auth_role';
  
  // Initialize from sessionStorage if exists
  private initialRole: UserRole = null;
  
  constructor() {
    const saved = sessionStorage.getItem(this.STORAGE_KEY);
    if (saved === 'HR' || saved === 'EMPLOYEE') {
      this.initialRole = saved as UserRole;
    }
  }

  readonly userRole = signal<UserRole>(this.initialRole);

  login(role: UserRole) {
    this.userRole.set(role);
    if (role) {
      sessionStorage.setItem(this.STORAGE_KEY, role);
    } else {
      sessionStorage.removeItem(this.STORAGE_KEY);
    }
  }

  logout() {
    this.userRole.set(null);
    sessionStorage.removeItem(this.STORAGE_KEY);
  }
}
