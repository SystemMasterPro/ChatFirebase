import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Mensaje} from '../Interfaces/Chatmensaje';
import {map} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase/app';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class ChatService {

    private itemsCollection : AngularFirestoreCollection < Mensaje >;

    public chats : Mensaje[] = [];

    public usuario : any = {};

    constructor(private afs : AngularFirestore, public af : AngularFireAuth, private route : Router) { // Verificamos el estado de la autentificacion
        this.af.authState.subscribe(user => { // Si no hay nada en el estado retornamos un return vacio;
            if (!user) {
                return;
            }
            // Tomamos los valores que vienen d ela autentificacion
            this.usuario.nombre = user.displayName;
            this.usuario.uid = user.uid;
        });
    }
    // Cargamos los mensajes
    cargarMensajes() {
        this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'asc'));
        return this.itemsCollection.valueChanges().pipe(map((mensajes : Mensaje[]) => {
            this.chats = mensajes;
        }))
    }
    // Enviamos los mensajes
    agregarMensaje(texto : string) { // TODO falta el usuario
        let mensaje: Mensaje = {
            nombre: this.usuario.nombre,
            mensaje: texto,
            fecha: new Date().getTime(),
            uid: this.usuario.uid
        }

        return this.itemsCollection.add(mensaje);
    }
    // GOOGLE AUTH
    loginGoogle() {
        this.usuario = {};
        this.af.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(() => {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Entrada Exitosa',
                showConfirmButton: false,
                timer: 1500
            });
            localStorage.setItem("estado", "true");
            window.location.reload();
            window.location.href = "/chat";
        }).catch(() => {
            Swal.fire({icon: 'error', title: 'Oops...', text: 'Hubieron problemas de Autenticacion con Google!'});
        });
    }
    // FACEBOOK AUTH
    loginFacebook() {
        this.usuario = {};
        this.af.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(() => {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Entrada Exitosa',
                showConfirmButton: false,
                timer: 1500
            });
            localStorage.setItem("estado", "true")
            this.route.navigate(['chat']);
        }).catch(() => {
            Swal.fire({icon: 'error', title: 'Oops...', text: 'Hubieron problemas de Autenticacion con Facebook!'});
        });
    }
    // TWIITER AUTH
    loginTwitter() {
        this.usuario = {};
        this.af.signInWithPopup(new firebase.auth.TwitterAuthProvider()).then(() => {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Entrada Exitosa',
                showConfirmButton: false,
                timer: 1500
            });
            localStorage.setItem("estado", "true")
            this.route.navigate(['chat']);
        }).catch(() => {
            Swal.fire({icon: 'error', title: 'Oops...', text: 'Hubieron problemas de Autenticacion con Twitter!'});
        });
    }
    // LOGOUT
    logout() {
        this.af.signOut().then(() => {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Salida Exitosa',
                showConfirmButton: false,
                timer: 1500
            });
            localStorage.setItem("estado", "false")
            this.route.navigate(['login']);
            window.location.reload();
        });
    }

    // GUARDS
    hasUser() {
        return this.af.authState;
    }
}
