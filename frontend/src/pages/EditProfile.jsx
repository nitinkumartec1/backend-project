import { useState, useEffect } from "react";
import { getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, changePassword } from "../api/user.api";

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [details, setDetails] = useState({ fullName: "", email: "" });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    getCurrentUser().then(res => {
      setUser(res.data.data);
      setDetails({ fullName: res.data.data.fullName, email: res.data.data.email });
    });
  }, []);

  const handleDetailsUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateAccountDetails(details);
      setMessage("Account details updated successfully!");
    } catch (err) {
      setMessage("Failed to update account details.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await changePassword(passwords);
      setMessage("Password changed successfully!");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setMessage("Failed to change password.");
    }
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(type, file); // 'avatar' or 'coverImage'

    try {
      if (type === "avatar") {
        await updateUserAvatar(formData);
      } else {
        await updateUserCoverImage(formData);
      }
      setMessage(`${type} updated successfully!`);
      // Refresh user to see changes
      const res = await getCurrentUser();
      setUser(res.data.data);
    } catch (err) {
       console.error(err);
      setMessage(`Failed to update ${type}.`);
    }
  };

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      
      {message && <div className="bg-blue-100 text-blue-800 p-3 rounded mb-4">{message}</div>}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Images</h2>
         <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Avatar</label>
            <div className="flex items-center space-x-4">
                <img src={user.avatar} className="w-16 h-16 rounded-full object-cover" />
                <input type="file" onChange={(e) => handleFileChange(e, "avatar")} />
            </div>
         </div>
         <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Cover Image</label>
            <div className="flex items-center space-x-4">
                {user.coverImage && <img src={user.coverImage} className="w-32 h-16 object-cover" />}
                <input type="file" onChange={(e) => handleFileChange(e, "coverImage")} />
            </div>
         </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Account Details</h2>
        <form onSubmit={handleDetailsUpdate} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
            <input 
              type="text" 
              value={details.fullName} 
              onChange={(e) => setDetails({ ...details, fullName: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input 
              type="email" 
              value={details.email} 
              onChange={(e) => setDetails({ ...details, email: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Save Details
          </button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Old Password</label>
            <input 
              type="password" 
              value={passwords.oldPassword} 
              onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
            <input 
              type="password" 
              value={passwords.newPassword} 
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Change Password
          </button>
        </form>
      </div>

    </div>
  );
}
