class Tooltip {
  static #instance;

  constructor() {
    if (Tooltip.#instance) {
      return Tooltip.#instance;
    }
    Tooltip.#instance = this;

    this.element = this.createElement(this.createTemplate());
  }

  render(text) {
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
    document.addEventListener('pointerover', (e) => this.onDocumentPointerOver(e));
  }
  
  onDocumentPointerOver(e) {
    const target = e.target.closest('[data-tooltip]');

    if (target) {      
      this.render(target.dataset.tooltip);     
      
      target.addEventListener(
        'pointermove', (e) => this.onDocumentPointerMove(e)
      );
      
      target.addEventListener(
        'pointerout',
        (e) => this.onDocumentPointerOut(e),
        { once: true }
      );
    }
  }

  onDocumentPointerMove(e) {
    this.element.style.left = e.pageX + 'px';
    this.element.style.top = e.pageY + 'px';
  }

  onDocumentPointerOut(e) {
    e.target.removeEventListener('pointermove', (e) => this.onTargetPointerMove(e));
    this.remove();
  }

  remove() {
    this.element.remove();
  }

  destroyEventListeners() {
    document.removeEventListener('pointerover', (e) => this.onDocumentPointerOver(e));
  }
  
  destroy() {
    this.destroyEventListeners();
    this.remove();
  }
}

export default Tooltip;
