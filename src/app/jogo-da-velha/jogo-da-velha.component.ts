import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GameService } from '../services/game.service';
import { CPUService } from '../services/cpu.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-tictactoe',
  templateUrl: './jogo-da-velha.component.html',
  styleUrls: ['./jogo-da-velha.component.scss'],
  standalone: true,
  imports: [DialogModule, CommonModule, ButtonModule, TranslateModule]
})
export class JogoDaVelhaComponent implements OnInit {
  public mensagemDialogo = '';
  public mostrarDialogo = false;
  public isCpuTurn = false;

  constructor(
    public gameService: GameService,
    private cpuService: CPUService,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    this.translate.use(savedLang);

    this.route.queryParams.subscribe((params) => {
      const player1 = params['player1'] || 'Player 1';
      const player2 = params['player2'] || (params['mode'] === 'pvp' ? 'Player 2' : 'CPU');
      const player1Color = params['player1Color'] || '#ff0000';
      const player2Color = params['player2Color'] || '#0000ff';

      this.gameService.setPlayers([
        { nome: player1, cor: player1Color, pontos: 0 },
        { nome: player2, cor: player2Color, pontos: 0 }
      ]);

      this.gameService.setGameMode('tictactoe');
    });
  }

  // Função para manipular jogadas
  manipularCliqueCelula(indiceColuna: number, indiceLinha: number): void {
    // Verifica se a célula está vazia e se não é a vez da CPU
    if (this.gameService.board[indiceLinha][indiceColuna] === '' && !this.isCpuTurn) {
      const jogadorAtual = this.gameService.currentPlayer.value;

      if (jogadorAtual) {
        // Marca a jogada do jogador humano
        this.gameService.board[indiceLinha][indiceColuna] = jogadorAtual.cor;
        this.gameService.addMoveToHistory(indiceLinha, indiceColuna);

        // Verifica se houve vitória ou empate após a jogada
        if (this.gameService.checkVictory(indiceLinha, indiceColuna)) {
          this.mostrarDialogo = true;
          this.mensagemDialogo = `${jogadorAtual.nome} ${this.translate.instant('won')}!`;
          return; // Termina a jogada se o jogador vencer
        } else if (this.gameService.checkTie()) {
          this.mensagemDialogo = this.translate.instant('draw');
          this.mostrarDialogo = true;
          return; // Termina a jogada em caso de empate
        }

        // Alterna para o próximo jogador (CPU ou Player 2)
        this.gameService.switchPlayer();

        const cpuPlayer = this.gameService.currentPlayer.value;
        if (cpuPlayer && cpuPlayer.nome === 'CPU') {
          this.isCpuTurn = true;

          setTimeout(() => {
            this.cpuService.cpuMoveTicTacToe(); // CPU faz a jogada

            const lastMove = this.gameService.moveHistory[this.gameService.moveHistory.length - 1];
            if (this.gameService.checkVictory(lastMove.row, lastMove.col)) {
              this.mostrarDialogo = true;
              this.mensagemDialogo = `CPU ${this.translate.instant('won')}!`;
            } else if (this.gameService.checkTie()) {
              this.mensagemDialogo = this.translate.instant('draw');
              this.mostrarDialogo = true;
            } else {
              this.gameService.switchPlayer(); // Volta para o jogador humano
              this.isCpuTurn = false;
            }
          }, 1000);  // Delay de 1 segundo para simular "pensamento" do CPU
        }
      }
    }
  }

  reiniciarJogo(): void {
    this.gameService.resetBoard();
    this.mostrarDialogo = false;
    this.isCpuTurn = false;
  }

  voltarParaHome(): void {
    this.mostrarDialogo = false;
    this.router.navigate(['/home']);
  }
}
