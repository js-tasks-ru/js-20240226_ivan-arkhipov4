export default class ColumnChart {
  chartHeight = 50;
  
  constructor({
    data = [],
    label = '',
    value = 0,
    link = '',
    formatHeading = value => value
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;

    this.element = this.createElement(this.createTemplate());
  }
  
  createTemplate() {
    return `
    <div class="${this.createChartClasses()} column-chart" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        ${this.label}
        ${this.createLinkTemplate()}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">
          ${this.formatHeading(this.value)}
        </div>
        <div data-element="body" class="column-chart__chart">
          ${this.createChartBodyTemplate()}
        </div>
      </div>
    </div>
    `;
  }

  update(newData = []) {
    this.data = newData;
    this.element.querySelector('[data-element="body"]').innerHTML = this.createChartBodyTemplate();
  }

  createChartClasses() {
    return this.data.length ? '' : 'column-chart_loading';
  }

  getColumnProps() {
    const maxValue = Math.max(...this.data);
    const coeff = this.chartHeight / maxValue;
    return this.data.map(item => {
      return {
        value: String(Math.floor(item * coeff)),
        valuePercent: (item / maxValue * 100).toFixed(0)
      };
    });
  }

  createChartBodyTemplate() {
    return this.getColumnProps().map(({ value, valuePercent }) => `
        <div style="--value: ${value}" data-tooltip="${ valuePercent }%"></div>
      `).join('');
  }

  createLinkTemplate() {
    if (this.link) {
      return `<a href="${this.link}" class="column-chart__link">View all</a>`;
    }
    return '';
  }
  
  createElement(template) {
    const element = document.createElement('div');
    
    element.innerHTML = template;

    return element.firstElementChild; 
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
