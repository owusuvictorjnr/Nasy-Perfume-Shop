/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

interface ImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  folder?: string;
}

export default function ImageUpload({
  value = [],
  onChange,
  maxFiles = 5,
  folder = "products",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(
    (result: any) => {
      const newUrl = result.info.secure_url;
      onChange([...value, newUrl]);
    },
    [value, onChange]
  );

  const handleRemove = (url: string) => {
    onChange(value.filter((current) => current !== url));
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      {value.length < maxFiles && (
        <CldUploadWidget
          uploadPreset="nasy-shop"
          options={{
            maxFiles: maxFiles - value.length,
            folder: `nasy-shop/${folder}`,
            resourceType: "image",
            clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
            maxFileSize: 5000000, // 5MB
          }}
          onUpload={handleUpload}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              disabled={isUploading}
              className="w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors disabled:opacity-50"
            >
              <div className="flex flex-col items-center gap-2">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-sm text-gray-600">
                  Click to upload images ({value.length}/{maxFiles})
                </p>
                <p className="text-xs text-gray-500">
                  JPG, PNG, or WebP (Max 5MB)
                </p>
              </div>
            </button>
          )}
        </CldUploadWidget>
      )}

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div
              key={url}
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
            >
              <Image
                src={url}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleRemove(url)}
                  className="opacity-0 group-hover:opacity-100 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-opacity"
                >
                  Remove
                </button>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-purple-600 text-white text-xs rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
