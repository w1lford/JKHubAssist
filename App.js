const fs = require('fs');
'use strict';
const e = React.createElement;
var file = fs.readFileSync("data.json",'utf8'); //read the json file
var jsonData = JSON.parse(file);

class SearchBar extends React.Component {
  render() {
    const searchBarInput =  e('input',{type: "text", id: "search-input", value: "Search..."});
    return ( e('div', {className: 'search-bar'},searchBarInput));
  }
}

class ContentPane extends React.Component {
  render() {
    const components = [];
    components.push(e(SearchBar));
    components.push(e('p', null, 'Hello, world!'));
    components.push(e('p', null, 'Hello, world!'));
    components.push(e('p', null, 'Hello, world!'));
    components.push(e('p', null, 'Hello, world!'));
    components.push(e('p', null, 'Hello, world!'));
    components.push(e('p', null, 'Hello, world!'));
    components.push(e('p', null, 'Hello, world!'));
    return ( e('div', {className: 'content-pane'}, components));
  }
}

class SubCategoryButton extends React.Component {
  render() {
    return( e('button',null,this.props.title));
  }
}

class Subcategory extends React.Component {
  render() {
    return( e('li', null, e(SubCategoryButton, {title: this.props.title})));
  }
}

class CategoryHeader extends React.Component {
  render() {
    return( e('h4', {className: 'title'}, this.props.title));
  }
}

class Category extends React.Component {
  render() {
    const subcategories = [];
    subcategories.push(e(CategoryHeader, {title: this.props.categories.category}));
    this.props.categories.subcategory.forEach( (category) => {
      subcategories.push( e(Subcategory,{title: category.name}));
    });
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

class App extends React.Component {
  render() {
    const components = [];
    components.push(e(Sidebar));
    components.push(e(ContentPane));
    return e('div', {id: 'app'}, components);
  }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(App), domContainer);
