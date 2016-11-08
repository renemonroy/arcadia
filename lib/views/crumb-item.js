'use babel';
import View from '../utils/view.js';
import Menu from './menu.js';

class CrumbItem extends View {

  getDefaultTemplate({ name }) {
    return (
      `<arc-crumb-item>
        <a>${name}</a>
      </arc-crumb-item>`
    );
  }

  viewAfterStart() {
    this.linkElement = this.element.getElementsByTagName('a')[0];
    this.bindEvents();
    this.addEventListeners();
  }

  viewBeforeDestroy() {
    this.removeEventListeners();
    this.linkElement = null;
    if (this.modal) this.modal.destroy();
  }

  bindEvents() {
    this.handleClick = this.handleClick.bind(this);
  }

  addEventListeners() {
    this.element.addEventListener('click', this.handleClick);
  }

  removeEventListeners() {
    this.element.removeEventListener('click', this.handleClick);
  }

  handleClick(e) {
    e.preventDefault();
    // this.activateModal();
  }

  activateModal() {
    const menu = this.addView(Menu, { ref: 'menu' });
    this.modal = atom.workspace.addModalPanel({
      item: menu.element,
    });
    this.modal.show();
  }

  deactivateModal() {
    this.modal.hide();
    this.refs.menu.destroy();
    this.modal.destroy();
    this.modal = null;
  }

  changeName(name) {
    this.linkElement.textContent = name;
    return this;
  }

}

export default CrumbItem;
