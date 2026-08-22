"use client";

import { useEffect, useId, useState } from "react";

import { clinicConfig } from "@/config/public-config";
import type { Locale } from "@/i18n/config";

type WhatsAppChatProps = {
  locale: Locale;
  labels: {
    open: string;
    close: string;
    online: string;
    welcome: string;
    quickQuestions: string;
    bookAppointment: string;
    askTreatment: string;
    clinicTimings: string;
    talkToTeam: string;
    messageLabel: string;
    messagePlaceholder: string;
    send: string;
    emptyMessage: string;
  };
};

function WhatsAppIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16.04 3C8.85 3 3 8.67 3 15.64c0 2.23.6 4.4 1.74 6.3L3 29l7.3-1.66a13.2 13.2 0 0 0 5.74 1.31h.01C23.23 28.65 29 23 29 16.02 29 9.05 23.23 3 16.04 3Zm0 23.51h-.01a11.1 11.1 0 0 1-5.63-1.53l-.4-.24-4.34.99 1.04-4.1-.27-.42a10.3 10.3 0 0 1-1.7-5.57c0-5.8 5.08-10.52 11.32-10.52 6.22 0 11.22 4.92 11.22 10.9 0 5.79-5 10.49-11.23 10.49Zm6.17-7.84c-.34-.17-2.02-.97-2.33-1.08-.31-.11-.54-.17-.77.17-.23.33-.88 1.08-1.08 1.3-.2.22-.4.25-.74.08-.34-.16-1.43-.51-2.73-1.63a10.35 10.35 0 0 1-1.9-2.3c-.2-.33-.02-.51.15-.68.15-.15.34-.39.51-.58.17-.2.23-.33.34-.55.11-.22.06-.42-.03-.58-.09-.17-.77-1.8-1.05-2.46-.28-.67-.56-.57-.77-.58h-.66c-.23 0-.6.08-.91.42-.31.33-1.2 1.14-1.2 2.78 0 1.63 1.23 3.21 1.4 3.43.17.22 2.42 3.59 5.87 5.03.82.34 1.46.54 1.96.69.82.25 1.57.22 2.16.13.66-.1 2.02-.8 2.3-1.58.29-.78.29-1.44.2-1.58-.08-.14-.31-.22-.65-.39Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function SendIcon({ rtl }: { rtl: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`size-[18px] ${rtl ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m4 4 17 8-17 8 3.4-8L4 4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />

      <path
        d="M7.5 12H21"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function WhatsAppChat({ locale, labels }: WhatsAppChatProps) {
  const isRtl = locale === "ur";
  const headingId = useId();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const quickQuestions = [
    labels.bookAppointment,
    labels.askTreatment,
    labels.clinicTimings,
    labels.talkToTeam,
  ];

  const whatsappNumber = clinicConfig.whatsapp.number;

  /*
   * Close the chat with Escape for keyboard users.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function selectQuickQuestion(question: string) {
    setMessage(question);
    setShowError(false);
  }

  function sendMessage() {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setShowError(true);
      return;
    }

    /*
     * WhatsApp requires the number in international format,
     * containing digits only.
     *
     * +92 300 1234567
     * becomes
     * 923001234567
     */
    const normalizedNumber = whatsappNumber.replace(/\D/g, "");

    if (!normalizedNumber) {
      return;
    }

    const whatsappUrl =
      `https://wa.me/${normalizedNumber}` +
      `?text=${encodeURIComponent(trimmedMessage)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div
      className={`
        fixed right-3
        bottom-[calc(5.75rem+env(safe-area-inset-bottom))]
        z-[60]

        flex flex-col
        items-end
        gap-3

        md:right-6
        md:bottom-6

        ${isRtl ? "font-[inherit]" : ""}
      `}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* =====================================================
          CHAT WINDOW
      ===================================================== */}

      <div
        aria-hidden={!open}
        aria-labelledby={headingId}
        role="dialog"
        className={`
          flex
          w-[min(23rem,calc(100vw-1.5rem))]
          max-h-[min(33rem,calc(100dvh-9rem))]
          flex-col

          origin-bottom-right
          overflow-hidden

          rounded-[1.5rem]

          border
          border-white/70

          bg-white/95
          text-[var(--ink)]

          shadow-[0_28px_80px_-30px_rgba(7,48,71,0.55)]

          backdrop-blur-2xl
          backdrop-saturate-150

          transition-[opacity,transform,visibility]
          duration-250
          ease-[cubic-bezier(0.65,0,0.35,1)]

          ${
            open
              ? "visible translate-y-0 scale-100 opacity-100"
              : "pointer-events-none invisible translate-y-3 scale-[0.97] opacity-0"
          }
        `}
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <div
          className="
            relative
            shrink-0
            overflow-hidden

            bg-[linear-gradient(135deg,var(--primary-ink),var(--teal-dark))]

            px-5 py-4
            text-white
          "
        >
          <div
            aria-hidden="true"
            className="
              absolute
              -end-10 -top-12

              size-28
              rounded-full

              bg-cyan-300/10
              blur-2xl
            "
          />

          <div
            className="
              relative
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div
              className="
                flex min-w-0
                items-center
                gap-3
              "
            >
              {/* WhatsApp logo */}
              <span
                className="
                  grid size-11
                  shrink-0
                  place-items-center

                  rounded-xl

                  bg-[#25D366]
                  text-white

                  shadow-[0_10px_24px_-12px_rgba(37,211,102,0.8)]
                "
              >
                <WhatsAppIcon className="size-[26px]" />
              </span>

              {/* Clinic info */}
              <div className="min-w-0">
                <h2
                  className="
                    truncate
                    text-sm
                    font-extrabold
                    tracking-[-0.015em]
                    text-white
                  "
                  id={headingId}
                >
                  {clinicConfig.name}
                </h2>

                <p
                  className="
                    mt-1
                    flex items-center
                    gap-1.5
                    text-xs
                    text-white/70
                  "
                >
                  <span
                    aria-hidden="true"
                    className="
                      size-2
                      shrink-0
                      rounded-full
                      bg-[#25D366]
                    "
                  />

                  {labels.online}
                </p>
              </div>
            </div>

            {/* Close */}
            <button
              aria-label={labels.close}
              className="
                grid size-9
                shrink-0
                place-items-center

                rounded-xl

                border
                border-white/15

                bg-white/[0.08]
                text-white/80

                transition-colors

                hover:bg-white/[0.15]
                hover:text-white

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-white
              "
              onClick={() => setOpen(false)}
              type="button"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* ===================================================
            SCROLLABLE CONTENT
        =================================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain

            px-4 py-4

            sm:px-5

            [scrollbar-width:thin]
            [scrollbar-color:rgba(7,48,71,0.25)_transparent]
          "
        >
          {/* Welcome */}
          <div
            className="
              rounded-2xl

              border
              border-[var(--line)]

              bg-[var(--aqua-soft)]

              px-4 py-3
            "
          >
            <p
              className="
                text-sm
                leading-6
                text-[var(--muted-text)]
              "
            >
              {labels.welcome}
            </p>
          </div>

          {/* =================================================
              QUICK QUESTIONS
          ================================================= */}

          <div className="mt-4">
            <p
              className="
                text-[0.68rem]
                font-extrabold
                tracking-[0.11em]
                text-[var(--teal-dark)]
                uppercase
              "
            >
              {labels.quickQuestions}
            </p>

            <div
              className="
                mt-2.5
                flex flex-wrap
                gap-2
              "
            >
              {quickQuestions.map((question) => {
                const selected = message === question;

                return (
                  <button
                    className={`
                      inline-flex
                      min-h-10
                      items-center

                      rounded-xl

                      border
                      px-3 py-2

                      text-start
                      text-xs
                      font-bold
                      leading-5

                      shadow-[0_6px_18px_-14px_rgba(7,48,71,0.45)]

                      transition-[background-color,border-color,color,transform]
                      duration-200

                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[var(--aqua)]

                      ${
                        selected
                          ? `
                            border-[var(--aqua)]
                            bg-[var(--aqua-soft)]
                            text-[var(--teal-dark)]
                          `
                          : `
                            border-[var(--line)]
                            bg-white
                            text-[var(--primary-ink)]

                            hover:-translate-y-px
                            hover:border-[var(--aqua)]
                            hover:bg-[var(--aqua-soft)]
                          `
                      }
                    `}
                    key={question}
                    onClick={() => selectQuickQuestion(question)}
                    type="button"
                  >
                    {question}
                  </button>
                );
              })}
            </div>
          </div>

          {/* =================================================
              MESSAGE
          ================================================= */}

          <div className="mt-4">
            <label
              className="
                block
                text-xs
                font-extrabold
                text-[var(--primary-ink)]
              "
              htmlFor="whatsapp-message"
            >
              {labels.messageLabel}
            </label>

            <textarea
              className="
                mt-2
                min-h-20
                w-full

                resize-none

                rounded-xl

                border
                border-[var(--line-strong)]

                bg-white

                px-3.5 py-3

                text-sm
                leading-6
                text-[var(--primary-ink)]

                outline-none

                transition-[border-color,box-shadow]
                duration-200

                placeholder:text-[var(--muted-text)]/65

                focus:border-[var(--aqua)]
                focus:shadow-[0_0_0_3px_rgba(32,147,224,0.12)]
              "
              id="whatsapp-message"
              maxLength={500}
              onChange={(event) => {
                setMessage(event.target.value);

                if (showError && event.target.value.trim()) {
                  setShowError(false);
                }
              }}
              placeholder={labels.messagePlaceholder}
              value={message}
            />

            <div
              className="
                mt-1.5
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <p
                aria-live="polite"
                className={`
                  min-h-4
                  text-xs

                  ${showError ? "text-red-600" : "text-transparent"}
                `}
              >
                {showError ? labels.emptyMessage : "\u00A0"}
              </p>

              <span
                className="
                  shrink-0
                  text-[0.65rem]
                  text-[var(--muted-text)]
                "
              >
                {message.length}/500
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================
            FIXED SEND AREA
        =================================================== */}

        <div
          className="
            relative
            z-10
            shrink-0

            border-t
            border-[var(--line)]

            bg-white/95

            px-4
            py-3

            shadow-[0_-10px_30px_-24px_rgba(7,48,71,0.5)]

            backdrop-blur-xl

            sm:px-5
          "
        >
          <button
            className="
              inline-flex
              min-h-12
              w-full

              items-center
              justify-center
              gap-2.5

              rounded-xl

              bg-[#25D366]

              px-5
              py-3

              text-sm
              font-extrabold
              text-white

              shadow-[0_14px_32px_-16px_rgba(37,211,102,0.75)]

              transition-[background-color,transform,box-shadow]
              duration-250

              hover:-translate-y-0.5
              hover:bg-[#1fbe5b]
              hover:shadow-[0_18px_36px_-16px_rgba(37,211,102,0.85)]

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#25D366]
              focus-visible:ring-offset-2

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            disabled={!whatsappNumber}
            onClick={sendMessage}
            type="button"
          >
            <WhatsAppIcon className="size-5" />

            <span>{labels.send}</span>

            <SendIcon rtl={isRtl} />
          </button>
        </div>
      </div>

      {/* =====================================================
          FLOATING WHATSAPP BUTTON
      ===================================================== */}

      <button
        aria-expanded={open}
        aria-label={open ? labels.close : labels.open}
        className="
          group
          relative

          grid
          size-14
          place-items-center

          rounded-2xl

          border
          border-white/70

          bg-[#25D366]
          text-white

          shadow-[0_16px_38px_-16px_rgba(18,86,55,0.7)]

          transition-[transform,background-color,box-shadow]
          duration-300
          ease-[cubic-bezier(0.65,0,0.35,1)]

          hover:-translate-y-1
          hover:bg-[#1fbe5b]
          hover:shadow-[0_20px_42px_-16px_rgba(18,86,55,0.8)]

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#25D366]
          focus-visible:ring-offset-2
          focus-visible:ring-offset-white

          md:size-15
        "
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span
          aria-hidden="true"
          className="
            absolute inset-0

            rounded-2xl

            ring-1
            ring-inset
            ring-white/20
          "
        />

        {open ? <CloseIcon /> : <WhatsAppIcon className="size-7" />}
      </button>
    </div>
  );
}
