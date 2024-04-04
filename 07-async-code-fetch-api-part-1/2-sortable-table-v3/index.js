import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV2 {
  LIMIT = 20;

  constructor(headersConfig, options = {}) {
    
    super(headersConfig, options);
    
    this.url = options.url ?? '';
    this.isSortLocally = options.isSortLocally ?? false;
    this.id = options.sorted?.id ?? this.defaultSortField;
    this.order = options.sorted?.order ?? this.defaultSortOrder;
    
    this.start = 0;
    this.limit = this.LIMIT;
    this.end = this.isSortLocally ? undefined : this.limit;

    this.loadingElement = this.createElement(this.createLoadingTemplate());
    this.placeholderElement = this.createElement(this.createEmptyPlaceholderTemplate());

    this.render();
  }

  async render() {
    this.data = await this.loadData();
    
    this.updateTemplates();

    let bottomRelativePos = this.getTableBottomRelativePos();

    while (bottomRelativePos < 0 && this.data.length !== 0) {
      this.start += this.limit;
      this.end += this.limit;

      await this.extendBody();

      bottomRelativePos = this.getTableBottomRelativePos();
    }
  }

  updateTemplates() {
    if (this.data.length == 0) {

      this.element.classList.add('sortable-table_empty');
      this.element.append(this.placeholderElement);

    } else {

      this.element.classList.remove('sortable-table_empty');
      this.placeholderElement.remove();
      
      this.updateBody();
      this.updateHeader(this.id, this.order);
    }
  }

  createURL() {
    const qParams = {
      '_sort': this.id,
      '_order': this.order,
      '_start': this.start,
      '_end': this.end
    };

    const url = new URL(this.url, BACKEND_URL);

    for (const [key, value] of Object.entries(qParams)) {

      if (value != undefined) {
        url.searchParams.set(key, value);
      }
    }

    return url;
  }

  async loadData() {
    const q = this.createURL();

    return await fetchJson(q);
  }

  async sort(id, order) {

    if (this.subElements.body.children.length == 0) {
      return;
    }
    
    if (this.isSortLocally) {      
      this.sortOnClient(id, order);    
    } else {
      await this.sortOnServer(id, order);
    }
  }

  sortOnClient (id, order) {
    const sortField = this.headerConfig.find((column) => column.id == id);
   
    this.sortData(sortField, order);
   
    this.updateTemplates();
  }

  async sortOnServer (id, order) {
    this.id = id;
    this.order = order;
    this.start = 0;
    this.end = this.limit;

    await this.render();
  }

  createLoadingTemplate() {
    return '<div data-element="loading" class="loading-line sortable-table__loading-line"></div>';
  }

  createEmptyPlaceholderTemplate() {
    return `
      <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        <div>
          <p>No products satisfies your filter criteria</p>
          <button type="button" class="button-primary-outline">Reset all filters</button>
        </div>
      </div>
    `;
  }

  getTableBottomRelativePos() {
    const totalHeight = document.documentElement.clientHeight;
    const tableBottom = this.element.getBoundingClientRect().bottom;
    
    return tableBottom - totalHeight;
  }

  async extendBody() {
    this.element.append(this.loadingElement);
    this.element.classList.add('sortable-table_loading');
    
    this.data = await this.loadData();
    
    this.loadingElement.remove();
    this.element.classList.remove('sortable-table_loading');

    if (this.data.length !== 0) {
      this.subElements.body.insertAdjacentHTML('beforeend', this.createTableBodyTemplate());     
    }
  }
  
  async onDocumentScroll(e) {
    const position = this.getTableBottomRelativePos();
    
    if (position <= 0 && this.data.length !== 0) {
      
      this.start += this.limit;
      this.end += this.limit;
      
      await this.extendBody();
    } 
  }

  createEvenListeners() {
    super.createEvenListeners();
    this.onDocumentScroll = this.onDocumentScroll.bind(this);
    window.addEventListener('scroll', this.onDocumentScroll);   
  }

  destroyEventListeners() { 
    super.destroyEventListeners();
    window.removeEventListener('scroll', this.onDocumentScroll);
  }
}
