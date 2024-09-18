import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightSQL]',
  standalone: true,
})
export class HighlightSQLDirective {
  private keywords = [
    'SELECT',
    'FROM',
    'WHERE',
    'INSERT',
    'UPDATE',
    'DELETE',
    'INNER',
    'JOIN',
  ];

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    const cursorPosition = range?.startOffset || 0;

    const inputValue = this.el.nativeElement.innerText || '';
    const highlightedText = this.highlightKeywords(inputValue);

    // Guardar a posição relativa do cursor antes da atualização do HTML
    const relativePosition = this.getRelativeCursorPosition(
      this.el.nativeElement,
      selection?.focusNode,
      cursorPosition
    );

    // Atualizar o conteúdo do div com o texto formatado
    this.renderer.setProperty(
      this.el.nativeElement,
      'innerHTML',
      highlightedText
    );

    // Restaurar a posição do cursor após a atualização
    this.restoreRelativeCursorPosition(this.el.nativeElement, relativePosition);
  }

  // Função que altera palavras reservadas para uppercase e cor azul
  private highlightKeywords(text: string): string {
    if (!text) return '';
    const regex = new RegExp(`\\b(${this.keywords.join('|')})\\b`, 'gi');
    return text.replace(
      regex,
      (match) => `<span style="color: blue;">${match.toUpperCase()}</span>`
    );
  }

  // Calcula a posição relativa do cursor em relação aos nós de texto
  private getRelativeCursorPosition(
    parent: HTMLElement,
    currentNode: any,
    cursorOffset: number
  ) {
    let length = 0;
    const walker = document.createTreeWalker(
      parent,
      NodeFilter.SHOW_TEXT,
      null
    );
    while (walker.nextNode()) {
      if (walker.currentNode === currentNode) {
        return length + cursorOffset;
      }
      length += walker.currentNode.textContent?.length || 0;
    }
    return length;
  }

  // Restaura a posição do cursor em um nó de texto correspondente
  private restoreRelativeCursorPosition(
    parent: HTMLElement,
    cursorPosition: number
  ) {
    const selection = window.getSelection();
    const range = document.createRange();
    const walker = document.createTreeWalker(
      parent,
      NodeFilter.SHOW_TEXT,
      null
    );
    let length = 0;
    let node: Node | null = null;

    while (walker.nextNode()) {
      node = walker.currentNode;
      const nodeLength = node.textContent?.length || 0;
      if (length + nodeLength >= cursorPosition) {
        const offset = cursorPosition - length;
        range.setStart(node, offset);
        range.setEnd(node, offset);
        break;
      }
      length += nodeLength;
    }

    if (node) {
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }
}
