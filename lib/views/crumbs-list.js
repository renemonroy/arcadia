'use babel';
import View from '../utils/view.js';
import CrumbItem from './crumb-item.js';

class CrumbsList extends View {

  getDefaultTemplate() {
    return '<arc-crumbs-list></arc-crumbs-list>';
  }

  viewAfterStart() {
    this.addCrumbItems();
  }

  addCrumbItems() {
    const { items } = this.props;
    const docFrag = document.createDocumentFragment();
    items.forEach(({ name, path }, i) => {
      const crumbItem = this.addView(CrumbItem, {
        ref: `crumb-item-${i}`,
        name,
        path,
      });
      docFrag.appendChild(crumbItem.element);
    });
    this.element.appendChild(docFrag);
  }

}

export default CrumbsList;
