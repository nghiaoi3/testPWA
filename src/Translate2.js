import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";
import numbered from "numbered";

class Translate2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      translated: ""
    };
  }


  

  render() {
    return (
      <div>
        Translated <span>{this.props.data}</span>{" "}
      </div>
    );
  }
}

export default Translate2;
