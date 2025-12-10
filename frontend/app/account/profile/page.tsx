"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/lib/firebase/AuthProvider";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface SavedAddress {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface SavedPayment {
  id: string;
  type: "card" | "paypal";
  label: string;
  last4?: string;
  expiryDate?: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<
    "profile" | "addresses" | "payments" | "preferences"
  >("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: user?.displayName?.split(" ")[0] || "",
    lastName: user?.displayName?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
  });

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([
    {
      id: "1",
      label: "Home",
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "US",
      isDefault: true,
    },
  ]);

  const [savedPayments, setSavedPayments] = useState<SavedPayment[]>([
    {
      id: "1",
      type: "card",
      label: "Visa",
      last4: "4242",
      expiryDate: "12/25",
      isDefault: true,
    },
  ]);

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Please Sign In
          </h1>
          <p className="text-gray-600 mb-8">
            You need to be signed in to view your profile
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to update profile
    setIsEditing(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">
            Manage your profile, addresses, and payment methods
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          {(["profile", "addresses", "payments", "preferences"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition whitespace-nowrap ${
                  activeTab === tab
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          )}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            {/* Avatar */}
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {profile.firstName.charAt(0)}
                  {profile.lastName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-gray-600">{profile.email}</p>
                  <button className="mt-2 text-purple-600 hover:text-purple-700 font-medium text-sm">
                    Change Avatar
                  </button>
                </div>
              </div>

              {/* Profile Form */}
              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          firstName: e.target.value,
                        })
                      }
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          lastName: e.target.value,
                        })
                      }
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="Email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  />

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={profile.phone || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                  />

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wide">
                        First Name
                      </p>
                      <p className="text-gray-900 font-medium">
                        {profile.firstName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wide">
                        Last Name
                      </p>
                      <p className="text-gray-900 font-medium">
                        {profile.lastName}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">
                      Email
                    </p>
                    <p className="text-gray-900 font-medium">{profile.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">
                      Phone
                    </p>
                    <p className="text-gray-900 font-medium">
                      {profile.phone || "Not provided"}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            {savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white rounded-lg shadow p-6 relative border-2 border-transparent hover:border-purple-200 transition"
              >
                {addr.isDefault && (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Default
                  </span>
                )}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {addr.label}
                </h3>
                <p className="text-gray-600 mb-4">
                  {addr.firstName} {addr.lastName}
                  <br />
                  {addr.address}
                  <br />
                  {addr.city}, {addr.state} {addr.zipCode}
                  <br />
                  {addr.country}
                </p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 border border-purple-300 rounded-lg font-medium transition">
                    Edit
                  </button>
                  <button className="px-4 py-2 text-red-600 hover:bg-red-50 border border-red-300 rounded-lg font-medium transition">
                    Delete
                  </button>
                </div>
              </div>
            ))}

            <button className="w-full py-4 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 font-semibold transition">
              + Add New Address
            </button>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            {savedPayments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white rounded-lg shadow p-6 relative"
              >
                {payment.isDefault && (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Default
                  </span>
                )}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                    {payment.type === "card" ? "VISA" : "PP"}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{payment.label}</h3>
                    {payment.type === "card" && (
                      <p className="text-gray-500 text-sm">
                        **** **** **** {payment.last4} (Exp:{" "}
                        {payment.expiryDate})
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 border border-purple-300 rounded-lg font-medium transition">
                    Edit
                  </button>
                  <button className="px-4 py-2 text-red-600 hover:bg-red-50 border border-red-300 rounded-lg font-medium transition">
                    Delete
                  </button>
                </div>
              </div>
            ))}

            <button className="w-full py-4 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 font-semibold transition">
              + Add Payment Method
            </button>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-8 space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-gray-600">
                    Get updates about your orders and new products
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Marketing Communications
                  </h3>
                  <p className="text-sm text-gray-600">
                    Receive promotional offers and newsletters
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    SMS Notifications
                  </h3>
                  <p className="text-sm text-gray-600">
                    Get text message updates about your orders
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 cursor-pointer"
                />
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Danger Zone
                </h3>
                <button className="px-6 py-3 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg font-semibold transition">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
