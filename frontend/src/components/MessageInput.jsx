import { useState, useRef, useEffect } from "react";
import { Send, Image, Smile } from "lucide-react";
import { useChatStore } from "../store/chatStore";
import { useMessageStore } from "../store/messageStore";
import { useAuthStore } from "../store/authStore";
import { emit } from "../services/socket";
import { getChatName } from "../lib/utils";
import Button from "./ui/Button";
import toast from "react-hot-toast";

const QUICK_EMOJIS = [
  "😀",
  "😂",
  "😍",
  "😢",
  "👍",
  "🙏",
  "🔥",
  "🥳",
  "🤔",
  "🎉",
  "❤️",
  "🤩",
];

const MAX_MESSAGE_CHARACTERS = 500;

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPalette, setShowEmojiPalette] = useState(false);
  const { selectedChat } = useChatStore();
  const { sendMessage, uploadImage } = useMessageStore();
  const { user } = useAuthStore();
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const textareaRef = useRef(null);
  const emojiPanelRef = useRef(null);
  const emojiToggleRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      120
    )}px`;
  }, [message]);

  useEffect(() => {
    if (!showEmojiPalette) return;

    const handleClickOutside = (event) => {
      const clickedOutsidePanel =
        !emojiPanelRef.current || !emojiPanelRef.current.contains(event.target);
      const clickedOutsideToggle =
        !emojiToggleRef.current ||
        !emojiToggleRef.current.contains(event.target);

      if (clickedOutsidePanel && clickedOutsideToggle) {
        setShowEmojiPalette(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPalette]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleTyping = (valueOrUpdater) => {
    let normalizedValue = "";

    setMessage((prevMessage) => {
      const nextValue =
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(prevMessage)
          : valueOrUpdater;

      normalizedValue = nextValue.slice(0, MAX_MESSAGE_CHARACTERS);
      return normalizedValue;
    });

    if (!selectedChat) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      return;
    }

    if (normalizedValue && !isTyping) {
      setIsTyping(true);
      emit("typing", { chatId: selectedChat._id, userName: user?.name });
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      emit("stop-typing", { chatId: selectedChat._id });
    }, 2000);
  };

  const handleEmojiSelect = (emoji) => {
    handleTyping((prev) => prev + emoji);
    setShowEmojiPalette(false);
    textareaRef.current?.focus();
  };

  const handleAttachmentClick = () => {
    if (!selectedChat) {
      toast.error("Select a chat to share media");
      return;
    }

    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || !selectedChat) return;
    setShowEmojiPalette(false);

    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      emit("stop-typing", { chatId: selectedChat._id });
    }

    const content = message;
    setMessage("");

    const newMessage = await sendMessage(selectedChat._id, content);

    if (newMessage) {
      // Emit to socket
      emit("new-message", newMessage);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!selectedChat) {
      toast.error("Select a chat before sharing media");
      e.target.value = "";
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      e.target.value = "";
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      e.target.value = "";
      return;
    }

    // Upload image
    const imageUrl = await uploadImage(file);
    e.target.value = "";

    if (!imageUrl) {
      toast.error("Image upload failed. Please try again.");
      return;
    }

    const newMessage = await sendMessage(selectedChat._id, "", imageUrl);

    if (newMessage) {
      // Emit to socket
      emit("new-message", newMessage);
    }
  };

  const isSendDisabled = !message.trim() || !selectedChat;
  const chatLabel = selectedChat ? getChatName(selectedChat, user?._id) : null;

  return (
    <div className="border-t border-border/60 bg-card/90 px-4 py-3 backdrop-blur">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Hidden Image Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        <div className="flex items-end gap-3">
          {/* Message Input */}
          <div className="flex flex-1 items-end gap-2 rounded-2xl border border-input/60 bg-background/90 px-2 py-1 shadow-sm transition focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Upload image"
              onClick={handleAttachmentClick}
              className="text-muted-foreground hover:text-foreground"
            >
              <Image className="h-5 w-5" />
            </Button>

            <textarea
              ref={textareaRef}
              value={message}
              maxLength={MAX_MESSAGE_CHARACTERS}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={
                selectedChat
                  ? `Message ${chatLabel || "this chat"}`
                  : "Select a chat to start typing..."
              }
              rows={1}
              className="flex-1 resize-none bg-transparent px-1 py-[10px] text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />

            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Insert emoji"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowEmojiPalette((prev) => !prev)}
                ref={emojiToggleRef}
              >
                <Smile
                  className={`h-5 w-5 transition ${
                    showEmojiPalette ? "text-primary" : ""
                  }`}
                />
              </Button>

              {showEmojiPalette && (
                <div
                  ref={emojiPanelRef}
                  className="absolute bottom-12 right-0 z-10 w-48 rounded-2xl border border-border/70 bg-popover p-3 shadow-xl"
                >
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Quick emoji
                  </p>
                  <div className="grid grid-cols-6 gap-1">
                    {QUICK_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiSelect(emoji)}
                        className="rounded-lg bg-muted/60 p-1 text-base transition hover:bg-primary/10"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            size="icon"
            disabled={isSendDisabled}
            className="h-12 w-12 shrink-0 rounded-2xl shadow-lg transition hover:shadow-primary/40 disabled:shadow-none"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Press Enter to send • Shift+Enter for newline</span>
          <span>
            {message.length}/{MAX_MESSAGE_CHARACTERS}
          </span>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
