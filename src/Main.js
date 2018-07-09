import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  FormText
} from "reactstrap";

import Detail from "./Detail";
import Filter from "./Filter";
import Translate2 from "./Translate2";

import moment from "moment";
import axios from "axios";
//import converter from 'number-to-words';
import _ from "lodash";
import numbered from "numbered";

import { DateRangePicker, DayPickerRangeController } from "react-dates";
import Context from "./Context";

import firebase from 'firebase';


  var config = {
    apiKey: "AIzaSyBozz-7o3ap3YoQvssrt17ClJ7Z2tDn_20",
    authDomain: "etrap-a0229.firebaseapp.com",
    databaseURL: "https://etrap-a0229.firebaseio.com",
    projectId: "etrap-a0229",
    storageBucket: "etrap-a0229.appspot.com",
    messagingSenderId: "787999366132"
  };
  firebase.initializeApp(config);

  const database =firebase.database()
  const exPenses = database.ref('exPenses');
  const tranSactions = database.ref('tranSactions');

  //database.ref('expenses').then(()=>{console.log('saved')})

  //database.ref('transactions').set({test:'nghia'}).then(()=>{console.log('saved')})

//import InfiniteCalendar from 'react-infinite-calendar';
//import 'react-infinite-calendar/styles.css'; // Make sure to import the default stylesheet



/*https://www.json-generator.com/
[
  '{{repeat(30)}}',
   
   {
      id: '{{objectId()}}',
      date: '{{date(new Date(2017, 0, 1), new Date(), "YYYY-MM-dd")}}',
      type: function () {
      return ['ĂN','GIẤY VUÔNG','XÀ BÔNG','NƯỚC BÌNH'][Math.floor(Math.random()*4)];
    },
      amount: '{{integer(20, 150)}}',
      note: '{{lorem(1, "sentences")}}',
      flag: '{{bool()}}'
    }
]
*/
class Main extends React.Component {
  constructor(props) {
    super(props);
    var today = moment().format("YYYY-MM-DD");

    this.state = {
      date: today,
      select: "ĂN",
      number: "130",
      text: "",
      modal: false,
      data: [],
      translate_result: "",
      focusedInput: null,
      start: '',
      end: '',
      type: "all",
      expenses_total: 0,
      added_total: 0,
      added_histories:[],
      flagged: null,
      keywordNote: "",
      isSearch: false,


    };

    this.toggle = this.toggle.bind(this);
  }


componentDidMount(){
  const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
  const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

  var Datefrom = startOfMonth
  var Dateto = endOfMonth


//Fetch data of exPenses from Firebase
  exPenses.once('value').then((snapshot) => {


    console.log('snapshot',snapshot.val())
    //Parse data
    const expenses = [];
var expensesTotal =0
    snapshot.forEach((childSnapshot) => {

      expensesTotal += (childSnapshot.val().amount)*1;

      expenses.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

   // this.setState({data:expenses})
    this.setState({data:expenses,expenses_total:expensesTotal,start:Datefrom,end:Dateto},
      () => {
        this.translateApi();
      })
  });

//Fetch data of tranSactions from Firebase
  tranSactions.once('value').then((snapshot) => {

    var total = 0;
    const transactions = [];

    //Parse data

    snapshot.forEach((childSnapshot) => {
      total += (childSnapshot.val().amt);
      transactions.push({
        ...childSnapshot.val()
      });
    });
   // this.setState({data:expenses})
    this.setState({added_total:total,added_histories: transactions})
  });

}

  toggle() {
    console.log("test");
    this.setState({
      modal: !this.state.modal
    });
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = event => {


    var newEP = {
      date: this.state.date,
      type: this.state.select,
      amount: this.state.number,
      note: this.state.text,
      flag: false
    }

    exPenses.push(newEP).then((ref)=>{
      console.log('ref returned',ref)
      
      this.setState(
        {
          data: this.state.data.concat({id:ref.key,...newEP}),
          date: moment().format("YYYY-MM-DD"),
          select: "ĂN",
          number: "130",
          text: "",
          modal: false
        },
        () => {
          this.translateApi();
        }
      );

    })

   

    event.preventDefault();

    //this.translateTotal()
  };

  translateApi = () => {
    const total = _.sumBy(this.state.data, function(o) {
      return o.amount * 1000;
    });
    const key = "6823b4cc-4e0f-4781-9010-0336a14f7ea5";

    const total_inWords = numbered.stringify(total).replace(/-/g, " ");
    console.log("total_inWords", total_inWords);

    axios
      .get(
        "https://api-platform.systran.net/translation/text/translate?input=" +
          total_inWords +
          "&source=en&target=vi&withSource=false&withAnnotations=false&backTranslation=false&encoding=utf-8&key=" +
          key,
        {}
      )
      .then(response => {
        var words = response.data.outputs[0].output;

        this.setState({
          translate_result: words,
          expenses_total: total / 1000
        });
      });
    /*
       axios.get("https://systran-systran-platform-for-language-processing-v1.p.mashape.com/translation/text/translate?source=en&target=vi&input="+total_inWords,  {
          headers: { "X-Mashape-Key": "D17m0rIuhsmshLV1jMflfgNWLvDHp1mhiwhjsnk1ASeXbki5oF" }
      }) .then(response => {
          var words = response.data.outputs[0].output 


                    this.setState({translate_result:words})
                
      
         });*/
  };



  delete = id => {

    database.ref('exPenses/'+id).remove().then(() => {
      console.log('removed')
    });


    let copyArrayData = [...this.state.data];
    let index = copyArrayData.findIndex(el => {
      return el.id == id;
    });
    copyArrayData.splice(index, 1);

    this.setState(
      {
        data: copyArrayData
      },
      () => {
        this.translateApi();
      }
    );
  };

  submitEdit = (id, newObj) => {

    database.ref('exPenses/'+id).update(newObj).then(() => {
console.log('database updated')
    });


    console.log('id edit',id)
    //not mutate state of data
    let copyArrayData = [...this.state.data];
    let index = copyArrayData.findIndex(el => {
      return el.id == id;
    });

    console.log("index edit is", index);
    copyArrayData[index] = newObj;
    copyArrayData[index].id = this.state.data[index].id

    copyArrayData[index].flag = this.state.data[index].flag

    this.setState(
      {
        data: copyArrayData
      },
      () => {
        this.translateApi();
      }
    );
  };

  filterRange = (startDate, endDate, flagged, keywordNote) => {
    this.setState({
      isSearch: true,
      start: startDate,
      end: endDate,
      flagged,
      keywordNote
    });



    /*
  var filteredData = this.state.data.filter(function(a){
   var aDate = new Date(a.date);
    return aDate >= this.state.startDate && aDate <= this.state.endDate;
});*/

    /*
this.setState({
  dataTable:   filteredData   }, () => {
  this.translateApi();
});*/
    //console.log('filter',filteredData)
  };

  UnfilterRange = () => {
    this.state = {
      startDate: null,
      endDate: null,
      focusedInput: null
    };
    this.props.UnfilterRange();
  };

  filterType = type => {
    this.setState({
      type: type == "TẤT CẢ" ? "all" : type
    });
  };

  add = amount => {




    var newHist = {'time_added':moment().format('DD/MM'),'amt':amount}
    tranSactions.push(newHist).then((ref)=>{
      console.log('ref returned',ref)


    })


    this.setState({added_total: this.state.added_total + amount ,added_histories: this.state.added_histories.concat(newHist),
    });
  };

  
  onSelect = () => {
    console.log("selected");
  };

  toFlag = id => {


    

    let copyArrayData = [...this.state.data];
    let index = copyArrayData.findIndex(el => {
      return el.id == id;
    });

    var currentFlag = [...this.state.data][index]["flag"]
    console.log('currentFlag',currentFlag)

    
    database.ref('exPenses/'+id+'/flag').set(!currentFlag).then(() => {
      console.log('flag updated')
          });
          
    
    copyArrayData[index]["flag"] = ![...this.state.data][index]["flag"];

    this.setState({ data: copyArrayData });

  };
  /*

/*
searchNote=(word)=>{
  this.setState({    search_term: word,isSearch:true});
}
  */

 cancelSearch=(start,end,flagged,keywordNote)=>{
this.setState({isSearch:false,start:"1990-01-01",end:"2039-01-01",flagged:null,keywordNote:''})
 }



 /*
 componentDidUpdate(prevProps, prevState, snapshot){
  if (prevState.expenses_total!==this.state.expenses_total ) {
    console.log('update expenses')
    console.log('this.state.expenses_total',this.state.expenses_total)

    const key = "6823b4cc-4e0f-4781-9010-0336a14f7ea5";
    const total_inWords = numbered.stringify(this.state.expenses_total).replace(/-/g, " ");

    axios
    .get(
      "https://api-platform.systran.net/translation/text/translate?input=" +
        total_inWords +
        "&source=en&target=vi&withSource=false&withAnnotations=false&backTranslation=false&encoding=utf-8&key=" +
        key,
      {}
    )
    .then(response => {
       var  translated = response.data.outputs[0].output;
       console.log('translated',translated)
      this.setState({translated})
    });
  } 
  
}
*/

 
  render() {

    var filteredData = this.state.data.filter(a => {
      var aDate = new Date(a.date);
      var isFilter =
        this.state.type == "all"
          ? true
          : a.type == this.state.type
            ? true
            : false;

      var startDate = new Date(this.state.start);
      var endDate = new Date(this.state.end);

      return aDate >= startDate && aDate <= endDate && isFilter == true;
    });

    var keyword = this.state.keywordNote;

     var SearchResult = this.state.isSearch&&this.state.flagged!==null      ? filteredData.filter((obj)=> {
          return obj.note.includes(keyword)&&obj.flag===this.state.flagged   })
      : filteredData;

    const total = _.sumBy(SearchResult, function(o) {
      return o.amount * 1;
    });

    var remain = this.state.added_total - this.state.expenses_total;



    var today = new Date();
    var lastWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    );


    console.log('this.state.data',this.state.data)
    return (
      <div>
        <Context.Provider
          value={{
            sumAdded: this.state.added_total,
            added_histories:this.state.added_histories,
            remain: remain,
            add: this.add
          }}
        >
          <h5>Ngày : {moment().format("DD-MM-YYYY")}</h5>
          <Button color="warning" onClick={this.toggle}>
            Chi Thêm
          </Button>{" "}
          <div>
            <Filter
              filterType={this.filterType}
              filterRange={this.filterRange}
              searchNote={this.searchNote}
              cancelSearch={this.cancelSearch}
            />
          </div>
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle}
            className={this.props.className}
          >
            <ModalHeader toggle={this.toggle}>Chi Thêm</ModalHeader>
            <ModalBody>
              <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                  <Label for="exampleDate">Ngày</Label>
                  <Input
                    value={this.state.date}
                    type="date"
                    name="date"
                    id="exampleDate"
                    onChange={this.handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="exampleSelect">Mục</Label>

                  <Input
                    type="select"
                    name="select"
                    id="exampleSelect"
                    onChange={this.handleInputChange}
                    value={this.state.select}
                  >
                    <option>ĂN</option>
                    <option>GIẤY VUÔNG</option>
                    <option>GIẤY PUPPY</option>
                    <option>XÀ BÔNG</option>
                    <option>NƯỚC BÌNH</option>
                    <option>TIỀN NƯỚC, ĐIỆN THOẠI</option>
                    <option>CHỢ THIẾC</option>
                    <option>TRUYỀN HÌNH</option>
                    <option>INTERNET</option>
                    <option>KHÁC</option>
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label for="exampleNumber">Số tiền</Label>
                  <Input
                    value={this.state.number}
                    type="number"
                    name="number"
                    id="exampleNumber"
                    placeholder="number placeholder"
                    onChange={this.handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="exampleText">Ghi chú</Label>
                  <Input
                    type="textarea"
                    name="text"
                    id="exampleText"
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
                <Button color="primary" type="submit">
                  Save
                </Button>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
          <Detail
            toFlag={this.toFlag}
            submitEdit={this.submitEdit}
            delete={this.delete}
            translate_result={this.state.translate_result}
            total={total}
            data={SearchResult}
          />
   </Context.Provider>
      </div>
    );
  }
}

export default Main;
