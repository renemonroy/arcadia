'use babel';
import { CompositeDisposable, Emitter } from 'atom';

class View {

  constructor(props, context = {}) {
    const defaultProps = {
      ref: null,
      className: null,
    };
    if (!props.ref) {
      throw new Error(`All views need a 'ref' property.`);
    }
    let tmpEl = document.createElement('div');
    this.refs = new Map();
    this.owner = null;
    this.props = Object.assign({}, defaultProps, props);
    this.context = context;
    tmpEl.insertAdjacentHTML('afterbegin', this.getDefaultTemplate(this.props));
    this.element = tmpEl.firstChild;
    tmpEl = null;
    if (this.props.className) {
      this.element.classList.add(this.props.className);
    }
    this.subscriptions = new CompositeDisposable();
    this.emitter = new Emitter();
    this.viewAfterStart(this.props, this.context);
  }

  viewAfterStart() {}
  viewAfterRender() {}
  viewBeforeDestroy() {}

  addView(ChildView, childProps = {}, extraContext = {}) {
    const context = Object.assign({}, this.context, extraContext);
    const childView = new ChildView(childProps, context);
    if (childView.owner) childView.owner.removeView(childView);
    this.refs.set(childView.props.ref, childView);
    childView.setOwner(this);
    return childView;
  }

  removeView(childRef) {
    if (this.refs.has(childRef)) {
      this.refs.get(childRef).owner = null;
      this.refs.delete(childRef);
    }
    return this;
  }

  setOwner(owner) {
    this.owner = owner;
    return this;
  }

  destroy() {
    this.viewBeforeDestroy();
    this.emitter.dispose();
    this.subscriptions.dispose();
    if (this.element) this.element.remove();
    this.refs.forEach((child, key) => {
      this.refs.get(key).destroy();
    });
    if (this.owner) this.owner.removeView(this.props.ref);
    this.element = null;
    this.props = null;
    this.context = null;
    this.refs = null;
    return null;
  }

  render(element, pos) {
    switch (pos) {
      case 'beforebegin':
        element.parentNode.insertBefore(this.element, element);
        break;
      case 'afterbegin':
        element.insertBefore(this.element, element.firstChild);
        break;
      case 'afterend':
        element.parentNode.insertBefore(this.element, element.nextSibling);
        break;
      default:
        element.appendChild(this.element);
        break;
    }
    this.viewAfterRender();
    return this;
  }

  getDefaultTemplate() {
    return `<div></div>`;
  }

}

export default View;
