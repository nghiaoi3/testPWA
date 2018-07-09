import React, { Component } from 'react';
import axios  from 'axios';

class Translate extends React.Component {

    constructor(props) {

         super(props);

         
  
    }




    render () {


        return(

            <div><h5>Đã chi số tiền : {this.props.total} (Đồng)</h5></div>
        )
    }



}

export default Translate;
