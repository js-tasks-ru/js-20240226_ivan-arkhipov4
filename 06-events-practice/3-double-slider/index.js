export default class DoubleSlider {
  subElements = {};
  max;
  min;

  constructor({
    min = 0,
    max = 0,
    selected = {},
    formatValue = value => value,
  } = {}
  ) {
    this.min = min;
    this.max = max;

    this.from = selected.from ?? min;
    this.to = selected.to ?? max;

    this.formatValue = formatValue;

    this.element = this.createElement(this.createTemplate());
    
    this.selectSubElements();
    this.createEventListeneres();
  }

  selectSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    
    for (const element of elements) {
      this.subElements[element.dataset.element] = element;
    }
  }

  createElement(template) {
    const element = document.createElement('div');
    
    element.innerHTML = template;
    
    return element.firstElementChild;
  }

  createTemplate() {
    const leftPercent = this.calcLeftPercents();
    const rightPercent = this.calcRightPercents();

    return `
      <div class="range-slider">
        <span data-element="from">${this.formatValue(this.from)}</span>
        <div class="range-slider__inner" data-element="container">
          <span class="range-slider__progress" data-element="progress" style="left: ${leftPercent}%; right: ${rightPercent}%"></span>
          <span class="range-slider__thumb-left" data-element="thumbLeft" style="left: ${leftPercent}%"></span>
          <span class="range-slider__thumb-right" data-element="thumbRight" style="right: ${rightPercent}%"></span>
        </div>
        <span data-element="to">${this.formatValue(this.to)}</span>
      </div>
  `;}

  calcLeftPercents() {
    const total = this.max - this.min;
    const value = this.from - this.min;
    
    const percents = Math.round(value / total * 100);
    
    return percents;
  }
  
  calcRightPercents() {
    const total = this.max - this.min;
    const value = this.max - this.to;
    
    const percents = Math.round(value / total * 100);
    
    return percents;
  }

  dispatchRangeEvent() {
    const rangeEvent = new CustomEvent(
      'range-select', {
        detail: {
          from: this.from,
          to: this.to
        }
      }
    );

    this.element.dispatchEvent(rangeEvent); 
  }

  calcDocumentPoinerMove = (e) => {
    const { left, width } = this.subElements.container.getBoundingClientRect();
    const containerLeftX = left;
    const containerWidthX = width;

    const rangeX = e.clientX - containerLeftX;
    const total = this.max - this.min;
    
    const value = this.min + rangeX * total / containerWidthX;
    return value;
  }

  onDocumentPoinerMove = (e) => {
    
    if (this.activeThumb === 'thumbRight') {
      const value = this.calcDocumentPoinerMove(e);
      const limitedValue = Math.min(this.max, Math.max(this.from, value));
      
      this.to = Math.round(limitedValue);
      this.subElements.to.textContent = this.formatValue(this.to);

      const percent = this.calcRightPercents() + '%';
      this.subElements.progress.style.right = this.subElements.thumbRight.style.right = percent;
    }
    
    if (this.activeThumb === 'thumbLeft') {
      const value = this.calcDocumentPoinerMove(e);
      const limitedValue = Math.max(this.min, Math.min(this.to, value));

      this.from = Math.round(limitedValue);
      this.subElements.from.textContent = this.formatValue(this.from);

      const percent = this.calcLeftPercents() + '%';
      this.subElements.progress.style.left = this.subElements.thumbLeft.style.left = percent;
    }    
    
  }
  
  onDocumentPointerUp = (e) => {
    this.dispatchRangeEvent();
    window.removeEventListener('pointermove', this.onDocumentPoinerMove);    
  }
  
  onDocumentPointerDown = (e) => {
    this.activeThumb = e.target.dataset.element;
    
    if (['thumbRight', 'thumbLeft'].includes(this.activeThumb)) {
      window.addEventListener('pointermove', this.onDocumentPoinerMove);
      window.addEventListener('pointerup', this.onDocumentPointerUp);
    }
  }

  onRightPointerDown = (e) => {
    document.addEventListener('pointerup', this.onDocumentPointerUp);
  }

  createEventListeneres() {
    document.addEventListener('pointerdown', this.onDocumentPointerDown);
  }

  destroyEventListeneres() {
    document.removeEventListener('pointerdown', this.onDocumentPointerDown);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.destroyEventListeneres();
    this.remove();
  }
}
