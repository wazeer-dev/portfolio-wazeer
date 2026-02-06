"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/canvasUtils";

interface ImageUploaderProps {
    onUploadComplete: (url: string) => void;
}

export default function ImageUploader({ onUploadComplete }: ImageUploaderProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [uploading, setUploading] = useState(false);

    // Resize options
    const [targetWidth, setTargetWidth] = useState<number | "">("");
    const [targetHeight, setTargetHeight] = useState<number | "">("");

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener("load", () => setImageSrc(reader.result as string));
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        setUploading(true);
        try {
            // 1. Get cropped blob/file
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

            if (!croppedBlob) {
                alert("Failed to crop image");
                return;
            }

            // 2. Prepare FormData
            const formData = new FormData();
            formData.append("file", croppedBlob);
            // Note: Cloudinary fits/limits to uploaded dimensions. 
            // If explicit resizing is needed, we could pass params or resize on canvas.
            // For now, let's assume crop is sufficient, but we can add transformation params if API supports.

            // 3. Upload
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                // Cloudinary returns secure_url
                onUploadComplete(data.result.secure_url);
                setImageSrc(null); // Reset
            } else {
                alert(`Upload failed: ${data.error?.message || "Unknown error"}`);
            }

        } catch (error) {
            console.error(error);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4 border border-white/10 p-4 rounded-xl bg-neutral-900/50">
            {!imageSrc ? (
                // File Selecting State
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 rounded-xl hover:border-orange-500/50 transition-colors cursor-pointer relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="text-orange-500 mb-2">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <p className="text-sm text-gray-400">Click or Drag to upload image</p>
                </div>
            ) : (
                // Cropping State
                <div className="space-y-4">
                    <div className="relative w-full h-64 bg-black rounded-xl overflow-hidden border border-white/10">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={4 / 3} // Default aspect, maybe make dynamic?
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase">Zoom</label>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full accent-orange-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setImageSrc(null)}
                            className="py-2 px-4 rounded bg-gray-800 text-white text-xs hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="py-2 px-4 rounded bg-orange-600 text-white text-xs font-bold hover:bg-orange-500 transition disabled:opacity-50"
                        >
                            {uploading ? "Uploading..." : "Crop & Upload"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
