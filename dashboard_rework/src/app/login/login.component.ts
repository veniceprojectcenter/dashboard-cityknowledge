import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service'; // Assicurati di avere il tuo servizio di autenticazione
import {Router, RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showModal: boolean = false; // Variabile per controllare la visualizzazione del modal
  confirmationMessage: string | null = null; // Messaggio di errore

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inizializza il modulo di login
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Qualsiasi logica di inizializzazione può andare qui
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          // Reindirizza l'utente dopo un login riuscito
          this.router.navigate(['/home']); // Cambia il percorso in base alla tua applicazione
        },
        error: (err) => {
          console.error('Login failed', err);
          this.handleError(err.code); // Gestisci l'errore
        }
      });
    }
  }

  onLoginWithGoogle(): void {
    this.authService.loginWithGoogle().subscribe({
      next: () => {
        // Reindirizza l'utente dopo un login riuscito
        this.router.navigate(['/home']); // Cambia il percorso in base alla tua applicazione
      },
      error: (err) => {
        console.error('Google login failed', err);
        this.handleError(err.code); // Gestisci l'errore
      }
    });
  }

  handleError(errorCode: string) {
    switch (errorCode) {
      case 'auth/wrong-password':
        this.confirmationMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/user-not-found':
        this.confirmationMessage = 'No user found with this email.';
        break;
      default:
        this.confirmationMessage = 'An unknown error occurred. Please try again.';
    }
    this.showModal = true; // Mostra il modal
  }

  closeModal() {
    this.showModal = false; // Chiudi il modal
    this.confirmationMessage = null; // Resetta il messaggio di errore
  }

  onContinue() {
    this.closeModal(); // Chiudi il modal quando si fa clic su "Continue"
  }
}
