import React, { useState, useEffect, Fragment } from 'react';

import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CRUD = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [isActive, setIsActive] = useState(0);

  const [editID, setEditID] = useState('');
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editIsActive, setEditIsActive] = useState(0);

  const BASE_URL = 'https://localhost:7249/api/Employee';

  const empdata = [
    {
      id: 1,
      name: 'Manoj',
      age: 23,
      isActive: 1,
    },
    {
      id: 2,
      name: 'Suza',
      age: 21,
      isActive: 1,
    },
    {
      id: 3,
      name: 'Martins',
      age: 30,
      isActive: 0,
    },
  ];

  const [data, setData] = useState([empdata]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(BASE_URL)
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (id) => {
    const urlEdit = `${BASE_URL}/${id}`;
    handleShow();
    axios
      .get(urlEdit)
      .then((result) => {
        setEditName(result.data.name);
        setEditAge(result.data.age);
        setEditIsActive(result.data.isActive);
        setEditID(id);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleDelete = (id) => {
    const deleteUrl = `${BASE_URL}/${id}`;
    if (window.confirm('Are you sure to delete this employee') == true) {
      axios
        .delete(deleteUrl)
        .then((result) => {
          if (result.status === 200) {
            toast.success('Employee has been deleted');
            getData();
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  const handleUpdate = () => {
    const urlUpdate = `${BASE_URL}/${editID}`;
    const data = {
      id: editID,
      name: editName,
      age: editAge,
      isActive: editIsActive,
    };
    axios
      .put(urlUpdate, data)
      .then((result) => {
        handleClose();
        getData();
        clear();
        toast.success('Employee has been updated');
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleSave = () => {
    const data = {
      name: name,
      age: age,
      isActive: isActive,
    };

    axios
      .post(BASE_URL, data)
      .then((result) => {
        getData();
        clear();
        toast.success('Employee has been added');
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const clear = () => {
    setName('');
    setAge('');
    setIsActive(0);
    setEditName('');
    setEditAge('');
    setEditIsActive(0);
    setEditID('');
  };

  const handleActiveChange = (e) => {
    if (e.target.checked) {
      setIsActive(1);
    } else {
      setIsActive(0);
    }
  };

  const handleEditActiveChange = (e) => {
    if (e.target.checked) {
      setEditIsActive(1);
    } else {
      setEditIsActive(0);
    }
  };

  return (
    <div className="bg-red p-96">
      <Fragment>
        <ToastContainer />
        <Container>
          <Row>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="checkbox"
                checked={isActive === 1 ? true : false}
                onChange={(e) => handleActiveChange(e)}
                value={isActive}
              />
              <label>isActive</label>
            </Col>
            <Col>
              <button className="btn btn-primary" onClick={(e) => handleSave()}>
                Submit
              </button>
            </Col>
          </Row>
        </Container>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              {/* <th>ID</th> */}
              <th>Name</th>
              <th>Age</th>
              <th>isActive</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0
              ? data.map((item, index) => {
                  return (
                    <tr key={index}>
                      <tb>{index + 1}</tb>
                      {/* <td>{item.id}</td> */}
                      <td>{item.name}</td>
                      <td>{item.age}</td>
                      <td>{item.isActive}</td>
                      <td colSpan={2}>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleEdit(item.id)}
                        >
                          edit
                        </button>{' '}
                        &nbsp;
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              : 'Loading...'}
          </tbody>
        </Table>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modify / Update Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </Col>
                <Col>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Age"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                  />
                </Col>
                <Col>
                  <input
                    type="checkbox"
                    checked={editIsActive === 1 ? true : false}
                    onChange={(e) => handleEditActiveChange(e)}
                    value={editIsActive}
                  />
                  <label>isActive</label>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    </div>
  );
};

export default CRUD;
