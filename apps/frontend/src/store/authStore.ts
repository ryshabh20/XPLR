import { create } from "zustand";

type SignUpState = 0 | 1 | 2;
type UserSignUpState = {
  username: string;
  email: string;
  password: string;
  fullname: string;
};

type State = {
  signUpState: SignUpState;
  userSignUpDataState: UserSignUpState;
};
type Actions = {
  changeSignUpState: (state: State["signUpState"]) => void;
  changeUserSignUpDataState: (state: State["userSignUpDataState"]) => void;
};

const InitialState: State = {
  signUpState: 0,
  userSignUpDataState: { fullname: "", email: "", username: "", password: "" },
};

const useAuthStore = create<State & Actions>((set) => ({
  ...InitialState,
  changeSignUpState: (state) => set(() => ({ signUpState: state })),
  changeUserSignUpDataState: (state) =>
    set(() => ({ userSignUpDataState: state })),
}));

export default useAuthStore;
