// "npm run dev" command would start this file (frontend)

import "./App.css";
import axios from "axios";
import { useState } from "react";

function App() {
  const [userData, setUserData] = useState({});
  const [userUpdateData, setUserUpdateData] = useState({ name: "", title: "" });
  const [showInputs, setShowInputs] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  // useEffect(() => {
  //   handleGetUsers();
  // }, []);

  const onChangeUserText = (e, key) => {
    setUserData((prevData) => {
      return { ...prevData, [key]: e.target.value };
    });
  };

  const onChangeText = (e, key) => {
    setUserUpdateData((prevData) => {
      return { ...prevData, [key]: e.target.value };
    });
  };

  // const handleCreateUser = () => {
  //   setShowInputs(!showInputs);

  //   // Send a POST request to create a user
  //   axios
  //     .post("http://localhost:5000/users", userData)
  //     .then((response) => {
  //       // Handle the successful creation of the user (e.g., show a success message)
  //       console.log("User created:", response.data);
  //       // Clear the input fields
  //       setUserData({});
  //       // Refresh the user list
  //       handleGetUsers();
  //     })
  //     .catch((error) => {
  //       // Handle any errors (e.g., show an error message)
  //       console.error("Error creating user:", error);
  //     });
  // };
  const handleCreateUser = () => {
    if (!userData.name || !userData.title) {
      console.error("Name and title are required.");
      return;
    }

    setShowInputs(false);

    axios
      .post("http://localhost:5000/users", userData)
      .then((response) => {
        console.log("User created:", response.data);
        setUserData({ name: "", title: "" });
        handleGetUsers();
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });
  };

  const handleGetUsers = () => {
    setShowData(!showData);
    setLoading(true);
    axios
      .get("http://localhost:5000/users")
      .then((response) => {
        console.log("Users data fetched:", response);
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setLoading(false);
      });
  };

  const handleDelete = (user_id) => {
    axios
      .delete(`http://localhost:5000/users/${user_id}`)
      .then((response) => {
        console.log("User deleted successfully:", response.data);
        handleGetUsers();
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const handleEditUser = (user_id) => {
    setEditUserId(user_id);
    const userToEdit = users.find((user) => user.user_id === user_id);
    setUserUpdateData({ name: userToEdit.name, title: userToEdit.title });
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:5000/users/${editUserId}`, userUpdateData)
      .then((response) => {
        console.log("User updated successfully:", response.data);
        setUserUpdateData({ name: "", title: "" });
        setEditUserId(null);
        handleGetUsers();
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  return (
    <div>
      {editUserId !== null && (
        <div className="middleBox">
          <div>
            Edit Name
            <input
              type="text"
              value={userUpdateData.name}
              onChange={(e) => onChangeText(e, "name")}
            />
          </div>
          <div className="boxes">
            Edit Title
            <input
              type="text"
              value={userUpdateData.title}
              onChange={(e) => onChangeText(e, "title")}
            />
          </div>
          <button onClick={handleUpdate} className="btn">
            Update User
          </button>
        </div>
      )}
      {showInputs && (
        <div className="middleBox">
          <div>
            Enter the name
            <input
              type="text"
              value={userData.name}
              onChange={(e) => onChangeUserText(e, "name")}
            />
          </div>
          <div className="boxes">
            Enter the title
            <input
              type="text"
              value={userData.title}
              onChange={(e) => onChangeUserText(e, "title")}
            />
          </div>
          <button onClick={handleCreateUser} className="btn">
            Create New User
          </button>
        </div>
      )}
      <div className="middleBox">
        <button onClick={() => setShowInputs(!showInputs)} className="btn">
          Create User
        </button>
        <button onClick={handleGetUsers} className="btn">
          Get all users
        </button>
      </div>
      {showData &&
        (loading ? (
          <h3>Loading users...</h3>
        ) : (
          <div className="middleBox">
            <h2>Users</h2>
            <ul>
              {users.map((user) => (
                <div key={user.user_id} className="body-box">
                  <div>Name: {user.name}</div> <div>Title: {user.title}</div>
                  <button
                    onClick={() => handleDelete(user.user_id)}
                    className="btn"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEditUser(user.user_id)}
                    className="btn"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}

export default App;
