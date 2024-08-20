export default class Game {
  canvas: HTMLCanvasElement;

  constructor() {
    console.info('starting game...');

    this.canvas = document.querySelector('canvas')!;
  }

  async load() {
    
  }
}

// singleton to make data syncronization easier
let singleton: Game | null = null;

export function GameFactory(): Game {
  if (!singleton) {
    singleton = new Game();
  }

  return singleton;
}