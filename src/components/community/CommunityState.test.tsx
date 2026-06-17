import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Inbox } from "lucide-react";
import {
  CommunityEmpty,
  CommunityError,
  FeedCardSkeleton,
  ReviewCardSkeleton,
  VideoCardSkeleton,
  ShortTileSkeleton,
  OfferCardSkeleton,
  SkeletonList,
  SkeletonGrid,
} from "./CommunityState";

describe("CommunityState", () => {
  it("renders empty state with title, description and action", () => {
    const onClick = vi.fn();
    const { container, getByText, getByRole } = render(
      <CommunityEmpty
        icon={Inbox}
        title="No posts yet"
        description="Be the first to share something."
        action={{ label: "Create post", onClick }}
      />,
    );
    expect(container.querySelector('[role="status"]')).not.toBeNull();
    expect(getByText("No posts yet")).toBeTruthy();
    expect(getByText("Be the first to share something.")).toBeTruthy();
    fireEvent.click(getByRole("button", { name: "Create post" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders error state with retry", () => {
    const onRetry = vi.fn();
    const { container, getByRole } = render(<CommunityError onRetry={onRetry} />);
    expect(container.querySelector('[role="alert"]')).not.toBeNull();
    fireEvent.click(getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("error state defaults message and hides retry when no handler", () => {
    const { container, queryByRole } = render(<CommunityError />);
    const alert = container.querySelector('[role="alert"]');
    expect(alert?.textContent?.toLowerCase()).toContain("something went wrong");
    expect(queryByRole("button")).toBeNull();
  });

  it("renders all skeleton variants without crashing", () => {
    const { container } = render(
      <>
        <FeedCardSkeleton />
        <ReviewCardSkeleton />
        <VideoCardSkeleton />
        <ShortTileSkeleton />
        <OfferCardSkeleton />
      </>,
    );
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThanOrEqual(5);
  });

  it("SkeletonList repeats children count times", () => {
    const { container } = render(
      <SkeletonList count={3}>
        <div data-testid="row" />
      </SkeletonList>,
    );
    expect(container.querySelectorAll('[data-testid="row"]').length).toBe(3);
  });

  it("SkeletonGrid repeats children count times with grid class", () => {
    const { container } = render(
      <SkeletonGrid count={4}>
        <div data-testid="tile" />
      </SkeletonGrid>,
    );
    expect(container.querySelectorAll('[data-testid="tile"]').length).toBe(4);
    expect((container.firstChild as HTMLElement).className).toContain("grid");
  });
});
