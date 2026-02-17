import { useState } from "react";
import { ConversationList } from "./components/ConversationList";
import { MessageThread } from "./components/MessageThread";

export const Messages = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>("956131");

  // Mock data for conversations
  const conversations = [
    {
      id: "956131",
      name: "Jason Degg",
      lastMessage: "You: Work orders are ready for review ( #372) and signing (#296,#369)",
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
      name: "Jason Degg",
      lastMessage: "Victor: Sorry just saw the message on maintainX",
      lastMessageDate: "31/03/2025",
      avatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png"
    },
    {
      id: "678949",
      name: "All Team",
      lastMessage: "Jason joined CWS - Slovakia",
      lastMessageDate: "12/02/2025",
      avatarUrl: "https://app.getmaintainx.com/img/93eafef8-3c18-48b5-a95a-2a8d545d9ac5_Chenega-Logo-Simplified-4C.png?w=512&h=512"
    }
  ];

  // Mock data for messages
  const messages = [
    {
      id: "1",
      authorName: "Pedro Modesto",
      authorAvatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png",
      text: "Test",
      timestamp: "02/09/2025, 07:49",
      showAvatar: true
    },
    {
      id: "2",
      authorName: "Jason Degg",
      authorAvatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png",
      text: "👌",
      timestamp: "02/09/2025, 07:50",
      showAvatar: true
    },
    {
      id: "3",
      authorName: "Pedro Modesto",
      authorAvatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png",
      text: "Did you receive the notification for the work order ?",
      timestamp: "02/09/2025, 07:51",
      showAvatar: true
    },
    {
      id: "4",
      authorName: "Pedro Modesto",
      authorAvatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png",
      text: "I sent a message asking you to sign it",
      timestamp: "07:51",
      showAvatar: false
    },
    {
      id: "5",
      authorName: "Pedro Modesto",
      authorAvatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png",
      text: "Test",
      timestamp: "07:56",
      showAvatar: false
    },
    {
      id: "6",
      authorName: "Pedro Modesto",
      authorAvatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png",
      text: "Manhole Grass cutting WO ready for review and signature",
      timestamp: "02/09/2025, 10:31",
      showAvatar: true
    },
    {
      id: "7",
      authorName: "Pedro Modesto",
      authorAvatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png",
      text: "work order created as requested",
      timestamp: "08:42",
      showAvatar: false
    },
    {
      id: "8",
      authorName: "Pedro Modesto",
      authorAvatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png",
      text: "Weekly wo ready for signing",
      timestamp: "26/09/2025, 08:02",
      showAvatar: true,
      reactions: [{ emoji: "👍", count: 1 }]
    },
    {
      id: "9",
      authorName: "Pedro Modesto",
      authorAvatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png",
      text: "Hvac wo ready for signing",
      timestamp: "26/09/2025, 12:02",
      showAvatar: true
    },
    {
      id: "10",
      authorName: "Pedro Modesto",
      authorAvatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png",
      text: "Manhole monthly maintenance wo#252 ready for review and signing",
      timestamp: "30/09/2025, 09:54",
      showAvatar: true
    },
    {
      id: "11",
      authorName: "Pedro Modesto",
      authorAvatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png",
      text: "Warehouse light replacement #288 ready for review and signing",
      timestamp: "06/10/2025, 10:19",
      showAvatar: true
    },
    {
      id: "12",
      authorName: "Pedro Modesto",
      authorAvatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png",
      text: "289 ready for review and signing",
      timestamp: "06/10/2025, 12:05",
      showAvatar: true
    },
    {
      id: "13",
      authorName: "Pedro Modesto",
      authorAvatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png",
      text: "Weekly WO - #341 is ready for signing",
      timestamp: "29/11/2025, 08:34",
      showAvatar: true,
      reactions: [{ emoji: "👍", count: 1 }]
    },
    {
      id: "14",
      authorName: "Pedro Modesto",
      authorAvatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png",
      text: "WO #320, #216 ready for review and signing",
      timestamp: "02/12/2025, 14:34",
      showAvatar: true,
      reactions: [{ emoji: "👍", count: 1 }]
    },
    {
      id: "15",
      authorName: "Pedro Modesto",
      authorAvatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png",
      text: "Manhole monthly maintenance  WO #320 Is ready for signing",
      timestamp: "03/12/2025, 13:27",
      showAvatar: true,
      reactions: [{ emoji: "👍", count: 1 }]
    },
    {
      id: "16",
      authorName: "Jason Degg",
      authorAvatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png",
      text: "Dobre",
      timestamp: "27/11/2025, 14:37",
      showAvatar: true
    },
    {
      id: "17",
      authorName: "Pedro Modesto",
      authorAvatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png",
      text: "WO#250 is ready for signing",
      timestamp: "27/11/2025, 14:32",
      showAvatar: true,
      reactions: [{ emoji: "👍", count: 1 }]
    },
    {
      id: "18",
      authorName: "Pedro Modesto",
      authorAvatarUrl: "https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png",
      text: `Work orders are ready for review ( #372) and signing (#296,#369)

HVAC Control System Troubleshooting & Repair
#372

Quarterly Split unit AC Air Filter Cleaning
#296

Weekly Maintenance Service
#369`,
      timestamp: "17/12/2025, 09:23",
      showAvatar: true
    }
  ];

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="relative bg-white box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
      {/* Header */}
      <div className="bg-white box-border caret-transparent shrink-0 px-4 py-5">
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
                  className="bg-gray-50 bg-[url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2711%27%20height=%2712%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%20stroke=%27%23868686%27%20stroke-width=%271.25%27%20transform=%27translate%281%201.5)] bg-no-repeat box-border caret-transparent shrink-0 leading-5 min-h-10 -outline-offset-2 w-full border border-gray-50 bg-[position:10px_50%] pl-[30px] pr-2 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
                />
              </form>
            </div>
            <button
              type="button"
              className="relative text-white font-bold items-center bg-blue-500 caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap border border-blue-500 px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:bg-blue-400 hover:border-blue-400"
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
        {selectedConversation && (
          <MessageThread
            conversationName={selectedConversation.name}
            conversationAvatarUrl={selectedConversation.avatarUrl}
            messages={messages}
          />
        )}
      </div>
    </div>
  );
};
