import React from "react";
import {
  Collapse,
  ListGroup,
  ListGroupItem,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  Button,
  CardTitle,
  CardText,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import classnames from "classnames";
import Context from "./Context";
import moment from "moment";

class Fulfil extends React.Component {
  constructor(props) {
    super(props);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.toggleModal = this.toggleModal.bind(this);

    this.state = {
      histories: [],
      amount: 0,
      modal: false,
      collapse:false,
      dropdownOpen: false
    };
  }
  toggleModal() {
    this.setState({
      modal: !this.state.modal
    });
  }

  toggleDropdown() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  openModal = () => {
    this.setState({
      modal: true
    });
  };

  handleInputChange = event => {
    const value = event.target.value;
    console.log("value", value);

    this.setState({
      amount: value
    });
  };

  handleSubmit = (event, add) => {
    var t= moment()

    event.preventDefault();
    //this.props.Context.add(this.state.amount)
    this.setState({
      histories: [t, ...this.state.histories],
      amount: 0,
      modal: false
    });
    add(this.state.amount * 1);
    //this.translateTotal()
  };
  
  updatehistories=()=>{
    var t= moment()
this.setState({histories:  [t, ...this.state.histories]})

  }

  
  renderhistories = () => {
    var histories = this.state.histories

  return  histories.map((el,i)=>{return <ListGroupItem>{moment(el).format("DD-MM-YYYY HH:mm:ss")}</ListGroupItem>})
  }


  openList=()=>{
    this.setState({ collapse: !this.state.collapse });

  }

  render() {
    return (
      <Context.Consumer>
        {({ sumAdded, remain, add,added_histories}) => (
          <div>
            <Row>
              <div className="d-inline-block">
                <Card body>
                  <CardTitle>{remain} ngàn</CardTitle>
                  <CardText>còn lại</CardText>
                  <Dropdown
                    isOpen={this.state.dropdownOpen}
                    toggle={this.toggleDropdown}
                  >
                    <DropdownToggle caret>Nạp thêm</DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>
                        <a
                          style={{ cursor: "pointer", color: "#43464c" }}
                          onClick={() =>  {this.updatehistories(),add(10000)}}
                        >
                          10000
                        </a>
                      </DropdownItem>
                      <DropdownItem>
                        <a
                          style={{ cursor: "pointer", color: "#43464c" }}
                          onClick={() =>  {this.updatehistories(),add(5000)}}
                        >
                          5000
                        </a>
                      </DropdownItem>
                      <DropdownItem>
                        <a
                          onClick={() => this.openModal()}
                          style={{ cursor: "pointer", color: "#43464c" }}
                        >
                          Khác
                        </a>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </Card>
              </div>
              <div className="d-inline-block">
                <Card body>
                  <CardTitle>
                    <h6>Tổng nạp: {sumAdded} ngàn</h6>
                  </CardTitle>
                  <CardText>
                    <a href="#" onClick={this.openList}>Xem lịch sử nạp</a>
                    <Collapse isOpen={this.state.collapse}>
                    <ListGroup>{added_histories.map((el)=><ListGroupItem>{el.time_added}</ListGroupItem>)}</ListGroup>

                    </Collapse>

                  </CardText>
                </Card>
              </div>
            </Row>
            <Modal
              isOpen={this.state.modal}
              toggle={this.toggleModal}
              className={this.props.className}
            >
              <ModalHeader toggle={this.toggleModal}>Modal title</ModalHeader>
              <ModalBody>
                <Form onSubmit={e => this.handleSubmit(e, add)}>
                  <FormGroup>
                    <Label for="exampleNumber">Số tiền (ngàn)</Label>
                    <Input
                      type="number"
                      name="number"
                      id="exampleNumber"
                      placeholder="number placeholder"
                      onChange={this.handleInputChange}
                    />
                  </FormGroup>
                  <Button color="primary" type="submit">
                    Ok
                  </Button>{" "}
                  <Button color="secondary" onClick={this.toggleModal}>
                    Cancel
                  </Button>
                </Form>
              </ModalBody>
            </Modal>
          </div>
        )}
      </Context.Consumer>
    );
  }
}
export default Fulfil;
