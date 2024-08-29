import { create } from "zustand";

type ChatState = 0 | 1;
type newChatState = {
  avatar: string;
  fullname: string;
  id: string;
  username: string;
};

type State = {
  chatState: ChatState;
  newChatState: newChatState;
};
type Actions = {
  changeChatState: (state: State["chatState"]) => void;
  changeNewChatState: (state: State["newChatState"]) => void;
};
const InitialState: State = {
  chatState: 0,
  newChatState: {
    avatar: "",
    fullname: "",
    id: "",
    username: "",
  },
};
const useChatStore = create<State & Actions>((set) => ({
  ...InitialState,
  changeChatState: (state) => set(() => ({ chatState: state })),
  changeNewChatState(state) {
    set(() => ({
      newChatState: state,
    }));
  },
}));

export default useChatStore;
