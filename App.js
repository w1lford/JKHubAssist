const fs = require('fs');
'use strict';
const e = React.createElement;
var file = fs.readFileSync("data.json",'utf8'); //read the json file
var jsonData = JSON.parse(file);

class ModEntry extends React.Component {
  render() {
    const components = [];
    const image_link = this.props.thumb;
    const image = e('img', {src: image_link, width: 120, height: 120});
    const title = e('div', {className: 'mod-entry-title'}, this.props.title);
    const author = e('div', {className: 'mod-entry-author'}, this.props.author);
    const install = e('button',{className: 'mod-entry-install'},"Install") //may have to become a react component.
    components.push(image);
    components.push(title);
    components.push(author);
    components.push(install);
    return ( e('div', {className: 'mod-entry'}, components));
  }
}

class ModContent extends React.Component {
  render() {
    const components = [];

    //components.push(e(ModEntry, {title: "Poop", author: "Poopy", thumb: "https://jkhub.org/screenshots/monthly_10_2017/thumb-5bae4e29e800604ba8abb67b4cb7bb64-shot0379.jpg"}));
    jsonData[0].subcategory[4].files.forEach( (file) => {
      components.push(e(ModEntry, {title: file.name.substring(0,13) + "...", author: file.author, thumb: file.thumb}))
    });

    return (e('div', {className: 'mod-content'}, components));
  }
}

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
    components.push(e(ModContent));

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
