import React, { useState, useEffect } from 'react';

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

  const [data, setData] = useState();

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
    if (window.confirm('Are you sure to delete this employee') === true) {
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

  const isFormValid = () => {
    return name.trim() !== '' && age.trim() !== '';
  };

  const handleAgeChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAge(value);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="p-4 flex justify-center items-center flex-col md:flex-row">
        <div>
          <input
            type="text"
            className="border rounded px-2 w-52 h-8 mr-2 md:mr-4"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <span className="font-bold">:</span>
          <input
            type="text"
            className="border rounded px-2 w-20 h-8 ml-2 md:ml-4 md:mr-10"
            placeholder="Age"
            value={age}
            onChange={handleAgeChange}
            min="0"
          />
        </div>

        <div className="flex mt-2 md:mt-0">
          <div className="p-0.5 px-1 md:py-1 bg-gray-200 rounded flex items-center">
            <input
              type="checkbox"
              className=""
              checked={isActive === 1 ? true : false}
              onChange={(e) => handleActiveChange(e)}
              value={isActive}
            />
            <label className="ml-2">isActive</label>
          </div>

          <button
            className={`md:ml-12 w-full md:w-auto px-6 py-1 bg-blue-400 text-white rounded ml-2 ${
              !isFormValid() ? 'cursor-not-allowed opacity-50' : ''
            }`}
            onClick={() => handleSave()}
            disabled={!isFormValid()}
          >
            Submit
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        <thead className="flex">
          <tr className="flex justify-between w-full border-b border-t bg-gray-300">
            <th className="w-1/5 border-l border-r">#</th>
            {/* <th>ID</th> */}
            <th className="w-1/5 border-l border-r">Name</th>
            <th className="w-1/5 border-l border-r">Age</th>
            <th className="w-1/5 border-l border-r">isActive</th>
            <th className="w-1/5 border-r">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0
            ? data.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className="flex justify-between w-full hover:bg-gray-300 border-b"
                  >
                    <tb className="w-1/5 p-4 border-l border-r">{index + 1}</tb>
                    {/* <td>{item.id}</td> */}
                    <td className="w-1/5 p-4 border-l border-r">{item.name}</td>
                    <td className="w-1/5 p-4 border-l border-r">{item.age}</td>
                    <td className="w-1/5 p-4 border-l border-r">
                      {item.isActive === 1 ? 'Yes' : 'No'}
                    </td>
                    <td
                      colSpan={2}
                      className="w-1/5 p-4 flex flex-col lg:flex-row"
                    >
                      <button
                        className="sm:px-6 bg-blue-400 text-white rounded"
                        onClick={() => handleEdit(item.id)}
                      >
                        Edit
                      </button>{' '}
                      &nbsp;
                      <button
                        className="sm:px-4 bg-red-500 text-white rounded"
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
      </div>

      {show && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 w-full max-w-xl max-h-screen overflow-auto rounded">
            <div className="flex justify-between border-b mb-4 items-center">
              <div className="mb-2">
                <h1 className="font-bold">Modify / Update Employee</h1>
              </div>
              <button className="mb-2" onClick={handleClose}>
                <img
                  className="w-4"
                  src="https://static-00.iconduck.com/assets.00/close-icon-2048x2047-22z7exfk.png"
                  alt="close icon"
                />
              </button>
            </div>
            <div className="flex mb-4 items-center border-b">
              <div>
                <input
                  type="text"
                  className="border rounded px-2 w-52 h-8 mr-2 md:mr-4 mb-6"
                  placeholder="Enter Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <span className="font-bold">:</span>
                <input
                  type="text"
                  className="border rounded px-2 w-20 h-8 ml-2 md:ml-4 md:mr-10 mb-6"
                  placeholder="Enter Age"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                />
              </div>
              <div className="p-0.5 px-1 md:py-1 bg-gray-200 rounded flex items-center mb-6">
                <input
                  type="checkbox"
                  checked={editIsActive === 1 ? true : false}
                  onChange={(e) => handleEditActiveChange(e)}
                  value={editIsActive}
                />
                <label className="ml-2">isActive</label>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="mr-2 w-full md:w-auto px-14 py-1 bg-gray-500 text-white rounded"
                variant="secondary"
                onClick={handleClose}
              >
                Close
              </button>
              <button
                className="w-full md:w-auto px-6 py-1 bg-blue-400 text-white rounded font-bold"
                variant="primary"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRUD;
