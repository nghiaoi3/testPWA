
import React from "react";
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
  

} from "reactstrap";



class AdvancedFilter extends React.Component {
    constructor(props) {
      super(props);
      this.state = {text:'' };
  
    }
  
  
    
      handleInputChange = event => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
    
        const name = target.name;
    
        this.setState({
          [name]: value
        });
      };
    
    render() {
      return (
        <Collapse isOpen={this.props.openFilter}>
        <Card>
          <CardBody>
          <Form>
          <FormGroup check>
          <Label check>
            <Input type="checkbox" />{' '}
            <span className="oi oi-flag"></span></Label>
        </FormGroup>
          <FormGroup>
                  <Label for="exampleText">'Ghi chú's keyword</Label>
                  <Input
                    type="text"
                    name="text"
                    id="exampleText"
                    onChange={this.handleInputChange}
                  />
                </FormGroup>

                       
        </Form>

          </CardBody>

        </Card>
      </Collapse>

      )
    }
  }
  
  export default AdvancedFilter;