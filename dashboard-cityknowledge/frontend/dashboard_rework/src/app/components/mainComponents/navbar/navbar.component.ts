import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import firebase from 'firebase/compat/app';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { ApplicationRef } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  authService = inject(AuthService);
  router = inject(Router);
  applicationRef = inject(ApplicationRef);

  ngOnInit(): void {
    // Subscribe to isStable to perform actions when the application is stable
    this.applicationRef.isStable.pipe(first(isStable => isStable)).subscribe(() => {
      this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
        if (user) {
          this.authService.currentUserSig.set({
            uid: user.uid || '',
            email: user.email || '',
            username: user.displayName || '',
          });
        } else {
          this.authService.currentUserSig.set(null);
        }
      });
    });
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['home']);
      },
      error: (err) => {
        console.error('Logout error:', err);
        // Consider showing an error message to the user here
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
