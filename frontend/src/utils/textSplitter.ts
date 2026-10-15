/** Split laid-out text before animation transforms; preserve breaks and emphasis. */
export class TextSplitter {
  chars: Element[] = [];
  words: Element[] = [];
  lines: Element[] = [];
  elements: Element[] = [];
  selector: string;
  private originalHTML = new Map<Element, string>();

  constructor(target: string | Element | NodeListOf<Element> | Element[], vars?: { type?: string; linesClass?: string }) {
    const type = vars?.type || 'chars,words,lines';
    this.selector = typeof target === 'string' ? target : '';
    this.elements = typeof target === 'string' ? Array.from(document.querySelectorAll(target))
      : target instanceof Element ? [target] : Array.from(target);
    for (const element of this.elements) {
      this.originalHTML.set(element, element.innerHTML);
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      while (walker.nextNode()) nodes.push(walker.currentNode as Text);
      for (const node of nodes) {
        const fragment = document.createDocumentFragment();
        for (const token of (node.textContent || '').split(/(\s+)/)) {
          if (!token) continue;
          if (!token.trim()) { fragment.append(' '); continue; }
          const word = document.createElement('span');
          word.className = 'split-word';
          word.style.display = 'inline-block';
          word.style.whiteSpace = 'nowrap';
          if (type.includes('chars')) {
            for (const char of Array.from(token)) {
              const glyph = document.createElement('span');
              glyph.className = 'split-char';
              glyph.style.display = 'inline-block';
              glyph.textContent = char;
              word.append(glyph);
              this.chars.push(glyph);
            }
          } else word.textContent = token;
          fragment.append(word);
          this.words.push(word);
        }
        node.replaceWith(fragment);
      }
      if (type.includes('lines')) this.splitLines(element, vars?.linesClass || 'split-line');
    }
  }

  private splitLines(element: Element, className: string) {
    const groups: Element[][] = [];
    let top: number | undefined;
    for (const word of Array.from(element.querySelectorAll('.split-word'))) {
      const y = word.getBoundingClientRect().top;
      if (top === undefined || Math.abs(y - top) > 2) { groups.push([]); top = y; }
      groups[groups.length - 1].push(word);
    }
    // Ranges retain whitespace and inline formatting between the line's words.
    for (const group of groups.reverse()) {
      const range = document.createRange();
      range.setStartBefore(group[0]);
      range.setEndAfter(group[group.length - 1]);
      const contents = range.extractContents();
      const line = document.createElement('span');
      line.className = className;
      line.style.display = 'block';
      range.insertNode(line);
      line.append(contents);
      this.lines.unshift(line);
    }
    // The measured block wrappers now represent the explicit breaks as well.
    // Leaving <br> between them creates an empty line in the hero's name.
    element.querySelectorAll('br').forEach(br => br.remove());
  }

  revert() {
    for (const element of this.elements) {
      const html = this.originalHTML.get(element);
      if (html !== undefined) element.innerHTML = html;
    }
    this.chars = []; this.words = []; this.lines = [];
    this.originalHTML.clear();
  }
}
