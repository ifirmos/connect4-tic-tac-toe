import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public boardSize = { columns: 7, rows: 6 };  // Tamanho padrão: 7x6
  public board: string[][] = [];  // Estado do tabuleiro
  public players: Player[] = [];  // Lista de jogadores
  public currentPlayer = new BehaviorSubject<Player | null>(null);  // Jogador atual
  public objective = 4;  // Conectar 4 para vencer
  public moveHistory: { row: number, col: number, player: Player }[] = [];  // Histórico de jogadas

  constructor() {
    this.resetBoard();  // Inicializa o tabuleiro vazio ao criar o serviço
    console.log('Tabuleiro iniciado:', this.board);  // Log do estado inicial do tabuleiro
  }

  // Define o modo de jogo (Connect 4 ou Jogo da Velha)
  setGameMode(mode: 'connect4' | 'tictactoe'): void {
    console.log(`Modo de jogo selecionado: ${mode}`);  // Log de modo de jogo selecionado
    if (mode === 'tictactoe') {
      this.boardSize = { columns: 3, rows: 3 };
      this.objective = 3;
    } else {
      this.boardSize = { columns: 7, rows: 6 };
      this.objective = 4;
    }
    this.resetBoard();
  }

  // Define os jogadores
  setPlayers(players: Player[]): void {
    if (players[0].cor === players[1].cor) {
      console.error('Os jogadores não podem ter a mesma cor!');
      return;
    }
    this.players = players;
    this.currentPlayer.next(this.players[0]);  // Define o jogador 1 como inicial
    console.log('Jogadores definidos:', this.players);  // Log dos jogadores definidos
  }

  // Retorna o estado atual do tabuleiro
  getBoard(): string[][] {
    return this.board;
  }

  // Alterna entre os jogadores
  switchPlayer(): void {
    const currentPlayerIndex = this.players.findIndex(p => p === this.currentPlayer.value);
    const nextPlayer = this.players[(currentPlayerIndex + 1) % this.players.length];
    this.currentPlayer.next(nextPlayer);
    console.log(`Turno alternado: jogador atual é ${nextPlayer.nome}`);  // Log alternância de turno
  }

  // Reinicia o tabuleiro
  resetBoard(): void {
    this.board = Array.from({ length: this.boardSize.rows }, () => Array(this.boardSize.columns).fill(''));
    this.moveHistory = [];  // Limpa o histórico de jogadas
    console.log('Tabuleiro resetado:', this.board);  // Log do reset do tabuleiro
    this.currentPlayer.next(this.players[0]);
  }

  getAvailableRow(col: number): number {
    for (let row = this.boardSize.rows - 1; row >= 0; row--) {
      if (this.board[row][col] === '') {
        return row;
      }
    }
    return -1; // Coluna cheia
  }

  // Verifica empate
  checkTie(): boolean {
    const isTie = this.board.every(row => row.every(cell => cell !== ''));
    if (isTie) {
      console.log('Partida empatada!');  // Log de empate
    }
    return isTie;
  }

  // Verifica se houve vitória
  // Exemplo da função checkVictory em game.service.ts
  public checkVictory(rowIndex: number, colIndex: number, playerColor?: string): boolean {
    const currentColor = playerColor || this.currentPlayer.value?.cor;  // Usa a cor passada ou a do jogador atual
    if (!currentColor) return false;

    console.log(`Verificando vitória para o jogador com a cor: ${currentColor}, posição: (${rowIndex}, ${colIndex})`);

    // Verifica as condições de vitória (linhas, colunas, diagonais)
    const victory = this.checkHorizontal(rowIndex, currentColor) ||
                    this.checkVertical(colIndex, currentColor) ||
                    this.checkDiagonal(rowIndex, colIndex, currentColor);

    if (victory && currentColor === this.currentPlayer.value?.cor) {
      console.log(`Jogador com cor ${currentColor} venceu!`);  // Jogador atual vence
    } else if (victory) {
      console.log(`Jogador com cor ${currentColor} venceria com essa jogada!`);  // Simulação de vitória para o oponente
    } else {
      console.log(`Nenhuma vitória detectada para o jogador com cor ${currentColor}, posição: (${rowIndex}, ${colIndex})`);
    }

    return victory;
  }


  checkVictoryOrTie(row: number, col: number): boolean {
    if (this.checkVictory(row, col)) {
      console.log(`Jogador ${this.currentPlayer.value?.nome} venceu!`);
      return true;
    } else if (this.checkTie()) {
      console.log('Partida empatada!');
      return true;
    }
    return false;
  }

  // Verifica a vitória horizontal
  public checkHorizontal(row: number, color: string): boolean {
    let count = 0;
    for (let col = 0; col < this.boardSize.columns; col++) {
      count = this.board[row][col] === color ? count + 1 : 0;
      if (count === this.objective) return true;
    }
    return false;
  }

  // Verifica a vitória vertical
  public checkVertical(col: number, color: string): boolean {
    let count = 0;
    for (let row = 0; row < this.boardSize.rows; row++) {
      count = this.board[row][col] === color ? count + 1 : 0;
      if (count === this.objective) return true;
    }
    return false;
  }

  // Verifica a vitória diagonal (tanto a principal quanto a secundária)
  public checkDiagonal(row: number, col: number, color: string): boolean {
    return this.checkDiagonalPrincipal(row, col, color) ||
           this.checkDiagonalSecundaria(row, col, color);
  }

  // Diagonal ↘
  public checkDiagonalPrincipal(row: number, col: number, color: string): boolean {
    let count = 0;
    let r = row, c = col;

    // Move para o início da diagonal (↘)
    while (r > 0 && c > 0) {
      r--; c--;
    }

    // Verifica a diagonal
    while (r < this.boardSize.rows && c < this.boardSize.columns) {
      count = this.board[r][c] === color ? count + 1 : 0;
      if (count === this.objective) return true;
      r++; c++;
    }
    return false;
  }

  // Diagonal ↙
  public checkDiagonalSecundaria(row: number, col: number, color: string): boolean {
    let count = 0;
    let r = row, c = col;

    // Move para o início da diagonal (↙)
    while (r > 0 && c < this.boardSize.columns - 1) {
      r--; c++;
    }

    // Verifica a diagonal
    while (r < this.boardSize.rows && c >= 0) {
      count = this.board[r][c] === color ? count + 1 : 0;
      if (count === this.objective) return true;
      r++; c--;
    }
    return false;
  }

  // Adiciona uma jogada ao histórico
  addMoveToHistory(row: number, col: number): void {
    const currentPlayer = this.currentPlayer.value;
    if (currentPlayer) {
      this.moveHistory.push({ row, col, player: currentPlayer });
    }
  }

  // Função para resetar todos os estados
  resetAll(): void {
    this.players = [];  // Reseta os jogadores
    this.currentPlayer.next(null);  // Reseta o jogador atual
    this.board = [];  // Reseta o tabuleiro
    this.moveHistory = [];  // Reseta o histórico de movimentos
    this.objective = 4;  // Restaura o objetivo padrão para Connect 4
    this.boardSize = { columns: 7, rows: 6 };  // Restaura o tamanho padrão do tabuleiro para Connect 4
  }
}
