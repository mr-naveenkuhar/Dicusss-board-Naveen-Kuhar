import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');

  if (!isAuthenticated || !user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center">
          <h4>Please sign in to view your profile</h4>
          <Link to="/login" className="btn btn-primary mt-3">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // Save profile changes logic
    setIsEditing(false);
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-center mb-4">
            <img
              src={profileImage}
              alt={user.displayName}
              className="rounded-circle me-3"
              style={{ width: '80px', height: '80px' }}
            />
            <div>
              <h4>{user.displayName}</h4>
              <p className="text-muted">@{user.username}</p>
            </div>
          </div>

          {isEditing ? (
            <div>
              <div className="mb-3">
                <label htmlFor="profileImage" className="form-label">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  id="profileImage"
                  className="form-control"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                />
              </div>
              <button className="btn btn-success me-2" onClick={handleSave}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
