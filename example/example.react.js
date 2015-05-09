var React = require('react');
var Form = require('react-auto-form');
window.React = React;
var Pouch = require('pouchdb');
var Adapter = require('./db-adapter');

var adapter = new Adapter(new Pouch('adapter-test'));

var App = React.createClass({

  submitHandler: function(event) {
    event.preventDefault();
    var data = this.refs.form.getData();
    adapter.createNode({name: 'bla', url:'some url'}, data);
    // console.log(this.refs.form.getData());
  },

  render: function() {
    return (
      <form onSubmit={this.submitHandler}>
        <Form ref={'form'} />
        <button type="submit">submit</button>
      </form>
    );
  }

});

React.render(<App />, document.body);
