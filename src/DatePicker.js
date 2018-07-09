import React from "react";
import Context from "./Context";
import moment from "moment";
import "react-dates/lib/css/_datepicker.css";
import { DateRangePicker, DayPickerRangeController } from "react-dates";

class DatePicker extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        startDate: null,
        endDate: this.props.endDate,
        focusedInput: null,

      };
    }
    
    render() {
      return (
        <Context.Consumer>
          {({ added_histories}) => {

var highlight_dates = added_histories.map((el,i)=>el.time_added)
return (
             
  <DateRangePicker
    isOutsideRange={() => false}
    startDate={this.state.startDate} // momentPropTypes.momentObj or null,
    startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
    endDate={this.state.endDate} // momentPropTypes.momentObj or null,
    endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
    onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
    focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
    onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
    isDayHighlighted={ day1 => highlight_dates.some(day2 => day1.isSame(moment(day2,'DD/MM'), 'd')) }
    displayFormat="DD/MM/YYYY" 
  
  />
  
            )
          }      }
        </Context.Consumer>
      );
    }
  }
  export default DatePicker;

