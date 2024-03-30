import fetchJson from './utils/fetch-json.js';
import ColumnChartV1 from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';


const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChartV2 extends ColumnChartV1 {
  subElements = [];

  constructor(props = {}) {
    super(props);
    
    this.url = props.url ?? '';
    this.from = props.range?.from ?? new Date();
    this.to = props.range?.to ?? new Date(0);
    
    this.selectSubElements();
    this.update(this.from, this.to);
  }

  selectSubElements() {
    const elements = this.element.querySelectorAll('[data-element]'); 
  
    for (const element of elements) {
      this.subElements[element.dataset.element] = element;
    }
  }

  calcValue() {
    this.value = this.data.reduce((sum, cur) => sum + cur, 0);
  }

  updateTemplates() {
    this.subElements.body.innerHTML = this.createChartBodyTemplate();
    this.subElements.header.innerHTML = this.formatHeading(this.value);
  }
  
  async fetchData() {
    const url = new URL(this.url, BACKEND_URL);

    url.searchParams.set('from', this.from);
    url.searchParams.set('to', this.to);

    return await fetchJson(url);
  }
  
  async update(from, to) {
    this.from = from;
    this.to = to;
    
    this.element.classList.add('column-chart_loading');
    
    const loadedData = await this.fetchData();
    
    this.data = Object.values(loadedData);
    
    this.calcValue();
    
    this.updateTemplates();
    
    if (loadedData.length != 0) {
      this.element.classList.remove('column-chart_loading');   
    }
    return loadedData;
  }
}
