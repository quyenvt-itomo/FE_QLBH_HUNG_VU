import React, { useState, useEffect } from "react";
import { Input, Button, App } from "antd";
import { MicrophoneIcon } from "@heroicons/react/24/outline";
import { InputProps } from "antd/lib/input";

interface VoiceInputProps extends InputProps {
  onVoiceInput?: (text: string) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  value,
  onChange,
  onVoiceInput,
  ...props
}) => {
  const { message } = App.useApp();
  const [isListening, setIsListening] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null,
  );

  // Theo dõi trạng thái kết nối internet
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      if (isListening) {
        recognition?.stop();
        message.warning("Mất kết nối internet. Đã dừng ghi âm.");
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isListening, recognition, message]);

  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = "vi-VN";

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      const currentValue = (value as string) || "";
      const newValue = currentValue
        ? `${currentValue} ${transcript}`
        : transcript;

      const capitalizedValue =
        newValue.charAt(0).toUpperCase() + newValue.slice(1);

      onChange?.({ target: { value: capitalizedValue } } as any);
      onVoiceInput?.(transcript);
      message.success("Đã nhận dạng giọng nói thành công!");
      setIsListening(false);
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);

      let errorMessage = "Lỗi nhận dạng giọng nói. Vui lòng thử lại.";

      switch (event.error) {
        case "network":
          errorMessage =
            "⚠️ Chức năng nhận dạng giọng nói cần kết nối internet để hoạt động. " +
            "Vui lòng kiểm tra:\n" +
            "1. Kết nối internet của bạn\n" +
            "2. Firewall/VPN có thể đang chặn kết nối đến Google";
          break;
        case "not-allowed":
        case "service-not-allowed":
          errorMessage =
            "Vui lòng cấp quyền sử dụng microphone trong trình duyệt.";
          break;
        case "no-speech":
          errorMessage = "Không nhận được giọng nói. Vui lòng nói rõ hơn.";
          break;
        case "audio-capture":
          errorMessage =
            "Không tìm thấy microphone. Vui lòng kiểm tra thiết bị.";
          break;
        case "aborted":
          // Người dùng dừng, không cần thông báo lỗi
          setIsListening(false);
          return;
        default:
          break;
      }

      message.error(errorMessage);
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionInstance.onstart = () => {
      setIsListening(true);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (e) {
          // Ignore error if already stopped
        }
      }
    };
  }, [message, onChange, onVoiceInput, value]);

  const toggleListening = async () => {
    if (!recognition) {
      message.warning("Trình duyệt không hỗ trợ nhận dạng giọng nói");
      return;
    }

    // Kiểm tra kết nối internet
    if (!isOnline) {
      message.error(
        "⚠️ Không có kết nối internet. Chức năng nhận dạng giọng nói cần internet để hoạt động.",
      );
      return;
    }

    if (isListening) {
      try {
        recognition.stop();
        setIsListening(false);
      } catch (e) {
        console.error("Error stopping recognition:", e);
      }
    } else {
      try {
        await recognition.start();
        message.info("🎤 Đang lắng nghe... Hãy nói rõ ràng.");
      } catch (e: any) {
        console.error("Error starting recognition:", e);
        if (e.name === "NotAllowedError") {
          message.error("Vui lòng cấp quyền sử dụng microphone.");
        } else {
          message.error(
            "Không thể bắt đầu nhận dạng giọng nói. Có thể do:\n- Thiếu kết nối internet\n- Microphone đang được sử dụng",
          );
        }
      }
    }
  };

  return (
    <Input
      {...props}
      value={value}
      onChange={onChange}
      suffix={
        <Button
          tabIndex={-1}
          type={isListening ? "primary" : "text"}
          onClick={toggleListening}
          size="small"
          className="flex items-center justify-center p-0"
          danger={!isOnline}
          disabled={!isOnline}
          title={
            !isOnline
              ? "⚠️ Không có internet - Cần kết nối internet để sử dụng"
              : isListening
                ? "Dừng ghi âm"
                : "Bắt đầu ghi âm (yêu cầu internet)"
          }
        >
          <MicrophoneIcon
            className={`h-5 w-5 ${isListening ? "animate-pulse" : ""}`}
          />
        </Button>
      }
    />
  );
};
