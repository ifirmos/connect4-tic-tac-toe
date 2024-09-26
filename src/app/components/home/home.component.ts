import { GameService } from './../../services/game.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [ButtonModule, TranslateModule, CommonModule, FormsModule, InputTextModule, ColorPickerModule],
})

export class HomeComponent  {
  selectedGame: 'connect4' | 'tictactoe' = 'connect4'; // Jogo inicial
  selectedMode: 'pvp' | 'cpu' = 'pvp'; // Modo de jogo inicial
  player1Name: string = 'Isaac'; // Nome do Player 1
  player2Name: string = 'Davi'; // Nome inicial para Player 2 no modo PvP
  player1Color: string = '#ff0000'; // Cor do Player 1
  player2Color: string = '#0000ff'; // Cor do Player 2

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private gameService: GameService
  ) {}


  // Validação para habilitar o botão Start
  canStartGame(): boolean {
    if (this.selectedMode === 'pvp') {
      return this.player1Name.trim() !== '' && this.player2Name.trim() !== ''; // Verifica ambos os nomes
    } else {
      return this.player1Name.trim() !== ''; // Verifica apenas o nome do Player 1 no modo CPU
    }
  }

  selectGame(game: 'connect4' | 'tictactoe'): void {
    this.selectedGame = game;
  }

  // Selecionar o modo de jogo (PvP ou CPU)
  selectMode(mode: 'pvp' | 'cpu'): void {
    this.selectedMode = mode;

    // Atualiza o nome do player 2 baseado no modo de jogo
    if (mode === 'cpu') {
      this.player2Name = 'CPU'; // Definir Player 2 como CPU no modo CPU
    } else {
      this.player2Name = 'Davi'; // Nome padrão para PvP
    }
  }

  // Iniciar o jogo e passar os dados via queryParams
  startGame(): void {
    this.gameService.resetAll();  // Reseta o estado do jogo

    // Redirecionar para o jogo selecionado com cores e nomes dos jogadores
    this.router.navigate([`/${this.selectedGame}`], {
      queryParams: {
        mode: this.selectedMode,
        player1: this.player1Name,
        player2: this.selectedMode === 'cpu' ? 'CPU' : this.player2Name, // Passa CPU como player 2 no modo CPU
        player1Color: this.player1Color,
        player2Color: this.selectedMode === 'pvp' ? this.player2Color : null, // Apenas PvP tem player2
      },
    });
  }
}
