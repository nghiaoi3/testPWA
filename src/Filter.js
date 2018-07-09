import React, { Component } from "react";
import "react-dates/lib/css/_datepicker.css";

import { DateRangePicker, DayPickerRangeController } from "react-dates";
import {
  Collapse,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  Button,
  CardTitle,
  CardText,
  Col,
  Badge
} from "reactstrap";

import Fulfil from "./Fulfil";
import AdvancedFilter from "./AdvancedFilter";
import moment from "moment";
import DatePicker from "./DatePicker";
import Context from "./Context";



class Filter extends Component {
  constructor(props) {
    var today = moment()


    super(props);
    this.state = {
      startDate: null,
      endDate: today,
      focusedInput: null,
      collapse: false,
      keywordNote: "",
      flagged: null,
      isSearchRange:false
    };
  }

  filterRangeAdvanced = () => {

    var start = this.state.startDate != null ? this.state.startDate : "1990-01-01";
    var end = this.state.endDate != null ? this.state.endDate : "2039-01-01";
this.setState({isSearchRange:false})

    this.props.filterRange(      start,      end,      this.state.flagged,      this.state.keywordNote    );
  };
  filterRange = ()=>{

    var start = this.state.startDate != null ? this.state.startDate : "1990-01-01";
    var end = this.state.endDate != null ? this.state.endDate : "2039-01-01";
this.setState({ isSearchRange:true,focusing:false})
    this.props.filterRange(      start,      end,   null,  ''   );

  }

  handleInputChange = e => {
    const target = e.target;
    console.log("e.target.value", e.target.value);
    this.props.filterType(e.target.value);
  };

  /* SubmitSearch = () => {
this.props.searchNote(this.state.flagged,this.state.keywordNote)

this.setState({ search_term: '' });

  };
*/
  toggleAdvancedFilter = () => {
    this.setState({ collapse: !this.state.collapse, flagged:false });
  };

  handleInputChangeAdvanced = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    const name = target.name;

    this.setState({
      [name]: value
    });
  };


  cancelAdvancedFilter = () => {
    this.setState({
      startDate: null,
      collapse: !this.state.collapse,
      keywordNote: "",
      flagged: null,
      isSearchRange:false
    });
    this.props.cancelSearch();
  };

  cancelRangeFilter = () => {
    this.setState({
      startDate: null,
      isSearchRange:false,
      keywordNote: "",
      flagged: null
    });
    this.props.cancelSearch();
  };

  render() {
    console.log("state", this.state);

    var from = moment(this.state.startDate).format("DD/MM");
    var to = moment(this.state.endDate).format("DD/MM");
    return (
      <div className="container">
        <div className="d-flex">
          <div className="p-2">
            <Input
              type="select"
              name="select"
              id="exampleSelect"
              onChange={this.handleInputChange}
            >
              <option>TẤT CẢ</option>
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
          </div>

          <div className="p-2">


             <Context.Consumer>
          {({ added_histories}) => {

var highlight_dates = added_histories.map((el,i)=>el.time_added)
return (
             
  <DateRangePicker


isOutsideRange={() => false}
isDayHighlighted={ day1 => highlight_dates.some(day2 => day1.isSame(moment(day2,'DD/MM'), 'd')) }

startDateId="startDate"
endDateId="endDate"
startDate={this.state.startDate}
endDate={this.state.endDate}
displayFormat="DD/MM/YYYY" 
onDatesChange={({ startDate, endDate }) => {
  this.setState({ startDate, endDate });
}}
focusedInput={this.state.focusedInput}
onFocusChange={focusedInput => {

  console.log('focusRange')
  this.setState({ focusedInput,focusing:true });
}}
/>
            )
          }      }
        </Context.Consumer>
            
            <p style={{ marginTop: 10, marginBottom: 10 }}>
              {this.state.collapse == false && (this.state.isSearchRange==false||this.state.focusing==true) &&(
                <Button color="warning" onClick={this.filterRange}>
                  {" "}
                  <span className="oi oi-magnifying-glass" />Filter
                </Button>
              )}
{this.state.isSearchRange==true&&this.state.focusing==false&&(  <Button onClick={this.cancelRangeFilter}>Cancel Filter</Button>)}
              
              <a
                href="#"
                onClick={this.toggleAdvancedFilter}
                style={{ marginBottom: "1rem" }}
              >
                {" "}
                More...
              </a>
            </p>
            <Collapse isOpen={this.state.collapse}>
              <Card>
                <CardBody>
                  <h6>
                    {" "}
                    {from} -> {to}
                  </h6>
                  <Form>
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="checkbox"
                          name="flagged"
                          checked={this.state.flagged}
                          onChange={this.handleInputChangeAdvanced}
                        />
                        <span
                          style={{ fontSize: 15, color: "rgba(128,0,0,1)" }}
                          className="oi oi-star "
                        />
                      </Label>
                    </FormGroup>
                    <FormGroup>
                      <Label for="exampleText">'Ghi chú's keyword</Label>
                      <Input
                        type="text"
                        value={this.state.keywordNote}
                        name="keywordNote"
                        id="exampleText"
                        onChange={this.handleInputChangeAdvanced}
                      />
                    </FormGroup>
                    <Button color="warning" onClick={this.filterRangeAdvanced}>
                      {" "}
                      <span className="oi oi-magnifying-glass" />Filter
                    </Button>{" "}
                    <Button onClick={this.cancelAdvancedFilter}>Cancel</Button>
                  </Form>
                </CardBody>
              </Card>
            </Collapse>
            {/* <Input
              value={this.state.search_term || ""}
              onChange={this.handleSearchChange}
              type="text"
              name="searchText"
              id="exampleEmail"
              placeholder="Enter a keyword"
            />

            <Button color="warning" onClick={this.SubmitSearch}>
              {" "}
              <span className="oi oi-magnifying-glass" />Tìm ghi chú
            </Button>*/}
          </div>

          <div className="ml-auto p-2">
            <Fulfil />
          </div>
        </div>
      </div>
    );
  }
}

export default Filter;
