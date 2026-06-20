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
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/providers/language-provider";

const COLOR_OPTIONS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
];

type AddProductDialogProps = {
  onCreateProduct: (product: {
    name: string;
    description: string;
    color: string;
  }) => void;
};

export function AddProductDialog({ onCreateProduct }: AddProductDialogProps) {
  const t = useTranslation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);

  const isFormValid = name.trim() !== "" && description.trim() !== "";

  function resetForm() {
    setName("");
    setDescription("");
    setColor(COLOR_OPTIONS[0]);
  }

  function handleCreate() {
    if (!isFormValid) return;
    onCreateProduct({ name: name.trim(), description: description.trim(), color });
    resetForm();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t("products.addProduct")}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t("products.addNewProduct")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <label htmlFor="add-product-name" className="text-sm font-medium">
              {t("products.name")}
            </label>
            <Input
              id="add-product-name"
              placeholder={t("products.enterName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="add-product-description" className="text-sm font-medium">
              {t("products.productDescription")}
            </label>
            <Textarea
              id="add-product-description"
              placeholder={t("products.writeDescription")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("products.color")}</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="h-8 w-8 rounded-full border-2 transition"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? "currentColor" : "transparent",
                  }}
                  onClick={() => setColor(c)}
                  aria-label={t("products.selectColor", { color: c })}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
            >
              {t("common.cancel")}
            </Button>

            <Button type="button" onClick={handleCreate} disabled={!isFormValid}>
              {t("products.createProduct")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
