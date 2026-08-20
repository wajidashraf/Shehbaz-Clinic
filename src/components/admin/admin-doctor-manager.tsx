"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import type { DoctorRecord } from "@/modules/doctors/doctor.types";

type AdminDoctorManagerProps = {
  doctors: readonly DoctorRecord[];
  onChanged: () => Promise<void>;
};

const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-[var(--line-strong)] bg-white px-3";

export function AdminDoctorManager({
  doctors,
  onChanged,
}: AdminDoctorManagerProps) {
  const [editing, setEditing] = useState<DoctorRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    if (editing) form.set("doctorId", editing.id);
    form.set("isFeatured", form.has("isFeatured") ? "true" : "false");
    let response: Response;
    try {
      response = await fetch("/api/v1/admin/doctors", {
        method: "POST",
        body: form,
      });
    } catch {
      setBusy(false);
      setMessage("Doctor details could not be saved. Check your connection.");
      return;
    }
    setBusy(false);
    const result = (await response.json().catch(() => null)) as {
      cleanupPending?: boolean;
      error?: string;
    } | null;
    if (!response.ok) {
      setMessage(
        result?.error === "gallery-limit"
          ? "Keep the featured gallery to five images or fewer."
          : result?.error === "image-required"
            ? "Upload a profile image for the new doctor."
            : "Doctor details could not be saved. Check every required field and Cloudinary settings.",
      );
      return;
    }
    setMessage(
      result?.cleanupPending
        ? "Doctor details saved. An unused image still needs Cloudinary cleanup."
        : "Doctor details saved.",
    );
    setEditing(null);
    formElement.reset();
    await onChanged();
  }

  async function remove(id: string) {
    if (!window.confirm("Remove this doctor from the website?")) return;
    setBusy(true);
    let response: Response;
    try {
      response = await fetch(
        `/api/v1/admin/doctors?id=${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );
    } catch {
      setBusy(false);
      setMessage("Doctor could not be removed. Check your connection.");
      return;
    }
    const result = response.ok
      ? null
      : ((await response.json().catch(() => null)) as {
          cleanupPending?: boolean;
          error?: string;
        } | null);
    setBusy(false);
    setMessage(
      response.ok
        ? "Doctor removed."
        : result?.error === "doctor-has-appointments"
          ? "Cancel or reschedule this doctor's future appointments before removing the doctor."
          : result?.cleanupPending
            ? "Doctor removed from the website, but image cleanup failed. Select Remove again to retry Cloudinary cleanup."
            : "Doctor could not be removed.",
    );
    if (response.ok) {
      if (editing?.id === id) setEditing(null);
      await onChanged();
    }
  }

  return (
    <section className="rounded-[2rem] border border-[var(--line)] bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold">Doctors</h2>
          <p className="mt-2 text-[var(--muted-text)]">
            Add, edit, remove, and select the doctor featured on the home page.
          </p>
        </div>
        {editing ? (
          <button
            className="min-h-11 rounded-full border border-[var(--line-strong)] px-4 font-bold"
            onClick={() => setEditing(null)}
            type="button"
          >
            Add new doctor
          </button>
        ) : null}
      </div>

      {message ? (
        <p
          className="mt-5 rounded-2xl bg-[var(--aqua-soft)] px-4 py-3 font-bold"
          role="status"
        >
          {message}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {doctors.map((doctor) => (
          <article
            className="rounded-2xl border border-[var(--line)] p-4"
            key={doctor.id}
          >
            <div className="flex gap-4">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-[var(--aqua)]">
                <Image
                  alt={doctor.imageAlt.en}
                  className="object-cover"
                  fill
                  sizes="80px"
                  src={doctor.image}
                />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold">{doctor.name.en}</p>
                <p className="mt-1 text-sm text-[var(--muted-text)]">
                  {doctor.title.en}
                </p>
                {doctor.isFeatured ? (
                  <span className="mt-2 inline-flex rounded-full bg-[var(--aqua)] px-2.5 py-1 text-xs font-extrabold text-[var(--teal-dark)]">
                    Featured doctor
                  </span>
                ) : null}
              </div>
            </div>
            <div className="mt-4 flex gap-3 border-t border-[var(--line)] pt-4">
              <button
                className="min-h-11 font-bold text-[var(--teal-dark)]"
                onClick={() => setEditing(doctor)}
                type="button"
              >
                Edit
              </button>
              <button
                className="min-h-11 font-bold text-[var(--danger)]"
                disabled={busy}
                onClick={() => void remove(doctor.id)}
                type="button"
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>

      <form
        className="mt-8 border-t border-[var(--line)] pt-7"
        key={editing?.id ?? "new"}
        onSubmit={save}
      >
        <h3 className="text-xl font-extrabold">
          {editing ? `Edit ${editing.name.en}` : "Add a doctor"}
        </h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="font-bold">
            Doctor name
            <input
              className={inputClass}
              defaultValue={editing?.name.en}
              name="name"
              required
            />
          </label>
          <label className="font-bold">
            Specialty or designation
            <input
              className={inputClass}
              defaultValue={editing?.title.en}
              name="title"
              required
            />
          </label>
          <label className="font-bold">
            Qualification
            <input
              className={inputClass}
              defaultValue={editing?.qualification.en}
              name="qualification"
            />
          </label>
          <label className="font-bold">
            Registration
            <input
              className={inputClass}
              defaultValue={editing?.registration.en}
              name="registration"
            />
          </label>
          <label className="font-bold md:col-span-2">
            Education
            <input
              className={inputClass}
              defaultValue={editing?.education.en}
              name="education"
            />
          </label>
          <label className="font-bold md:col-span-2">
            Professional profile
            <textarea
              className={`${inputClass} min-h-28 py-3`}
              defaultValue={editing?.biography.en}
              name="biography"
              required
            />
          </label>
          <label className="font-bold md:col-span-2">
            Focus areas{" "}
            <span className="font-normal text-[var(--muted-text)]">
              (one per line)
            </span>
            <textarea
              className={`${inputClass} min-h-28 py-3`}
              defaultValue={editing?.focusAreas
                .map((focus) => focus.en)
                .join("\n")}
              name="focusAreas"
            />
          </label>
          <label className="font-bold">
            Languages
            <input
              className={inputClass}
              defaultValue={editing?.languages.en}
              name="languages"
            />
          </label>
          <label className="font-bold">
            Working days and hours
            <input
              className={inputClass}
              defaultValue={editing?.workingDays.en}
              name="workingDays"
            />
          </label>
          <label className="font-bold">
            Profile image
            <input
              accept="image/jpeg,image/png,image/webp"
              className={`${inputClass} py-3`}
              name="profileImage"
              required={!editing}
              type="file"
            />
          </label>
          <label className="font-bold">
            Add featured gallery images
            <input
              accept="image/jpeg,image/png,image/webp"
              className={`${inputClass} py-3`}
              multiple
              name="galleryImages"
              type="file"
            />
            <span className="mt-1 block text-xs font-normal text-[var(--muted-text)]">
              Up to five gallery images in total.
            </span>
          </label>
        </div>

        {editing?.featuredImages.length ? (
          <fieldset className="mt-5">
            <legend className="font-extrabold">
              Images kept in the featured gallery
            </legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {editing.featuredImages.map((entry) => (
                <label
                  className="relative block cursor-pointer"
                  key={entry.url}
                >
                  <input
                    className="peer absolute start-2 top-2 z-10 size-5 accent-[var(--teal)]"
                    defaultChecked
                    name="retainedGallery"
                    type="checkbox"
                    value={entry.url}
                  />
                  <span className="relative block size-24 overflow-hidden rounded-xl border-2 border-transparent opacity-50 peer-checked:border-[var(--teal)] peer-checked:opacity-100">
                    <Image
                      alt={entry.altText.en}
                      className="object-cover"
                      fill
                      sizes="96px"
                      src={entry.url}
                    />
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-2xl bg-[var(--aqua-soft)] p-4 font-extrabold">
          <input
            className="size-5 accent-[var(--teal)]"
            defaultChecked={editing?.isFeatured}
            name="isFeatured"
            type="checkbox"
          />
          Feature this doctor on the home page
        </label>
        <button
          className="mt-6 min-h-12 rounded-full bg-[var(--teal)] px-6 font-extrabold text-[var(--primary-ink)] hover:bg-[var(--teal-dark)] hover:text-white disabled:opacity-60"
          disabled={busy}
          type="submit"
        >
          {busy ? "Saving…" : "Save doctor"}
        </button>
      </form>
    </section>
  );
}
