import { useEffect, useState } from "react";
import { fetchUsers, createUser, updateUser, deleteUser } from "../services/api";
import { IoPersonAddOutline, IoTrashOutline, IoPencilOutline, IoClose } from "react-icons/io5";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: "", email: "", password: "", role: "user" });
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "edit" or "delete"

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData);
      }
      setFormData({ username: "", email: "", password: "", role: "user" });
      setEditingUser(null);
      setShowModal(false);
      loadUsers();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, email: user.email, role: user.role });
    setModalType("edit");
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!editingUser) return;
    try {
      await deleteUser(editingUser.id);
      setShowModal(false);
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Manage Users</h2>
          <button
            onClick={() => {
              setEditingUser(null);
              setFormData({ username: "", email: "", password: "", role: "user" });
              setModalType("add");
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <IoPersonAddOutline className="mr-2" size={20} /> Add User
          </button>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search users..."
          className="w-full p-2 border rounded mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">Username</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">Loading users...</td>
                </tr>
              ) : (
                users
                  .filter((user) => user.username.toLowerCase().includes(search.toLowerCase()))
                  .map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-3">{user.username}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.role}</td>
                      <td className="p-3 flex space-x-3">
                        <button className="text-blue-600" onClick={() => handleEdit(user)}>
                          <IoPencilOutline size={20} />
                        </button>
                        <button
                          className="text-red-600"
                          onClick={() => {
                            setEditingUser(user);
                            setModalType("delete");
                            setShowModal(true);
                          }}
                        >
                          <IoTrashOutline size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit/Delete */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-[400px]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {modalType === "edit" ? "Edit User" : modalType === "delete" ? "Delete User" : "Add User"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <IoClose size={24} />
              </button>
            </div>

            {modalType === "delete" ? (
              <div className="mt-4">
                <p>Are you sure you want to delete {editingUser?.username}?</p>
                <div className="flex justify-end space-x-2 mt-4">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">
                    Cancel
                  </button>
                  <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full p-2 border rounded"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 border rounded"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-2 border rounded"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                />
                <select
                  className="w-full p-2 border rounded"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  {editingUser ? "Update User" : "Add User"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
