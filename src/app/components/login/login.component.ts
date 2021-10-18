import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  constructor(private service: ChatService) { }

  loginGoogle() { 
    this.service.loginGoogle();
  }
  loginFacebook() { 
    this.service.loginFacebook();
  }
  loginTwitter() { 
    this.service.loginTwitter();
  }
}
