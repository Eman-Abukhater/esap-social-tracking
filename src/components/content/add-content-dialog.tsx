"use client";

import { useState } from "react";

import { useTranslation } from "@/providers/language-provider";
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
import { PLATFORMS } from "@/lib/constants";

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

export function AddContentDialog({ onCreateContent }: AddContentDialogProps) {
  const t = useTranslation();
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
        <Button>{t("content.addContent")}</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle>{t("content.addNewContent")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <label htmlFor="add-content-title" className="text-sm font-medium">{t("content.col.title")}</label>
            <Input
              id="add-content-title"
              placeholder={t("content.enterTitle")}
              value={formData.title}
              onChange={(event) =>
                setFormData({ ...formData, title: event.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="add-content-description" className="text-sm font-medium">{t("content.description_label")}</label>
            <Textarea
              id="add-content-description"
              placeholder={t("content.writeDescription")}
              value={formData.description}
              onChange={(event) =>
                setFormData({ ...formData, description: event.target.value })
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("content.selectType")}</label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("content.selectType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="post">{t("type.post")}</SelectItem>
                  <SelectItem value="video">{t("type.video")}</SelectItem>
                  <SelectItem value="reel">{t("type.reel")}</SelectItem>
                  <SelectItem value="carousel">{t("type.carousel")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("content.col.status")}</label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("content.selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">{t("status.planned")}</SelectItem>
                  <SelectItem value="in_progress">{t("status.in_progress")}</SelectItem>
                  <SelectItem value="review">{t("status.review")}</SelectItem>
                  <SelectItem value="done">{t("status.done")}</SelectItem>
                  <SelectItem value="published">{t("status.published")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("content.col.product")}</label>
              <Select
                value={formData.productId}
                onValueChange={(value) =>
                  setFormData({ ...formData, productId: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("content.selectProduct")} />
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
              <label className="text-sm font-medium">{t("content.col.priority")}</label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("content.selectPriority")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t("priority.low")}</SelectItem>
                  <SelectItem value="medium">{t("priority.medium")}</SelectItem>
                  <SelectItem value="high">{t("priority.high")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("content.col.assignedTo")}</label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) =>
                  setFormData({ ...formData, assignedTo: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("content.selectUser")} />
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
              <label htmlFor="add-content-date" className="text-sm font-medium">{t("content.scheduledDate")}</label>
              <Input
                id="add-content-date"
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
            <label className="text-sm font-medium">{t("common.platforms")}</label>

            <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
              {PLATFORMS.map((platform) => (
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
              {t("common.cancel")}
            </Button>

            <Button
              type="button"
              onClick={handleCreateContent}
              disabled={!isFormValid}
            >
              {t("content.createContent")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}