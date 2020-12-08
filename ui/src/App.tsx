import React, {Component} from 'react';
import {Header, HeaderContent, Icon} from "semantic-ui-react";
import axios from "axios";
import './App.css';

 
class App extends Component {
  state = {
    values: []
  }

  componentDidMount() {
    axios.get("http://localhost:5000/api/values")
    .then(response => (
      this.setState({values: response.data})
    ))
  }

  render() {
    return (
    <div>
      <Header as="h2">
        <Icon name="user" />
        <HeaderContent>Event Hub</HeaderContent>
      </Header>
        <ul>
          {this.state.values.map((value: any) => (
            <li key={value.id}>{value.name}</li>
          ))}
        </ul>
    </div>
  );}
}
 

export default App;
