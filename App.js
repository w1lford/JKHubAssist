const fs = require('fs');
'use strict';
const e = React.createElement;
var file = fs.readFileSync("data.json",'utf8'); //read the json file
var jsonData = JSON.parse(file);

class ModEntry extends React.Component {
  render() {
    const components = [];
    const maxLength = 13;
    var titleName = this.props.title;
    if(titleName.length > maxLength) { //prevent name length overflow
      titleName = titleName.substring(0,maxLength) + "...";
    }
    const image_link = this.props.thumb;
    const image = e('img', {src: image_link, title: this.props.title, width: 120, height: 120});
    const title = e('div', {className: 'mod-entry-title'}, titleName);
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
      var searchQuery = this.props.fileState.searchText.toLowerCase();
      var fileName = file.name.toLowerCase();
      var fileAuthor = file.author.toLowerCase();
      if(fileName.indexOf(searchQuery) === -1 && fileAuthor.indexOf(searchQuery) === -1 ) {
        return;
      }
      components.push(e(ModEntry, {title: file.name, author: file.author, thumb: file.thumb}))
    });
    return (e('div', {className: 'mod-content'}, components));
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.initialState = this.props.fileState;
  }

  handleChange(e) {
    this.props.changeSearchText(e.target.value);
  }

  render() {
    const searchBarInput =  e('input',{type: "text", id: "search-input", onChange: this.handleChange, placeholder: "Search..."});
    return ( e('div', {className: 'search-bar'},searchBarInput));
  }
}

class ContentPane extends React.Component {
  render() {
    const components = [];
    components.push(e(SearchBar, {fileState: this.props.fileState, changeState: this.props.changeState, changeSearchText: this.props.changeSearchText}));
    components.push(e(ModContent, {fileState: this.props.fileState}));
    return ( e('div', {className: 'content-pane', fileState: this.props.fileState}, components));
  }
}

class SubCategoryButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  changeState(files) {
    this.props.changeSearchText("");
    this.props.changeState(files);
  }

  handleClick() {
    this.changeState(this.props.subCategory.files);
  }

  render() {
    return( e('button',{onClick: this.handleClick},this.props.subCategory.name));
  }
}

class Subcategory extends React.Component {
  render() {
    return( e('li', null, e(SubCategoryButton, {subCategory: this.props.subCategory, changeState: this.props.changeState, changeSearchText: this.props.changeSearchText})));
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
      subcategories.push( e(Subcategory,{subCategory: subcat, changeState: this.props.changeState, changeSearchText: this.props.changeSearchText}));
    });
    return( e('ul', {className: 'mod_category'}, subcategories));
  }
}

class Sidebar extends React.Component {
  render() {
    const categories = [];
    jsonData.forEach( (cat) => {
      categories.push(e(Category, {categories: cat, changeState: this.props.changeState, changeSearchText: this.props.changeSearchText}));
    });
    return e('div', {className: 'sidebar'}, categories);
  }
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {files: jsonData[0].subcategory[7].files, searchText: ""}; //default file list
    this.changeState = this.changeState.bind(this);
    this.changeSearchText = this.changeSearchText.bind(this);
  }

  changeState(files) {
    this.setState({files: files}); //change the state so the new file list is shown in the UI.
  }

  changeSearchText(text){
    this.setState({searchText: text});
  }

  render() {
    const components = [];
    components.push(e(Sidebar, {changeState: this.changeState, changeSearchText: this.changeSearchText}));
    components.push(e(ContentPane, {fileState: this.state, changeState: this.changeState, changeSearchText: this.changeSearchText}));
    return e('div', {id: 'app'}, components);
  }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(App), domContainer);
