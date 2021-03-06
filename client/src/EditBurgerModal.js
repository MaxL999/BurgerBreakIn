import React, { Component } from 'react';

import { Modal } from 'react-bootstrap';


class EditBurgerModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            burgerArr: [0],
            ingArr: [],
            name: "",
            id: 0
        }

        this.changeName = this.changeName.bind(this)
        this.editBurgerArr = this.editBurgerArr.bind(this);
        this.sortIngredientArray = this.sortIngredientArray.bind(this);
    }

    componentDidUpdate(prevProps) {
        // this triggers during EditIngredientModal interactions and crashes so the extra condition is needed
        if (this.props.burger !== prevProps.burger && this.props.show) {

            this.setState({
                burgerArr: JSON.parse(this.props.burger.ingArr),
                name: this.props.burger.name,
                id: this.props.burger.id,
                ingArr: this.sortIngredientArray(this.props.ingredients)
            });
        }
    }

    sortIngredientArray(oldArr) {
        var sortIngArr = []
        var sortOrder = ["Bun", "Meat", "Cheese", "Vegetable", "Condiment"]

        for (var i = 0; i < sortOrder.length; i++) {
            for (var t = 0; t < oldArr.length; t++) {
                if (sortOrder[i] === oldArr[t].type) {
                    sortIngArr.push(oldArr[t])
                }
            }
        }

        return sortIngArr
    }

    changeName(event) {
        var newName = event.target.value
        this.setState({ name: newName })
    }

    editBurgerArr(event) {
        var i = event.target.name
        var value = parseInt(event.target.value)
        let tempVal = this.state.burgerArr
        tempVal.splice(i, 1, value)
        this.setState({ burgerArr: tempVal })
    }

    createBurgeri(i) {
        i = i + 1
        let tempVal = this.state.burgerArr
        tempVal.splice(i, 0, 0)
        this.setState({ burgerArr: tempVal })
    }

    deleteBurgeri(i) {
        let tempVal = this.state.burgerArr
        tempVal.splice(i, 1)
        this.setState({ burgerArr: tempVal })
    }

    submitInformation() {

        this.props.editItem("burgers", {
            id: this.state.id,
            name: this.state.name,
            ingArr: this.state.burgerArr,
        })

        this.props.onHide()
    }

    render() {
        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>
                        <label>Name: <input type="text" value={this.state.name} onChange={this.changeName}></input></label>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">Layer</th>
                                <th scope="col">Type</th>
                                <th scope="col">Name</th>
                                <th scope="col">Insert New</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.burgerArr.map((ingID, index) => {
                                var ingType
                                var ingArr = this.props.ingredients
                                for (var i = 0; i < ingArr.length; i++) {
                                    if (ingID === 0) ingType = "Empty";
                                    if (ingID === ingArr[i].id) ingType = ingArr[i].type;
                                }
                                return <tr key={index}>
                                    <th scope="row">{index}</th>
                                    <th><span>{ingType}</span></th>
                                    <th>
                                        <select value={ingID} name={index} onChange={this.editBurgerArr}>
                                            <option value={0}>Empty</option>
                                            {this.state.ingArr.map((ing) => {
                                                // the bun layer can only select buns the opposite with ing layers
                                                if (index === 0) {
                                                    if (ing.type !== "Bun") return false
                                                    else return <option key={ing.id} value={ing.id}>{ing.name}</option>
                                                } else {
                                                    if (ing.type === "Bun") return false
                                                    else return <option key={ing.id} value={ing.id}>{ing.name}</option>
                                                }
                                            })}
                                        </select>
                                    </th>
                                    <td><button type="button" className="btn btn-primary" onClick={() => this.createBurgeri(index)}>Insert</button></td>
                                    {/* the bun option is un-deletable, a burger needs a wrapper of some kind! */}
                                    {index === 0 ?
                                        <td><button type="button" className="btn btn-danger" disabled>X</button></td>
                                        :
                                        <td><button type="button" className="btn btn-danger" onClick={() => this.deleteBurgeri(index)}>X</button></td>
                                    }
                                </tr>
                            })}
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={this.props.onHide}>Close</button>
                    <button onClick={() => this.submitInformation()}>Edit</button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default EditBurgerModal