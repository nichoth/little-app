var React = require('react');
var KvForm = require('react-auto-form');  // key-value form

module.exports = React.createClass({

  propTypes: {
    submitHandler: React.PropTypes.func.isRequired
  },

  submitHandler: function(event) {
    event.preventDefault();
    var vals = event.target.elements;
    var doc = {
      name: vals[0].value,
      url: vals[1].value
    };
    var kvData = this.refs.kvForm.getData();
    doc.metadata = kvData;
    console.log(doc);
    this.props.submitHandler(doc);
  },

  render: function() {
    return (
      <form onSubmit={this.submitHandler}>
        <div className="attrs">
          <label>Name <input type="text" name="name" placeholder="Name" />
          </label>
          <br />
          <label>URL <input type="text" name="url" placeholder="url" />
          </label>
          <br />
        </div>
        <h4> metadata </h4>
        <KvForm ref={'kvForm'} />
        <button type="submit">submit</button>
      </form>
    );
  }

});
