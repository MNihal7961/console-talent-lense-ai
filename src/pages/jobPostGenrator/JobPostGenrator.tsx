import { memo, useEffect, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import { Button, Input, Tooltip, Typography } from "antd";
import {
  IoAttachOutline,
  IoDocumentTextOutline,
  IoSend,
  IoSparkles,
} from "react-icons/io5";
import useJobPostGenerator from "../../hooks/useJobPostGenerator";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import { getErrorMessage } from "../../utils/error";
import {
  MAX_PDF_FILE_SIZE_BYTES,
  extractTextFromPdf,
  isPdfFile,
} from "../../utils/pdf";
import "./index.scss";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  status?: "loading" | "success" | "error";
  text?: string;
  fileName?: string;
}

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Hi! Tell me about the role you're hiring for, or attach a job description PDF (max 5MB) and I'll turn it into a ready-to-review job post.",
};

const TYPEWRITER_VARIANTS = {
  visible: {
    transition: { staggerChildren: 0.014 },
  },
};

const TYPEWRITER_CHAR_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const TypewriterText = ({ text }: { text: string }) => (
  <motion.span
    initial="hidden"
    animate="visible"
    variants={TYPEWRITER_VARIANTS}
  >
    {Array.from(text).map((character, index) => (
      <motion.span key={index} variants={TYPEWRITER_CHAR_VARIANTS}>
        {character}
      </motion.span>
    ))}
  </motion.span>
);

const ChatBubble = memo(({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`job-post-chat-row ${isUser ? "job-post-chat-row-user" : ""}`}
    >
      {!isUser && (
        <div className="job-post-chat-avatar">
          <IoSparkles />
        </div>
      )}

      <div
        className={`job-post-chat-bubble ${
          isUser
            ? "job-post-chat-bubble-user"
            : "job-post-chat-bubble-assistant"
        } ${message.status === "error" ? "job-post-chat-bubble-error" : ""}`}
      >
        {message.status === "loading" ? (
          <div className="job-post-chat-bubble-loading">
            {message.fileName && (
              <div className="job-post-chat-bubble-file">
                <IoDocumentTextOutline />
                <Typography.Text>
                  Extracting {message.fileName}...
                </Typography.Text>
              </div>
            )}
            <span className="job-post-chat-typing">
              <span />
              <span />
              <span />
            </span>
          </div>
        ) : (
          <>
            {message.fileName && (
              <div className="job-post-chat-bubble-file">
                <IoDocumentTextOutline />
                <Typography.Text>{message.fileName}</Typography.Text>
              </div>
            )}
            {message.text &&
              (isUser ? (
                <Typography.Text className="job-post-chat-bubble-text">
                  {message.text}
                </Typography.Text>
              ) : (
                <Typography.Text className="job-post-chat-bubble-text">
                  <TypewriterText text={message.text} />
                </Typography.Text>
              ))}
          </>
        )}
      </div>
    </div>
  );
});

const JobPostGenrator = () => {
  const navigate = useNavigate();
  const { isGenerating, generateJobPost } = useJobPostGenerator();

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!isPdfFile(file)) {
      toast.error("Only PDF files are supported.");
      return;
    }

    if (file.size > MAX_PDF_FILE_SIZE_BYTES) {
      toast.error("PDF file must be 5MB or smaller.");
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: createId(),
        role: "user",
        text: `You uploaded "${file.name}".`,
        fileName: file.name,
      },
    ]);

    const extractingMessageId = createId();
    setMessages((prev) => [
      ...prev,
      {
        id: extractingMessageId,
        role: "assistant",
        status: "loading",
        fileName: file.name,
      },
    ]);

    try {
      setIsExtracting(true);
      const text = await extractTextFromPdf(file);

      if (!text) {
        setMessages((prev) =>
          prev.map((existingMessage) =>
            existingMessage.id === extractingMessageId
              ? {
                  ...existingMessage,
                  status: "error",
                  text: "Couldn't extract any text from that PDF.",
                }
              : existingMessage,
          ),
        );
        toast.error("Couldn't extract any text from that PDF.");
        return;
      }

      setMessages((prev) =>
        prev.map((existingMessage) =>
          existingMessage.id === extractingMessageId
            ? {
                ...existingMessage,
                status: "success",
                text: "Extracted the text below into the message box. Feel free to edit it before sending.",
              }
            : existingMessage,
        ),
      );
      setInputText(text);
    } catch (error: any) {
      console.log("JobPostGenrator ~ handleFileSelect ~ error:", error);
      setMessages((prev) =>
        prev.map((existingMessage) =>
          existingMessage.id === extractingMessageId
            ? {
                ...existingMessage,
                status: "error",
                text: "Failed to read the PDF. Please try a different file.",
              }
            : existingMessage,
        ),
      );
      toast.error("Failed to read the PDF. Please try a different file.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSend = async () => {
    const message = inputText.trim();

    if (!message || isGenerating) return;

    setMessages((prev) => [
      ...prev,
      {
        id: createId(),
        role: "user",
        text: message,
      },
    ]);

    setInputText("");

    const loadingMessageId = createId();
    setMessages((prev) => [
      ...prev,
      { id: loadingMessageId, role: "assistant", status: "loading" },
    ]);

    try {
      const result = await generateJobPost(message);
      setMessages((prev) =>
        prev.map((existingMessage) =>
          existingMessage.id === loadingMessageId
            ? {
                ...existingMessage,
                status: "success",
                text: `Generated "${result.title}". Redirecting you to review and save it...`,
              }
            : existingMessage,
        ),
      );
      toast.success("Job post generated successfully.");
      setTimeout(() => {
        navigate("/job-post/create", { state: { generatedJobPost: result } });
      }, 800);
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "Failed to generate the job post. Please try again.",
      );
      setMessages((prev) =>
        prev.map((existingMessage) =>
          existingMessage.id === loadingMessageId
            ? { ...existingMessage, status: "error", text: errorMessage }
            : existingMessage,
        ),
      );
      toast.error(errorMessage);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const canSend = inputText.trim() !== "" && !isGenerating && !isExtracting;

  return (
    <div className="job-post-generator-page">
      <PageBreadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Job Posts", path: "/job-post" },
          { label: "Generate" },
        ]}
      />

      <div className="job-post-chat">
        <div className="job-post-chat-messages">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="job-post-chat-composer">
          <div className="job-post-chat-input-box">
            <Input.TextArea
              className="job-post-chat-textarea"
              variant="borderless"
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the role you want to hire for, or attach a job description PDF..."
              autoSize={{ minRows: 2, maxRows: 6 }}
              disabled={isGenerating}
            />

            <div className="job-post-chat-input-actions">
              <Tooltip title="Extract details from a file containing the job description (PDF, max 5MB)">
                <Button
                  className="job-post-chat-attach-btn"
                  icon={<IoAttachOutline />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isGenerating || isExtracting}
                  loading={isExtracting}
                />
              </Tooltip>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                hidden
                onChange={handleFileSelect}
              />

              <Button
                className="job-post-chat-send-btn"
                type="primary"
                icon={<IoSend />}
                onClick={handleSend}
                disabled={!canSend}
                loading={isGenerating}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostGenrator;
