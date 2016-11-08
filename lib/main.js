'use babel';
import Navbar from './views/navbar.js';
import { CompositeDisposable } from 'atom';
import './utils/registerer.js';

export default {

  activate(state) {
    this.children = {};
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.workspace.observePanes(pane => {
      const paneElement = atom.views.getView(pane);

      /* Navigation Bar */
      const navbarRef = `navbar-${pane.id}`;
      const navbar = new Navbar({ ref: navbarRef }, { pane });
      navbar.render(paneElement.firstChild, 'beforebegin');
      this.children[navbarRef] = navbar;

      /* Pane Events */
      this.subscriptions.add(pane.onWillDestroy(() => {
        this.destroyChild(navbarRef);
      }));
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
    Object.keys(this.children).forEach(childName => {
      this.destroyChild(childName);
    });
  },

  destroyChild(name) {
    this.children[name].destroy();
    delete this.children[name];
  }

};
