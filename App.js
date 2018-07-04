const fs = require('fs');
'use strict';
const e = React.createElement;
var file = fs.readFileSync("data.json",'utf8'); //read the json file
var jsonData = JSON.parse(file);

class Subcategory extends React.Component {
  render() {
    return( e('li', null, this.props.title));
  }
}

class CategoryHeader extends React.Component {
  render() {
    return( e('h4', {className: 'title'}, this.props.title));
  }
}

class Category extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const subcategories = [];
    subcategories.push(e(CategoryHeader, {title: this.props.categories.category}));
    this.props.categories.subcategory.forEach( (category) => {
      subcategories.push( e(Subcategory,{title: category.name}));
    });
    //return(e('div', {className: 'mod_category'}, e(CategoryHeader,{title: this.props.categories.category})));
    return( e('ul', {className: 'mod_category'}, subcategories));
  }
}

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const categories = [];
    jsonData.forEach( (cat) => {
      categories.push(e(Category, {categories: cat}));
    });
    return e('div', {className: 'sidebar'}, categories);
  }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(Sidebar), domContainer);
