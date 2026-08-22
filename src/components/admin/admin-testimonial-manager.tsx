"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import type { TestimonialRecord } from "@/modules/testimonials/testimonial.types";

type AdminTestimonialManagerProps = {
  testimonials: readonly TestimonialRecord[];
  onChanged: () => void | Promise<void>;
};

const emptyDraft = {
  testimonialId: "",
  nameEn: "",
  nameUr: "",
  treatmentEn: "",
  treatmentUr: "",
  reviewEn: "",
  reviewUr: "",
  dateKey: "",
  isPublished: true,
  sortOrder: "0",
};

type Draft = typeof emptyDraft;

function draftFromTestimonial(testimonial: TestimonialRecord): Draft {
  return {
    testimonialId: testimonial.id,
    nameEn: testimonial.name.en,
    nameUr: testimonial.name.ur,
    treatmentEn: testimonial.treatment.en,
    treatmentUr: testimonial.treatment.ur,
    reviewEn: testimonial.review.en,
    reviewUr: testimonial.review.ur,
    dateKey: testimonial.dateKey,
    isPublished: testimonial.isPublished,
    sortOrder: String(testimonial.sortOrder),
  };
}

function testimonialFormData(
  testimonial: TestimonialRecord,
  isPublished: boolean,
) {
  const form = new FormData();
  const draft = draftFromTestimonial(testimonial);
  for (const [key, value] of Object.entries(draft)) {
    form.set(key, key === "isPublished" ? String(isPublished) : String(value));
  }
  return form;
}

const fieldClassName =
  "mt-2 min-h-12 w-full rounded-lg border border-[var(--line-strong)] bg-white px-3 outline-none transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus:border-[var(--teal)] focus:ring-3 focus:ring-[var(--aqua)]";

export function AdminTestimonialManager({
  testimonials,
  onChanged,
}: AdminTestimonialManagerProps) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [formVersion, setFormVersion] = useState(0);
  const editing = testimonials.find((item) => item.id === draft.testimonialId);

  function setField<K extends keyof Draft>(field: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  async function send(form: FormData) {
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/v1/admin/testimonials", {
      method: "POST",
      body: form,
    }).catch(() => null);
    const result = response
      ? ((await response.json().catch(() => ({}))) as {
          cleanupPending?: boolean;
          error?: string;
        })
      : {};
    setBusy(false);
    if (!response?.ok) {
      const errors: Record<string, string> = {
        forbidden:
          "Your session cannot make this change. Refresh and sign in again.",
        unauthorized: "Your admin session expired. Sign in and try again.",
        "not-found":
          "This testimonial no longer exists. Refresh the dashboard.",
        "invalid-image": "Choose a valid JPEG, PNG, or WebP image up to 5 MiB.",
        "invalid-request":
          "Check all bilingual fields, the date, and display order.",
      };
      setMessage(
        errors[result.error ?? ""] ??
          "The testimonial could not be saved. Please try again.",
      );
      return false;
    }
    setMessage(
      result.cleanupPending
        ? "Testimonial saved. An old image still needs Cloudinary cleanup."
        : "Testimonial saved.",
    );
    await onChanged();
    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const image = form.get("image");
    if (image instanceof File && image.size === 0) form.delete("image");
    if (await send(form)) {
      setDraft(emptyDraft);
      setFormVersion((current) => current + 1);
    }
  }

  async function togglePublished(testimonial: TestimonialRecord) {
    const isPublished = !testimonial.isPublished;
    if (await send(testimonialFormData(testimonial, isPublished))) {
      setDraft((current) =>
        current.testimonialId === testimonial.id
          ? { ...current, isPublished }
          : current,
      );
    }
  }

  async function deleteTestimonial(testimonial: TestimonialRecord) {
    if (!window.confirm(`Delete testimonial from ${testimonial.name.en}?`))
      return;
    setBusy(true);
    setMessage("");
    const response = await fetch(
      `/api/v1/admin/testimonials?id=${encodeURIComponent(testimonial.id)}`,
      { method: "DELETE" },
    ).catch(() => null);
    const result = response
      ? ((await response.json().catch(() => ({}))) as {
          cleanupPending?: boolean;
        })
      : {};
    setBusy(false);
    if (!response?.ok && !result.cleanupPending) {
      setMessage("The testimonial could not be deleted.");
      return;
    }
    setMessage(
      result.cleanupPending
        ? "Testimonial deleted. Its old image still needs Cloudinary cleanup."
        : "Testimonial deleted.",
    );
    if (draft.testimonialId === testimonial.id) {
      setDraft(emptyDraft);
      setFormVersion((current) => current + 1);
    }
    await onChanged();
  }

  function startEditing(testimonial: TestimonialRecord) {
    setDraft(draftFromTestimonial(testimonial));
    setFormVersion((current) => current + 1);
  }

  function cancelEditing() {
    setDraft(emptyDraft);
    setFormVersion((current) => current + 1);
  }

  return (
    <section className="rounded-lg border border-[var(--line)] bg-white p-5 shadow-[0_20px_55px_-42px_rgba(4,71,83,0.5)] sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold tracking-[0.14em] text-[var(--teal-dark)] uppercase">
            Patient stories
          </p>
          <h2 className="mt-2 text-2xl font-extrabold">Testimonials</h2>
          <p className="mt-2 max-w-2xl text-[var(--muted-text)]">
            Manage the English and Urdu reviews shown on the clinic homepage.
          </p>
        </div>
        <span className="rounded-full bg-[var(--aqua-soft)] px-4 py-2 text-sm font-extrabold text-[var(--teal-dark)]">
          {testimonials.filter((item) => item.isPublished).length} visible
        </span>
      </div>

      {message ? (
        <p
          className="mt-5 rounded-lg bg-[var(--aqua-soft)] px-4 py-3 font-bold"
          role="status"
        >
          {message}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article
            className="rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4"
            key={testimonial.id}
          >
            <div className="flex items-center gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-full border-2 border-white bg-[var(--aqua-soft)] shadow-sm">
                <Image
                  alt={testimonial.name.en}
                  className="object-cover"
                  fill
                  sizes="56px"
                  src={
                    testimonial.image ??
                    "/images/testimonials/default-avatar.svg"
                  }
                />
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-extrabold">
                  {testimonial.name.en}
                </h3>
                <p className="truncate text-sm text-[var(--muted-text)]">
                  {testimonial.treatment.en}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                  testimonial.isPublished
                    ? "bg-[var(--aqua)] text-[var(--teal-dark)]"
                    : "bg-white text-[var(--muted-text)]"
                }`}
              >
                {testimonial.isPublished ? "Visible" : "Hidden"}
              </span>
              <span className="text-xs font-bold text-[var(--muted-text)]">
                {testimonial.dateKey}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--line)] pt-4">
              <button
                aria-label="Edit testimonial"
                className="min-h-10 rounded-lg border border-[var(--line-strong)] bg-white px-3 text-sm font-bold transition-colors duration-300 hover:border-[var(--teal)] hover:bg-[var(--aqua-soft)]"
                onClick={() => startEditing(testimonial)}
                type="button"
              >
                Edit
              </button>
              <button
                aria-label={
                  testimonial.isPublished
                    ? "Hide testimonial"
                    : "Show testimonial"
                }
                className="min-h-10 rounded-lg border border-[var(--line-strong)] bg-white px-3 text-sm font-bold transition-colors duration-300 hover:border-[var(--teal)] hover:bg-[var(--aqua-soft)]"
                disabled={busy}
                onClick={() => void togglePublished(testimonial)}
                type="button"
              >
                {testimonial.isPublished ? "Hide" : "Show"}
              </button>
              <button
                aria-label="Delete testimonial"
                className="min-h-10 rounded-lg px-3 text-sm font-bold text-[var(--danger)] transition-colors duration-300 hover:bg-red-50"
                disabled={busy}
                onClick={() => void deleteTestimonial(testimonial)}
                type="button"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
        {testimonials.length === 0 ? (
          <p className="text-[var(--muted-text)]">No testimonials added yet.</p>
        ) : null}
      </div>

      <form
        className="mt-8 border-t border-[var(--line)] pt-7"
        key={formVersion}
        onSubmit={handleSubmit}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-extrabold">
            {editing ? `Edit ${editing.name.en}` : "Add a testimonial"}
          </h3>
          {editing ? (
            <button
              className="min-h-10 rounded-lg px-3 text-sm font-bold text-[var(--teal-dark)] hover:bg-[var(--aqua-soft)]"
              onClick={cancelEditing}
              type="button"
            >
              Cancel editing
            </button>
          ) : null}
        </div>
        <input name="testimonialId" type="hidden" value={draft.testimonialId} />
        <input
          name="isPublished"
          type="hidden"
          value={String(draft.isPublished)}
        />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="font-bold">
            Patient name (English)
            <input
              className={fieldClassName}
              name="nameEn"
              onChange={(event) => setField("nameEn", event.target.value)}
              required
              value={draft.nameEn}
            />
          </label>
          <label className="font-bold" dir="rtl">
            Patient name (Urdu)
            <input
              className={fieldClassName}
              name="nameUr"
              onChange={(event) => setField("nameUr", event.target.value)}
              required
              value={draft.nameUr}
            />
          </label>
          <label className="font-bold">
            Treatment (English)
            <input
              className={fieldClassName}
              name="treatmentEn"
              onChange={(event) => setField("treatmentEn", event.target.value)}
              required
              value={draft.treatmentEn}
            />
          </label>
          <label className="font-bold" dir="rtl">
            Treatment (Urdu)
            <input
              className={fieldClassName}
              name="treatmentUr"
              onChange={(event) => setField("treatmentUr", event.target.value)}
              required
              value={draft.treatmentUr}
            />
          </label>
          <label className="font-bold">
            Review (English)
            <textarea
              className={`${fieldClassName} min-h-32 py-3`}
              name="reviewEn"
              onChange={(event) => setField("reviewEn", event.target.value)}
              required
              value={draft.reviewEn}
            />
          </label>
          <label className="font-bold" dir="rtl">
            Review (Urdu)
            <textarea
              className={`${fieldClassName} min-h-32 py-3`}
              name="reviewUr"
              onChange={(event) => setField("reviewUr", event.target.value)}
              required
              value={draft.reviewUr}
            />
          </label>
          <label className="font-bold">
            Review date
            <input
              className={fieldClassName}
              name="dateKey"
              onChange={(event) => setField("dateKey", event.target.value)}
              required
              type="date"
              value={draft.dateKey}
            />
          </label>
          <label className="font-bold">
            Display order
            <input
              className={fieldClassName}
              min="0"
              name="sortOrder"
              onChange={(event) => setField("sortOrder", event.target.value)}
              required
              type="number"
              value={draft.sortOrder}
            />
          </label>
          <label className="font-bold md:col-span-2">
            Patient image{" "}
            <span className="font-normal text-[var(--muted-text)]">
              (optional)
            </span>
            <input
              accept="image/jpeg,image/png,image/webp"
              className={`${fieldClassName} py-3`}
              name="image"
              type="file"
            />
          </label>
          {editing?.image ? (
            <label className="flex min-h-11 items-center gap-3 font-bold md:col-span-2">
              <input
                className="size-5 accent-[var(--teal)]"
                name="removeImage"
                type="checkbox"
                value="true"
              />
              Remove the current image and use the default avatar
            </label>
          ) : null}
          <label className="flex min-h-11 items-center gap-3 font-bold md:col-span-2">
            <input
              checked={draft.isPublished}
              className="size-5 accent-[var(--teal)]"
              onChange={(event) =>
                setField("isPublished", event.target.checked)
              }
              type="checkbox"
            />
            Show this testimonial on the homepage
          </label>
        </div>
        <button
          className="mt-6 min-h-12 rounded-lg bg-[var(--teal)] px-6 font-extrabold text-[var(--primary-ink)] transition-[background-color,color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:bg-[var(--teal-dark)] hover:text-white hover:shadow-lg disabled:cursor-wait disabled:opacity-60"
          disabled={busy}
          type="submit"
        >
          {busy ? "Saving…" : editing ? "Save testimonial" : "Add testimonial"}
        </button>
      </form>
    </section>
  );
}
