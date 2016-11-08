'use babel';
import path from 'path';
import View from '../utils/view.js';
import CrumbsList from './crumbs-list.js';

class Navbar extends View {

  getDefaultTemplate() {
    return '<arc-navbar></arc-navbar>';
  }

  viewAfterStart(props, { pane }) {
    this.addCrumbsList(pane.getActiveItem());
    this.subscriptions.add(pane.onDidChangeActiveItem(activeItem => {
      if (this.refs.has('crumbs-list')) {
        this.refs.get('crumbs-list').destroy();
      }
      this.addCrumbsList(activeItem);
    }));
  }

  addCrumbsList(activeItem) {
    if (!atom.workspace.isTextEditor(activeItem)) return;
    const crumbsList = this.addView(CrumbsList, {
      ref: 'crumbs-list',
      items: this.buildCrumbsListData(activeItem),
    });
    crumbsList.render(this.element);
  }

  buildCrumbsListData(item) {
    const pjPath = atom.project.getPaths()[0];
    const arrPath = item.getPath().replace(pjPath, '').split('/').slice(1);
    let crumbPath = path.dirname(pjPath);
    arrPath.unshift(path.basename(pjPath));
    return arrPath.map(crumb => {
      crumbPath = `${crumbPath}/${crumb}`;
      return {
        name: crumb,
        path: crumbPath,
      };
    });
  }

}

export default Navbar;
