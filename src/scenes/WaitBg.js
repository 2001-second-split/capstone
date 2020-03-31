import 'phaser';
import { socket } from '..';

export default class WaitBg extends Phaser.Scene {
  constructor() {
    super('WaitBg');
  }

  preload() {
    // Preload Sprites
    this.load.image('sky', 'assets/backgrounds/sky.png');

    // placeholder text
    // this.load.image('waitingRoomBanner', 'assets/backgrounds/waitingRoomBanner.png')
  }

  create(data) {

    //data received from StartingScene --> WaitScene --> WaitBg
    const roomCreator = data.roomCreator;

    // Create Sprites
    this.add.image(-160, 0, 'sky').setOrigin(0).setScale(.5);
    // this.add.image(380,80,'waitingRoomBanner').setScale(5)


    this.header = this.add.text(250, 50, 'Waiting Room!!', { fontSize: '32px', fill: '#000' });
    //display different loading messages for game creator vs joiners
    this.loading = roomCreator? this.add.text(100, 250, 'Waiting for other players to join...', { fontSize: '24px', fill: '#FFF' }): this.add.text(100, 250, 'Waiting for Room Creator to start game...', { fontSize: '24px', fill: '#FFF' });


    //wait for all four players to join
    socket.on('playersReady', () => {
      //if the current player is the room creator enable start button
      this.loading.setActive(false).setVisible(false);
      if (roomCreator) {
        //create a "start button" for room creator
        let startButton = this.add.text(250, 250, 'Start Button', { fontSize: '32px', fill: '#FFF' });

        //make it interactive! so when we click it...
        startButton.setInteractive();

        //when mouse is released, emit transitionToBoard & listen for it in WaitFg (since we want to pass the queue info)
        startButton.on('pointerup', () => {
          socket.emit('transitionToBoard')
        })
      }
    })
  }
}
