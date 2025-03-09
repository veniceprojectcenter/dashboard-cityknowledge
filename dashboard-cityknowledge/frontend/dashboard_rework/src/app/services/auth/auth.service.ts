import { Injectable, inject, signal, Inject, PLATFORM_ID } from '@angular/core';
import { Auth, user, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from '@angular/fire/auth';
import { Observable, from, throwError, catchError } from 'rxjs';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { User_interface } from '../../interfaces/user_interface';
import { isPlatformBrowser } from '@angular/common';

// Importa firebase in modalità compat correttamente:
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<User_interface | null>(null); // Inizializza come null

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Controlla se l'utente è autenticato all'avvio
    this.user$.subscribe((user) => {
      if (user) {
        this.currentUserSig.set({
          uid: user.uid,
          email: user.email || '',
          username: user.displayName || '' // Usa displayName per impostare username
        });
      } else {
        this.currentUserSig.set(null);
      }
    });
  }

  register(email: string, username: string, password: string): Observable<void> {
    if (email.length < 4) {
      return throwError(() => new Error('Specifica una email valida'));
    }
    if (password.length < 6) {
      return throwError(() => new Error('Password troppo corta'));
    }

    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      .then((response) => {
        return updateProfile(response.user, { displayName: username });
      });

    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    if (email.length < 4) {
      return throwError(() => new Error('Specifica una email valida'));
    }
    if (password.length < 6) {
      return throwError(() => new Error('Password troppo corta'));
    }

    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(() => {});

    return from(promise);
  }

  async loginWithGoogle(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      throw new Error('Il login con Google non è supportato in questo ambiente.');
    }

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.firebaseAuth, provider);
      const user = result.user;

      await updateProfile(user, { displayName: user.displayName || 'User' });
      this.currentUserSig.set({
        uid: user.uid,
        email: user.email || '',
        username: user.displayName || ''
      });
    } catch (error) {
      console.error('Errore durante il login con Google:', error);
      throw new Error('Errore durante il login con Google.');
    }
  }

  resetPassword(email: string): Observable<void> {
    if (email.trim().length < 4) {
      return throwError(() => new Error('Specifica una email valida'));
    }

    const promise = sendPasswordResetEmail(this.firebaseAuth, email)
      .then(() => {
        console.log('Email per il reset della password inviata con successo.');
      });

    return from(promise).pipe(
      catchError((error) => {
        console.error('Errore nell\'invio dell\'email per il reset della password:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }


  isLoggedIn(): boolean {
    return this.currentUserSig() != null;
  }
}
