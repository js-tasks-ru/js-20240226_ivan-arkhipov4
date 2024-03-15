export default class SortableTable {
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    
    this.element = this.createElement(this.createTemplate());
    this.markerElement = this.createElement(this.createSortMarkerTemplate());
    
    this.selectSubElements();
  }
  
  sort(sortFieldId = '', orderValue = '') {
    const sortField = this.headerConfig.find((column) => column.id == sortFieldId);
    this.sortData(sortField, orderValue);
    this.updateBody();
    this.updateHeader(sortFieldId, orderValue);
  }
  
  sortData(sortField, orderValue) {
    const field = sortField.id;
    const sortFunc = this.getSortFunc(sortField.sortType);
    
    this.data.sort(
      (a, b) => {
        const key = sortFunc(a[field], b[field]);
        return orderValue === 'asc' ? key : -key;  
      }
    );
    return;  
  }

  getSortFunc(sortType) {
    if (sortType === 'number') {
      return (a, b) => a - b;
    }
    if (sortType === 'string') {
      return (a, b) => a.localeCompare(
        b, undefined, { numeric: true, caseFirst: 'upper' }
      );
    }
  }

  updateBody() {
    this.subElements.body.innerHTML = this.createTableBodyTemplate();
  }

  updateHeader(columnId, order) {
    this.markerElement.remove();
    const columnElement = this.subElements.header.querySelector(`[data-id=${columnId}]`);
    columnElement.append(this.createSortMarkerTemplate());
    columnElement.dataset.order = order;
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  selectSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    for (const element of elements) {
      this.subElements[element.dataset.element] = element;
    }
    return this.subElements;
  }

  createTemplate() {return `
    <div class="sortable-table">
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.createTableHeaderTemplate()}
    </div>
      <div data-element="body" class="sortable-table__body">
        ${this.createTableBodyTemplate()}
      </div>
  `;}

  createTableHeaderTemplate() {return (
    this.headerConfig.map((column) => {return `
      <div class="sortable-table__cell"
        data-id="${column.id}"
        data-sortable="${column.sortable}" data-order="">
      <span>${column.title}</span>
      </div>
      `;}
    ).join(''));
  }

  createTableBodyTemplate() {return (
    this.data.map(
      item => {return (`
        <a href="#" class="sortable-table__row">    
          ${this.createTableRawTemplate(item)}
        </a>
      `);}
    ).join('')
  );}
  
  createTableColumnTemplate(column) {
    if (column.template) {
      return column.template;
    }
    return (
      (value) => `<div class="sortable-table__cell">${value}</div>`
    );
  }

  createTableRawTemplate(rawData) {
    return this.headerConfig.map(
      column => this.createTableColumnTemplate(column)(rawData[column.id])
    ).join('');
  }

  createSortMarkerTemplate() {return `
    <span data-element="arrow" class="sortable-table__sort-arrow">
      <span class="sort-arrow"></span>
    </span>
  `;}

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}