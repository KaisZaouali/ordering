import { useEffect } from "react";
import { message, notification } from "antd";

/* error handling hook */
export const useErrors = (errors, clearErrors) => {
  useEffect(() => {
    for (let action in errors) {
      if (errors[action]) {
        message.error(errors[action]);
        clearErrors();
      }
    }
  }, [clearErrors, errors]);
};

/* notification handling hook */
export const useNotifications = (
  notifications,
  messages,
  clearNotifications
) => {
  useEffect(() => {
    for (let action in notifications) {
      if (notifications[action]) {
        notification.success({
          description: messages[action] || "Action has been made successfully",
        });
        clearNotifications();
      }
    }
  }, [clearNotifications, notifications, messages]);
};
