import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

const solved = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sliding Puzzle';
  puzzleSolvedMessage = 'Puzzle solved!!!';
  @ViewChild('box1') box1: ElementRef;
  @ViewChild('box2') box2: ElementRef;
  @ViewChild('box3') box3: ElementRef;
  @ViewChild('box4') box4: ElementRef;
  @ViewChild('box5') box5: ElementRef;
  @ViewChild('box6') box6: ElementRef;
  @ViewChild('box7') box7: ElementRef;
  @ViewChild('box8') box8: ElementRef;
  @ViewChild('box9') box9: ElementRef;

  x = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];

  squares: Array<ElementRef>;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.drop = this.drop.bind(this);
    this.drag = this.drag.bind(this);
    this.allowDrop = this.allowDrop.bind(this);

    this.squares = [this.box1,
      this.box2,
      this.box3,
      this.box4,
      this.box5,
      this.box6,
      this.box7,
      this.box8,
      this.box9];

    this.scramblePuzzlePieces(10);
    this.copyTextContentsIntoArray();
    this.addRemoveEventHandlersToSquares();
  }

  private swap(source: ElementRef, target: ElementRef): void {
    this.swapBackgrounds(source, target);
    this.swapTextContent(source, target);
  }

  private allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  private drag(event: DragEvent & {target: HTMLElement}): void {
    event.dataTransfer.setData('text', event.target.id);
  }

  private drop(event: DragEvent & {target: HTMLElement}): void {
    event.preventDefault();

    const sourceBoxId = event.dataTransfer.getData('text').toString().replace('box', '');
    const targetBoxId = event.target.id.toString().replace('box', '');

    if (sourceBoxId === targetBoxId) {
      return;
    }

    const sourceBox = this.getBoxById(sourceBoxId);
    const targetBox = this.getBoxById(targetBoxId);

    this.swap(sourceBox, targetBox);
    this.copyTextContentsIntoArray();

    // if (this.isPuzzleSolved()) {
    //   this.messages = 'Puzzle solved!!!';
    // }

    this.addRemoveEventHandlersToSquares();
  }

  private swapTextContent(source: ElementRef, target: ElementRef): void {
    const targetTextContent = target.nativeElement.textContent;
    target.nativeElement.textContent = source.nativeElement.textContent;
    source.nativeElement.textContent = targetTextContent;
  }

  private swapBackgrounds(source: ElementRef, target: ElementRef): void {
    const sourceBoxBackground = window.getComputedStyle(source.nativeElement, null).getPropertyValue('background');
    this.renderer.setStyle(target.nativeElement, 'background', sourceBoxBackground);
    this.renderer.setStyle(source.nativeElement, 'background', 'black');
  }

  private copyTextContentsIntoArray(): void {
    for (let i = 0; i < this.x.length; i++) {
        for (let j = 0; j < this.x.length; j++) {
            this.x[i][j] = Number(this.squares[i * this.x.length + j].nativeElement.textContent);
        }
    }
  }

  private isBox9ToTheRight(box: HTMLElement): boolean {
    const boxNumber = box.id.replace('box', '');
    const modulus = Number(boxNumber) % this.x.length;

    if (modulus === 0) {
        return false;
    }

    const boxToTheRight = document.getElementById('box'.concat((Number(boxNumber) + 1).toString()));
    const boxToTheRightTextContent = boxToTheRight.textContent;

    if (boxToTheRightTextContent === '9') {
        return true;
    }

    return false;
  }

  private isBox9ToTheLeft(box: HTMLElement): boolean {
    const boxNumber = box.id.replace('box', '');
    const modulus = Number(boxNumber) % this.x.length;

    if (modulus === 1) {
        return false;
    }

    const boxToTheLeft = document.getElementById('box'.concat((Number(boxNumber) - 1).toString()));
    const boxToTheLeftTextContent = boxToTheLeft.textContent;

    if (boxToTheLeftTextContent === '9') {
        return true;
    }

    return false;
  }

  private isBox9OnTop(box: HTMLElement): boolean {
    const boxNumber = (Number)(box.id.replace('box', ''));
    if (boxNumber <= this.x.length) {
        return false;
    }
    const boxOnTop = document.getElementById('box'.concat((boxNumber - this.x.length).toString()));
    const boxOnTopTextContent = boxOnTop.textContent;

    if (boxOnTopTextContent === '9') {
        return true;
    }

    return false;
  }

  private isBox9Below(box: HTMLElement): boolean {
    const boxNumber = (Number)(box.id.replace('box', ''));
    if (boxNumber > this.x.length * (this.x.length - 1)) {
        return false;
    }
    const boxBelow = document.getElementById('box'.concat((boxNumber + this.x.length).toString()));
    const boxBelowTextContent = boxBelow.textContent;

    if (boxBelowTextContent === '9') {
        return true;
    }

    return false;
  }

  private addRemoveEventHandlersToSquares(): void {
    this.squares.forEach(s => {
      s.nativeElement.removeEventListener('drop', this.drop, false);
      s.nativeElement.removeEventListener('dragover', this.allowDrop, false);
      s.nativeElement.removeEventListener('dragstart', this.drag, false);

      this.renderer.setProperty(s.nativeElement, 'draggable', false);
    });

    if (this.isPuzzleSolved()) {
      return;
    }

    this.squares.forEach(s => {
      if (s.nativeElement.textContent === '9') {
        s.nativeElement.addEventListener('drop', this.drop, false);
        s.nativeElement.addEventListener('dragover', this.allowDrop, false);
      } else {
        if (this.isBox9Below(s.nativeElement) ||
           this.isBox9OnTop(s.nativeElement) ||
           this.isBox9ToTheLeft(s.nativeElement) ||
           this.isBox9ToTheRight(s.nativeElement)) {
          s.nativeElement.addEventListener('dragstart', this.drag, false);
          this.renderer.setProperty(s.nativeElement, 'draggable', true);
        }
      }
    });
  }

  private isPuzzleSolved(): boolean {
    for (let i = 0; i < this.x.length; i++) {
        for (let j = 0; j < this.x.length; j++) {
            if (this.x[i][j] !== solved[i][j]) {
                return false;
            }
        }
    }

    return true;
  }

  private scramblePuzzlePieces(maxNumberOfMoves: number): void {
      // this.manualScramble();

      for (let i = 0; i < maxNumberOfMoves; i++) {
        const swappable = this.getSwappable();
        // console.log(swappable);

        let swapWith9 = null;

        while (swapWith9 === null) {
          let random = this.getRandomInt(3);

          while (swappable[random] === null || swappable[random].textContent === '9') {
            random = this.getRandomInt(3);
          }

          swapWith9 = this.getBoxByTextContent(swappable[random].textContent);
        }

        this.swap(swapWith9, this.getBoxByTextContent('9'));

        swapWith9 = null;
      }
  }

  private getSwappable(): [HTMLElement, HTMLElement, HTMLElement] {
    const swappable: [HTMLElement, HTMLElement, HTMLElement] = [null, null, null];

    this.squares.forEach(s => {
      if (s.nativeElement.textContent === '9') {
        // do nothing
      } else {
        if (this.isBox9Below(s.nativeElement) ||
           this.isBox9OnTop(s.nativeElement) ||
           this.isBox9ToTheLeft(s.nativeElement) ||
           this.isBox9ToTheRight(s.nativeElement)) {
          if (swappable[0] === null) {
            swappable[0] = s.nativeElement;
          } else if (swappable[1] === null) {
            swappable[1] = s.nativeElement;
          } else {
            swappable[2] = s.nativeElement;
          }
        }
      }
    });

    return swappable;
  }

  private getBoxById(id: string): ElementRef {
    switch (id) {
      case '1': {
        return this.box1;
      }
      case '2': {
        return this.box2;
      }
      case '3': {
        return this.box3;
      }
      case '4': {
        return this.box4;
      }
      case '5': {
        return this.box5;
      }
      case '6': {
        return this.box6;
      }
      case '7': {
        return this.box7;
      }
      case '8': {
        return this.box8;
      }
      case '9': {
        return this.box9;
      }
    }
  }

  private getBoxByTextContent(content: string) {
    for (let i = 0; i < this.squares.length; i++) {
      if (this.squares[i].nativeElement.textContent === content) {
        return this.squares[i];
      }
    }
  }

  private reloadPage(): void {
    location.reload();
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
  }

  private manualScramble(): void {
    this.swap(this.getBoxById('6'), this.getBoxById('9'));
    this.swap(this.getBoxById('3'), this.getBoxById('6'));
    this.swap(this.getBoxById('2'), this.getBoxById('3'));
    this.swap(this.getBoxById('1'), this.getBoxById('2'));
    this.swap(this.getBoxById('4'), this.getBoxById('1'));
    this.swap(this.getBoxById('7'), this.getBoxById('4'));
    this.swap(this.getBoxById('8'), this.getBoxById('7'));
    this.swap(this.getBoxById('5'), this.getBoxById('8'));
  }
}
