"use client";

import { callApis } from "@/apis/callApi";
import { sendGetRequest } from "@/apis/getRequest";
import Image from "next/image";
import { useEffect, useState } from "react";

type Board = {
  id: string;
  name: string;
  description: string | null;
  creatorUserId: string;
  startDate: string | null;
  finishDate: string | null;
  createdAt: string;
  updatedAt: string;
};

type WorkflowState = {
  id: string;
  name: string;
  description: string | null;
  position: number;
  boardId: string;
  startDate: string | null;
  finishDate: string | null;
  createdAt: string;
  updatedAt: string;
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  boardId: string;
  workflowStateId: string;
  priorityIndex: number;
  startDate: string | null;
  finishDate: string | null;
  createdAt: string;
  updatedAt: string;

  board: {
    id: string;
    name: string;
  };

  workflowState: {
    id: string;
    name: string;
    position: number;
  };
};

type AssignedTask = {
  id: string;
  taskId: string;
  task: Task;
};

type BoardMember = {
  id: string;
  joinedAt: string;
  board: Board;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  image: string | null;
  createdAt: string;
  updatedAt: string;

  boards: Board[];
  boardMembers: BoardMember[];
  workflowStates: WorkflowState[];
  tasks: Task[];
  taskAssignees: AssignedTask[];
};

export default function MePage() {
  const [user, setUser] = useState<User | null>(null);

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] =
    useState(false);
  const [savingPassword, setSavingPassword] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await sendGetRequest(
          "/auth/me",
          "MePage",
          {
            requiredAuth: true,
          },
        );

        if (!response) {
          throw new Error("Failed to load user");
        }

        const userData = response as User;

        setUser(userData);
        setName(userData.name);
        setImagePreview(userData.image);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load profile",
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setImage(selectedFile);

    const previewUrl =
      URL.createObjectURL(selectedFile);

    setImagePreview(previewUrl);
  };

  const handleProfileUpdate = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setSavingProfile(true);
      setMessage("");
      setError("");

      const formData = new FormData();

      formData.append("name", name);

      if (image) {
        formData.append("image", image);
      }

      const response = await callApis(
        "/users/me",
        "MePage",
        {
          method: "PATCH",
          body: formData,
          requiredAuth: true,
        },
      );

      if (!response) {
        throw new Error(
          "Failed to update profile",
        );
      }

      const updatedUser =
        response as Partial<User>;

      setUser((previousUser) => {
        if (!previousUser) {
          return previousUser;
        }

        return {
          ...previousUser,
          ...updatedUser,
        };
      });

      if (updatedUser.image !== undefined) {
        setImagePreview(updatedUser.image);
      }

      setImage(null);

      setMessage(
        "Profile updated successfully.",
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update profile",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "Password must be at least 6 characters.",
      );
      return;
    }

    try {
      setSavingPassword(true);

      await callApis(
        "/auth/set-password",
        "MePage",
        {
          method: "POST",
          body: {
            password: newPassword,
          },
          requiredAuth: true,
        },
      );

      setNewPassword("");
      setConfirmPassword("");

      setMessage(
        "Password updated successfully.",
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update password",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-gray-600">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-red-600">
          {error || "Unable to load profile."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          My Profile
        </h1>

        <p className="mt-1 text-gray-600">
          Manage your account and view your activity.
        </p>
      </div>

      {/* Messages */}
      {message && (
        <div className="rounded-lg bg-green-100 p-4 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Profile Information */}
      <section className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">
          Profile Information
        </h2>

        <form
          onSubmit={handleProfileUpdate}
          className="space-y-6"
        >
          {/* Profile Image */}
          <div>
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt={user.name}
                width={120}
                height={120}
                loading="eager"
                className="h-30 w-30 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-30 w-30 items-center justify-center rounded-full bg-gray-200 text-3xl font-bold text-gray-600">
                {user.name
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Profile Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
            />
          </div>

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Name
            </label>

            <input
              type="text"
              value={name}
              placeholder="Enter your name"
              onChange={(event) =>
                setName(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>

              <span
                title="Email cannot be changed"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
              >
                !
              </span>
            </div>

            <input
              type="email"
              value={user.email}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500 blur-[0.4px]"
            />

            <p className="mt-1 text-xs text-gray-500">
              Email cannot be changed.
            </p>
          </div>

          {/* Role */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Role
              </label>

              <span
                title="Role cannot be changed"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
              >
                !
              </span>
            </div>

            <input
              type="text"
              value={user.role}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500 blur-[0.4px]"
            />

            <p className="mt-1 text-xs text-gray-500">
              Role can only be changed by an administrator.
            </p>
          </div>

          {/* Save */}
          <button
            type="submit"
            disabled={savingProfile}
            className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {savingProfile
              ? "Saving..."
              : "Save Profile"}
          </button>
        </form>
      </section>

      {/* Password */}
      <section className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">
          Change Password
        </h2>

        <form
          onSubmit={handlePasswordUpdate}
          className="max-w-xl space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              placeholder="Enter new password"
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              placeholder="Confirm new password"
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {savingPassword
              ? "Updating..."
              : "Update Password"}
          </button>
        </form>
      </section>

      {/* Account Information */}
      <section className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">
          Account Information
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600">
              User ID
            </p>

            <p className="break-all font-medium text-gray-800">
              {user.id}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">
              Role
            </p>

            <p className="font-medium text-gray-800">
              {user.role}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">
              Created
            </p>

            <p className="font-medium text-gray-800">
              {new Date(
                user.createdAt,
              ).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">
              Last Updated
            </p>

            <p className="font-medium text-gray-800">
              {new Date(
                user.updatedAt,
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* Created Boards */}
      <section className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          My Boards
        </h2>

        {user.boards.length === 0 ? (
          <p className="text-gray-600">
            You havent created any boards.
          </p>
        ) : (
          <div className="space-y-3">
            {user.boards.map((board) => (
              <div
                key={board.id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <h3 className="font-semibold text-gray-900">
                  {board.name}
                </h3>

                {board.description && (
                  <p className="mt-1 text-sm text-gray-600">
                    {board.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Member Boards */}
      <section className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Boards Im a Member Of
        </h2>

        {user.boardMembers.length === 0 ? (
          <p className="text-gray-600">
            You are not a member of any other boards.
          </p>
        ) : (
          <div className="space-y-3">
            {user.boardMembers.map(
              (membership) => (
                <div
                  key={membership.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <h3 className="font-semibold text-gray-900">
                    {membership.board.name}
                  </h3>

                  <p className="text-sm text-gray-600">
                    Joined{" "}
                    {new Date(
                      membership.joinedAt,
                    ).toLocaleDateString()}
                  </p>
                </div>
              ),
            )}
          </div>
        )}
      </section>

      {/* Workflow States */}
      <section className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Workflow States
        </h2>

        {user.workflowStates.length === 0 ? (
          <p className="text-gray-600">
            No workflow states created.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {user.workflowStates.map(
              (state) => (
                <div
                  key={state.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <h3 className="font-semibold text-gray-900">
                    {state.name}
                  </h3>

                  <p className="text-sm text-gray-600">
                    Position: {state.position}
                  </p>
                </div>
              ),
            )}
          </div>
        )}
      </section>

      {/* Created Tasks */}
      <section className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Tasks I Created
        </h2>

        {user.tasks.length === 0 ? (
          <p className="text-gray-600">
            No tasks created.
          </p>
        ) : (
          <div className="space-y-3">
            {user.tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <h3 className="font-semibold text-gray-900">
                  {task.title}
                </h3>

                {task.description && (
                  <p className="mt-1 text-sm text-gray-600">
                    {task.description}
                  </p>
                )}

                <p className="mt-2 text-sm text-gray-600">
                  Board: {task.board.name}
                </p>

                <p className="text-sm text-gray-600">
                  State: {task.workflowState.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Assigned Tasks */}
      <section className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Tasks Assigned To Me
        </h2>

        {user.taskAssignees.length === 0 ? (
          <p className="text-gray-600">
            No assigned tasks.
          </p>
        ) : (
          <div className="space-y-3">
            {user.taskAssignees.map(
              (assignment) => (
                <div
                  key={assignment.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <h3 className="font-semibold text-gray-900">
                    {assignment.task.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    Board:{" "}
                    {assignment.task.board.name}
                  </p>

                  <p className="text-sm text-gray-600">
                    State:{" "}
                    {
                      assignment.task
                        .workflowState.name
                    }
                  </p>
                </div>
              ),
            )}
          </div>
        )}
      </section>
    </div>
  );
}