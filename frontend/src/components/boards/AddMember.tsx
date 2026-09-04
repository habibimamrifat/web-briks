
"use client";

import { useEffect, useState } from "react";

import { sendGetRequest } from "@/apis/getRequest";
import { callApis } from "@/apis/callApi";

type Member = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "ADMIN" | "MEMBER";
};

type BoardMember = {
  user: Member;
};

type AddMemberProps = {
  boardId: string;
  members: BoardMember[];
  onUpdated?: () => void;
};

export default function AddMember({
  boardId,
  members,
  onUpdated,
}: AddMemberProps) {
  const [showPopup, setShowPopup] = useState(false);

  const [users, setUsers] = useState<Member[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(
    [],
  );

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!showPopup) {
      return;
    }

    async function fetchUsers() {
      try {
        setLoading(true);

        const data = await sendGetRequest(
          "/users",
          "AddMember",
          {
            requiredAuth: true,
          },
        );

        setUsers(data);

        const currentMemberIds = members.map(
          (member) => member.user.id,
        );

        setSelectedUserIds(currentMemberIds);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [showPopup, members]);

  const handleToggleMember = (userId: string) => {
    setSelectedUserIds((currentIds) => {
      if (currentIds.includes(userId)) {
        return currentIds.filter((id) => id !== userId);
      }

      return [...currentIds, userId];
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const currentMemberIds = members.map(
        (member) => member.user.id,
      );

      const addMemberIds = selectedUserIds.filter(
        (userId) => !currentMemberIds.includes(userId),
      );

      const removeMemberIds = currentMemberIds.filter(
        (userId) => !selectedUserIds.includes(userId),
      );

      await callApis(
        `/boards/${boardId}/invite`,
        "AddMember",
        {
          method: "POST",
          body: {
            addMemberIds,
            removeMemberIds,
          },
          requiredAuth: true,
        },
      );

      setShowPopup(false);

      onUpdated?.();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowPopup(true)}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
      >
        + Add Member
      </button>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Manage Members
              </h2>

              <button
                type="button"
                onClick={() => setShowPopup(false)}
                disabled={saving}
                className="text-xl text-gray-500 hover:text-gray-900"
              >
                ×
              </button>
            </div>

            {/* Users */}
            {loading ? (
              <div className="py-10 text-center text-gray-600">
                Loading members...
              </div>
            ) : users.length === 0 ? (
              <div className="py-10 text-center text-gray-600">
                No users found.
              </div>
            ) : (
              <div className="mt-6 space-y-2">
                {users.map((user) => {
                  const selected = selectedUserIds.includes(
                    user.id,
                  );

                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() =>
                        handleToggleMember(user.id)
                      }
                      className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition ${
                        selected
                          ? "border-gray-900 bg-gray-100"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {user.email}
                        </p>
                      </div>

                      {selected ? (
                        <span className="text-xl font-bold text-gray-900">
                          ✓
                        </span>
                      ) : (
                        <span className="text-xl text-gray-400">
                          +
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving || loading}
                className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Members"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

