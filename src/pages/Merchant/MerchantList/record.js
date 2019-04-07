import React, { PureComponent } from 'react';

class Record extends PureComponent {

  componentWillMount() {

  }

  componentDidMount() {

  }

  render() {
    
    const {
      match: { params },
    } = this.props;

    return (
      <h2>{params.id}</h2>
    );
  }

}

export default Record;