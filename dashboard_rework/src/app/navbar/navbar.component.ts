import {Component, inject, OnInit} from '@angular/core';
import { AuthService} from '../services/auth.service';
import {UserInterface} from '../interfaces/user-interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.user$.subscribe((user: UserInterface) => {
      if(user) {
        this.authService.currentUserSig.set ({
          uid: user.uid!,
          email: user.email!,
          username: user.username!,
        });
      }   else {
        this.authService.currentUserSig.set(null);
      }
      console.log(this.authService.currentUserSig())
    });
  }


}
