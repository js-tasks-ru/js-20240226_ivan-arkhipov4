import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTableV2 extends SortableTableV1 {
  defaultSortField = 'title';
  defaultSortOrder = 'asc';

  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, data);
    this.sorted = sorted;

    this.createEvenListeners();

    this.sort(this.defaultSortField, this.defaultSortOrder);
  }

  createEvenListeners() {
    this.subElements.header.addEventListener(
      'pointerdown', (e) => this.onHeaderPointerDown(e)
    );
  }

  onHeaderPointerDown(e) {
    const columnElement = e.target.closest('[data-sortable=true]');

    if (!columnElement) {
      return;
    }

    const orderValue = columnElement.dataset.order === 'desc' ? 'asc' : 'desc';
    const columnId = columnElement.dataset.id;

    this.sort(columnId, orderValue);
  }

  destroyEventListeners() { 
    this.subElements.header.removeEventListener(
      'pointerdown', (e) => this.onHeaderPointerDown(e)
    );
  }

  destroy() {
    super.destroy();
    this.destroyEventListeners();
  }
}
