type Message = {
  id: string;
  authorName: string;
  authorAvatarUrl: string;
  text: string;
  timestamp: string;
  reactions?: Array<{ emoji: string; count: number }>;
  showAvatar?: boolean;
};

type MessageThreadProps = {
  conversationName: string;
  conversationAvatarUrl?: string;
  messages: Message[];
};

export const MessageThread = ({ conversationName, conversationAvatarUrl, messages }: MessageThreadProps) => {
  return (
    <div className="box-border caret-transparent flex basis-[375px] flex-col grow shrink-0 min-w-[200px] pt-2 px-2">
      <div className="bg-white shadow-[rgba(242,242,242,0.6)_0px_0px_12px_2px] box-border caret-transparent flex grow w-full border border-zinc-200 overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid">
        <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-hidden w-full">
          {/* Header */}
          <div className="box-border caret-transparent shrink-0 border-b border-zinc-200">
            <div className="items-center box-border caret-transparent flex shrink-0 justify-between px-4 py-3">
              <div className="items-center box-border caret-transparent flex shrink-0 gap-3">
                <div
                  className="items-center bg-white bg-cover box-border caret-transparent flex shrink-0 h-14 justify-center w-14 bg-center rounded-full"
                  style={{
                    backgroundImage: conversationAvatarUrl 
                      ? `url('${conversationAvatarUrl}')`
                      : "url('https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png')"
                  }}
                ></div>
                <div className="box-border caret-transparent flex flex-col">
                  <div className="font-medium text-base box-border caret-transparent text-ellipsis text-nowrap overflow-hidden">
                    {conversationName}
                  </div>
                  <a
                    href="#"
                    className="text-blue-500 text-sm box-border caret-transparent hover:text-blue-400"
                  >
                    View Conversation Information
                  </a>
                </div>
              </div>
              <div className="items-center box-border caret-transparent flex shrink-0 gap-2">
                <button
                  type="button"
                  title="Search in conversation"
                  className="relative text-slate-500 font-bold items-center aspect-square bg-transparent caret-transparent flex shrink-0 h-8 justify-center text-center text-nowrap overflow-hidden px-2 rounded hover:bg-gray-100"
                >
                  <img
                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-28.svg"
                    alt="Icon"
                    className="box-border caret-transparent shrink-0 h-5 w-5"
                  />
                </button>
                <button
                  type="button"
                  className="relative text-slate-500 font-bold items-center aspect-square bg-transparent caret-transparent flex shrink-0 h-8 justify-center text-center text-nowrap overflow-hidden px-2 rounded hover:bg-gray-100"
                >
                  <img
                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-40.svg"
                    alt="Icon"
                    className="box-border caret-transparent shrink-0 h-5 w-5"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="relative box-border caret-transparent flex flex-col grow overflow-x-hidden overflow-y-auto px-4 py-4">
            <ul className="box-border caret-transparent shrink-0 list-none pl-0 space-y-4">
              {messages.map((message) => (
                <li key={message.id} className="box-border caret-transparent shrink-0">
                  <div className="box-border caret-transparent flex shrink-0 group hover:bg-gray-50 -mx-2 px-2 py-1 rounded">
                    <div className="box-border caret-transparent shrink-0 w-14">
                      {message.showAvatar ? (
                        <a href="#" className="box-border caret-transparent">
                          <div
                            className="items-center bg-white bg-cover box-border caret-transparent flex shrink-0 h-9 justify-center w-9 bg-center rounded-full"
                            style={{ backgroundImage: `url('${message.authorAvatarUrl}')` }}
                          ></div>
                        </a>
                      ) : (
                        <a
                          href="#"
                          className="text-gray-500 text-xs box-border caret-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {message.timestamp.split(',')[1]?.trim() || message.timestamp}
                        </a>
                      )}
                    </div>
                    <div className="box-border caret-transparent grow shrink-0 w-0">
                      {message.showAvatar && (
                        <div className="box-border caret-transparent flex shrink-0 mb-1">
                          <a
                            href="#"
                            className="font-semibold box-border caret-transparent hover:text-blue-500"
                          >
                            {message.authorName}
                          </a>
                          <a
                            href="#"
                            className="text-gray-600 text-xs box-border caret-transparent ml-2 hover:underline"
                          >
                            {message.timestamp}
                          </a>
                        </div>
                      )}
                      <div className="box-border caret-transparent shrink-0 leading-[21px] break-words">
                        {message.text}
                      </div>
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="items-center box-border caret-transparent flex shrink-0 gap-2 mt-2">
                          {message.reactions.map((reaction, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className="items-center bg-gray-50 box-border caret-transparent flex shrink-0 border border-gray-200 px-2 py-1 rounded-full hover:bg-gray-100"
                            >
                              <span className="text-base">{reaction.emoji}</span>
                              <span className="text-xs ml-1">{reaction.count}</span>
                            </button>
                          ))}
                          <button
                            type="button"
                            title="Add Reaction"
                            className="items-center bg-gray-50 box-border caret-transparent flex shrink-0 h-6 w-6 justify-center border border-gray-200 rounded-full hover:bg-gray-100"
                          >
                            <span className="text-xs">+</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Input */}
          <div className="box-border caret-transparent shrink-0 border-t border-zinc-200 px-4 py-3">
            <form className="box-border caret-transparent shrink-0">
              <div className="items-center box-border caret-transparent flex shrink-0 gap-2">
                <button
                  type="button"
                  className="relative text-slate-500 font-bold items-center aspect-square bg-transparent caret-transparent flex shrink-0 h-8 justify-center text-center text-nowrap overflow-hidden px-2 rounded hover:bg-gray-100"
                >
                  <img
                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-54.svg"
                    alt="Icon"
                    className="box-border caret-transparent shrink-0 h-5 w-5"
                  />
                </button>
                <input
                  type="file"
                  className="text-neutral-600 items-baseline bg-transparent box-border caret-transparent hidden shrink-0 text-ellipsis text-nowrap p-0"
                />
                <div
                  role="textbox"
                  contentEditable
                  className="relative bg-transparent box-border caret-transparent flex grow shrink-0 leading-5 max-h-[218px] min-h-[38px] break-words overflow-x-hidden overflow-y-auto w-full border border-zinc-200 px-3 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid focus:outline-none focus:border-blue-500"
                  data-placeholder="Write a message…"
                >
                  <p className="box-border caret-transparent shrink-0 tracking-[-0.2px] leading-[20.0004px]">
                    <span className="box-border caret-transparent shrink-0">
                      <span className="box-border caret-transparent shrink-0">
                        <span className="absolute box-border caret-transparent block shrink-0 max-w-full opacity-[0.333] pointer-events-none w-full top-2">
                          Write a message…
                        </span>
                      </span>
                    </span>
                  </p>
                </div>
                <button
                  type="submit"
                  className="relative text-white font-bold items-center bg-blue-500 caret-transparent flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] text-center text-nowrap border border-blue-500 px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:bg-blue-400 hover:border-blue-400"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
