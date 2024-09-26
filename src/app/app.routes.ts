import { Routes } from '@angular/router';
import { Connect4Component } from './components/connect4/connect4.component';
import { PlayerConfigComponent } from './components/player-config/player-config.component';
import { JogoDaVelhaComponent } from './jogo-da-velha/jogo-da-velha.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'connect4', component: Connect4Component },
  { path: 'tictactoe', component: JogoDaVelhaComponent },
  { path: 'config', component: PlayerConfigComponent },
  { path: 'home', component: HomeComponent },
];
