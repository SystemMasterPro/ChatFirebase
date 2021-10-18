import {Component, OnInit} from '@angular/core';
import {ChatService} from '../../services/chat.service';

@Component({selector: 'app-nav', templateUrl: './nav.component.html', styleUrls: ['./nav.component.css']})
export class NavComponent implements OnInit {

  estado = localStorage.getItem("estado")
  constructor(public service: ChatService) {}


    ngOnInit(): void {}

  salir() {
        localStorage.setItem("estado", "false");
        this.service.logout();
    }
}
