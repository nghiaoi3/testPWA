import React, { Component } from 'react';


const Context = React.createContext({
    sumAdded: 0,
    remain:0,
    add: () => {},
    added_histories:[],

  });
export default Context 


  