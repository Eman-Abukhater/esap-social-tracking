"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from "@/hooks/use-products";
import { useUsers } from "@/hooks/use-users";
import type { ContentItem, Platform } from "@/lib/types";

type AddContentDialogProps = {
onCreateContent: (content: {
  title: string;
  description: string;
  type: ContentItem["type"];
  productId: string;
  status: ContentItem["status"];
  platforms: Platform[];
  scheduledDate: string;
  assignedToId: string;
  priority: ContentItem["priority"];
  tags: string[];
}) => void;};

const platforms: Platform[] = [
  "LinkedIn",
  "X",
  "Instagram",
  "TikTok",
  "YouTube",
  "Facebook",
];

export function AddContentDialog({ onCreateContent }: AddContentDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: products = [] } = useProducts();
  const { data: users = [] } = useUsers(); 
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    status: "",
    productId: "",
    priority: "",
    assignedTo: "",
    scheduledDate: "",
    platforms: [] as Platform[],
  });

  const isFormValid =
    formData.title.trim() !== "" &&
    formData.description.trim() !== "" &&
    formData.type !== "" &&
    formData.status !== "" &&
    formData.productId !== "" &&
    formData.priority !== "" &&
    formData.assignedTo !== "" &&
    formData.scheduledDate !== "" &&
    formData.platforms.length > 0;

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      type: "",
      status: "",
      productId: "",
      priority: "",
      assignedTo: "",
      scheduledDate: "",
      platforms: [],
    });
  }

  function togglePlatform(platform: Platform) {
    const isSelected = formData.platforms.includes(platform);

    setFormData({
      ...formData,
      platforms: isSelected
        ? formData.platforms.filter((item) => item !== platform)
        : [...formData.platforms, platform],
    });
  }

  function handleCancel() {
    resetForm();
    setOpen(false);
  }

  function handleCreateContent() {
  if (!isFormValid) return;

  onCreateContent({
    title: formData.title,
    description: formData.description,
    type: formData.type as ContentItem["type"],
    productId: formData.productId,
    status: formData.status as ContentItem["status"],
    platforms: formData.platforms,
    scheduledDate: formData.scheduledDate,
    assignedToId: formData.assignedTo,
    priority: formData.priority as ContentItem["priority"],
    tags: [],
  });

  resetForm();
  setOpen(false);
}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Content</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Enter content title"
              value={formData.title}
              onChange={(event) =>
                setFormData({ ...formData, title: event.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Write content description..."
              value={formData.description}
              onChange={(event) =>
                setFormData({ ...formData, description: event.target.value })
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="post">Post</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="reel">Reel</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product</label>
              <Select
                value={formData.productId}
                onValueChange={(value) =>
                  setFormData({ ...formData, productId: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Assigned To</label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) =>
                  setFormData({ ...formData, assignedTo: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Scheduled Date</label>
              <Input
                type="date"
                value={formData.scheduledDate}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    scheduledDate: event.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Platforms</label>

            <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
              {platforms.map((platform) => (
                <label
                  key={platform}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <Checkbox
                    checked={formData.platforms.includes(platform)}
                    onCheckedChange={() => togglePlatform(platform)}
                  />
                  {platform}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleCreateContent}
              disabled={!isFormValid}
            >
              Create Content
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}