import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { PortfolioSection } from "@/components/ui/PortfolioSection";

// jsdom does not implement the native dialog methods. Browser tests cover
// top-layer focus trapping and Escape handling with the real dialog.
beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.removeAttribute("open");
    },
  });
});

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function openFirst() {
  render(<PortfolioSection locale="en" />);
  const trigger = screen.getByRole("button", {
    name: "Preview image: Exterior of Shahbaz Dental Clinic",
  });
  fireEvent.click(trigger);
  return { trigger, dialog: screen.getByRole("dialog") };
}

function finishClose() {
  act(() => vi.advanceTimersByTime(180));
}

describe("portfolio lightbox", () => {
  it("opens the selected original image, locks scrolling, and restores focus and styles on close", () => {
    document.body.style.overflow = "auto";
    const { trigger, dialog } = openFirst();
    expect(within(dialog).getByRole("img")).toHaveAttribute(
      "src",
      "/images/location images/locationImage (1).png",
    );
    expect(within(dialog).getByText("1 / 16")).toBeVisible();
    expect(document.body.style.overflow).toBe("hidden");
    const close = within(dialog).getByRole("button", { name: "Close gallery" });
    expect(close).toHaveFocus();
    fireEvent.keyDown(close, { key: "Tab", shiftKey: true });
    const next = within(dialog).getByRole("button", { name: "Next image" });
    expect(next).toHaveFocus();
    fireEvent.keyDown(next, { key: "Tab" });
    expect(close).toHaveFocus();
    fireEvent.click(close);
    finishClose();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("auto");
    expect(trigger).toHaveFocus();
    document.body.style.overflow = "";
  });

  it("navigates with buttons and keyboard in both directions including wraparound", () => {
    const { dialog } = openFirst();
    fireEvent.click(
      within(dialog).getByRole("button", { name: "Previous image" }),
    );
    expect(within(dialog).getByText("16 / 16")).toBeVisible();
    fireEvent.keyDown(dialog, { key: "ArrowRight" });
    expect(within(dialog).getByText("1 / 16")).toBeVisible();
    fireEvent.click(within(dialog).getByRole("button", { name: "Next image" }));
    expect(within(dialog).getByRole("img")).toHaveAttribute(
      "src",
      "/images/location images/locationImage (4).jpeg",
    );
    fireEvent.keyDown(dialog, { key: "ArrowLeft" });
    expect(within(dialog).getByText("1 / 16")).toBeVisible();
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    finishClose();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps image clicks open and closes on the backdrop", () => {
    const { dialog } = openFirst();
    fireEvent.click(within(dialog).getByRole("img"));
    act(() => vi.advanceTimersByTime(200));
    expect(dialog).toHaveAttribute("open");
    fireEvent.click(dialog);
    finishClose();
    expect(dialog).not.toHaveAttribute("open");
  });

  it("opens any thumbnail and supports horizontal swipes without treating vertical or multitouch gestures as navigation", () => {
    render(<PortfolioSection locale="ur" />);
    const triggers = screen.getAllByRole("button");
    fireEvent.click(triggers[4]);
    const dialog = screen.getByRole("dialog", { name: "کلینک کی تصاویر" });
    const figure = dialog.querySelector("figure")!;
    expect(within(dialog).getByText("5 / 16")).toBeVisible();
    fireEvent.touchStart(figure, { touches: [{ clientX: 220, clientY: 100 }] });
    fireEvent.touchEnd(figure, {
      changedTouches: [{ clientX: 70, clientY: 105 }],
    });
    expect(within(dialog).getByText("6 / 16")).toBeVisible();
    fireEvent.touchStart(figure, { touches: [{ clientX: 70, clientY: 100 }] });
    fireEvent.touchEnd(figure, {
      changedTouches: [{ clientX: 220, clientY: 105 }],
    });
    expect(within(dialog).getByText("5 / 16")).toBeVisible();
    fireEvent.touchStart(figure, { touches: [{ clientX: 220, clientY: 100 }] });
    fireEvent.touchEnd(figure, {
      changedTouches: [{ clientX: 150, clientY: 300 }],
    });
    expect(within(dialog).getByText("5 / 16")).toBeVisible();
    fireEvent.touchStart(figure, {
      touches: [
        { clientX: 220, clientY: 100 },
        { clientX: 240, clientY: 100 },
      ],
    });
    fireEvent.touchEnd(figure, {
      changedTouches: [{ clientX: 50, clientY: 100 }],
    });
    expect(within(dialog).getByText("5 / 16")).toBeVisible();
  });
});
