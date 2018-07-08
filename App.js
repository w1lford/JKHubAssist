const fs = require('fs');
'use strict';
const e = React.createElement;
var file = fs.readFileSync("data.json",'utf8'); //read the json file
var jsonData = JSON.parse(file);

class ModEntry extends React.Component {
  render() {
    const components = [];
    const image_link = this.props.thumb;
    const image = e('img', {src: image_link, title: this.props.title, width: 120, height: 120});
    const title = e('div', {className: 'mod-entry-title'}, this.props.title.substring(0,13) + "...");
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
    var modContent = this.props.fileState.files;

    modContent.forEach( (file) => {
      components.push(e(ModEntry, {title: file.name, author: file.author, thumb: file.thumb}))
    });
    return (e('div', {className: 'mod-content'}, components));
  }
}

class SearchBar extends React.Component {
  render() {
    const searchBarInput =  e('input',{type: "text", id: "search-input", placeholder: "Search..."});
    return ( e('div', {className: 'search-bar'},searchBarInput));
  }
}

class ContentPane extends React.Component {
  render() {
    const components = [];
    components.push(e(SearchBar));
    components.push(e(ModContent, {fileState: this.props.fileState}));
    return ( e('div', {className: 'content-pane', fileState: this.props.fileState}, components));
  }
}

class SubCategoryButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick(files) {
    this.props.handleButtonClick(files);
  }

  handleClick() {
    this.handleButtonClick(this.props.subCategory.files);
  }

  render() {
    return( e('button',{onClick: this.handleClick},this.props.subCategory.name));
  }
}

class Subcategory extends React.Component {
  render() {
    return( e('li', null, e(SubCategoryButton, {subCategory: this.props.subCategory, handleButtonClick: this.props.handleButtonClick})));
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
    this.props.categories.subcategory.forEach( (subcat) => {
      subcategories.push( e(Subcategory,{subCategory: subcat, handleButtonClick: this.props.handleButtonClick}));
    });
    return( e('ul', {className: 'mod_category'}, subcategories));
  }
}

class Sidebar extends React.Component {
  render() {
    const categories = [];
    jsonData.forEach( (cat) => {
      categories.push(e(Category, {categories: cat, handleButtonClick: this.props.handleButtonClick}));
    });
    return e('div', {className: 'sidebar'}, categories);
  }
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {files: jsonData[0].subcategory[7].files};
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick(files) {
    this.setState({files: files}); //change the state so the new file list is shown in the UI.
  }

  render() {
    const components = [];
    components.push(e(Sidebar, {handleButtonClick: this.handleButtonClick}));
    components.push(e(ContentPane, {fileState: this.state}));
    return e('div', {id: 'app'}, components);
  }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(App), domContainer);
