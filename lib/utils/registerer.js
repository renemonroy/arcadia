'use babel';
(function Registerer() {
  const newElements = [
    { tagName: 'arc-navbar', tagType: 'nav' },
    { tagName: 'arc-crumbs-list', tagType: 'ul' },
    { tagName: 'arc-crumb-item', tagType: 'li' },
  ];

  const registerTag = (tagName, tagType) => {
    document.registerElement(tagName, {
      prototype: Object.create(HTMLElement.prototype),
      extends: tagType,
    });
  };

  newElements.forEach(({ tagName, tagType }) =>
    (registerTag(tagName, tagType)));
}(window || this));