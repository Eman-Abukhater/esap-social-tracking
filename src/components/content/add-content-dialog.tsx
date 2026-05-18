"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
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
import { products } from "@/lib/mock-data";

export function AddContentDialog() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    status: "",
    productId: "",
    priority: "",
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Content</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
                setFormData({
                  ...formData,
                  description: event.target.value,
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
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
                <SelectTrigger>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product</label>
              <Select
                value={formData.productId}
                onValueChange={(value) =>
                  setFormData({ ...formData, productId: value })
                }
              >
                <SelectTrigger>
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
                <SelectTrigger>
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

          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button>Create Content</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}