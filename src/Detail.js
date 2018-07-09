import React, { Component } from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter,Form, FormGroup, Label, Input, FormText  } from 'reactstrap';
import _  from 'lodash';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';


import TableExampleControlled from './TableExampleControlled';


import Translate from './Translate';

class Detail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      date:'',
    select:'',
    number:'',
    text:'',
    modal: false,
    hovered:null
  };
  }



  toggle=()=> {
    console.log('this state',this.state)
    this.setState({
      modal: !this.state.modal
    });
  }

  handleInputChange=(event)=>{
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    const name = target.name;

    this.setState({
      [name]: value
    });


    }

    handleSubmit=(event) =>{

      var newObj={};
     
    newObj.date= this.state.date
    newObj.type= this.state.select
    newObj.amount=this.state.number
    newObj.note=this.state.text


this.props.submitEdit(this.state.idx,newObj)

this.setState({
  idx:'',
  date:'',
  select:'',
  number:'',
  text:'',
  modal: false,

})
              event.preventDefault();


//this.translateTotal()
      
    }

OnEdit=(index,obj)=>{

this.setState({
  idx:obj.id,
  date:obj.date,
  select:obj.type,
  number:obj.amount,
  text:obj.note,
  modal: true,

})
}

OnDelete=(id)=>{
this.props.delete(id)
  
}


hover = rowNumber => {
  this.setState({ hovered: rowNumber });
  console.log("hovered on", rowNumber);
};

toFlag=(id)=>{


this.props.toFlag(id)
}

  render() {
  const {data,total,translate_result} = this.props


//const total = _.sumBy(data, function(o) { return o.amount; })


    return (

<div>
<Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Chi Thêm</ModalHeader>
          <ModalBody>
          <Form onSubmit={this.handleSubmit}>
     
      <FormGroup>
        <Label for="exampleDate">Ngày</Label>
   <Input value={this.state.date} type="date" name="date" id="exampleDate" onChange={this.handleInputChange}/>
      
      </FormGroup>



      <FormGroup>
        <Label for="exampleSelect">Mục</Label>

        <Input type="select" name="select" id="exampleSelect" onChange={this.handleInputChange} value={this.state.select}>
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
        <Input value={this.state.number} type="number" name="number" id="exampleNumber" placeholder="number placeholder" onChange={this.handleInputChange}/>
      </FormGroup>

      <FormGroup>
        <Label for="exampleText">Ghi chú</Label>
        <Input type="textarea" name="text" id="exampleText" onChange={this.handleInputChange}/>
      </FormGroup>
      <Button color="primary" type='submit'>Lưu thay đổi</Button>

      

    </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>

    <Table onRowHover={this.hover}>
        <TableHeader adjustForCheckbox={false} displaySelectAll={false} style={{'textAlign': 'center'}}>
          <TableRow>
            <TableHeaderColumn style={{'textAlign': 'center'}}>Ngày</TableHeaderColumn>
            <TableHeaderColumn style={{'textAlign': 'center'}}>Mục</TableHeaderColumn>
            <TableHeaderColumn style={{'textAlign': 'center'}}></TableHeaderColumn>

            <TableHeaderColumn style={{'textAlign': 'center'}}>Số tiền</TableHeaderColumn>
            <TableHeaderColumn style={{'textAlign': 'center'}}>Ghi chú</TableHeaderColumn>
            <TableHeaderColumn style={{'textAlign': 'center'}}>Chỉnh sửa</TableHeaderColumn>

          </TableRow>
        </TableHeader>
   <TableBody showRowHover={true} displayRowCheckbox={false}>
{ data.map((el,i)=>(
  <TableRow  hoverable={true}>
  <TableRowColumn style={{'textAlign': 'center'}}>{el.date}</TableRowColumn>
  <TableRowColumn style={{'textAlign': 'center'}}>{el.type}</TableRowColumn>
  <TableRowColumn style={{'textAlign': 'center'}}>
  
  {el.flag==true?<span onClick={()=>this.toFlag(el.id)} style={{ 'fontSize':22,'color': 'rgba(128,0,0,2)','padding': 5, 'cursor': 'pointer'}} className="oi oi-star " />:this.state.hovered == i ? <span onClick={()=>this.toFlag(el.id)} style={{ 'fontSize':23,'color': 'rgba(128,0,0,0.3)','fill': "#f00",'padding': 5, 'cursor': 'pointer'}} className="oi oi-star " />:<span style={{ 'padding': 5 }}/>}</TableRowColumn>

  <TableRowColumn style={{'textAlign': 'center'}}>{el.amount}</TableRowColumn>
  <TableRowColumn style={{'textAlign': 'center'}}>{el.note}</TableRowColumn>
<TableRowColumn><Button color="info" onClick={()=>this.OnEdit(i,el)}>Edit</Button>{' '}<Button color="warning" onClick={()=>this.OnDelete(el.id)}>Delete</Button>
</TableRowColumn>
</TableRow>))}
         
<TableRow>
  <TableRowColumn style={{'textAlign': 'center'}}>Tổng chi</TableRowColumn>
  <TableRowColumn style={{'textAlign': 'center'}}></TableRowColumn>
  <TableRowColumn style={{'textAlign': 'center'}}></TableRowColumn>

  <TableRowColumn style={{'textAlign': 'center'}}>{total}</TableRowColumn>

  <TableRowColumn style={{'textAlign': 'center'}}></TableRowColumn>

</TableRow>
        </TableBody>

              
      </Table>
      <Translate total={translate_result}/>

</div>
    );
  }
}

export default Detail;
