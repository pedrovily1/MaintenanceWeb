import { useState } from "react";
import { ConversationList } from "./components/ConversationList";
import { MessageThread } from "./components/MessageThread";

export const Messages = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>("956131");

  // Mock data for conversations
  const conversations = [
    {
      id: "956131",
      name: "Admin",
      lastMessage: "You: Work orders are ready for review (#372) and signing (#296, #369)",
      lastMessageDate: "17/12/2025",
      avatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png",
      isActive: true
    },
    {
      id: "682915",
      name: "Slovakia SSF",
      lastMessage: "You: Assigned a work order to this team: app.getmaintainx.com/workorders/81454334",
      lastMessageDate: "17/12/2025",
      avatarUrl: undefined
    },
    {
      id: "743491",
      name: "Admin",
      lastMessage: "Update received.",
      lastMessageDate: "31/03/2025",
      avatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png"
    },
    {
      id: "678949",
      name: "All Team",
      lastMessage: "Admin joined CWS - Slovakia",
      lastMessageDate: "12/02/2025",
      avatarUrl: "logo.svg"
    }
  ];

  // Mock data for messages
  const messages = [
    {
      id: "1",
      authorName: "Admin",
      authorAvatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png",
      text: "Welcome to the messaging panel.",
      timestamp: "Today",
      showAvatar: true
    },
    {
      id: "2",
      authorName: "Admin",
      authorAvatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png",
      text: "This area will show recent updates.",
      timestamp: "Today",
      showAvatar: true
    }
  ];

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="relative bg-[var(--panel-2)] box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
      {/* Header */}
      <div className="bg-[var(--panel-2)] border-b border-[var(--border)] shadow-[inset_0_-1px_0_rgba(255,255,255,0.03)] box-border caret-transparent shrink-0 px-4 py-4">
        <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow gap-y-4">
          <div className="items-center box-border caret-transparent gap-x-4 flex shrink-0 gap-y-4">
            <h2 className="text-[31.9998px] font-bold box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[39.9997px]">
              Messages
            </h2>
          </div>
          <div className="items-center box-border caret-transparent gap-x-4 flex basis-[0%] grow justify-end gap-y-4">
            <div className="box-border caret-transparent flex basis-[0%] grow max-w-[400px]">
              <form className="box-border caret-transparent basis-[0%] grow">
                <input
                  type="search"
                  placeholder="Search Messages"
                  className="bg-[var(--panel-2)] bg-[url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2711%27%20height=%2712%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%20stroke=%27%23868686%27%20stroke-width=%271.25%27%20transform=%27translate%281%201.5)] bg-no-repeat box-border caret-transparent shrink-0 leading-5 min-h-10 -outline-offset-2 w-full border border-[var(--border)] bg-[position:10px_50%] pl-[30px] pr-2 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
                />
              </form>
            </div>
            <button
              type="button"
              className="relative text-white font-bold items-center bg-teal-500 caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-teal-500 px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:bg-teal-400 hover:border-teal-400"
            >
              <img
                src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-22.svg"
                alt="Icon"
                className="box-border caret-transparent shrink-0 h-5 text-nowrap w-5"
              />
              <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                New Message
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative box-border caret-transparent flex basis-[0%] grow mx-4">
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
        />
        <div className="flex basis-[0%] grow flex-col overflow-hidden border-l border-[var(--border)]">
          {selectedConversation ? (
            <MessageThread
              conversationName={selectedConversation.name}
              conversationAvatarUrl={selectedConversation.avatarUrl}
              messages={messages}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-500 bg-[var(--panel-2)]">
              Select a conversation to view messages
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
