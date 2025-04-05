
import { useAppState } from "@/hooks/useAppState";
import { useEffect } from "react";

interface Props {
  behavior?: ScrollBehavior;
}

export default function AutoScrollToBottom({ behavior = "auto" }: Props) {
  const { conversationId } = useAppState();

  useEffect(() => {
    const scroller = document.querySelector("main");

    if (!scroller) return;

    scroller?.scrollTo({
      behavior,
      top: scroller.scrollHeight,
    });
  }, [behavior, conversationId]);

  return null;
}
