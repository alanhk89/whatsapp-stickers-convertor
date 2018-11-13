import React, { Component } from 'react';
import './App.css';
import StickerForm from './StickerForm';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="Container">
          <StickerForm />
        </div>
      </div>
    );
  }
}

export default App;
