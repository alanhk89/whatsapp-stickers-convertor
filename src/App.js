import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      identifier: '',
      name: '',
      publisher: '',
      trayImage: ''
    };
  }

  getBase64 = (evt, stateName) => {
    var file = evt.target.files[0]
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      this.setState({
        [stateName]: reader.result.split(',')[1],
      })
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    }
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
  }

  renderJSON = () => {
    const { identifier, name, publisher, trayImage } = this.state;
    return (
      <textarea className="JSONContainer" readOnly value={JSON.stringify({identifier, name, publisher, tray_image: trayImage})}></textarea>
    );
  }

  updateInputValue = (evt, stateName) => {
    this.setState({
      [stateName]: evt.target.value
    });
  }

  uploadImage = (selectedFiles) => {
    console.log(selectedFiles);
  }

  renderStickersInputs = () => {
    const min = 3;
    let stickerItems = [];
    for (let i = 0; i < min; i++) {
      stickerItems.push(<span><input type="file" name="stickers" accept='.webp'/></span>);
    }
    return <div className="row">{stickerItems}</div>
  }

  render() {
    return (
      <div className="App">
        <div className="Container">
          <form className="StickerForm" onSubmit={this.handleSubmit}>
            <div className="row">
              <label>
                Identifier:
              </label>
              <span><input type="text" name="identifier" value={this.state.identifier} onChange={evt => this.updateInputValue(evt, 'identifier')} /></span>
            </div>
            <div className="row">
              <label>
                Name:
              </label>
              <span><input type="text" name="name" value={this.state.name} onChange={evt => this.updateInputValue(evt, 'name')} /></span>
            </div>
            <div className="row">
              <label>
              Publisher:
              </label>
              <span><input type="text" name="publisher" value={this.state.publisher} onChange={evt => this.updateInputValue(evt, 'publisher')} /></span>
            </div>
            <div className="row">
              <label>
              Tray Image:
              </label>
              <span><input type="file" name="tray_image" accept='.png' onChange={evt => this.getBase64(evt, 'trayImage')} /></span>
            </div>
            <div className="row">
              <label>
              Stickers:
              </label>
            </div>
            {this.renderStickersInputs()}
          </form>
          {this.renderJSON()}
        </div>
      </div>
    );
  }
}

export default App;
