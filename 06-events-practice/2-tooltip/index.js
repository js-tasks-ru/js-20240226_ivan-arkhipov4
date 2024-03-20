class Tooltip {
  static #instance;

  constructor() {
    if (Tooltip.#instance) {
      return Tooltip.#instance;
    }
    Tooltip.#instance = this;

    this.element = this.createElement(this.createTemplate());
  }
  
  onDocumentPointerOver = (e) => {
    const target = e.target.closest('[data-tooltip]');

    if (target) {      
      this.render(target.dataset.tooltip);     
      
      target.addEventListener(
        'pointermove', this.onDocumentPointerMove
      );
      
      target.addEventListener(
        'pointerout',
        this.onDocumentPointerOut,
        { once: true }
      );
    }
  }

  onDocumentPointerMove = (e) => {
    this.element.style.left = e.pageX + 5 + 'px';
    this.element.style.top = e.pageY + 5 + 'px';
  }

  onDocumentPointerOut = (e) => {
    e.target.removeEventListener('pointermove', this.onDocumentPointerMove);
    this.remove();
  }

  render(text = '') {
    document.body.append(this.element);
    this.element.textContent = text;
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    return `<div class="tooltip">This is tooltip</div>`;
  }

  initialize () {
    document.addEventListener('pointerover', this.onDocumentPointerOver);
  }
  
  remove() {
    this.element.remove();
  }

  destroyEventListeners() {
    document.removeEventListener('pointerover', this.onDocumentPointerOver);
  }
  
  destroy() {
    this.destroyEventListeners();
    this.remove();
  }
}

export default Tooltip;
