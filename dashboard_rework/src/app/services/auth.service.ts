import { Injectable, inject, signal } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { Observable, from, throwError } from 'rxjs';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { UserInterface } from '../interfaces/user-interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<UserInterface | null>(null); // Inizializza come null

  constructor() {
    // Controlla se l'utente è autenticato all'avvio
    this.user$.subscribe((user: UserInterface) => {
      if (user) {
        this.currentUserSig.set({
          uid: user.uid,
          email: user.email || '',
          username: user.username || ''
        });
      } else {
        this.currentUserSig.set(null);
      }
    });
  }

  register(email: string, username: string, password: string): Observable<void> {
    // Controlli sulla lunghezza dell'email e della password
    if (email.length < 4) {
      return throwError(() => new Error('Specify a valid E-Mail'));
    }
    if (password.length < 6) {
      return throwError(() => new Error('Password too short'));
    }

    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      .then((response) => {
        return updateProfile(response.user, { displayName: username });
      });

    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    // Controlli sulla lunghezza dell'email e della password
    if (email.length < 4) {
      return throwError(() => new Error('Specify a valid E-Mail'));
    }
    if (password.length < 6) {
      return throwError(() => new Error('Password too short'));
    }

    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(() => {});

    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }

  // Metodo per controllare se l'utente è autenticato
  isLoggedIn(): boolean {
    return this.currentUserSig() != null;
  }
}
