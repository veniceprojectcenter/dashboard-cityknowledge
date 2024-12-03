import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserInterface } from '../interfaces/user-interface';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit(): void {
    this.authService.user$.subscribe((user: UserInterface) => {
      if (user) {
        this.authService.currentUserSig.set({
          uid: user.uid!,
          email: user.email!,
          username: user.username!,
        });
        console.log("navbar");
        console.log(this.authService.currentUserSig());
      } else {
        this.authService.currentUserSig.set(null);
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['home']);
  }
}
