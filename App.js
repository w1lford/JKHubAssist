const fs = require('fs');
'use strict';
const e = React.createElement;
var file = fs.readFileSync("data.json",'utf8'); //read the json file
var data = JSON.parse(file);

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like'
    );
  }
}

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e('h1',null, data[0].category, data[1].category);
  }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(Sidebar), domContainer);
