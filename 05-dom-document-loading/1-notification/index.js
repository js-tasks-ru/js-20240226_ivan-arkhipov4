export default class NotificationMessage {
  static lastInstance;

  constructor(
    message = '',
    {duration = 0, type = ''} = {}
  ) {
    
    this.message = message;
    this.duration = duration;
    this.type = type;
    
    this.timerId = null;

    this.element = this.createElement(this.createTemplate());
  }
  
  show(container = document.body) {
    if (NotificationMessage.lastInstance) {
      NotificationMessage.lastInstance.destroy();
    }
    NotificationMessage.lastInstance = this;
    container.append(this.element);
    this.timerId = setTimeout(() => this.destroy(), this.duration);    
  }

  createElement(template) {
    const element = document.createElement('div');

    element.innerHTML = template;

    return element.firstElementChild;
  }

  createTemplate() {
    return (`
      <div class="notification ${this.type}" style="--value:${(this.duration / 1000).toFixed(3)}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `);
  }

  remove() {
    this.element.remove();
    NotificationMessage.lastInstance = null;
  }
  
  destroy() {
    this.remove();
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  }
}