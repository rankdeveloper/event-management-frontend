import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { socket } from "../socket";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MessageCircle, UserCircle } from "lucide-react";
import { Message } from "react-hook-form";
import toast from "react-hot-toast";

export default function MessageBox({
  eventId,
  currentUser,
  profilePic,
}: {
  eventId: string;
  currentUser: string;
  profilePic: string;
}) {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.emit("join_room", eventId);

    socket.on("receive_message", (data) => {
      setChatMessages((prev) => [...prev, data]);
    });

    socket.on("previous_messages", (messages) => {
      setChatMessages(messages);
    });

    return () => {
      socket.off("receive_message");
      socket.off("previous_messages");
    };
  }, [eventId]);

  const handleSend = () => {
    if (currentUser === "Guest") {
      toast.error(
        "Guest users cannot send messages , Please create an account"
      );
      return;
    }

    if (message.trim() !== "") {
      socket.emit("send_message", {
        eventId,
        message,
        sender: currentUser,
      });
      setMessage("");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="rounded-l-3xl rounded-r-none  fixed bottom-4 right-0 bg-indigo-500 hover:bg-indigo-600">
          Messages
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full !w-[80vw] !p-0 ">
        <SheetHeader className="">
          <SheetTitle className="px-4 !py-4 text-indigo-500">
            Chat Box
          </SheetTitle>
          <hr />
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 !py-0 ">
          {chatMessages?.map((item: any) => (
            <div
              key={item._id}
              className={`flex w-full ${
                item.sender === currentUser ? "justify-end" : "justify-start"
              } mt-3`}
            >
              <div
                className={`px-3 py-1 rounded-xl ${
                  item.sender === currentUser ? "bg-indigo-500" : "bg-gray-200"
                }`}
              >
                <div className="flex gap-2 items-center">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="profile"
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <UserCircle
                      className={`${
                        item.sender === currentUser
                          ? "text-white"
                          : "text-indigo-500"
                      }  h-8 w-8`}
                    />
                  )}

                  <span
                    className={`text-sm font-medium ${
                      item.sender === currentUser
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {item.sender === currentUser ? "You" : item.sender}
                    {": "}
                  </span>
                </div>
                <p
                  className={`text-base  ${
                    item.sender === currentUser ? "text-white" : "text-gray-600"
                  }`}
                >
                  {item.message}
                </p>
                <p
                  className={`text-right text-sm ${
                    item.sender === currentUser
                      ? "text-gray-200"
                      : "text-gray-500"
                  }`}
                >
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {chatMessages?.length == 0 && (
          <>
            <div className="flex-1">
              <div className="flex items-center flex-col gap-2">
                <MessageCircle className="text-indigo-500 h-10 w-10" />
                <h2 className="text-center text-xl text-indigo-500">
                  No Chats Found
                </h2>
              </div>
            </div>
          </>
        )}

        <hr />

        <SheetFooter className="mt-auto !py-2 !px-4">
          <div className="w-full flex justify-between  items-center">
            <input
              type="text"
              placeholder="Your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="px-2 py-1  outline-indigo-300"
            />

            <Button
              className="bg-indigo-500"
              type="submit"
              onClick={handleSend}
              disabled={message.trim() === "" || currentUser === "Guest"}
            >
              Send Message
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
