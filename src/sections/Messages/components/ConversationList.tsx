type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageDate: string;
  avatarUrl?: string;
  isActive?: boolean;
};

type ConversationListProps = {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
};

export const ConversationList = ({ conversations, selectedConversationId, onSelectConversation }: ConversationListProps) => {
  return (
    <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex flex-col shrink-0 max-w-[500px] min-w-[300px] w-2/5 border border-[var(--border)] mr-4 rounded-tl rounded-tr border-solid">
      {/* Tabs */}
      <div className="border-b-zinc-200 border-l-neutral-800 border-r-neutral-800 border-t-neutral-800 box-border caret-transparent flex shrink-0 flex-wrap border-b">
        <button
          type="button"
          className="text-blue-500 font-semibold bg-transparent border-b-blue-500 border-l-neutral-500/30 border-r-neutral-500/30 border-t-neutral-500/30 caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b"
        >
          <div className="items-center box-border caret-transparent flex shrink-0 justify-center">
            <span className="box-border caret-transparent block text-ellipsis text-nowrap overflow-hidden">
              Messages
            </span>
          </div>
        </button>
        <button
          type="button"
          className="text-gray-600 bg-transparent border-b-zinc-200 border-l-neutral-500/30 border-r-neutral-500/30 border-t-neutral-500/30 caret-transparent block basis-[0%] grow text-center -mb-px px-2 py-2.5 border-t-0 border-x-0 border-b hover:bg-gray-50"
        >
          <div className="items-center box-border caret-transparent flex shrink-0 justify-center">
            <span className="box-border caret-transparent block text-ellipsis text-nowrap overflow-hidden">
              Threads
            </span>
          </div>
        </button>
      </div>

      {/* Conversation List */}
      <div className="relative box-border caret-transparent basis-[0%] grow overflow-x-hidden overflow-y-auto pb-8 rounded-bl rounded-br">
        {conversations.length === 0 ? (
          <div className="text-center text-gray-500 py-8 px-4">
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          <div>
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`relative items-start border-b border-[var(--border)] box-border caret-transparent flex shrink-0 cursor-pointer hover:bg-[var(--panel-2)] even:bg-[rgba(255,255,255,0.02)] px-4 py-3 border-l-2 transition-colors ${
                  selectedConversationId === conversation.id ? "bg-[var(--panel-2)] border-l-[var(--accent)]" : "border-l-transparent"
                } group`}
              >
                <div className="box-border caret-transparent shrink-0 mr-3">
                  <div
                      className={`items-center bg-white bg-cover box-border caret-transparent flex shrink-0 h-14 justify-center w-14 bg-center rounded-full transition-opacity ${selectedConversationId === conversation.id ? 'opacity-100' : 'group-hover:opacity-100'}`}
                      style={{
                        backgroundImage: conversation.avatarUrl
                            ? `url(${conversation.avatarUrl})`
                            : "url(/logo.svg)",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                      }}
                  ></div>

                </div>

                <div className="box-border caret-transparent flex basis-[0%] flex-col grow justify-center min-w-0">
                  <div className="items-center box-border caret-transparent flex shrink-0 justify-between mb-1">
                    <div
                      title={conversation.name}
                      className="font-medium box-border caret-transparent text-ellipsis text-nowrap overflow-hidden"
                    >
                      {conversation.name}
                    </div>
                    <div className="text-gray-600 text-xs box-border caret-transparent shrink-0 ml-2">
                      {conversation.lastMessageDate}
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm box-border caret-transparent text-ellipsis text-nowrap overflow-hidden">
                    {conversation.lastMessage}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
