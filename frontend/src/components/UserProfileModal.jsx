import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Camera } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/Avatar";
import Button from "./ui/Button";
import Input from "./ui/Input";
import toast from "react-hot-toast";

const UserProfileModal = ({ onClose }) => {
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);

  useEffect(() => {
    setName(user?.name || "");
    setBio(user?.bio || "");
    setAvatarPreview(user?.avatar || "");
  }, [user]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const updatePreview = (url) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (url?.startsWith("blob:")) {
      previewUrlRef.current = url;
    }

    setAvatarPreview(url);
  };

  const handleSave = async () => {
    const success = await updateProfile({ name, bio, avatarFile });
    if (success) {
      setIsEditing(false);
      setAvatarFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    }
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setBio(user?.bio || "");
    setAvatarFile(null);
    updatePreview(user?.avatar || "");
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar must be smaller than 5MB");
      event.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    updatePreview(previewUrl);
    setAvatarFile(file);
    setIsEditing(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md rounded-lg bg-card p-6 shadow-xl"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Profile</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-accent transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Avatar */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarPreview} alt={user?.name} />
              <AvatarFallback className="text-2xl">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-lg hover:bg-primary/90 transition"
              title="Change avatar"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              className={!isEditing ? "opacity-70" : ""}
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              type="email"
              value={user?.email || ""}
              disabled
              className="opacity-70"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!isEditing}
              rows={3}
              className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                !isEditing ? "opacity-70" : ""
              }`}
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="w-full">
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1">
                Save Changes
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfileModal;
